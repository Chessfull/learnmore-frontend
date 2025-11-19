'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Rocket, Target, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] relative">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image
              src="/images/logo/logo.png"
              alt="Learn More"
              width={64}
              height={64}
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About LearnMore
          </h1>
          <p className="text-xl text-white/70">
            Your journey to mastering programming in space
          </p>
        </div>

        {/* Mission */}
        <GlassCard padding="lg" glow="cyan" className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6 text-[#00d4ff]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-white/70 leading-relaxed">
                LearnMore is dedicated to making programming education accessible, engaging, and fun for everyone. 
                Through our immersive space-themed platform, we transform the learning experience into an exciting 
                adventure where every line of code takes you closer to mastering your chosen technology.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard padding="lg" glow="purple">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Learning</h3>
              <p className="text-sm text-white/60">
                Learn by doing with real-time code execution and instant feedback
              </p>
            </div>
          </GlassCard>

          <GlassCard padding="lg" glow="green">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00ff88]/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-[#00ff88]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-sm text-white/60">
                Join thousands of developers learning and growing together
              </p>
            </div>
          </GlassCard>

          <GlassCard padding="lg" glow="cyan">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gamified Progress</h3>
              <p className="text-sm text-white/60">
                Track your progress with XP, achievements, and leaderboards
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Stats */}
        <GlassCard padding="lg" glow="purple" className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#00d4ff] mb-1">10K+</div>
              <div className="text-sm text-white/60">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#8b5cf6] mb-1">500+</div>
              <div className="text-sm text-white/60">Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00ff88] mb-1">5</div>
              <div className="text-sm text-white/60">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00d4ff] mb-1">24/7</div>
              <div className="text-sm text-white/60">Available</div>
            </div>
          </div>
        </GlassCard>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-linear-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Your Journey
          </Link>
        </div>
      </div>

      <style jsx>{`
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent);
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

