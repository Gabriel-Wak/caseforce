'use client';

import { useMemo, useState } from 'react';
import { rarityOrder, getSkin } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { calculateInventoryValue, formatCoins, mostExpensiveItem } from '@/lib/game';
import { InventoryItemCard } from '@/components/inventory/InventoryItemCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type { Rarity } from '@/lib/types';

export function InventoryGrid() {
  const { currentUser, sellItem, mode } = useGame();
  const [rarity, setRarity] = useState<Rarity | 'All'>('All');
  const [sort, setSort] = useState<'value' | 'newest'>('value');

  const items = useMemo(() => {
    if (!currentUser) return [];
    return currentUser.inventory
      .filter((item) => rarity === 'All' || getSkin(item.skinId).rarity === rarity)
      .sort((a, b) => sort === 'value' ? getSkin(b.skinId).value - getSkin(a.skinId).value : +new Date(b.obtainedAt) - +new Date(a.obtainedAt));
  }, [currentUser, rarity, sort]);

  if (!currentUser) {
    return <div className="forge-panel p-6 text-forge-muted">Login to view your inventory.</div>;
  }

  const total = calculateInventoryValue(currentUser.inventory);
  const best = mostExpensiveItem(currentUser.inventory);

  return (
    <div className="space-y-4">
      <div className="forge-panel p-5">
        <div className="relative z-10 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="micro-label text-forge-amber">Inventory value</p>
            <h1 className="font-display text-5xl font-black uppercase text-forge-ice">¢{formatCoins(total)}</h1>
            <p className="mt-2 text-sm text-forge-muted">{currentUser.inventory.length} fictional skins stored {mode === 'online' ? 'online.' : 'locally.'}</p>
          </div>
          <div className="border border-white/10 bg-black/30 p-4">
            <p className="micro-label">Most expensive</p>
            <p className="mt-1 font-display text-xl font-black uppercase text-forge-amber">{best ? getSkin(best.item.skinId).name : 'None yet'}</p>
          </div>
          <div className="border border-white/10 bg-black/30 p-4">
            <p className="micro-label">Balance</p>
            <p className="mt-1 font-display text-xl font-black text-forge-ice">¢{formatCoins(currentUser.coins)}</p>
          </div>
        </div>
      </div>

      <div className="forge-panel p-4">
        <SectionHeader eyebrow="Vault" title="Your skins" />
        <div className="relative z-10 mb-4 flex flex-wrap gap-2">
          <select value={rarity} onChange={(event) => setRarity(event.target.value as Rarity | 'All')} className="border border-white/15 bg-black/70 px-3 py-2 text-sm font-bold text-forge-ice outline-none">
            <option value="All">All rarities</option>
            {rarityOrder.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value as 'value' | 'newest')} className="border border-white/15 bg-black/70 px-3 py-2 text-sm font-bold text-forge-ice outline-none">
            <option value="value">Sort by value</option>
            <option value="newest">Sort by newest</option>
          </select>
        </div>
        <div className="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => <InventoryItemCard key={item.uid} item={item} onSell={sellItem} highlight={best?.item.uid === item.uid} />)}
        </div>
        {items.length === 0 ? <p className="relative z-10 p-6 text-center text-forge-muted">No items match this filter. Open a case to start collecting.</p> : null}
      </div>
    </div>
  );
}
