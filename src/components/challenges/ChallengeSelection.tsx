'use client';

import { TechStackName } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface ChallengeSelectionProps {
  onSelect: (techStack: TechStackName, difficulty: string) => void;
}

type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

const TECH_STACKS: Array<{ name: TechStackName; label: string; planet: string; color: string }> = [
  { name: 'GO', label: 'Go', planet: '/images/planets/go-planet.png', color: '#00d4ff' },
  { name: 'PYTHON', label: 'Python', planet: '/images/planets/python-planet.png', color: '#ffd43b' },
  { name: 'JAVA', label: 'Java', planet: '/images/planets/java-planet.png', color: '#f89820' },
  { name: 'NODEJS', label: 'Node.js', planet: '/images/planets/nodejs-planet.png', color: '#68a063' },
];

const DIFFICULTIES: Array<{ value: Difficulty; label: string; xp: string; color: string }> = [
  { value: 'BEGINNER', label: 'Beginner', xp: '50-100 XP', color: '#4ade80' },
  { value: 'INTERMEDIATE', label: 'Intermediate', xp: '75-150 XP', color: '#fbbf24' },
  { value: 'ADVANCED', label: 'Advanced', xp: '100-200 XP', color: '#f87171' },
];

export function ChallengeSelection({ onSelect }: ChallengeSelectionProps) {
  const [selectedTechStack, setSelectedTechStack] = useState<TechStackName | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleStart = () => {
    if (selectedTechStack && selectedDifficulty) {
      onSelect(selectedTechStack, selectedDifficulty);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          🚀 Choose Your Challenge
        </h1>
        <p className="text-white/70 text-lg">
          Select a tech stack and difficulty to begin your coding adventure
        </p>
      </div>

      {/* Tech Stack Selection */}
      <div className="mb-12 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Tech Stack</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_STACKS.map((stack) => (
            <button
              key={stack.name}
              onClick={() => setSelectedTechStack(stack.name)}
              className={`
                relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300
                ${selectedTechStack === stack.name
                  ? 'bg-white/10 border-2 scale-105'
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:scale-105'
                }
              `}
              style={{
                borderColor: selectedTechStack === stack.name ? stack.color : undefined,
                boxShadow: selectedTechStack === stack.name ? `0 0 30px ${stack.color}40` : undefined,
              }}
            >
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={stack.planet}
                  alt={stack.label}
                  fill
                  sizes="96px"
                  className="object-contain animate-[spin_20s_linear_infinite]"
                />
              </div>
              <span className="text-white font-semibold text-lg">{stack.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      {selectedTechStack && (
        <div className="mb-12 w-full max-w-4xl animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`
                  relative p-6 rounded-2xl transition-all duration-300
                  ${selectedDifficulty === diff.value
                    ? 'bg-white/10 border-2 scale-105'
                    : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:scale-105'
                  }
                `}
                style={{
                  borderColor: selectedDifficulty === diff.value ? diff.color : undefined,
                  boxShadow: selectedDifficulty === diff.value ? `0 0 30px ${diff.color}40` : undefined,
                }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{diff.label}</h3>
                  <p className="text-white/70">{diff.xp}</p>
                  {selectedDifficulty === diff.value && (
                    <div className="mt-3 text-2xl">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start Button */}
      {selectedTechStack && selectedDifficulty && (
        <button
          onClick={handleStart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold text-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(0,212,255,0.4)] animate-fade-in"
        >
          Start Challenge! 🚀
        </button>
      )}

      {/* Pilot Hands (Bottom Center) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none z-0">
        <Image
          src="/images/pilot-hands.png"
          alt="Pilot hands"
          fill
          sizes="256px"
          className="object-contain opacity-30"
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

