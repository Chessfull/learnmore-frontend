'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function DemoVideoPanel() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    // For now, just show alert - will implement video player in future
    alert('Demo video player will be implemented in next iteration');
    setIsPlaying(true);
  };

  return (
    <GlassCard padding="lg" glow="purple" className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Experience Zero-Gravity Learning</h2>
        <p className="text-white/60 text-center">
        See in 2 minutes why 10,000+ developers started their journey here
        </p>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/30 cursor-pointer group">
        {/* Thumbnail */}
        <Image
          src="/images/demo-thumbnail.jpg"
          alt="Demo video thumbnail"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          priority
          className="object-cover"
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] group-hover:bg-black/30 transition-all duration-300"
          >
            <div className="w-20 h-20 rounded-full bg-[#00d4ff]/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(0,212,255,0.5)]">
              <Play className="w-8 h-8 text-[#0a0f1c] ml-1" fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="mt-6 space-y-3">
        <FeatureItem text="Real-time code validation and error hints" />
        <FeatureItem text="Track progress with achievements, streaks, and milestones" />
        <FeatureItem text="Compete on leaderboards with a global community" />
      </div>
    </GlassCard>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}

