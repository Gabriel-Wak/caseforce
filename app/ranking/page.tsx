import { TopInventories } from '@/components/ranking/TopInventories';
import { RecentWins } from '@/components/shared/RecentWins';

export default function RankingPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <TopInventories />
      <RecentWins />
    </div>
  );
}
