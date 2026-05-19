'use client';

import { getSkin, rarityStyles } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { formatCoins, timeAgo } from '@/lib/game';
import { Avatar } from '@/components/shared/Avatar';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function LiveDropFeed({ compact = false }: { compact?: boolean }) {
  const { recentWins } = useGame();
  const wins = recentWins.slice(0, compact ? 6 : 14);

  return (
    <div className="forge-panel p-4">
      <SectionHeader eyebrow="Real local feed" title="Live Drops" />
      <div className="relative z-10 space-y-2">
        {wins.map((win) => {
          const skin = getSkin(win.skinId);
          const style = rarityStyles[skin.rarity];
          return (
            <div key={win.id} className={`grid grid-cols-[36px_1fr_auto] items-center gap-3 border bg-black/35 p-2 ${style.border}`}>
              <Avatar value={win.avatar} size="sm" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-bold text-forge-ice">{win.userName}</p>
                  <span className="text-[10px] text-forge-muted">{timeAgo(win.createdAt)}</span>
                </div>
                <p className={`truncate font-display text-sm font-black uppercase ${style.text}`}>{skin.name}</p>
              </div>
              {!compact ? <WeaponSilhouette skinId={skin.id} compact className="scale-75" /> : null}
              <p className="font-display text-sm font-black text-forge-amber">¢{formatCoins(win.value)}</p>
            </div>
          );
        })}
        {wins.length === 0 ? <p className="border border-white/10 bg-black/30 p-5 text-center text-sm font-bold text-forge-muted">Sem drops falsos. Abra uma caixa com um usuário real local para alimentar o feed.</p> : null}
      </div>
    </div>
  );
}
