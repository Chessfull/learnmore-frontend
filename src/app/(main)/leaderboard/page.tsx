'use client';

import { ActivityFeed } from '@/components/leaderboard/ActivityFeed';
import { Top20List } from '@/components/leaderboard/Top20List';
import { TopThreePodium } from '@/components/leaderboard/TopThreePodium';

export default function LeaderboardPage() {
  return (
    <div className="leaderboard-container">
      <aside className="left-panel">
        <Top20List />
      </aside>
      <main className="center-panel">
        <TopThreePodium />
      </main>
      <aside className="right-panel">
        <ActivityFeed />
      </aside>
    </div>
  );
}
