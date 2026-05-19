'use client';

import { useMemo, useState } from 'react';
import { caseCategories, cases } from '@/data/cases';
import { CaseCard } from '@/components/cases/CaseCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useGame } from '@/store/GameContext';
import type { CaseCategory } from '@/lib/types';

type SortMode = 'popular' | 'cheap' | 'expensive' | 'free';

export function CaseMarket() {
  const { currentUser } = useGame();
  const [category, setCategory] = useState<CaseCategory | 'All'>('All');
  const [sort, setSort] = useState<SortMode>('popular');
  const [search, setSearch] = useState('');
  const [unlockedOnly, setUnlockedOnly] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cases
      .filter((forgeCase) => category === 'All' || forgeCase.category === category)
      .filter((forgeCase) => !query || `${forgeCase.name} ${forgeCase.tagline} ${forgeCase.category}`.toLowerCase().includes(query))
      .filter((forgeCase) => !unlockedOnly || !currentUser || currentUser.level >= forgeCase.levelRequired)
      .filter((forgeCase) => sort !== 'free' || forgeCase.price === 0)
      .sort((a, b) => {
        if (sort === 'cheap' || sort === 'free') return a.price - b.price;
        if (sort === 'expensive') return b.price - a.price;
        return a.levelRequired - b.levelRequired || a.price - b.price;
      });
  }, [category, sort, search, unlockedOnly, currentUser]);

  return (
    <div className="space-y-5">
      <div className="forge-panel p-4">
        <div className="relative z-10 grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
          <SectionHeader eyebrow="Case market" title="Cases separados por categoria" />
          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar caixa"
              className="h-10 min-w-[220px] border border-white/15 bg-black/55 px-3 text-sm font-bold text-forge-ice outline-none focus:border-forge-amber/60"
            />
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="h-10 border border-white/15 bg-black/70 px-3 text-sm font-bold text-forge-ice outline-none">
              <option value="popular">Popular / level</option>
              <option value="cheap">Mais baratas</option>
              <option value="expensive">Mais caras</option>
              <option value="free">Grátis</option>
            </select>
            <button onClick={() => setUnlockedOnly((value) => !value)} className={unlockedOnly ? 'forge-button min-h-10 px-3 text-xs' : 'ghost-button min-h-10 text-xs'}>
              Disponíveis
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-4 flex gap-2 overflow-x-auto pb-1">
          {(['All', ...caseCategories] as const).map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={category === item ? 'forge-button min-h-10 shrink-0 px-4 text-xs' : 'ghost-button min-h-10 shrink-0 text-xs'}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((forgeCase) => <CaseCard key={forgeCase.id} forgeCase={forgeCase} />)}
      </div>
      {filtered.length === 0 ? <div className="forge-panel p-8 text-center font-bold text-forge-muted">Nenhuma caixa encontrada com esses filtros.</div> : null}
    </div>
  );
}
