'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useGame } from '@/store/GameContext';
import { calculateInventoryValue, formatCoins } from '@/lib/game';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/shared/Avatar';
import { LevelProgressBar } from '@/components/shared/LevelProgressBar';

const nav = [
  { label: 'Cases', href: '/cases' },
  { label: 'Upgrade', href: '/upgrade' },
  { label: 'Contracts', href: '/contracts' },
  { label: 'Battles', href: '/battles' },
  { label: 'Ranking', href: '/ranking' },
  { label: 'Events', href: '/events' }
];

export function Header({ onLogin }: { onLogin: () => void }) {
  const pathname = usePathname();
  const { currentUser, logout, mode } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#111219]/95 shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-xl">
      <div className="flex h-[68px] items-center gap-3 px-3 lg:px-5">
        <Link href="/" className="flex min-w-[172px] items-center gap-2">
          <div className="grid h-9 w-9 place-items-center bg-[#f5b544] text-[#14100a] [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]">
            <span className="font-display text-base font-black">CF</span>
          </div>
          <div className="leading-none">
            <p className="font-display text-2xl font-black tracking-tight text-forge-ice">case<span className="text-forge-amber">forge</span></p>
            <p className="text-[9px] font-black uppercase tracking-[.14em] text-forge-muted">fictional drops</p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-stretch gap-1 xl:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'grid place-items-center border-b-2 px-4 text-xs font-black uppercase tracking-wide text-forge-silver transition hover:text-forge-ice',
                  active ? 'border-forge-amber bg-white/[0.035] text-forge-amber' : 'border-transparent'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-right md:block">
            <p className="text-[10px] font-black uppercase text-emerald-300">{mode === 'online' ? 'online real' : 'local mode'}</p>
            <p className="font-display text-sm font-black text-forge-ice">{mode === 'online' ? 'server players' : 'prototype'}</p>
          </div>

          <div className="border border-violet-500/30 bg-violet-950/50 px-3 py-2 text-right">
            <p className="text-[10px] font-black uppercase text-violet-200">valor das skins</p>
            <p className="font-display text-sm font-black text-forge-ice">¢{formatCoins(currentUser ? calculateInventoryValue(currentUser.inventory) : 0)}</p>
          </div>
          <div className="border border-lime-400/30 bg-lime-900/30 px-3 py-2 text-right">
            <p className="text-[10px] font-black uppercase text-lime-200">saldo fictício</p>
            <p className="font-display text-sm font-black text-forge-ice">¢{formatCoins(currentUser?.coins ?? 0)}</p>
          </div>

          {currentUser ? (
            <div className="relative">
              <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.07]">
                <Avatar value={currentUser.avatar} size="md" />
                <div className="hidden min-w-[110px] text-left lg:block">
                  <p className="truncate font-display text-sm font-black uppercase text-forge-ice">{currentUser.name}</p>
                  <p className="text-[10px] font-bold uppercase text-forge-amber">LVL {currentUser.level}</p>
                  <LevelProgressBar level={currentUser.level} xp={currentUser.xp} compact />
                </div>
                <span className="font-black text-forge-muted">☰</span>
              </button>
              {open ? (
                <div className="absolute right-0 mt-2 w-64 border border-white/10 bg-[#111219] p-2 shadow-2xl">
                  <Link href="/inventory" className="block px-3 py-2 text-sm font-bold text-forge-silver hover:bg-white/[0.05] hover:text-forge-ice">Inventory</Link>
                  <Link href="/ranking" className="block px-3 py-2 text-sm font-bold text-forge-silver hover:bg-white/[0.05] hover:text-forge-ice">Top Inventories</Link>
                  <button onClick={onLogin} className="block w-full px-3 py-2 text-left text-sm font-bold text-forge-silver hover:bg-white/[0.05] hover:text-forge-ice">{mode === 'online' ? 'Account / login' : 'Create / switch local user'}</button>
                  <button onClick={logout} className="block w-full px-3 py-2 text-left text-sm font-bold text-red-300 hover:bg-red-500/10">Logout</button>
                </div>
              ) : null}
            </div>
          ) : (
            <button onClick={onLogin} className="forge-button min-h-10 px-4 text-xs">Login</button>
          )}
        </div>
      </div>
    </header>
  );
}
