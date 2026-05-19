'use client';

import { getSkin, rarityStyles } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { formatCoins, timeAgo } from '@/lib/game';
import { Avatar } from '@/components/shared/Avatar';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function RecentWins() {
  const { recentWins } = useGame();
  return (
    <div className="forge-panel p-4">
      <SectionHeader eyebrow="Activity" title="Recent Wins" />
      <div className="relative z-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {recentWins.slice(0, 9).map((win) => {
          const skin = getSkin(win.skinId);
          const style = rarityStyles[skin.rarity];
          return (
            <div key={win.id} className={`border bg-black/35 p-3 ${style.border}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar value={win.avatar} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-forge-ice">{win.userName}</p>
                    <p className="text-[10px] text-forge-muted">{timeAgo(win.createdAt)}</p>
                  </div>
                </div>
                <span className="font-display text-base font-black text-forge-amber">¢{formatCoins(skin.value)}</span>
              </div>
              <WeaponSilhouette skinId={skin.id} className="mt-2" />
              <div className="mt-2 flex items-center justify-between gap-3">
                <h3 className={`truncate font-display text-base font-black uppercase tracking-wide ${style.text}`}>{skin.name}</h3>
                <span className="micro-label">{skin.rarity}</span>
              </div>
            </div>
          );
        })}
      </div>
      {recentWins.length === 0 ? <p className="relative z-10 p-6 text-center text-forge-muted">Nenhuma vitória recente ainda. O feed só mostra usuários reais locais, sem bots.</p> : null}
    </div>
  );
}
