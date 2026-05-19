'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DropTicker } from '@/components/layout/DropTicker';
import { LoginModal } from '@/components/layout/LoginModal';
import { useGame } from '@/store/GameContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser, hydrated } = useGame();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !currentUser) setLoginOpen(true);
  }, [hydrated, currentUser]);

  return (
    <>
      <Header onLogin={() => setLoginOpen(true)} />
      <DropTicker />
      <main className="mx-auto min-h-screen max-w-[1560px] px-3 pb-12 pt-[172px] lg:px-5">
        {children}
      </main>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
