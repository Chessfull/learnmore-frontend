'use client';

import { PlanetGrid } from '@/components/courses/PlanetGrid';
import { WelcomeMessage } from '@/components/courses/WelcomeMessage';

export default function CoursesPage() {
  return (
    <div className="min-h-[calc(100vh-(--spacing(16))-(--spacing(20)))] bg-[#0a0f1c] p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-stretch">
          {/* Left Panel - Welcome Message */}
          <aside className="flex flex-col">
            <WelcomeMessage />
          </aside>

          {/* Right Panel - Planet Grid */}
          <main className="min-h-[600px]">
            <PlanetGrid />
          </main>
        </div>
      </div>
    </div>
  );
}

