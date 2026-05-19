import Link from 'next/link';

export function FeatureStub({ title, eyebrow, description }: { title: string; eyebrow: string; description: string }) {
  return (
    <div className="forge-panel p-6">
      <div className="relative z-10 max-w-4xl">
        <p className="micro-label text-forge-amber">{eyebrow}</p>
        <h1 className="mt-2 font-display text-6xl font-black uppercase tracking-wide text-forge-ice">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-forge-silver">{description}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="border border-white/10 bg-black/35 p-4"><p className="micro-label">Status</p><p className="font-display text-2xl font-black text-forge-amber">Prototype-ready</p></div>
          <div className="border border-white/10 bg-black/35 p-4"><p className="micro-label">Economy</p><p className="font-display text-2xl font-black text-forge-ice">Fictional only</p></div>
          <div className="border border-white/10 bg-black/35 p-4"><p className="micro-label">Next action</p><Link href="/cases" className="mt-1 inline-flex font-display text-2xl font-black text-forge-ice hover:text-forge-amber">Open cases →</Link></div>
        </div>
      </div>
    </div>
  );
}
