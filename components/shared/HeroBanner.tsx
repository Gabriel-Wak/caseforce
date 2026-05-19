'use client';

import Link from 'next/link';
import { cases } from '@/data/cases';
import { CaseCrate } from '@/components/shared/CaseCrate';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';

export function HeroBanner() {
  return (
    <section className="relative min-h-[390px] overflow-hidden border border-white/10 bg-[#15161d] shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(255,196,77,.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,.28),transparent_30%),linear-gradient(135deg,#252026_0%,#12131a_45%,#0a0b0f_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute left-6 top-10 hidden rotate-[-7deg] opacity-90 lg:block"><WeaponSilhouette skinId="s-016" className="scale-125" /></div>
      <div className="absolute right-12 top-16 hidden rotate-[8deg] opacity-90 lg:block"><WeaponSilhouette skinId="s-018" className="scale-125" /></div>
      <div className="relative z-10 mx-auto grid min-h-[390px] max-w-5xl place-items-center px-5 py-10 text-center">
        <div>
          <p className="micro-label mb-4 text-forge-amber">CASE FORGE EVENT</p>
          <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-forge-ice md:text-8xl">
            FORGE<br /><span className="text-forge-amber drop-shadow-[0_0_24px_rgba(255,196,77,.35)]">LUCK</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-forge-silver">Um jogo fictício de abrir caixas com XP difícil, inventário local, contratos, trades e batalhas entre usuários reais criados no navegador.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/cases" className="forge-button min-w-56">Entrar nas cases</Link>
            <Link href="/battles" className="ghost-button min-w-48">Case Battle</Link>
          </div>
          <div className="mt-6 inline-flex border border-white/10 bg-black/35 px-5 py-3 font-display text-xl font-black text-forge-ice">
            SEM DEPÓSITO · SEM SAQUE · ECONOMIA FICTÍCIA
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 left-10 hidden md:block"><CaseCrate forgeCase={cases[7]} size="lg" /></div>
      <div className="absolute bottom-4 right-12 hidden md:block"><CaseCrate forgeCase={cases[12]} size="lg" /></div>
    </section>
  );
}
