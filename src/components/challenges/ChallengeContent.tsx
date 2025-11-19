'use client';

import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { SpaceLoading } from '../ui/SpaceLoading';
import { ChallengeFilters } from './ChallengeFilters';
import { ChallengeResult } from './ChallengeResult';
import { CodeChallenge } from './CodeChallenge';
import { QuizChallenge } from './QuizChallenge';

type ChallengeState = 'loading' | 'ready' | 'active' | 'submitted' | 'complete';

interface Challenge {
  id: string;
  type: 'QUIZ' | 'CODE';
  question: string;
  options?: string[];
  correct_answer?: string;
  difficulty: string;
  xp_reward: number;
  time_limit: number;
  tech_stack: string;
}

interface ChallengeSubmitResult {
  id: string;
  is_correct: boolean;
  xp_earned: number;
  time_taken: number;
  new_total_xp: number;
  new_level: number;
}

export function ChallengeContent() {
  const [state, setState] = useState<ChallengeState>('loading');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<ChallengeSubmitResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [filters, setFilters] = useState({ techStack: '', difficulty: '' });

  // Fetch random challenge
  const fetchChallenge = async () => {
    try {
      setState('loading');
      const params = new URLSearchParams();
      if (filters.techStack) params.append('tech_stack', filters.techStack);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await api.get(`/challenges/random?${params.toString()}`);
      const challengeData = response.data.data;
      
      setChallenge(challengeData);
      setTimeLeft(challengeData.time_limit);
      setSelectedAnswer('');
      setCode('');
      setResult(null);
      setState('ready');
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
    }
  };

  // Start challenge timer
  const startChallenge = () => {
    setState('active');
    setTimerActive(true);
  };

  // Submit challenge answer
  const submitChallenge = async () => {
    if (!challenge) return;

    try {
      setState('submitted');
      setTimerActive(false);

      const response = await api.post('/challenges/submit', {
        challenge_id: challenge.id,
        answer: challenge.type === 'QUIZ' ? selectedAnswer : code,
        time_taken: challenge.time_limit - timeLeft,
      });

      const resultData = response.data.data;
      setResult(resultData);
      setState('complete');
    } catch (error) {
      console.error('Failed to submit challenge:', error);
      setState('active');
      setTimerActive(true);
    }
  };

  // Auto-submit when time runs out
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timerActive && timeLeft <= 0) {
        submitChallenge();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Initial fetch
  useEffect(() => {
    fetchChallenge();
  }, [filters]);

  // Loading state
  if (state === 'loading') {
    return <SpaceLoading message="Loading challenge..." />;
  }

  // Result state
  if (state === 'complete' && result) {
    return (
      <ChallengeResult
        result={result}
        onNextChallenge={fetchChallenge}
      />
    );
  }

  // Challenge states (ready/active/submitted)
  if (!challenge) {
    return (
      <div className="text-center">
        <p className="text-white/70">No challenges available</p>
        <button
          onClick={fetchChallenge}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="challenge-wrapper relative">
      {/* Filters - Top Right */}
      <div className="absolute top-0 right-0 z-10">
        <ChallengeFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Challenge Display */}
      <div className="max-w-4xl mx-auto pt-12">
        {challenge.type === 'QUIZ' ? (
          <QuizChallenge
            challenge={challenge}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={submitChallenge}
            timeLeft={timeLeft}
            isActive={state === 'active'}
            onStart={startChallenge}
            isReady={state === 'ready'}
            isSubmitting={state === 'submitted'}
          />
        ) : (
          <CodeChallenge
            challenge={challenge}
            code={code}
            onCodeChange={setCode}
            onSubmit={submitChallenge}
            timeLeft={timeLeft}
            isActive={state === 'active'}
            onStart={startChallenge}
            isReady={state === 'ready'}
            isSubmitting={state === 'submitted'}
          />
        )}
      </div>
    </div>
  );
}

