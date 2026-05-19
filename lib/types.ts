export type Rarity = 'Consumer' | 'Industrial' | 'Mil-Spec' | 'Restricted' | 'Classified' | 'Covert' | 'Gold';

export type MissionType = 'open_cases' | 'rare_drops' | 'battle' | 'trade' | 'level_up';

export type CaseCategory = 'Free Cases' | 'Promo Cases' | 'Holo Cases' | 'Battle Cases' | 'Premium Cases' | 'Elite Cases';

export type Skin = {
  id: string;
  name: string;
  weapon: string;
  rarity: Rarity;
  value: number;
  image: string;
  chance: number;
  color: string;
  light: string;
};

export type CaseDrop = {
  skinId: string;
  chance: number;
};

export type ForgeCase = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  category: CaseCategory;
  levelRequired: number;
  xpReward: number;
  coinReward: number;
  price: number;
  accent: string;
  items: CaseDrop[];
};

export type InventoryItem = {
  uid: string;
  skinId: string;
  obtainedAt: string;
  source: 'case' | 'battle' | 'trade' | 'reward' | 'contract';
};

export type RecentWin = {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  skinId: string;
  value: number;
  rarity: Rarity;
  createdAt: string;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  target: number;
  xpReward: number;
  coinReward: number;
};

export type MissionState = {
  progress: number;
  claimed: boolean;
};

export type UserStats = {
  openedCases: number;
  rareDrops: number;
  battlesPlayed: number;
  tradesCompleted: number;
  levelsGained: number;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  tickets: number;
  inventory: InventoryItem[];
  wins: RecentWin[];
  createdAt: string;
  lastDailyReward?: string;
  missionState: Record<string, MissionState>;
  stats: UserStats;
};

export type BattleRoundDrop = {
  playerId: string;
  playerName: string;
  avatar: string;
  caseId: string;
  skinId: string;
  value: number;
};

export type BattlePlayer = {
  id: string;
  name: string;
  avatar: string;
};

export type BattleResult = {
  id: string;
  caseIds: string[];
  players: BattlePlayer[];
  rounds: BattleRoundDrop[][];
  totals: Record<string, number>;
  winnerId: string;
  winnerName: string;
  createdAt: string;
};

export type TradeProposal = {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredItemUid: string;
  requestedItemUid: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
};
