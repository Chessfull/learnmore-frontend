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
    <div className="quiz-challenge">
      {/* Challenge Info */}
      <div className="challenge-header">
        <div className="challenge-meta">
          <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
            {challenge.difficulty}
          </span>
          <span className="xp-badge">+{challenge.xp_reward} XP</span>
        </div>

        {isActive && (
          <CountdownTimer
            timeLeft={timeLeft}
            totalTime={challenge.time_limit}
          />
        )}
      </div>

      {/* Question */}
      <div className="quiz-question">
        <h2 className="question-text">{challenge.question}</h2>
      </div>

      {/* Options */}
      {isReady && (
        <div className="quiz-ready">
          <p className="text-white/70 mb-4">Ready to start?</p>
          <button onClick={onStart} className="btn-primary">
            Start Challenge
          </button>
        </div>
      )}

      {isActive && (
        <>
          <div className="quiz-options">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onSelectAnswer(option)}
                className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
              >
                <span className="option-letter">{optionLetters[index]}</span>
                <span className="option-text">{option}</span>
                <span className="option-key">({index + 1})</span>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="challenge-actions">
            <button
              onClick={onSubmit}
              disabled={!selectedAnswer || isSubmitting}
              className="btn-submit"
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

