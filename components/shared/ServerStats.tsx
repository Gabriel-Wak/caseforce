'use client';

import { useGame } from '@/store/GameContext';
import { formatCoins } from '@/lib/game';

const labels = [
  ['casesOpened', 'Cases opened'],
  ['battlesPlayed', 'Battles played'],
  ['usersRegistered', 'Users registered'],
  ['totalCoinsWon', 'Total coins won']
] as const;

export function ServerStats() {
  const { stats } = useGame();
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {labels.map(([key, label]) => (
        <div key={key} className="forge-panel p-4">
          <div className="relative z-10">
            <p className="micro-label">{label}</p>
            <p className="mt-1 font-display text-3xl font-black text-forge-ice">{formatCoins(stats[key])}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
