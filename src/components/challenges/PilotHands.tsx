'use client';

import Image from 'next/image';

export function PilotHands() {
  // Check if pilot hands image exists, otherwise hide
  const showHands = false; // Will be true when image is available

  if (!showHands) {
    return null;
  }

  return (
    <div className="pilot-hands">
      <Image
        src="/images/pilot-hands.png"
        alt="Pilot hands on controls"
        width={600}
        height={400}
        className="animate-subtle-float"
        priority
      />
    </div>
  );
}

