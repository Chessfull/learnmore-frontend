'use client';

import { AuthPanel } from '@/components/auth/AuthPanel';
import { DemoVideoPanel } from '@/components/auth/DemoVideoPanel';
import { SpaceLoading } from '@/components/ui/SpaceLoading';
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
    // If user is already authenticated, skip video and redirect immediately
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleVideoError = () => {
    console.warn('UYARI: Intro video yüklenemedi - public/videos/intro/intro-video.mp4');
    setVideoError(true);
    setVideoEnded(true);
  };

  // Skip video for development
  const skipVideo = () => {
    setVideoEnded(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
      </div>

      {/* Intro Video - Only show if not authenticated */}
      <AnimatePresence>
        {!videoEnded && !isAuthenticated && (
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
              className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm transition-colors"
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
          className="relative z-0 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
        >
          {isLoading ? (
            <SpaceLoading message="Initializing your space journey..." />
          ) : isAuthenticated ? (
            <SpaceLoading message="Redirecting to dashboard..." />
          ) : (
            <div className="w-full max-w-7xl mx-auto">
              {/* Auth Panels Container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
                {/* Left Panel - Auth */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                  className="flex"
                >
                  <AuthPanel />
                </motion.div>

                {/* Right Panel - Demo Video */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
                  className="flex"
                >
                  <DemoVideoPanel />
                </motion.div>
              </div>

              {/* Trusted By Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
                className="text-center mt-20 mr-30"
              >
                <p className="text-white/50 text-xl mb-4 mt-4">
                  Trusted by developers from
                </p>
                <div className="flex items-center justify-center gap-8 md:gap-12">
                  <img
                    src="/images/icon/google-intro.svg"
                    alt="Google"
                    className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="/images/icon/spotify-intro.svg"
                    alt="Spotify"
                    className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity"
                  />
                  <img
                    src="/images/icon/netflix-intro.svg"
                    alt="Netflix"
                    className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              </motion.div>
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
