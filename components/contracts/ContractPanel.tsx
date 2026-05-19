'use client';

import { useMemo, useState } from 'react';
import { useGame } from '@/store/GameContext';
import { getSkin, rarityStyles } from '@/data/skins';
import { calculateInventoryValue, formatCoins } from '@/lib/game';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';

export function ContractPanel() {
  const { currentUser, runContract } = useGame();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [rewardSkinId, setRewardSkinId] = useState<string | null>(null);

  const sortedItems = useMemo(() => currentUser?.inventory.slice().sort((a, b) => getSkin(b.skinId).value - getSkin(a.skinId).value) ?? [], [currentUser]);
  const selectedItems = sortedItems.filter((item) => selected.includes(item.uid));
  const selectedValue = calculateInventoryValue(selectedItems);
  const potentialMin = Math.floor(selectedValue * 0.65);
  const potentialMax = Math.floor(selectedValue * 1.85);

  if (!currentUser) return <div className="forge-panel p-6 text-forge-muted">Faça login para usar contratos.</div>;

  const toggle = (uid: string) => {
    setRewardSkinId(null);
    setMessage('');
    setSelected((prev) => prev.includes(uid) ? prev.filter((item) => item !== uid) : prev.length >= 10 ? prev : [...prev, uid]);
  };

  const rewardSkin = rewardSkinId ? getSkin(rewardSkinId) : null;

  return (
    <div className="space-y-5">
      <div className="forge-panel p-5">
        <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_430px]">
          <div>
            <SectionHeader eyebrow="Contracts" title="Combine 3 a 10 skins" />
            <p className="mt-2 max-w-3xl text-sm font-semibold text-forge-muted">Escolha itens do seu inventário, queime todos no contrato e receba uma skin fictícia nova baseada no valor total. Sistema 100% local e sem dinheiro real.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Selecionadas</p>
                <p className="font-display text-3xl font-black text-forge-ice">{selected.length}/10</p>
              </div>
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Valor queimado</p>
                <p className="font-display text-3xl font-black text-forge-amber">¢{formatCoins(selectedValue)}</p>
              </div>
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Faixa possível</p>
                <p className="font-display text-xl font-black text-forge-silver">¢{formatCoins(potentialMin)} - ¢{formatCoins(potentialMax)}</p>
              </div>
            </div>
          </div>

          <div className="border border-forge-amber/25 bg-black/35 p-4">
            <p className="micro-label text-forge-amber">Contract machine</p>
            <div className="mt-3 grid min-h-[210px] place-items-center border border-white/10 bg-[radial-gradient(circle,rgba(255,196,77,.16),transparent_55%)]">
              {rewardSkin ? (
                <div className="level-pop text-center">
                  <WeaponSilhouette skinId={rewardSkin.id} />
                  <p className="font-display text-2xl font-black uppercase text-forge-ice">{rewardSkin.name}</p>
                  <p className="font-display text-xl font-black text-forge-amber">¢{formatCoins(rewardSkin.value)}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-display text-5xl font-black text-forge-muted">///</p>
                  <p className="mt-2 text-sm font-bold text-forge-muted">O resultado aparece aqui</p>
                </div>
              )}
            </div>
            <button
              className="forge-button mt-4 w-full"
              disabled={selected.length < 3}
              onClick={() => {
                const result = runContract(selected);
                if ('error' in result) {
                  setMessage(result.error);
                  return;
                }
                setRewardSkinId(result.skinId);
                setMessage(`Contrato concluído: ${result.spentCount} skins queimadas por ¢${formatCoins(result.totalValue)}.`);
                setSelected([]);
              }}
            >
              Criar contrato
            </button>
            {message ? <p className="mt-3 border border-forge-amber/30 bg-forge-amber/10 p-3 text-sm font-bold text-forge-amber">{message}</p> : null}
          </div>
        </div>
      </div>

      <div className="forge-panel p-4">
        <SectionHeader eyebrow="Inventory input" title="Itens disponíveis" />
        <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {sortedItems.map((item) => {
            const skin = getSkin(item.skinId);
            const style = rarityStyles[skin.rarity];
            const active = selected.includes(item.uid);
            return (
              <button key={item.uid} onClick={() => toggle(item.uid)} className={`border p-3 text-left transition ${active ? 'border-forge-amber bg-forge-amber/10' : `${style.border} bg-black/30 hover:bg-white/[0.04]`}`}>
                <WeaponSilhouette skinId={skin.id} compact />
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="micro-label">{skin.weapon}</p>
                    <p className={`truncate font-display text-base font-black uppercase ${style.text}`}>{skin.name}</p>
                  </div>
                  <p className="font-display text-lg font-black text-forge-amber">¢{formatCoins(skin.value)}</p>
                </div>
              </button>
            );
          })}
        </div>
        {sortedItems.length < 3 ? <p className="relative z-10 p-6 text-center text-forge-muted">Você precisa de pelo menos 3 skins no inventário para criar um contrato.</p> : null}
      </div>
    </div>
  );
}
