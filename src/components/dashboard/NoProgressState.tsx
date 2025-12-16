'use client';

import { RocketTransition, useRocketTransition } from '@/components/animations/RocketTransition';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Rocket, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function NoProgressState() {
  const { isActive, launch, reset } = useRocketTransition();

  return (
    <GlassCard padding="none" glow="purple" className="relative overflow-hidden h-full">
      {/* Space Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0f1c] via-[#1a0a2e] to-[#0d1b2a]">
        {/* Floating Stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Floating Planets - Background Layer - Optimal Sizes */}
        <FloatingPlanet
          src="/images/planets/go-planet.png"
          alt="Go"
          position="top-[12%] left-[8%]"
          size="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
          delay={0}
        />
        <FloatingPlanet
          src="/images/planets/python-planet.png"
          alt="Python"
          position="top-[58%] left-[5%]"
          size="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52"
          delay={1.5}
        />
        <FloatingPlanet
          src="/images/planets/java-planet.png"
          alt="Java"
          position="top-[22%] right-[10%]"
          size="w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60"
          delay={0.8}
        />
        <FloatingPlanet
          src="/images/planets/nodejs-planet.png"
          alt="Node.js"
          position="top-[68%] right-[12%]"
          size="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52"
          delay={2}
        />
      </div>

      {/* Content - Foreground */}
      <div className="relative z-10 py-16 px-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center animate-float shadow-[0_0_60px_rgba(0,212,255,0.4)]">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#00d4ff] animate-pulse" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          Begin Your Space Journey!
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto text-center leading-relaxed">
          Select a programming language to start learning and embark on an exciting adventure through
          the cosmos of code.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={launch}
            leftIcon={<Rocket className="w-5 h-5" />}
            className="shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all"
          >
            Go to Courses
          </Button>
        </div>
      </div>

      {/* Rocket Transition Animation */}
      <RocketTransition 
        isActive={isActive} 
        targetPath="/courses" 
        onComplete={reset}
      />
    </GlassCard>
  );
}

interface FloatingPlanetProps {
  src: string;
  alt: string;
  position: string;
  size: string;
  delay: number;
}

function FloatingPlanet({ src, alt, position, size, delay }: FloatingPlanetProps) {
  return (
    <div
      className={`absolute ${position} ${size} opacity-20 pointer-events-none`}
      style={{
        animation: `float 8s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="150px"
        className="object-contain blur-[0.5px]"
      />
    </div>
  );
}

