'use client';

import { LearningRoadmap } from '@/components/dashboard/LearningRoadmap';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-(--spacing(16))-(--spacing(20)))] bg-[#0a0f1c] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-stretch">
          {/* Left Panel - Welcome & Stats */}
          <aside className="flex flex-col gap-6">
            <WelcomeCard />
            <div className="flex-1">
              <StatsCard />
            </div>
          </aside>

          {/* Right Panel - Learning Roadmap */}
          <main>
            <LearningRoadmap />
          </main>
        </div>
      </div>
    </div>
  );
}

