import Link from 'next/link';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { ServerStats } from '@/components/shared/ServerStats';
import { CaseGrid } from '@/components/cases/CaseGrid';
import { RecentWins } from '@/components/shared/RecentWins';
import { TopInventories } from '@/components/ranking/TopInventories';
import { MissionPanel } from '@/components/missions/MissionPanel';

const shortcuts = [
  { href: '/cases', title: 'Cases', text: 'Mercado separado com filtros, grátis, baratas e premium.' },
  { href: '/battles', title: 'Case Battle', text: 'Monte rodadas escolhendo caixas diferentes e jogue contra usuários locais reais.' },
  { href: '/contracts', title: 'Contracts', text: 'Combine skins do inventário e receba um item novo.' },
  { href: '/trades', title: 'Trades', text: 'Troque itens com outros usuários reais cadastrados no navegador.' }
];

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <HeroBanner />
      <ServerStats />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item) => (
          <Link href={item.href} key={item.href} className="forge-panel p-4 transition hover:-translate-y-1 hover:border-forge-amber/50">
            <div className="relative z-10">
              <p className="micro-label text-forge-amber">seção separada</p>
              <h2 className="mt-1 font-display text-2xl font-black uppercase text-forge-ice">{item.title}</h2>
              <p className="mt-2 text-sm font-semibold text-forge-muted">{item.text}</p>
            </div>
          </Link>
        ))}
      </section>

      <CaseGrid limit={4} title="Cases em destaque" />
      <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
        <RecentWins />
        <MissionPanel />
      </div>
      <TopInventories />
    </div>
  );
}
