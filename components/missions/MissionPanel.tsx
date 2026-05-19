'use client';

import { useState } from 'react';
import { missions } from '@/data/missions';
import { missionProgressValue } from '@/lib/game';
import { useGame } from '@/store/GameContext';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function MissionPanel({ compact = false }: { compact?: boolean }) {
  const { currentUser, claimMission, claimDailyReward } = useGame();
  const [message, setMessage] = useState('');

  return (
    <div className="forge-panel p-4">
      <SectionHeader eyebrow="Daily objectives" title="Missions" />
      <div className="relative z-10 space-y-3">
        <button
          className="ghost-button w-full justify-between text-left"
          onClick={() => {
            const result = claimDailyReward();
            setMessage(result.message);
          }}
        >
          <span>Daily reward</span>
          <span className="text-forge-amber">+180 ¢</span>
        </button>
        {currentUser ? missions.slice(0, compact ? 3 : missions.length).map((mission) => {
          const progress = missionProgressValue(currentUser, mission);
          const claimed = currentUser.missionState[mission.id]?.claimed;
          const done = progress >= mission.target;
          const percent = Math.min(100, (progress / mission.target) * 100);
          return (
            <div key={mission.id} className="border border-white/10 bg-black/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-display text-base font-black uppercase tracking-wide text-forge-ice">{mission.title}</h4>
                  {!compact ? <p className="mt-1 text-xs text-forge-muted">{mission.description}</p> : null}
                </div>
                <span className="font-display text-sm font-black text-forge-amber">{progress}/{mission.target}</span>
              </div>
              <div className="mt-3 h-2 bg-black/70">
                <div className="h-full bg-gradient-to-r from-forge-orange to-forge-purple" style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-forge-muted">+{mission.xpReward} XP · +{mission.coinReward} ¢</span>
                <button
                  disabled={!done || claimed}
                  onClick={() => {
                    const result = claimMission(mission.id);
                    setMessage(result.message);
                  }}
                  className="ghost-button min-h-8 px-3 text-xs disabled:opacity-40"
                >
                  {claimed ? 'Claimed' : 'Claim'}
                </button>
              </div>
            </div>
          );
        }) : <p className="text-sm text-forge-muted">Login to track mission progress.</p>}
        {message ? <p className="border border-forge-orange/30 bg-forge-orange/10 p-2 text-xs font-bold text-forge-amber">{message}</p> : null}
      </div>
    </div>
  );
}
