'use client';

import { UserProfileCard } from '@/components/profile/UserProfileCard';
import { MissionPanel } from '@/components/missions/MissionPanel';
import { LiveDropFeed } from '@/components/shared/LiveDropFeed';

export function SidebarProfile() {
  return (
    <aside className="space-y-4">
      <UserProfileCard />
      <MissionPanel compact />
      <LiveDropFeed compact />
    </aside>
  );
}
