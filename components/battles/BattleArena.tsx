'use client';

import { useMemo, useState } from 'react';
import { cases } from '@/data/cases';
import { getSkin, rarityStyles } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { battleEntryCost, formatCoins } from '@/lib/game';
import { Avatar } from '@/components/shared/Avatar';
import { CaseCrate } from '@/components/shared/CaseCrate';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type { BattleResult } from '@/lib/types';

export function BattleArena({ compact = false }: { compact?: boolean }) {
  const { currentUser, users, runBattle, battles } = useGame();
  const realOpponents = users.filter((user) => user.id !== currentUser?.id);
  const [caseIds, setCaseIds] = useState<string[]>(['free-forge']);
  const [opponentIds, setOpponentIds] = useState<string[]>([]);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [message, setMessage] = useState('');

  const selectedCases = useMemo(() => caseIds.map((caseId) => cases.find((item) => item.id === caseId)).filter(Boolean) as typeof cases, [caseIds]);
  const cost = battleEntryCost(caseIds);

  if (compact) {
    return (
      <div className="forge-panel p-4">
        <SectionHeader eyebrow="Arena" title="Case Battles" />
        <p className="relative z-10 text-sm text-forge-muted">Agora as batalhas ficam em uma página própria, com seleção de várias caixas e jogadores reais locais.</p>
      </div>
    );
  }

  if (!currentUser) return <div className="forge-panel p-6 text-forge-muted">Faça login para criar batalhas.</div>;

  const addCase = (caseId: string) => {
    setCaseIds((prev) => prev.length >= 10 ? prev : [...prev, caseId]);
  };

  const toggleOpponent = (userId: string) => {
    setOpponentIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : prev.length >= 3 ? prev : [...prev, userId]);
  };

  return (
    <div className="space-y-5">
      <div className="forge-panel p-5">
        <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_420px]">
          <div>
            <SectionHeader eyebrow="Case Battle" title="Monte sua batalha por rodadas" />
            <p className="mt-2 max-w-3xl text-sm font-semibold text-forge-muted">Escolha uma sequência de caixas. Cada caixa vira uma rodada. Todos os usuários locais abrem a mesma caixa por rodada e o maior valor total vence todos os drops.</p>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Rodadas</p>
                <p className="font-display text-3xl font-black text-forge-ice">{caseIds.length}</p>
              </div>
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Jogadores</p>
                <p className="font-display text-3xl font-black text-forge-ice">{opponentIds.length + 1}/4</p>
              </div>
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Custo</p>
                <p className="font-display text-3xl font-black text-forge-amber">¢{formatCoins(cost)}</p>
              </div>
              <div className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">Modo</p>
                <p className="font-display text-xl font-black text-forge-silver">winner takes all</p>
              </div>
            </div>
          </div>

          <div className="border border-forge-amber/25 bg-black/35 p-4">
            <p className="micro-label text-forge-amber">Players reais locais</p>
            <div className="mt-3 grid gap-2">
              <div className="flex items-center gap-3 border border-forge-amber/30 bg-forge-amber/10 p-2">
                <Avatar value={currentUser.avatar} size="sm" />
                <div>
                  <p className="font-display text-sm font-black uppercase text-forge-ice">{currentUser.name}</p>
                  <p className="text-[10px] font-bold uppercase text-forge-muted">Você · LVL {currentUser.level}</p>
                </div>
              </div>
              {realOpponents.map((user) => (
                <button key={user.id} onClick={() => toggleOpponent(user.id)} className={`flex items-center gap-3 border p-2 text-left ${opponentIds.includes(user.id) ? 'border-forge-purple bg-forge-purple/10' : 'border-white/10 bg-white/[0.03]'}`}>
                  <Avatar value={user.avatar} size="sm" />
                  <div>
                    <p className="font-display text-sm font-black uppercase text-forge-ice">{user.name}</p>
                    <p className="text-[10px] font-bold uppercase text-forge-muted">LVL {user.level} · {user.inventory.length} skins</p>
                  </div>
                </button>
              ))}
            </div>
            {realOpponents.length === 0 ? <p className="mt-3 border border-white/10 bg-black/35 p-3 text-xs font-bold text-forge-muted">Crie outro usuário pelo menu de login para batalhar sem bots.</p> : null}
            <button
              className="forge-button mt-4 w-full"
              disabled={opponentIds.length === 0 || caseIds.length === 0}
              onClick={() => {
                const battle = runBattle(caseIds, opponentIds);
                if ('error' in battle) {
                  setMessage(battle.error);
                  return;
                }
                setResult(battle);
                setMessage(`Batalha finalizada. Vencedor: ${battle.winnerName}.`);
              }}
            >
              Start battle
            </button>
            {message ? <p className="mt-3 border border-forge-amber/30 bg-forge-amber/10 p-3 text-sm font-bold text-forge-amber">{message}</p> : null}
          </div>
        </div>
      </div>

      <div className="forge-panel p-4">
        <SectionHeader eyebrow="Rounds" title="Escolha as caixas da batalha" />
        <div className="relative z-10 mb-5 flex gap-2 overflow-x-auto pb-2">
          {selectedCases.map((forgeCase, index) => (
            <div key={`${forgeCase.id}-${index}`} className="min-w-[170px] border border-white/10 bg-black/35 p-2 text-center">
              <p className="micro-label">Round {index + 1}</p>
              <CaseCrate forgeCase={forgeCase} size="sm" />
              <p className="truncate font-display text-xs font-black uppercase text-forge-ice">{forgeCase.name}</p>
              <button onClick={() => setCaseIds((prev) => prev.filter((_, idx) => idx !== index))} className="mt-2 w-full border border-red-400/30 bg-red-500/10 py-1 text-[10px] font-black uppercase text-red-200">Remover</button>
            </div>
          ))}
        </div>
        <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {cases.map((forgeCase) => (
            <button key={forgeCase.id} onClick={() => addCase(forgeCase.id)} className="border border-white/10 bg-[#1b1c25] p-3 text-left transition hover:border-forge-amber/50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="micro-label">{forgeCase.category}</p>
                  <p className="truncate font-display text-base font-black uppercase text-forge-ice">{forgeCase.name}</p>
                </div>
                <p className="font-display text-sm font-black text-forge-amber">{forgeCase.price === 0 ? 'FREE' : `¢${formatCoins(forgeCase.price)}`}</p>
              </div>
              <CaseCrate forgeCase={forgeCase} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {result ? (
        <div className="forge-panel p-4">
          <SectionHeader eyebrow="Battle result" title={`Vencedor: ${result.winnerName}`} />
          <div className="relative z-10 mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {result.players.map((player) => (
              <div key={player.id} className={`border p-3 ${player.id === result.winnerId ? 'border-forge-amber bg-forge-amber/10' : 'border-white/10 bg-black/30'}`}>
                <div className="flex items-center gap-3">
                  <Avatar value={player.avatar} size="sm" />
                  <div>
                    <p className="font-display text-lg font-black uppercase text-forge-ice">{player.name}</p>
                    <p className="micro-label">Total ¢{formatCoins(result.totals[player.id] ?? 0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative z-10 space-y-4">
            {result.rounds.map((round, index) => (
              <div key={index} className="border border-white/10 bg-black/25 p-3">
                <p className="micro-label mb-3 text-forge-amber">Round {index + 1}</p>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {round.map((drop) => {
                    const skin = getSkin(drop.skinId);
                    const style = rarityStyles[skin.rarity];
                    return (
                      <div key={`${drop.playerId}-${index}`} className={`border bg-black/35 p-3 ${style.border}`}>
                        <div className="flex items-center gap-2">
                          <Avatar value={drop.avatar} size="sm" />
                          <p className="font-display text-sm font-black uppercase text-forge-ice">{drop.playerName}</p>
                        </div>
                        <WeaponSilhouette skinId={skin.id} compact />
                        <p className={`truncate font-display text-base font-black uppercase ${style.text}`}>{skin.name}</p>
                        <p className="font-display text-lg font-black text-forge-amber">¢{formatCoins(drop.value)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : battles.length > 0 ? (
        <div className="forge-panel p-4">
          <SectionHeader eyebrow="History" title="Últimas batalhas" />
          <div className="relative z-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {battles.slice(0, 6).map((battle) => (
              <div key={battle.id} className="border border-white/10 bg-black/30 p-3">
                <p className="micro-label">{battle.caseIds.length} rounds</p>
                <p className="font-display text-lg font-black uppercase text-forge-ice">Winner: {battle.winnerName}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
