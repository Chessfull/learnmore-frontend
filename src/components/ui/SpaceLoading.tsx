'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const spaceFacts = [
  "The International Space Station travels at about 28,000 km/h",
  "A day on Venus is longer than its year",
  "Neutron stars can spin 600 times per second",
  "There are more stars in the universe than grains of sand on Earth",
  "The footprints on the Moon will last for 100 million years",
  "One million Earths could fit inside the Sun",
  "Space is completely silent",
  "The sunset on Mars appears blue",
  "Jupiter's Great Red Spot is shrinking",
  "Saturn's rings are mostly made of ice",
];

interface SpaceLoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function SpaceLoading({ fullScreen = false, message }: SpaceLoadingProps) {
  const [fact, setFact] = useState('');

  useEffect(() => {
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    setFact(randomFact);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated planet/loader */}
      <motion.div
        className="w-16 h-16 rounded-full bg-linear-to-br from-[#00d4ff] to-[#8b5cf6]"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Message or fact */}
      <div className="text-center max-w-md">
        {message && (
          <p className="text-white font-medium mb-2">{message}</p>
        )}
        <p className="text-white/60 text-sm italic">
          💫 {fact}
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0a0f1c] flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

