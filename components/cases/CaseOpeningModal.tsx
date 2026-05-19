'use client';

import { useEffect, useState } from 'react';
import type { ForgeCase } from '@/lib/types';
import { getSkin, rarityStyles } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { formatCoins } from '@/lib/game';
import { CaseCrate } from '@/components/shared/CaseCrate';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';
import { RouletteSpinner } from '@/components/cases/RouletteSpinner';

export function CaseOpeningModal({ forgeCase, open, onClose }: { forgeCase: ForgeCase; open: boolean; onClose: () => void }) {
  const { openCaseById } = useGame();
  const [state, setState] = useState<'idle' | 'spinning' | 'finished'>('idle');
  const [resultSkinId, setResultSkinId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [levelNotice, setLevelNotice] = useState(false);

  useEffect(() => {
    if (!open) {
      setState('idle');
      setResultSkinId(null);
      setMessage('');
      setLevelNotice(false);
    }
  }, [open]);

  if (!open) return null;

  const resultSkin = resultSkinId ? getSkin(resultSkinId) : null;
  const style = resultSkin ? rarityStyles[resultSkin.rarity] : null;

  const handleOpen = () => {
    const result = openCaseById(forgeCase.id);
    if ('error' in result) {
      setMessage(result.error);
      return;
    }
    setResultSkinId(result.skinId);
    setState('spinning');
    setLevelNotice(result.leveledUp);
    setMessage(result.leveledUp ? `LEVEL UP! You reached level ${result.newLevel}. ${result.rewardsText ?? ''}` : 'Drop secured. Item added to inventory.');
    window.setTimeout(() => setState('finished'), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="forge-panel w-full max-w-5xl p-5">
        <div className="relative z-10">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="micro-label text-forge-amber">Case opening</p>
              <h2 className="font-display text-4xl font-black uppercase tracking-wide text-forge-ice">{forgeCase.name}</h2>
              <p className="mt-1 text-sm text-forge-muted">Cost: {forgeCase.price === 0 ? 'Free' : `¢${formatCoins(forgeCase.price)}`} · Reward: +{forgeCase.xpReward} XP</p>
            </div>
            <button className="ghost-button" onClick={onClose}>Close</button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="border border-white/10 bg-black/35 p-4">
              <CaseCrate forgeCase={forgeCase} size="lg" />
              <button disabled={state === 'spinning'} onClick={handleOpen} className="forge-button mt-5 w-full">
                {state === 'spinning' ? 'Rolling...' : 'Open crate'}
              </button>
              {message ? <p className={`mt-3 border p-3 text-sm font-bold ${state === 'finished' && levelNotice ? 'level-pop border-forge-amber/50 bg-forge-amber/10 text-forge-amber' : 'border-white/10 bg-black/35 text-forge-silver'}`}>{message}</p> : null}
            </div>
            <div>
              <RouletteSpinner forgeCase={forgeCase} resultSkinId={resultSkinId ?? undefined} spinning={state === 'spinning'} />
              {state === 'finished' && resultSkin && style ? (
                <div className={`level-pop mt-5 border bg-gradient-to-br ${style.bg} ${style.border} p-5`}>
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="micro-label">You won</p>
                      <h3 className={`font-display text-4xl font-black uppercase tracking-wide ${style.text}`}>{resultSkin.name}</h3>
                      <p className="mt-1 text-forge-muted">{resultSkin.weapon} · {resultSkin.rarity}</p>
                    </div>
                    <p className="font-display text-4xl font-black text-forge-amber">¢{formatCoins(resultSkin.value)}</p>
                  </div>
                  <WeaponSilhouette skinId={resultSkin.id} className="mt-3 scale-110" />
                </div>
              ) : (
                <div className="mt-5 border border-white/10 bg-black/30 p-5 text-sm text-forge-muted">
                  Press open to start the horizontal roulette. The final drop is added to your local inventory and live feed.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
