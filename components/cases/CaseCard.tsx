'use client';

import Link from 'next/link';
import type { ForgeCase } from '@/lib/types';
import { CaseCrate } from '@/components/shared/CaseCrate';
import { formatCoins } from '@/lib/game';
import { useGame } from '@/store/GameContext';
import { cn } from '@/lib/cn';

export function CaseCard({ forgeCase, featured = false }: { forgeCase: ForgeCase; featured?: boolean }) {
  const { currentUser } = useGame();
  const locked = !!currentUser && currentUser.level < forgeCase.levelRequired;

  return (
    <Link href={`/cases/${forgeCase.id}`} className={cn('group block', locked && 'opacity-60')}>
      <div className={cn('case-tile h-full overflow-hidden border border-white/10 bg-[#1c1d28] transition duration-200 group-hover:-translate-y-1 group-hover:border-forge-amber/60', featured && 'min-h-[320px]')}>
        <div className="relative min-h-[190px] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.16),transparent_40%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,0,0,.1))] p-4" style={{ color: forgeCase.accent }}>
          <div className="absolute right-3 top-3 bg-[#12131a] px-3 py-2 font-display text-sm font-black text-forge-ice shadow-xl">
            {forgeCase.price === 0 ? 'GRÁTIS' : `¢${formatCoins(forgeCase.price)}`}
          </div>
          <CaseCrate forgeCase={forgeCase} size={featured ? 'lg' : 'md'} className="pt-5" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-[#0f1016] px-3 py-2 text-[11px] font-black uppercase text-forge-ice">{forgeCase.name}</span>
            <span className="border border-white/10 bg-black/35 px-2 py-1 text-[10px] font-black uppercase text-forge-muted">LVL {forgeCase.levelRequired}</span>
          </div>
        </div>
        <div className="p-3">
          <p className="micro-label text-forge-amber">{forgeCase.category}</p>
          <p className="mt-1 line-clamp-2 min-h-10 text-xs font-semibold text-forge-muted">{forgeCase.tagline}</p>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[10px] font-black uppercase text-forge-silver">+{forgeCase.xpReward} XP · +{forgeCase.coinReward}¢</span>
            <span className={locked ? 'ghost-button min-h-8 text-xs' : 'forge-button min-h-8 px-3 text-xs'}>{locked ? 'Locked' : 'Open'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
