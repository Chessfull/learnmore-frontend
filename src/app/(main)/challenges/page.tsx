'use client';

import { ChallengeContent } from '@/components/challenges/ChallengeContent';
import { CockpitView } from '@/components/challenges/CockpitView';
import { PilotHands } from '@/components/challenges/PilotHands';

export default function ChallengesPage() {
  return (
    <div className="challenges-container">
      <CockpitView>
        <ChallengeContent />
      </CockpitView>
      <PilotHands />
    </div>
  );
}
