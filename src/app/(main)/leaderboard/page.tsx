'use client';

import { ActivityFeed } from '@/components/leaderboard/ActivityFeed';
import { Top20List } from '@/components/leaderboard/Top20List';
import { TopThreePodium } from '@/components/leaderboard/TopThreePodium';

export default function LeaderboardPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0f1c] overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
      </div>

      <div className="relative z-10 leaderboard-container">
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

      {/* CSS Stars */}
      <style jsx>{`
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 230px 80px, white, transparent);
          background-size: 250px 250px;
          animation: twinkle 5s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
