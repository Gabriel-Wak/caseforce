'use client';

import { useMemo } from 'react';
import type { ForgeCase } from '@/lib/types';
import { getSkin, rarityStyles } from '@/data/skins';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';

export function RouletteSpinner({ forgeCase, resultSkinId, spinning }: { forgeCase: ForgeCase; resultSkinId?: string; spinning: boolean }) {
  const strip = useMemo(() => {
    const ids = forgeCase.items.map((item) => item.skinId);
    const randoms = Array.from({ length: 28 }, (_, index) => ids[index % ids.length]);
    if (resultSkinId) randoms.splice(21, 0, resultSkinId);
    return randoms;
  }, [forgeCase, resultSkinId]);

  return (
    <div className="relative overflow-hidden border border-white/10 bg-black/55 p-3">
      <div className="absolute left-1/2 top-0 z-20 h-full w-[2px] -translate-x-1/2 bg-forge-amber shadow-[0_0_22px_rgba(255,196,77,0.9)]" />
      <div className={spinning ? 'roulette-strip flex gap-3' : 'flex gap-3'}>
        {strip.map((skinId, index) => {
          const skin = getSkin(skinId);
          const style = rarityStyles[skin.rarity];
          return (
            <div key={`${skinId}-${index}`} className={`min-w-[160px] border bg-gradient-to-br ${style.bg} ${style.border} p-3 text-center`}>
              <WeaponSilhouette skinId={skin.id} compact />
              <p className={`mt-2 truncate font-display text-sm font-black uppercase ${style.text}`}>{skin.weapon}</p>
              <p className="truncate text-[10px] font-bold text-forge-muted">{skin.rarity}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
