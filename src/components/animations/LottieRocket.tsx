'use client';

import { useEffect, useRef } from 'react';

interface LottieRocketProps {
  onComplete?: () => void;
}

export function LottieRocket({ onComplete }: LottieRocketProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const loadLottie = async () => {
      try {
        // Dynamically import lottie-web
        const lottie = (await import('lottie-web')).default;
        
        if (containerRef.current && !animationRef.current) {
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/animations/rocket-launch.json', // Your Lottie JSON file path
          });

          animationRef.current.addEventListener('complete', () => {
            onComplete?.();
          });
        }
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
      }
    };

    loadLottie();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [onComplete]);

  return <div ref={containerRef} className="w-full h-full" />;
}

