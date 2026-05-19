import { xpForLevel } from '@/lib/game';

export function LevelProgressBar({ level, xp, compact = false }: { level: number; xp: number; compact?: boolean }) {
  const needed = xpForLevel(level);
  const percent = Math.min(100, Math.round((xp / needed) * 100));
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-forge-muted">
        <span>Level {level}</span>
        <span>{xp}/{needed} XP</span>
      </div>
      <div className={compact ? 'h-2 bg-black/70 forge-border' : 'h-3 bg-black/70 forge-border'}>
        <div className="h-full bg-gradient-to-r from-forge-orange via-forge-amber to-forge-purple shadow-[0_0_18px_rgba(255,138,29,0.45)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
