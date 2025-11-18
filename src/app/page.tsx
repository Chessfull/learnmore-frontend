'use client';

import { useAuthStore } from '@/store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && videoEnded) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, videoEnded, router]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleVideoError = () => {
    console.warn('UYARI: Intro video yüklenemedi - public/videos/intro/intro-video.mp4');
    setVideoError(true);
    setVideoEnded(true);
  };

  // Skip video for development if it doesn't exist
  const skipVideo = () => {
    setVideoEnded(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
      </div>

      {/* Intro Video */}
      <AnimatePresence>
        {!videoEnded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10 bg-black"
          >
            {!videoError ? (
              <video
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                className="w-full h-full object-cover"
              >
                <source src="/videos/intro/intro-video.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/50">Video yüklenemedi</p>
              </div>
            )}
            
            {/* Skip button for development */}
            <button
              onClick={skipVideo}
              className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm"
            >
              Skip →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Shows after video */}
      {videoEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-0 min-h-screen flex items-center justify-center p-4"
        >
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : isAuthenticated ? (
            <div className="text-white">Redirecting to dashboard...</div>
          ) : (
            <div className="text-white text-2xl text-center">
              <p>Welcome to LearnMore</p>
              <p className="text-sm text-white/50 mt-2">Auth panels coming in Phase 1</p>
            </div>
          )}
        </motion.div>
      )}

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
      `}</style>
    </div>
  );
}
