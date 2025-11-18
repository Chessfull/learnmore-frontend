'use client';

import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Rocket, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function NoProgressState() {
  const router = useRouter();

  return (
    <GlassCard padding="none" glow="purple" className="relative overflow-hidden">
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

        {/* Floating Planets - Background Layer */}
        <FloatingPlanet
          src="/images/planets/go-planet.png"
          alt="Go"
          position="top-[15%] left-[10%]"
          size="w-24 h-24"
          delay={0}
        />
        <FloatingPlanet
          src="/images/planets/python-planet.png"
          alt="Python"
          position="top-[60%] left-[8%]"
          size="w-20 h-20"
          delay={1.5}
        />
        <FloatingPlanet
          src="/images/planets/java-planet.png"
          alt="Java"
          position="top-[25%] right-[12%]"
          size="w-28 h-28"
          delay={0.8}
        />
        <FloatingPlanet
          src="/images/planets/csharp-planet.png"
          alt="C#"
          position="top-[70%] right-[15%]"
          size="w-20 h-20"
          delay={2}
        />

        {/* Additional decorative planets (smaller) */}
        <FloatingPlanet
          src="/images/planets/nodejs-planet.png"
          alt="Node"
          position="top-[45%] right-[5%]"
          size="w-16 h-16"
          delay={1.2}
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
            onClick={() => router.push('/courses')}
            leftIcon={<Rocket className="w-5 h-5" />}
            className="shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all"
          >
            Go to Courses
          </Button>
        </div>
      </div>
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

