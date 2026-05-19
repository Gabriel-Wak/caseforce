import { cases } from '@/data/cases';
import { CaseCard } from '@/components/cases/CaseCard';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function CaseGrid({ limit, title = 'Popular Cases' }: { limit?: number; title?: string }) {
  const visible = limit ? cases.slice(0, limit) : cases;
  return (
    <div className="forge-panel p-4">
      <SectionHeader eyebrow="Crates" title={title} />
      <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visible.map((forgeCase, index) => <CaseCard key={forgeCase.id} forgeCase={forgeCase} featured={index === 0 && !limit} />)}
      </div>
    </div>
  );
}
