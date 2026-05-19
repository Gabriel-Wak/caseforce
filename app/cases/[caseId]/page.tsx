'use client';

import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { cases } from '@/data/cases';
import { getSkin, rarityStyles } from '@/data/skins';
import { CaseCrate } from '@/components/shared/CaseCrate';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';
import { CaseOpeningModal } from '@/components/cases/CaseOpeningModal';
import { formatCoins } from '@/lib/game';
import { useGame } from '@/store/GameContext';

export default function CaseDetailPage() {
  const params = useParams<{ caseId: string }>();
  const forgeCase = cases.find((item) => item.id === params.caseId);
  const [open, setOpen] = useState(false);
  const { currentUser } = useGame();

  if (!forgeCase) return notFound();
  const locked = !!currentUser && currentUser.level < forgeCase.levelRequired;

  return (
    <div className="space-y-4">
      <div className="forge-panel p-5">
        <div className="relative z-10 grid gap-6 xl:grid-cols-[360px_1fr] xl:items-center">
          <div className="border border-white/10 bg-black/30 p-5">
            <CaseCrate forgeCase={forgeCase} size="lg" />
          </div>
          <div>
            <Link href="/cases" className="micro-label text-forge-amber">← Back to cases</Link>
            <h1 className="mt-2 font-display text-6xl font-black uppercase tracking-wide text-forge-ice">{forgeCase.name}</h1>
            <p className="mt-3 max-w-3xl text-forge-silver">{forgeCase.tagline}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="border border-white/10 bg-black/35 p-3"><p className="micro-label">Price</p><p className="font-display text-2xl font-black text-forge-amber">{forgeCase.price === 0 ? 'FREE' : `¢${formatCoins(forgeCase.price)}`}</p></div>
              <div className="border border-white/10 bg-black/35 p-3"><p className="micro-label">XP</p><p className="font-display text-2xl font-black text-forge-ice">+{forgeCase.xpReward}</p></div>
              <div className="border border-white/10 bg-black/35 p-3"><p className="micro-label">Coins</p><p className="font-display text-2xl font-black text-forge-ice">+{forgeCase.coinReward}</p></div>
              <div className="border border-white/10 bg-black/35 p-3"><p className="micro-label">Unlock</p><p className="font-display text-2xl font-black text-forge-ice">LVL {forgeCase.levelRequired}</p></div>
            </div>
            <button disabled={locked} onClick={() => setOpen(true)} className="forge-button mt-6 min-w-52">{locked ? 'Locked' : 'Open Case'}</button>
          </div>
        </div>
      </div>

      <div className="forge-panel p-4">
        <div className="relative z-10 mb-4">
          <p className="micro-label text-forge-amber">Drop table</p>
          <h2 className="section-title">Possible Drops</h2>
        </div>
        <div className="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {forgeCase.items.map((drop) => {
            const skin = getSkin(drop.skinId);
            const style = rarityStyles[skin.rarity];
            return (
              <div key={drop.skinId} className={`border bg-gradient-to-br ${style.bg} ${style.border} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="micro-label">{skin.weapon}</p>
                    <h3 className={`font-display text-xl font-black uppercase tracking-wide ${style.text}`}>{skin.name}</h3>
                  </div>
                  <span className="font-display text-lg font-black text-forge-amber">{drop.chance}%</span>
                </div>
                <WeaponSilhouette skinId={skin.id} className="mt-2" />
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-forge-muted">{skin.rarity}</span>
                  <span className="font-display font-black text-forge-ice">¢{formatCoins(skin.value)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CaseOpeningModal forgeCase={forgeCase} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
