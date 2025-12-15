'use client';

import { ChapterRoadmap } from '@/components/dashboard/ChapterRoadmap';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';

export default function DashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-(--spacing(16))-(--spacing(20)))] bg-[#0a0f1c] px-6 lg:px-8 pt-12 lg:pt-16 pb-6 lg:pb-8 overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Panel - Welcome & Stats (25%) */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            <WelcomeCard />
            <div className="flex-1">
              <StatsCard />
            </div>
          </aside>

          {/* Right Panel - Chapter Roadmap (75%) */}
          <main className="lg:col-span-3 h-full">
            <ChapterRoadmap />
          </main>
        </div>
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

