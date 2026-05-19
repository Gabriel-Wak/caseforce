import type { ForgeCase } from '@/lib/types';
import { cn } from '@/lib/cn';

export function CaseCrate({ forgeCase, className, size = 'md' }: { forgeCase: ForgeCase; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-44 w-56' : size === 'sm' ? 'h-24 w-32' : 'h-32 w-44';
  return (
    <div className={cn('relative mx-auto', sizeClass, className)} style={{ color: forgeCase.accent }}>
      <div className="absolute inset-x-4 top-4 h-8 border border-current/60 bg-black/60 shadow-[0_0_22px_currentColor]" />
      <div className="absolute inset-x-2 bottom-2 top-10 border border-current/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),rgba(0,0,0,0.4))] shadow-[0_0_34px_currentColor]" />
      <div className="absolute inset-x-6 bottom-8 top-16 border border-white/15 bg-black/30" />
      <div className="absolute left-0 top-12 h-5 w-full bg-current/40" />
      <div className="absolute bottom-6 left-1/2 h-8 w-12 -translate-x-1/2 border border-current/70 bg-black/50" />
      <div className="absolute bottom-11 left-1/2 h-1 w-16 -translate-x-1/2 bg-white/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,currentColor,transparent_62%)] opacity-20 blur-2xl" />
    </div>
  );
}
