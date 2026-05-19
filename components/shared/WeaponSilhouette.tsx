import { getSkin } from '@/data/skins';
import { cn } from '@/lib/cn';

export function WeaponSilhouette({ skinId, className, compact = false }: { skinId: string; className?: string; compact?: boolean }) {
  const skin = getSkin(skinId);
  const isKnife = skin.weapon.includes('Knife') || skin.weapon.includes('Karambit') || skin.weapon.includes('Bayonet');
  const isGlove = skin.weapon.includes('Gloves');

  if (isGlove) {
    return (
      <div className={cn('relative mx-auto grid h-24 w-36 place-items-center', className)} style={{ color: skin.color }}>
        <div className="absolute h-16 w-16 -translate-x-5 rotate-[-14deg] border-2 border-current bg-current/15 shadow-[0_0_28px_currentColor]" />
        <div className="absolute h-16 w-16 translate-x-5 rotate-[14deg] border-2 border-current bg-current/10 shadow-[0_0_28px_currentColor]" />
        <div className="absolute inset-x-8 bottom-3 h-2 bg-current/70" />
      </div>
    );
  }

  if (isKnife) {
    return (
      <div className={cn('relative mx-auto h-24 w-44', className)} style={{ color: skin.color }}>
        <div className="weapon-line absolute left-3 top-12 h-3 w-24 -rotate-12 bg-current" />
        <div className="weapon-line absolute left-[92px] top-[33px] h-5 w-20 -rotate-12 bg-current/70 [clip-path:polygon(0_20%,100%_0,82%_100%,0_80%)]" />
        <div className="absolute left-2 top-[53px] h-7 w-7 -rotate-12 border-2 border-current bg-black/50" />
      </div>
    );
  }

  return (
    <div className={cn(compact ? 'h-16 w-32' : 'h-24 w-48', 'relative mx-auto', className)} style={{ color: skin.color }}>
      <div className="weapon-line absolute left-3 top-9 h-4 w-28 bg-current" />
      <div className="weapon-line absolute left-[103px] top-8 h-2 w-16 bg-current/80" />
      <div className="weapon-line absolute left-10 top-[48px] h-8 w-8 border-l-[12px] border-current bg-current/15" />
      <div className="weapon-line absolute left-[78px] top-[50px] h-8 w-4 -skew-x-12 bg-current/70" />
      <div className="weapon-line absolute left-5 top-6 h-8 w-10 border-t-4 border-current" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,currentColor,transparent_52%)] opacity-20 blur-xl" />
    </div>
  );
}
