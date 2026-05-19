'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cases } from '@/data/cases';
import { initialRecentWins, initialUsers, serverStats } from '@/data/users';
import { missions } from '@/data/missions';
import { getSkin, rarityIndex } from '@/data/skins';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';
import type { BattleResult, InventoryItem, RecentWin, TradeProposal, User, UserStats, MissionState } from '@/lib/types';
import {
  battleEntryCost,
  calculateInventoryValue,
  calculateXP,
  createBattle,
  createStarterUser,
  createTrade,
  generateRecentWin,
  levelUp,
  openCase,
  resolveContract,
  resolveTrade,
  uid
} from '@/lib/game';
import { loadLocal, saveLocal } from '@/lib/storage';

type OpenCaseResult = {
  skinId: string;
  leveledUp: boolean;
  newLevel?: number;
  rewardsText?: string;
};

type ContractResult = {
  skinId: string;
  totalValue: number;
  spentCount: number;
  leveledUp: boolean;
};

type AuthMode = 'sign-in' | 'sign-up';
type PersistenceMode = 'local' | 'online';

type LoginResult = { ok: boolean; message: string };

function normalizePlayerName(name: string) {
  return name.trim().slice(0, 18) || 'Forge Player';
}

function usernameToInternalEmail(username: string) {
  const slug = username
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);

  return `${slug || 'player'}@caseforge.local`;
}

type GameContextType = {
  hydrated: boolean;
  mode: PersistenceMode;
  onlineReady: boolean;
  authLoading: boolean;
  currentUser: User | null;
  users: User[];
  recentWins: RecentWin[];
  stats: typeof serverStats;
  battles: BattleResult[];
  trades: TradeProposal[];
  login: (name: string, avatar: string, email?: string, password?: string, authMode?: AuthMode) => Promise<LoginResult>;
  logout: () => Promise<void> | void;
  openLoginAs: (userId: string) => void;
  refreshOnlineData: () => Promise<void>;
  openCaseById: (caseId: string) => OpenCaseResult | { error: string };
  sellItem: (uid: string) => void;
  claimMission: (missionId: string) => { ok: boolean; message: string };
  claimDailyReward: () => { ok: boolean; message: string };
  runBattle: (caseIds: string[], opponentIds: string[]) => BattleResult | { error: string };
  sendTrade: (targetUserId: string, offeredItemUid: string, requestedItemUid: string) => TradeProposal | { error: string };
  runContract: (itemUids: string[]) => ContractResult | { error: string };
  resetPrototype: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

function isRealLocalUser(user: User) {
  return !user.id.startsWith('bot-') && !user.id.startsWith('npc-') && !user.id.startsWith('fake-');
}

function uniqueUsers(users: User[]) {
  const map = new Map<string, User>();
  users.filter(isRealLocalUser).forEach((user) => map.set(user.id, user));
  return Array.from(map.values());
}

function defaultStats(): UserStats {
  return {
    openedCases: 0,
    rareDrops: 0,
    battlesPlayed: 0,
    tradesCompleted: 0,
    levelsGained: 0
  };
}

function safeStats(value: unknown): UserStats {
  const stats = (value ?? {}) as Partial<UserStats>;
  return {
    openedCases: Number(stats.openedCases ?? 0),
    rareDrops: Number(stats.rareDrops ?? 0),
    battlesPlayed: Number(stats.battlesPlayed ?? 0),
    tradesCompleted: Number(stats.tradesCompleted ?? 0),
    levelsGained: Number(stats.levelsGained ?? 0)
  };
}

function safeMissionState(value: unknown): Record<string, MissionState> {
  if (!value || typeof value !== 'object') return {};
  return value as Record<string, MissionState>;
}

function profileRowToUser(profile: any, inventory: InventoryItem[] = []): User {
  return {
    id: profile.id,
    name: profile.username ?? 'Forge Player',
    avatar: profile.avatar_url ?? 'CF',
    level: Number(profile.level ?? 1),
    xp: Number(profile.xp ?? 0),
    coins: Number(profile.coins ?? 650),
    tickets: Number(profile.tickets ?? 0),
    inventory,
    wins: [],
    createdAt: profile.created_at ?? new Date().toISOString(),
    lastDailyReward: profile.last_daily_reward ?? undefined,
    missionState: safeMissionState(profile.mission_state),
    stats: safeStats(profile.stats)
  };
}

function inventoryRowToItem(row: any): InventoryItem {
  return {
    uid: row.id,
    skinId: row.skin_id,
    obtainedAt: row.obtained_at ?? new Date().toISOString(),
    source: row.source ?? 'case'
  };
}

function winRowToRecentWin(row: any): RecentWin {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    avatar: row.avatar ?? 'CF',
    skinId: row.skin_id,
    value: Number(row.value ?? 0),
    rarity: row.rarity,
    createdAt: row.created_at ?? new Date().toISOString()
  };
}

function battleRowToResult(row: any): BattleResult {
  return {
    id: row.id,
    caseIds: row.case_ids ?? [],
    players: row.players ?? [],
    rounds: row.rounds ?? [],
    totals: row.totals ?? {},
    winnerId: row.winner_id,
    winnerName: row.winner_name,
    createdAt: row.created_at ?? new Date().toISOString()
  };
}

function tradeRowToProposal(row: any): TradeProposal {
  return {
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    offeredItemUid: row.offered_item_uid,
    requestedItemUid: row.requested_item_uid,
    status: row.status ?? 'pending',
    createdAt: row.created_at ?? new Date().toISOString(),
    resolvedAt: row.resolved_at ?? undefined
  };
}

function applyXpAndRewards(user: User, xp: number) {
  const result = levelUp(user, xp);
  const leveledUp = result.level > user.level;
  return {
    user: {
      ...user,
      level: result.level,
      xp: result.xp,
      coins: user.coins + result.coinsReward,
      tickets: user.tickets + result.ticketsReward,
      stats: {
        ...user.stats,
        levelsGained: user.stats.levelsGained + result.levelsGained
      }
    },
    leveledUp,
    rewardsText: result.levelsGained > 0 ? `+${result.coinsReward} coins, +${result.ticketsReward} ticket. ${result.unlockedCases.join(', ')}` : undefined
  };
}

function profilePayload(user: User) {
  return {
    id: user.id,
    username: user.name,
    avatar_url: user.avatar,
    level: user.level,
    xp: user.xp,
    coins: user.coins,
    tickets: user.tickets,
    last_daily_reward: user.lastDailyReward ?? null,
    mission_state: user.missionState,
    stats: user.stats
  };
}

function inventoryPayload(userId: string, item: InventoryItem) {
  return {
    id: item.uid,
    user_id: userId,
    skin_id: item.skinId,
    obtained_at: item.obtainedAt,
    source: item.source
  };
}

function winPayload(win: RecentWin) {
  return {
    id: win.id,
    user_id: win.userId,
    user_name: win.userName,
    avatar: win.avatar,
    skin_id: win.skinId,
    value: win.value,
    rarity: win.rarity,
    created_at: win.createdAt
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [mode] = useState<PersistenceMode>(isSupabaseConfigured ? 'online' : 'local');
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(isSupabaseConfigured ? [] : initialUsers);
  const [recentWins, setRecentWins] = useState<RecentWin[]>(isSupabaseConfigured ? [] : initialRecentWins);
  const [battles, setBattles] = useState<BattleResult[]>([]);
  const [trades, setTrades] = useState<TradeProposal[]>([]);

  const persistProfile = useCallback(async (user: User) => {
    if (!supabase) return;
    await supabase.from('profiles').upsert(profilePayload(user), { onConflict: 'id' });
  }, []);

  const insertInventoryItems = useCallback(async (userId: string, items: InventoryItem[]) => {
    if (!supabase || items.length === 0) return;
    await supabase.from('inventory_items').upsert(items.map((item) => inventoryPayload(userId, item)), { onConflict: 'id' });
  }, []);

  const deleteInventoryItems = useCallback(async (itemIds: string[]) => {
    if (!supabase || itemIds.length === 0) return;
    await supabase.from('inventory_items').delete().in('id', itemIds);
  }, []);

  const insertRecentWin = useCallback(async (win: RecentWin) => {
    if (!supabase) return;
    await supabase.from('recent_wins').insert(winPayload(win));
  }, []);

  const insertBattle = useCallback(async (battle: BattleResult, creatorId: string) => {
    if (!supabase) return;
    await supabase.from('battles').insert({
      id: battle.id,
      creator_id: creatorId,
      case_ids: battle.caseIds,
      players: battle.players,
      rounds: battle.rounds,
      totals: battle.totals,
      winner_id: battle.winnerId,
      winner_name: battle.winnerName,
      created_at: battle.createdAt
    });
  }, []);

  const insertTrade = useCallback(async (trade: TradeProposal) => {
    if (!supabase) return;
    await supabase.from('trades').upsert({
      id: trade.id,
      from_user_id: trade.fromUserId,
      to_user_id: trade.toUserId,
      offered_item_uid: trade.offeredItemUid,
      requested_item_uid: trade.requestedItemUid,
      status: trade.status,
      created_at: trade.createdAt,
      resolved_at: trade.resolvedAt ?? null
    }, { onConflict: 'id' });
  }, []);

  const updateCurrentUser = useCallback((user: User) => {
    setCurrentUser(user);
    setUsers((prev) => uniqueUsers([user, ...prev]).map((entry) => (entry.id === user.id ? user : entry)));
    if (mode === 'online') void persistProfile(user);
  }, [mode, persistProfile]);

  const loadOnlineState = useCallback(async (currentUserId?: string | null) => {
    if (!supabase) return;
    setAuthLoading(true);

    const [{ data: profileRows }, { data: inventoryRows }, { data: winRows }, { data: battleRows }, { data: tradeRows }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('inventory_items').select('*').order('obtained_at', { ascending: false }).limit(2000),
      supabase.from('recent_wins').select('*').order('created_at', { ascending: false }).limit(80),
      supabase.from('battles').select('*').order('created_at', { ascending: false }).limit(30),
      supabase.from('trades').select('*').order('created_at', { ascending: false }).limit(60)
    ]);

    const inventoryByUser = new Map<string, InventoryItem[]>();
    (inventoryRows ?? []).forEach((row: any) => {
      const list = inventoryByUser.get(row.user_id) ?? [];
      list.push(inventoryRowToItem(row));
      inventoryByUser.set(row.user_id, list);
    });

    const loadedUsers = (profileRows ?? []).map((profile: any) => profileRowToUser(profile, inventoryByUser.get(profile.id) ?? []));
    const nextCurrent = currentUserId ? loadedUsers.find((user) => user.id === currentUserId) ?? null : null;

    setUsers(uniqueUsers(nextCurrent ? [nextCurrent, ...loadedUsers] : loadedUsers));
    setCurrentUser(nextCurrent);
    setRecentWins((winRows ?? []).map(winRowToRecentWin));
    setBattles((battleRows ?? []).map(battleRowToResult));
    setTrades((tradeRows ?? []).map(tradeRowToProposal));
    setHydrated(true);
    setAuthLoading(false);
  }, []);

  const ensureOnlineProfile = useCallback(async (id: string, name: string, avatar: string) => {
    if (!supabase) return null;
    const { data: existing } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (existing) return profileRowToUser(existing, []);

    const user = createStarterUser(name, avatar);
    const onlineUser: User = { ...user, id };
    await supabase.from('profiles').insert(profilePayload(onlineUser));
    return onlineUser;
  }, []);

  useEffect(() => {
    if (mode === 'online') {
      let mounted = true;
      const bootstrap = async () => {
        if (!supabase) return;
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (sessionUser) {
          const username = String(sessionUser.user_metadata?.username ?? sessionUser.email?.split('@')[0] ?? 'Forge Player');
          const avatar = String(sessionUser.user_metadata?.avatar_url ?? username.slice(0, 2).toUpperCase());
          await ensureOnlineProfile(sessionUser.id, username, avatar);
          if (mounted) await loadOnlineState(sessionUser.id);
        } else if (mounted) {
          await loadOnlineState(null);
        }
      };
      void bootstrap();

      const { data: listener } = supabase!.auth.onAuthStateChange((_event, session) => {
        void loadOnlineState(session?.user?.id ?? null);
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    }

    const loadedCurrent = loadLocal<User | null>('current-user', null);
    const cleanCurrent = loadedCurrent && isRealLocalUser(loadedCurrent) ? loadedCurrent : null;
    const loadedUsers = uniqueUsers(loadLocal<User[]>('users', initialUsers));
    setCurrentUser(cleanCurrent);
    setUsers(uniqueUsers(cleanCurrent ? [cleanCurrent, ...loadedUsers] : loadedUsers));
    setRecentWins(loadLocal<RecentWin[]>('recent-wins', initialRecentWins).filter((win) => !win.userId.startsWith('bot-')));
    setBattles(loadLocal<BattleResult[]>('battles', []));
    setTrades(loadLocal<TradeProposal[]>('trades', []));
    setHydrated(true);
  }, [mode, ensureOnlineProfile, loadOnlineState]);

  useEffect(() => {
    if (!hydrated || mode !== 'local') return;
    saveLocal('current-user', currentUser);
    saveLocal('users', uniqueUsers(users));
    saveLocal('recent-wins', recentWins.slice(0, 60));
    saveLocal('battles', battles.slice(0, 30));
    saveLocal('trades', trades.slice(0, 30));
  }, [hydrated, mode, currentUser, users, recentWins, battles, trades]);

  const login: GameContextType['login'] = async (name, avatar, _email, password, authMode = 'sign-in') => {
    const safeName = normalizePlayerName(name);

    if (mode === 'online') {
      if (!supabase) return { ok: false, message: 'Supabase não está configurado.' };
      if (!password || password.length < 6) return { ok: false, message: 'Digite uma senha com no mínimo 6 caracteres.' };

      const internalEmail = usernameToInternalEmail(safeName);
      setAuthLoading(true);

      const result = authMode === 'sign-up'
        ? await supabase.auth.signUp({
            email: internalEmail,
            password,
            options: {
              data: {
                username: safeName,
                avatar_url: avatar,
                login_type: 'username-password'
              }
            }
          })
        : await supabase.auth.signInWithPassword({ email: internalEmail, password });

      if (result.error) {
        setAuthLoading(false);
        const message = result.error.message.toLowerCase().includes('already registered')
          ? 'Esse username já existe. Escolha outro ou entre na conta.'
          : result.error.message.toLowerCase().includes('invalid login')
            ? 'Username ou senha incorretos.'
            : result.error.message;
        return { ok: false, message };
      }

      const authUser = result.data.user;
      if (!authUser || !result.data.session) {
        setAuthLoading(false);
        return { ok: false, message: 'Desative a confirmação de e-mail no Supabase para entrar sem verificar e-mail.' };
      }

      await ensureOnlineProfile(authUser.id, safeName, avatar);
      await loadOnlineState(authUser.id);
      setAuthLoading(false);
      return { ok: true, message: authMode === 'sign-up' ? 'Conta criada e login feito.' : 'Login feito.' };
    }

    const existing = users.find((user) => user.name.toLowerCase() === safeName.toLowerCase());
    if (existing) {
      const updated = { ...existing, avatar };
      updateCurrentUser(updated);
      return { ok: true, message: 'Usuário local aberto.' };
    }
    const user = createStarterUser(safeName, avatar);
    updateCurrentUser(user);
    return { ok: true, message: 'Usuário local criado.' };
  };

  const logout = async () => {
    if (mode === 'online' && supabase) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      return;
    }
    setCurrentUser(null);
  };

  const openLoginAs = (userId: string) => {
    if (mode === 'online') return;
    const user = users.find((item) => item.id === userId);
    if (user) setCurrentUser(user);
  };

  const refreshOnlineData = async () => {
    if (mode === 'online' && supabase) {
      const { data } = await supabase.auth.getSession();
      await loadOnlineState(data.session?.user?.id ?? null);
    }
  };

  const openCaseById = (caseId: string) => {
    if (!currentUser) return { error: 'Login first to open cases.' };
    const forgeCase = cases.find((item) => item.id === caseId);
    if (!forgeCase) return { error: 'Case not found.' };
    if (currentUser.level < forgeCase.levelRequired) return { error: `Unlocks at level ${forgeCase.levelRequired}.` };
    if (currentUser.coins < forgeCase.price) return { error: 'Not enough fictional coins.' };

    const skin = openCase(forgeCase);
    const item: InventoryItem = { uid: uid('inv'), skinId: skin.id, obtainedAt: new Date().toISOString(), source: 'case' };
    const xpGain = calculateXP(currentUser.level, forgeCase.xpReward);
    const baseUser: User = {
      ...currentUser,
      coins: currentUser.coins - forgeCase.price + forgeCase.coinReward,
      inventory: [item, ...currentUser.inventory],
      stats: {
        ...currentUser.stats,
        openedCases: currentUser.stats.openedCases + 1,
        rareDrops: currentUser.stats.rareDrops + (rarityIndex(skin.rarity) >= 2 ? 1 : 0)
      }
    };
    const xpApplied = applyXpAndRewards(baseUser, xpGain);
    const win = generateRecentWin(xpApplied.user, skin);
    const updatedUser: User = { ...xpApplied.user, wins: [win, ...xpApplied.user.wins].slice(0, 40) };

    updateCurrentUser(updatedUser);
    setRecentWins((prev) => [win, ...prev].slice(0, 60));
    if (mode === 'online') {
      void insertInventoryItems(updatedUser.id, [item]);
      void insertRecentWin(win);
    }

    return {
      skinId: skin.id,
      leveledUp: xpApplied.leveledUp,
      newLevel: xpApplied.leveledUp ? updatedUser.level : undefined,
      rewardsText: xpApplied.rewardsText
    };
  };

  const sellItem = (itemUid: string) => {
    if (!currentUser) return;
    const item = currentUser.inventory.find((entry) => entry.uid === itemUid);
    if (!item) return;
    const skin = getSkin(item.skinId);
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + skin.value,
      inventory: currentUser.inventory.filter((entry) => entry.uid !== itemUid)
    };
    updateCurrentUser(updatedUser);
    if (mode === 'online') void deleteInventoryItems([itemUid]);
  };

  const claimMission = (missionId: string) => {
    if (!currentUser) return { ok: false, message: 'Login first.' };
    const mission = missions.find((item) => item.id === missionId);
    if (!mission) return { ok: false, message: 'Mission not found.' };
    const state = currentUser.missionState[mission.id];
    const progress = Math.min(mission.target, (() => {
      if (mission.type === 'open_cases') return currentUser.stats.openedCases;
      if (mission.type === 'rare_drops') return currentUser.stats.rareDrops;
      if (mission.type === 'battle') return currentUser.stats.battlesPlayed;
      if (mission.type === 'trade') return currentUser.stats.tradesCompleted;
      return currentUser.stats.levelsGained;
    })());

    if (state?.claimed) return { ok: false, message: 'Mission already claimed.' };
    if (progress < mission.target) return { ok: false, message: 'Mission not finished yet.' };

    const rewarded = applyXpAndRewards({
      ...currentUser,
      coins: currentUser.coins + mission.coinReward,
      missionState: {
        ...currentUser.missionState,
        [mission.id]: { progress, claimed: true }
      }
    }, Math.floor(mission.xpReward * 0.55));
    updateCurrentUser(rewarded.user);
    return { ok: true, message: `Mission claimed: +${mission.coinReward} coins and +${Math.floor(mission.xpReward * 0.55)} XP.` };
  };

  const claimDailyReward = () => {
    if (!currentUser) return { ok: false, message: 'Login first.' };
    const today = new Date().toISOString().slice(0, 10);
    if (currentUser.lastDailyReward === today) return { ok: false, message: 'Daily reward already claimed today.' };
    const rewarded = applyXpAndRewards({
      ...currentUser,
      lastDailyReward: today,
      coins: currentUser.coins + 180,
      tickets: currentUser.tickets + 1
    }, 35);
    updateCurrentUser(rewarded.user);
    return { ok: true, message: 'Daily reward claimed: +180 coins, +35 XP, +1 ticket.' };
  };

  const runBattle = (caseIds: string[], opponentIds: string[]) => {
    if (!currentUser) return { error: 'Login first.' };
    if (caseIds.length === 0) return { error: 'Choose at least one case for the battle.' };
    if (opponentIds.length === 0) return { error: mode === 'online' ? 'Choose at least one real account from the server.' : 'Choose at least one real local player. Create another login first if needed.' };

    const selectedCases = caseIds.map((caseId) => cases.find((item) => item.id === caseId)).filter(Boolean) as typeof cases;
    const locked = selectedCases.find((item) => currentUser.level < item.levelRequired);
    if (locked) return { error: `${locked.name} unlocks at level ${locked.levelRequired}.` };

    const price = battleEntryCost(caseIds);
    if (currentUser.coins < price) return { error: 'Not enough fictional coins to enter this battle.' };

    const opponents = opponentIds.map((id) => users.find((item) => item.id === id)).filter(Boolean) as User[];
    if (opponents.length === 0) return { error: 'No valid real player selected.' };

    const result = createBattle(currentUser, caseIds, opponents);
    const allDrops = result.rounds.flat();
    const itemsAwarded = allDrops.map((drop) => ({ uid: uid('inv'), skinId: drop.skinId, obtainedAt: new Date().toISOString(), source: 'battle' as const }));
    const didWin = result.winnerId === currentUser.id;
    const xpApplied = applyXpAndRewards({
      ...currentUser,
      coins: currentUser.coins - price + (didWin ? 0 : 25),
      inventory: didWin ? [...itemsAwarded, ...currentUser.inventory] : currentUser.inventory,
      stats: {
        ...currentUser.stats,
        battlesPlayed: currentUser.stats.battlesPlayed + 1,
        rareDrops: currentUser.stats.rareDrops + (didWin ? itemsAwarded.filter((item) => rarityIndex(getSkin(item.skinId).rarity) >= 2).length : 0)
      }
    }, 28 + caseIds.length * 10);

    const winnerDrops = allDrops.filter((drop) => drop.playerId === result.winnerId).sort((a, b) => b.value - a.value);
    const recent = winnerDrops.slice(0, 3).map((drop) => {
      const winner = result.players.find((player) => player.id === result.winnerId) ?? result.players[0];
      return generateRecentWin({ ...currentUser, id: winner.id, name: winner.name, avatar: winner.avatar }, getSkin(drop.skinId));
    });

    const updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) return xpApplied.user;
      if (mode === 'local' && user.id === result.winnerId) {
        return {
          ...user,
          inventory: [...itemsAwarded, ...user.inventory],
          stats: { ...user.stats, battlesPlayed: user.stats.battlesPlayed + 1 }
        };
      }
      if (opponentIds.includes(user.id)) return { ...user, stats: { ...user.stats, battlesPlayed: user.stats.battlesPlayed + 1 } };
      return user;
    });

    setCurrentUser(xpApplied.user);
    setUsers(uniqueUsers(updatedUsers));
    setBattles((prev) => [result, ...prev].slice(0, 30));
    setRecentWins((prev) => [...recent, ...prev].slice(0, 60));

    if (mode === 'online') {
      void persistProfile(xpApplied.user);
      if (didWin) void insertInventoryItems(xpApplied.user.id, itemsAwarded);
      void insertBattle(result, currentUser.id);
      recent.forEach((win) => void insertRecentWin(win));
    }

    return result;
  };

  const sendTrade = (targetUserId: string, offeredItemUid: string, requestedItemUid: string) => {
    if (!currentUser) return { error: 'Login first.' };
    const target = users.find((item) => item.id === targetUserId);
    if (!target) return { error: 'Target user not found.' };
    const proposal = createTrade(currentUser, targetUserId, offeredItemUid, requestedItemUid);

    if (mode === 'online') {
      const finalProposal: TradeProposal = { ...proposal, status: 'pending' };
      setTrades((prev) => [finalProposal, ...prev].slice(0, 60));
      void insertTrade(finalProposal);
      return finalProposal;
    }

    const resolved = resolveTrade(currentUser, target, offeredItemUid, requestedItemUid);
    const finalProposal: TradeProposal = { ...proposal, status: resolved.status, resolvedAt: new Date().toISOString() };

    if (resolved.status === 'accepted') {
      const xpApplied = applyXpAndRewards({
        ...resolved.user,
        stats: {
          ...resolved.user.stats,
          tradesCompleted: resolved.user.stats.tradesCompleted + 1
        }
      }, 32);
      setCurrentUser(xpApplied.user);
      setUsers((prev) => uniqueUsers(prev.map((item) => {
        if (item.id === target.id) return resolved.targetUser;
        if (item.id === currentUser.id) return xpApplied.user;
        return item;
      })));
    }

    setTrades((prev) => [finalProposal, ...prev].slice(0, 30));
    return finalProposal;
  };

  const runContract = (itemUids: string[]) => {
    if (!currentUser) return { error: 'Login first.' };
    const unique = Array.from(new Set(itemUids));
    if (unique.length < 3 || unique.length > 10) return { error: 'Contracts need 3 to 10 skins.' };
    const selected = currentUser.inventory.filter((item) => unique.includes(item.uid));
    if (selected.length !== unique.length) return { error: 'One or more selected skins were not found.' };
    const { reward, total } = resolveContract(currentUser.inventory, unique);
    const rewardItem: InventoryItem = { uid: uid('inv'), skinId: reward.id, obtainedAt: new Date().toISOString(), source: 'contract' };
    const baseUser: User = {
      ...currentUser,
      inventory: [rewardItem, ...currentUser.inventory.filter((item) => !unique.includes(item.uid))],
      stats: {
        ...currentUser.stats,
        rareDrops: currentUser.stats.rareDrops + (rarityIndex(reward.rarity) >= 2 ? 1 : 0)
      }
    };
    const xpApplied = applyXpAndRewards(baseUser, 45 + unique.length * 7);
    const win = generateRecentWin(xpApplied.user, reward);
    const updatedUser = { ...xpApplied.user, wins: [win, ...xpApplied.user.wins].slice(0, 40) };
    updateCurrentUser(updatedUser);
    setRecentWins((prev) => [win, ...prev].slice(0, 60));
    if (mode === 'online') {
      void deleteInventoryItems(unique);
      void insertInventoryItems(updatedUser.id, [rewardItem]);
      void insertRecentWin(win);
    }
    return { skinId: reward.id, totalValue: total, spentCount: unique.length, leveledUp: xpApplied.leveledUp };
  };

  const resetPrototype = () => {
    if (mode === 'online') return;
    setCurrentUser(null);
    setUsers(initialUsers);
    setRecentWins(initialRecentWins);
    setBattles([]);
    setTrades([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('case-forge:current-user');
      window.localStorage.removeItem('case-forge:users');
      window.localStorage.removeItem('case-forge:recent-wins');
      window.localStorage.removeItem('case-forge:battles');
      window.localStorage.removeItem('case-forge:trades');
    }
  };

  const value = useMemo<GameContextType>(() => {
    const realUsers = uniqueUsers(currentUser ? [currentUser, ...users] : users);
    const inventoryMultiplier = realUsers.reduce((sum, user) => sum + calculateInventoryValue(user.inventory), 0);
    return {
      hydrated,
      mode,
      onlineReady: isSupabaseConfigured,
      authLoading,
      currentUser,
      users: realUsers,
      recentWins,
      stats: {
        ...serverStats,
        casesOpened: serverStats.casesOpened + realUsers.reduce((sum, user) => sum + user.stats.openedCases, 0),
        battlesPlayed: serverStats.battlesPlayed + battles.length,
        usersRegistered: serverStats.usersRegistered + realUsers.length,
        totalCoinsWon: serverStats.totalCoinsWon + inventoryMultiplier
      },
      battles,
      trades,
      login,
      logout,
      openLoginAs,
      refreshOnlineData,
      openCaseById,
      sellItem,
      claimMission,
      claimDailyReward,
      runBattle,
      sendTrade,
      runContract,
      resetPrototype
    };
  }, [hydrated, mode, authLoading, currentUser, users, recentWins, battles, trades]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
}
