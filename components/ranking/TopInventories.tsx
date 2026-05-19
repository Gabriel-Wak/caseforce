'use client';

import { useMemo } from 'react';
import { useGame } from '@/store/GameContext';
import { Avatar } from '@/components/shared/Avatar';
import { calculateInventoryValue, formatCoins, mostExpensiveItem } from '@/lib/game';
import { getSkin } from '@/data/skins';
import { cn } from '@/lib/cn';

export function TopInventories({ compact = false }: { compact?: boolean }) {
  const { users, currentUser } = useGame();
  const ranking = useMemo(() => users
    .map((user) => ({ user, total: calculateInventoryValue(user.inventory), best: mostExpensiveItem(user.inventory) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, compact ? 5 : 12), [users, compact]);

  return (
    <div className="forge-panel p-4">
      <div className="relative z-10 mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="micro-label text-forge-amber">Competitive value board</p>
          <h2 className="section-title">Top Inventories</h2>
        </div>
        {!compact ? <span className="micro-label">Apenas usuários reais locais</span> : null}
      </div>
      <div className="relative z-10 space-y-2">
        {ranking.map((entry, index) => {
          const isCurrent = currentUser?.id === entry.user.id;
          const bestSkin = entry.best ? getSkin(entry.best.item.skinId) : null;
          return (
            <div key={entry.user.id} className={cn(
              'grid grid-cols-[42px_1fr_auto] items-center gap-3 border bg-black/35 p-3',
              isCurrent ? 'border-forge-orange/70 shadow-glow' : 'border-white/10'
            )}>
              <div className={cn('grid h-9 w-9 place-items-center border font-display text-lg font-black', index < 3 ? 'border-forge-amber/50 bg-forge-amber/15 text-forge-amber' : 'border-white/10 text-forge-silver')}>
                #{index + 1}
              </div>
              <div className="flex min-w-0 items-center gap-3">
                <Avatar value={entry.user.avatar} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-lg font-black uppercase tracking-wide text-forge-ice">{entry.user.name}</p>
                    <span className="border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-black uppercase text-forge-muted">LVL {entry.user.level}</span>
                  </div>
                  <p className="truncate text-xs text-forge-muted">{entry.user.inventory.length} skins · Best: {bestSkin?.name ?? 'None'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-black text-forge-amber">¢{formatCoins(entry.total)}</p>
                {!compact ? <p className="text-[10px] uppercase tracking-widest text-forge-muted">inventory value</p> : null}
              </div>
            </div>
          );
        })}
        {ranking.length === 0 ? <p className="border border-white/10 bg-black/30 p-5 text-center text-sm font-bold text-forge-muted">Nenhum usuário criado ainda. Faça login para entrar no ranking.</p> : null}
      </div>
    </div>
  );
}
