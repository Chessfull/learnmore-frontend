'use client';

import { ChallengeContent } from '@/components/challenges/ChallengeContent';
import { CockpitView } from '@/components/challenges/CockpitView';
import { PilotHands } from '@/components/challenges/PilotHands';

export default function ChallengesPage() {
  return (
    <div className="challenges-container bg-[#0a0f1c] relative">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
      </div>

      <div className="relative z-10">
        <CockpitView>
          <ChallengeContent />
        </CockpitView>
        <PilotHands />
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
