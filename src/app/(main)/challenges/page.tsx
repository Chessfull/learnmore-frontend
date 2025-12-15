'use client';

import { ChallengeSelection } from '@/components/challenges/ChallengeSelection';
import { CodeChallenge } from '@/components/challenges/CodeChallenge';
import { QuizChallenge } from '@/components/challenges/QuizChallenge';
import api from '@/lib/api';
import { TechStackName } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

type ChallengeStep = 'selection' | 'active';
type ChallengeType = 'QUIZ' | 'CODE';

interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  question: string;
  options?: string; // JSON string
  starter_code?: string;
  hints?: string;
  difficulty: string;
  xp_reward_correct: number;
  xp_reward_wrong: number;
  time_limit: number;
  tech_stack: string;
}

export default function ChallengesPage() {
  const [step, setStep] = useState<ChallengeStep>('selection');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelection = async (techStack: TechStackName, difficulty: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/challenges/random', {
        tech_stack: techStack,
        difficulty,
      });
      
      const challengeData = response.data?.data || response.data;
      setChallenge(challengeData);
      setStep('active');
    } catch (error: any) {
      console.error('Failed to fetch challenge:', error);
      toast.error('No challenge found. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    setStep('selection');
    setChallenge(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-white text-2xl">Loading challenge... 🚀</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0f1c] overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
      </div>

      <div className="relative z-10">
        {step === 'selection' && (
          <ChallengeSelection onSelect={handleSelection} />
        )}

        {step === 'active' && challenge && (
          <>
            {challenge.type === 'QUIZ' ? (
              <QuizChallenge challenge={challenge} onComplete={handleComplete} />
            ) : (
              <CodeChallenge challenge={challenge} onComplete={handleComplete} />
            )}
          </>
        )}
      </div>

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

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
