'use client';

import Link from 'next/link';
import { cases } from '@/data/cases';
import { getSkin, rarityStyles } from '@/data/skins';
import { useGame } from '@/store/GameContext';
import { formatCoins, timeAgo } from '@/lib/game';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';
import { Avatar } from '@/components/shared/Avatar';

export function DropTicker() {
  const { recentWins, users } = useGame();
  const wins = recentWins.slice(0, 10);

  return (
    <div className="fixed inset-x-0 top-[68px] z-40 border-b border-white/10 bg-[#171821]/95 backdrop-blur-xl">
      <div className="flex h-[84px] overflow-hidden">
        <div className="hidden w-[116px] shrink-0 border-r border-white/10 bg-black/25 px-3 py-2 lg:block">
          <p className="font-display text-2xl font-black text-forge-amber">{Math.max(1, users.length)}</p>
          <p className="text-[10px] font-black uppercase text-forge-muted">real users</p>
          <p className="mt-1 text-[10px] font-bold text-forge-silver">local only</p>
        </div>
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto p-2">
          {wins.length > 0 ? wins.map((win) => {
            const skin = getSkin(win.skinId);
            const style = rarityStyles[skin.rarity];
            return (
              <div key={win.id} className={`grid min-w-[148px] grid-cols-[34px_1fr] items-center gap-2 border bg-black/30 px-2 ${style.border}`}>
                <Avatar value={win.avatar} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black text-forge-ice">{win.userName}</p>
                  <p className={`truncate font-display text-xs font-black uppercase ${style.text}`}>{skin.weapon}</p>
                  <p className="text-[10px] font-bold text-forge-amber">¢{formatCoins(win.value)} · {timeAgo(win.createdAt)}</p>
                </div>
              </div>
            );
          }) : cases.slice(0, 12).map((forgeCase) => (
            <Link key={forgeCase.id} href={`/cases/${forgeCase.id}`} className="grid min-w-[148px] place-items-center border border-white/10 bg-black/25 px-2 text-center transition hover:border-forge-amber/50" style={{ color: forgeCase.accent }}>
              <WeaponSilhouette skinId={forgeCase.items[0].skinId} compact className="scale-75" />
              <p className="w-full truncate font-display text-xs font-black uppercase text-forge-ice">{forgeCase.name}</p>
              <p className="text-[10px] font-black text-forge-amber">{forgeCase.price === 0 ? 'FREE' : `¢${formatCoins(forgeCase.price)}`}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
