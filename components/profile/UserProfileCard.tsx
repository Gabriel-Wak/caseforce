'use client';

import Link from 'next/link';
import { Avatar } from '@/components/shared/Avatar';
import { LevelProgressBar } from '@/components/shared/LevelProgressBar';
import { useGame } from '@/store/GameContext';
import { calculateInventoryValue, formatCoins } from '@/lib/game';

export function UserProfileCard() {
  const { currentUser } = useGame();

  if (!currentUser) {
    return (
      <div className="forge-panel p-4">
        <div className="relative z-10">
          <p className="micro-label text-forge-amber">Player profile</p>
          <h3 className="mt-2 font-display text-2xl font-black uppercase">Login required</h3>
          <p className="mt-2 text-sm text-forge-muted">Create a local profile to earn XP, collect fictional skins and play battles.</p>
        </div>
      </div>
    );
  }

  const inventoryValue = calculateInventoryValue(currentUser.inventory);

  return (
    <div className="forge-panel p-4">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Avatar value={currentUser.avatar} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="micro-label text-forge-amber">Authenticated locally</p>
            <h3 className="truncate font-display text-2xl font-black uppercase tracking-wide text-forge-ice">{currentUser.name}</h3>
          </div>
        </div>
        <div className="mt-4">
          <LevelProgressBar level={currentUser.level} xp={currentUser.xp} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="border border-white/10 bg-black/35 p-3">
            <p className="micro-label">Balance</p>
            <p className="font-display text-xl font-black text-forge-amber">¢ {formatCoins(currentUser.coins)}</p>
          </div>
          <div className="border border-white/10 bg-black/35 p-3">
            <p className="micro-label">Inventory</p>
            <p className="font-display text-xl font-black text-forge-ice">¢ {formatCoins(inventoryValue)}</p>
          </div>
          <div className="border border-white/10 bg-black/35 p-3">
            <p className="micro-label">Skins</p>
            <p className="font-display text-xl font-black text-forge-ice">{currentUser.inventory.length}</p>
          </div>
          <div className="border border-white/10 bg-black/35 p-3">
            <p className="micro-label">Tickets</p>
            <p className="font-display text-xl font-black text-forge-ice">{currentUser.tickets}</p>
          </div>
        </div>
        <Link href="/inventory" className="forge-button mt-4 w-full">Open inventory</Link>
      </div>
    </div>
  );
}
