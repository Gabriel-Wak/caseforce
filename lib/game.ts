import { cases } from '@/data/cases';
import { getSkin, rarityIndex, skins } from '@/data/skins';
import type { BattleResult, ForgeCase, InventoryItem, Mission, RecentWin, Skin, TradeProposal, User } from '@/lib/types';

export function uid(prefix = 'id') {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatCoins(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.max(0, Math.floor(value)));
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function xpForLevel(level: number) {
  return Math.floor(520 + level * 165 + Math.pow(level, 1.78) * 58);
}

export function calculateXP(level: number, base: number) {
  return Math.max(3, Math.floor(base * 0.42 + level * 0.28));
}

export function levelUp(user: User, addedXP: number) {
  let level = user.level;
  let xp = user.xp + addedXP;
  let coinsReward = 0;
  let ticketsReward = 0;
  let levelsGained = 0;
  const unlockedCases: string[] = [];

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    levelsGained += 1;
    coinsReward += 60 + level * 10;
    if ([5, 10, 20, 35, 50, 60].includes(level)) {
      ticketsReward += 1;
      const unlocked = cases.find((forgeCase) => forgeCase.levelRequired === level);
      if (unlocked) unlockedCases.push(unlocked.name);
    }
  }

  return { level, xp, coinsReward, ticketsReward, levelsGained, unlockedCases };
}

export function getUnlockedCases(level: number) {
  return cases.filter((forgeCase) => level >= forgeCase.levelRequired);
}

export function openCase(forgeCase: ForgeCase): Skin {
  const totalChance = forgeCase.items.reduce((sum, item) => sum + item.chance, 0);
  let cursor = Math.random() * totalChance;

  for (const drop of forgeCase.items) {
    cursor -= drop.chance;
    if (cursor <= 0) return getSkin(drop.skinId);
  }

  return getSkin(forgeCase.items[0].skinId);
}

export function calculateInventoryValue(inventory: InventoryItem[]) {
  return inventory.reduce((sum, item) => sum + getSkin(item.skinId).value, 0);
}

export function mostExpensiveItem(inventory: InventoryItem[]) {
  if (inventory.length === 0) return null;
  return inventory.map((item) => ({ item, skin: getSkin(item.skinId) })).sort((a, b) => b.skin.value - a.skin.value)[0];
}

export function generateRecentWin(user: User, skin: Skin): RecentWin {
  return {
    id: uid('win'),
    userId: user.id,
    userName: user.name,
    avatar: user.avatar,
    skinId: skin.id,
    value: skin.value,
    rarity: skin.rarity,
    createdAt: new Date().toISOString()
  };
}

export function createBattle(user: User, caseIds: string[], opponents: User[]): BattleResult {
  const players = [user, ...opponents].slice(0, 4).map((player) => ({ id: player.id, name: player.name, avatar: player.avatar }));
  const totals: Record<string, number> = Object.fromEntries(players.map((player) => [player.id, 0]));
  const rounds: BattleResult['rounds'] = [];

  caseIds.forEach((caseId) => {
    const forgeCase = cases.find((item) => item.id === caseId) ?? cases[0];
    const roundDrops = players.map((player) => {
      const skin = openCase(forgeCase);
      totals[player.id] += skin.value;
      return {
        playerId: player.id,
        playerName: player.name,
        avatar: player.avatar,
        caseId: forgeCase.id,
        skinId: skin.id,
        value: skin.value
      };
    });
    rounds.push(roundDrops);
  });

  const winner = players.slice().sort((a, b) => totals[b.id] - totals[a.id])[0];

  return {
    id: uid('battle'),
    caseIds,
    players,
    rounds,
    totals,
    winnerId: winner.id,
    winnerName: winner.name,
    createdAt: new Date().toISOString()
  };
}

export function battleEntryCost(caseIds: string[]) {
  return caseIds.reduce((sum, caseId) => sum + (cases.find((item) => item.id === caseId)?.price ?? 0), 0);
}

export function createTrade(user: User, toUserId: string, offeredItemUid: string, requestedItemUid: string): TradeProposal {
  return {
    id: uid('trade'),
    fromUserId: user.id,
    toUserId,
    offeredItemUid,
    requestedItemUid,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
}

export function resolveTrade(user: User, targetUser: User, offeredItemUid: string, requestedItemUid: string) {
  const offered = user.inventory.find((item) => item.uid === offeredItemUid);
  const requested = targetUser.inventory.find((item) => item.uid === requestedItemUid);
  if (!offered || !requested) return { status: 'rejected' as const, user, targetUser };

  const offeredSkin = getSkin(offered.skinId);
  const requestedSkin = getSkin(requested.skinId);
  const ratio = offeredSkin.value / Math.max(1, requestedSkin.value);
  const accepted = ratio >= 0.92;

  if (!accepted) return { status: 'rejected' as const, user, targetUser };

  const newRequestedItem: InventoryItem = { ...requested, uid: uid('inv'), obtainedAt: new Date().toISOString(), source: 'trade' };
  const newOfferedItem: InventoryItem = { ...offered, uid: uid('inv'), obtainedAt: new Date().toISOString(), source: 'trade' };

  return {
    status: 'accepted' as const,
    user: {
      ...user,
      inventory: [...user.inventory.filter((item) => item.uid !== offeredItemUid), newRequestedItem]
    },
    targetUser: {
      ...targetUser,
      inventory: [...targetUser.inventory.filter((item) => item.uid !== requestedItemUid), newOfferedItem]
    }
  };
}

export function resolveContract(inventory: InventoryItem[], selectedUids: string[]) {
  const selected = inventory.filter((item) => selectedUids.includes(item.uid));
  const total = calculateInventoryValue(selected);
  const min = Math.max(20, total * 0.65);
  const max = Math.max(min + 1, total * 1.85);
  const pool = skins.filter((skin) => skin.value >= min && skin.value <= max);
  const fallback = skins.slice().sort((a, b) => Math.abs(a.value - total) - Math.abs(b.value - total));
  const candidates = pool.length > 0 ? pool : fallback.slice(0, 8);
  const reward = candidates[Math.floor(Math.random() * candidates.length)];
  return { reward, total };
}

export function createStarterUser(name: string, avatar: string): User {
  return {
    id: uid('user'),
    name,
    avatar,
    level: 1,
    xp: 0,
    coins: 650,
    tickets: 0,
    inventory: [],
    wins: [],
    createdAt: new Date().toISOString(),
    missionState: {},
    stats: {
      openedCases: 0,
      rareDrops: 0,
      battlesPlayed: 0,
      tradesCompleted: 0,
      levelsGained: 0
    }
  };
}

export function missionProgressValue(user: User, mission: Mission) {
  const saved = user.missionState[mission.id]?.progress ?? 0;
  const live = (() => {
    if (mission.type === 'open_cases') return user.stats.openedCases;
    if (mission.type === 'rare_drops') return user.stats.rareDrops;
    if (mission.type === 'battle') return user.stats.battlesPlayed;
    if (mission.type === 'trade') return user.stats.tradesCompleted;
    return user.stats.levelsGained;
  })();
  return Math.min(mission.target, Math.max(saved, live));
}
