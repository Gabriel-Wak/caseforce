import type { Mission } from '@/lib/types';

export const missions: Mission[] = [
  {
    id: 'daily-open-5',
    title: 'Open 5 cases',
    description: 'Open any five crates in the forge.',
    type: 'open_cases',
    target: 5,
    xpReward: 70,
    coinReward: 160
  },
  {
    id: 'daily-rare-3',
    title: 'Win 3 rare skins',
    description: 'Drop Mil-Spec or better skins.',
    type: 'rare_drops',
    target: 3,
    xpReward: 85,
    coinReward: 220
  },
  {
    id: 'daily-battle-1',
    title: 'Play 1 battle',
    description: 'Join the Battle Arena once.',
    type: 'battle',
    target: 1,
    xpReward: 65,
    coinReward: 140
  },
  {
    id: 'daily-trade-1',
    title: 'Complete 1 trade',
    description: 'Send a trade and get it accepted.',
    type: 'trade',
    target: 1,
    xpReward: 75,
    coinReward: 170
  },
  {
    id: 'daily-level-1',
    title: 'Level up once',
    description: 'Earn XP until your account levels up.',
    type: 'level_up',
    target: 1,
    xpReward: 95,
    coinReward: 260
  }
];
