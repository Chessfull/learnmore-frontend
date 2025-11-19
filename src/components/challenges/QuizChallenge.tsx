'use client';

import { Send } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface QuizChallengeProps {
  challenge: {
    question: string;
    options?: string[];
    difficulty: string;
    xp_reward: number;
    time_limit: number;
  };
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  timeLeft: number;
  isActive: boolean;
  onStart: () => void;
  isReady: boolean;
  isSubmitting: boolean;
}

export function QuizChallenge({
  challenge,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  timeLeft,
  isActive,
  onStart,
  isReady,
  isSubmitting,
}: QuizChallengeProps) {
  const options = challenge.options || [];
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Keyboard shortcuts
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!isActive) return;
    
    const key = e.key;
    if (key >= '1' && key <= '4') {
      const index = parseInt(key) - 1;
      if (index < options.length) {
        onSelectAnswer(options[index]);
      }
    } else if (key === 'Enter' && selectedAnswer) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Challenge Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
            challenge.difficulty === 'BEGINNER' ? 'bg-green-500/20 text-green-400' :
            challenge.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {challenge.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00d4ff]/20 text-[#00d4ff]">
            +{challenge.xp_reward} XP
          </span>
        </div>

        {isActive && (
          <CountdownTimer
            timeLeft={timeLeft}
            totalTime={challenge.time_limit}
          />
        )}
      </div>

      {/* Question */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-relaxed break-words">
          {challenge.question}
        </h2>
      </div>

      {/* Ready State */}
      {isReady && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/70 text-lg">Ready to start?</p>
          <button 
            onClick={onStart} 
            className="px-8 py-3 bg-linear-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Challenge
          </button>
        </div>
      )}

      {/* Active State */}
      {isActive && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onSelectAnswer(option)}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedAnswer === option 
                    ? 'bg-[#00d4ff]/10 border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#00d4ff]/50'
                }`}
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold shrink-0 ${
                  selectedAnswer === option
                    ? 'bg-[#00d4ff] text-white'
                    : 'bg-white/10 text-white/70'
                }`}>
                  {optionLetters[index]}
                </span>
                <span className="text-white font-medium flex-1 break-words">{option}</span>
                <span className="text-white/40 text-sm shrink-0">({index + 1})</span>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={onSubmit}
              disabled={!selectedAnswer || isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

