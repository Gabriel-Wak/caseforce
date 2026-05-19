'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/store/GameContext';
import { getSkin, rarityStyles } from '@/data/skins';
import { calculateInventoryValue, formatCoins } from '@/lib/game';
import { Avatar } from '@/components/shared/Avatar';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';

export function TradePanel() {
  const { currentUser, users, sendTrade, trades, mode } = useGame();
  const targetUsers = users.filter((user) => user.id !== currentUser?.id);
  const [targetUserId, setTargetUserId] = useState('');
  const targetUser = targetUsers.find((user) => user.id === targetUserId) ?? targetUsers[0];
  const [offeredUid, setOfferedUid] = useState('');
  const [requestedUid, setRequestedUid] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!targetUserId && targetUsers[0]) setTargetUserId(targetUsers[0].id);
  }, [targetUserId, targetUsers]);

  const offered = currentUser?.inventory.find((item) => item.uid === offeredUid);
  const requested = targetUser?.inventory.find((item) => item.uid === requestedUid);
  const offeredSkin = offered ? getSkin(offered.skinId) : null;
  const requestedSkin = requested ? getSkin(requested.skinId) : null;
  const difference = offeredSkin && requestedSkin ? offeredSkin.value - requestedSkin.value : 0;

  const sortedMyItems = useMemo(() => currentUser?.inventory.slice().sort((a, b) => getSkin(b.skinId).value - getSkin(a.skinId).value) ?? [], [currentUser]);
  const sortedTargetItems = useMemo(() => targetUser?.inventory.slice().sort((a, b) => getSkin(b.skinId).value - getSkin(a.skinId).value) ?? [], [targetUser]);

  if (!currentUser) return <div className="forge-panel p-6 text-forge-muted">Login to trade skins.</div>;

  return (
    <div className="space-y-5">
      <div className="forge-panel p-5">
        <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_360px_1fr]">
          <div>
            <SectionHeader eyebrow="Your side" title="Suas skins" />
            <div className="mt-3 grid max-h-[680px] gap-3 overflow-auto pr-2">
              {sortedMyItems.map((item) => {
                const skin = getSkin(item.skinId);
                const style = rarityStyles[skin.rarity];
                return (
                  <button key={item.uid} onClick={() => setOfferedUid(item.uid)} className={`border p-3 text-left transition ${offeredUid === item.uid ? 'border-forge-orange bg-forge-orange/10' : `${style.border} bg-black/30`}`}>
                    <div className="grid grid-cols-[110px_1fr_auto] items-center gap-3">
                      <WeaponSilhouette skinId={skin.id} compact />
                      <div className="min-w-0">
                        <p className="micro-label">{skin.weapon}</p>
                        <p className={`truncate font-display text-lg font-black uppercase ${style.text}`}>{skin.name}</p>
                        <p className="text-xs text-forge-muted">{skin.rarity}</p>
                      </div>
                      <p className="font-display text-lg font-black text-forge-amber">¢{formatCoins(skin.value)}</p>
                    </div>
                  </button>
                );
              })}
              {sortedMyItems.length === 0 ? <p className="border border-white/10 bg-black/30 p-5 text-center text-forge-muted">Abra caixas para ter itens de troca.</p> : null}
            </div>
          </div>

          <div className="border border-white/10 bg-black/35 p-4">
            <p className="micro-label mb-2 text-forge-amber">Trade target</p>
            {targetUsers.length > 0 ? (
              <select value={targetUser?.id ?? ''} onChange={(event) => { setTargetUserId(event.target.value); setRequestedUid(''); }} className="w-full border border-white/15 bg-black/70 px-3 py-3 font-bold text-forge-ice outline-none">
                {targetUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            ) : (
              <div className="border border-white/10 bg-black/35 p-3 text-sm font-bold text-forge-muted">Nenhum outro usuário real local. Crie outro login no menu para trocar sem bots.</div>
            )}
            {targetUser ? (
              <div className="mt-4 flex items-center gap-3 border border-white/10 bg-black/35 p-3">
                <Avatar value={targetUser.avatar} size="md" />
                <div>
                  <p className="font-display text-lg font-black uppercase text-forge-ice">{targetUser.name}</p>
                  <p className="text-xs text-forge-muted">Level {targetUser.level} · {targetUser.inventory.length} skins · ¢{formatCoins(calculateInventoryValue(targetUser.inventory))}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-4 border border-white/10 bg-black/35 p-3">
              <p className="micro-label">Value comparison</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-forge-muted">You offer</p>
                  <p className="font-display text-xl font-black text-forge-ice">¢{formatCoins(offeredSkin?.value ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-forge-muted">You request</p>
                  <p className="font-display text-xl font-black text-forge-ice">¢{formatCoins(requestedSkin?.value ?? 0)}</p>
                </div>
              </div>
              <p className={`mt-2 text-sm font-bold ${difference >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{difference >= 0 ? 'Fair or overpay' : 'Underpay'} · Δ ¢{formatCoins(Math.abs(difference))}</p>
              <p className="mt-1 text-[11px] font-bold text-forge-muted">{mode === 'online' ? 'Modo online: envia proposta pendente para uma conta real. O dono da conta precisa entrar para responder em uma próxima versão.' : 'Regra local: aceita quando a oferta vale pelo menos 92% do pedido.'}</p>
            </div>

            <button
              className="forge-button mt-4 w-full"
              disabled={!offeredUid || !requestedUid || !targetUser}
              onClick={() => {
                if (!targetUser) return;
                const result = sendTrade(targetUser.id, offeredUid, requestedUid);
                if ('error' in result) setMessage(result.error);
                else {
                  setMessage(result.status === 'pending' ? 'Proposta enviada para uma conta real. Ela ficou pendente no banco.' : result.status === 'accepted' ? 'Troca aceita pelo sistema local. Itens trocados.' : 'Troca rejeitada. A oferta precisa ficar mais próxima do valor pedido.');
                  setOfferedUid('');
                  setRequestedUid('');
                }
              }}
            >
              Send proposal
            </button>
            {message ? <p className="mt-3 border border-forge-orange/30 bg-forge-orange/10 p-3 text-sm font-bold text-forge-amber">{message}</p> : null}
          </div>

          <div>
            <SectionHeader eyebrow="Their side" title="Inventário do usuário" />
            <div className="mt-3 grid max-h-[680px] gap-3 overflow-auto pr-2">
              {sortedTargetItems.map((item) => {
                const skin = getSkin(item.skinId);
                const style = rarityStyles[skin.rarity];
                return (
                  <button key={item.uid} onClick={() => setRequestedUid(item.uid)} className={`border p-3 text-left transition ${requestedUid === item.uid ? 'border-forge-purple bg-forge-purple/10' : `${style.border} bg-black/30`}`}>
                    <div className="grid grid-cols-[110px_1fr_auto] items-center gap-3">
                      <WeaponSilhouette skinId={skin.id} compact />
                      <div className="min-w-0">
                        <p className="micro-label">{skin.weapon}</p>
                        <p className={`truncate font-display text-lg font-black uppercase ${style.text}`}>{skin.name}</p>
                        <p className="text-xs text-forge-muted">{skin.rarity}</p>
                      </div>
                      <p className="font-display text-lg font-black text-forge-amber">¢{formatCoins(skin.value)}</p>
                    </div>
                  </button>
                );
              })}
              {targetUser && sortedTargetItems.length === 0 ? <p className="border border-white/10 bg-black/30 p-5 text-center text-forge-muted">Esse usuário ainda não tem skins.</p> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="forge-panel p-4">
        <SectionHeader eyebrow="History" title="Trade proposals" />
        <div className="relative z-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {trades.slice(0, 9).map((trade) => (
            <div key={trade.id} className="border border-white/10 bg-black/30 p-3">
              <p className="micro-label">{trade.status}</p>
              <p className="mt-1 font-display text-lg font-black uppercase text-forge-ice">Proposal #{trade.id.slice(-6)}</p>
              <p className="mt-1 text-xs text-forge-muted">{mode === 'online' ? 'Troca entre contas reais do servidor. Sem bots.' : 'Troca entre usuários locais reais. Sem bots.'}</p>
            </div>
          ))}
        </div>
        {trades.length === 0 ? <p className="relative z-10 text-sm text-forge-muted">No trade proposals yet.</p> : null}
      </div>
    </div>
  );
}
