import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/store/GameContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Case Forge — Fictional Case Opening Game',
  description: 'A fictional, no real-money case opening prototype built with Next.js, TypeScript and Tailwind CSS.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          <AppShell>{children}</AppShell>
        </GameProvider>
      </body>
    </html>
  );
}
