'use client';

import { getSkin, rarityIndex, rarityStyles } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { formatCoins, timeAgo } from '@/lib/game';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';

export function RareDropsPanel() {
  const { recentWins } = useGame();
  const rareWins = recentWins.filter((win) => rarityIndex(win.rarity) >= 4).slice(0, 4);

  return (
    <div className="forge-panel p-4">
      <SectionHeader eyebrow="High tier" title="Rare Drops" />
      <div className="relative z-10 space-y-3">
        {rareWins.map((win) => {
          const skin = getSkin(win.skinId);
          const style = rarityStyles[skin.rarity];
          return (
            <div key={win.id} className={`border bg-gradient-to-br ${style.bg} ${style.border} ${style.glow} p-3`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="micro-label">{skin.rarity} · {timeAgo(win.createdAt)}</p>
                  <h3 className="font-display text-lg font-black uppercase tracking-wide text-forge-ice">{skin.name}</h3>
                </div>
                <p className="font-display text-lg font-black text-forge-amber">¢{formatCoins(skin.value)}</p>
              </div>
              <WeaponSilhouette skinId={skin.id} className="mt-1" />
            </div>
          );
        })}
        {rareWins.length === 0 ? <p className="border border-white/10 bg-black/30 p-5 text-center text-sm font-bold text-forge-muted">Rare drops vão aparecer aqui quando usuários reais locais ganharem itens altos.</p> : null}
      </div>
    </div>
  );
}
