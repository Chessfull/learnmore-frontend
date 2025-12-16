'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RocketTransitionProps {
  isActive: boolean;
  targetPath: string;
  onComplete?: () => void;
}

export function RocketTransition({ isActive, targetPath, onComplete }: RocketTransitionProps) {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowAnimation(true);
      
      // Navigate after animation completes
      const timer = setTimeout(() => {
        router.push(targetPath);
        setShowAnimation(false);
        onComplete?.();
      }, 2500); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [isActive, targetPath, router, onComplete]);

  if (!showAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0f1c]"
      >
        {/* Stars Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.7 + 0.3,
              }}
              animate={{
                y: -100,
                opacity: [null, 1, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Lottie Animation Container */}
        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: -200 }}
            transition={{
              duration: 2,
              ease: [0.34, 1.56, 0.64, 1], // Bounce easing
            }}
            className="relative"
          >
            {/* Lottie Player will be loaded here */}
            <div id="rocket-lottie" className="w-full h-[400px]" />
            
            {/* Fallback SVG Rocket if Lottie fails */}
            <svg
              className="w-full h-[400px]"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rocket Body */}
              <motion.path
                d="M90 160 L90 80 Q90 60 100 60 Q110 60 110 80 L110 160 Z"
                fill="url(#rocketGradient)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Rocket Nose */}
              <motion.path
                d="M90 80 Q100 40 110 80 Z"
                fill="#00d4ff"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              />
              
              {/* Rocket Windows */}
              <motion.circle
                cx="100"
                cy="100"
                r="12"
                fill="#fff"
                opacity="0.9"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.2 }}
              />
              
              {/* Left Fin */}
              <motion.path
                d="M90 140 L70 160 L90 160 Z"
                fill="#8b5cf6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              />
              
              {/* Right Fin */}
              <motion.path
                d="M110 140 L130 160 L110 160 Z"
                fill="#8b5cf6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              />
              
              {/* Fire/Exhaust */}
              <motion.g
                animate={{
                  y: [0, 5, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              >
                <path d="M95 160 L100 180 L105 160 Z" fill="#ff6b35" />
                <path d="M92 165 L100 185 L108 165 Z" fill="#f7931e" />
                <path d="M90 170 L100 190 L110 170 Z" fill="#ffd700" opacity="0.6" />
              </motion.g>
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0099cc" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Launch Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Launching to Courses! 🚀
            </h2>
            <p className="text-white/60">Preparing your space journey...</p>
          </motion.div>
        </div>

        {/* Particle Trail Effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00d4ff]"
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: [-50 * i, -50 * i - 100],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to easily trigger rocket animation
export function useRocketTransition() {
  const [isActive, setIsActive] = useState(false);

  const launch = () => setIsActive(true);
  const reset = () => setIsActive(false);

  return { isActive, launch, reset };
}

