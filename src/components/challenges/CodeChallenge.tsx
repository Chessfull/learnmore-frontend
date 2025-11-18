'use client';

import { Send } from 'lucide-react';
import { CodeEditor } from '../lesson/CodeEditor';
import { CountdownTimer } from './CountdownTimer';

interface CodeChallengeProps {
  challenge: {
    question: string;
    difficulty: string;
    xp_reward: number;
    time_limit: number;
    tech_stack: string;
  };
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: () => void;
  timeLeft: number;
  isActive: boolean;
  onStart: () => void;
  isReady: boolean;
  isSubmitting: boolean;
}

export function CodeChallenge({
  challenge,
  code,
  onCodeChange,
  onSubmit,
  timeLeft,
  isActive,
  onStart,
  isReady,
  isSubmitting,
}: CodeChallengeProps) {
  const getLanguage = () => {
    const langMap: Record<string, string> = {
      'GO': 'go',
      'PYTHON': 'python',
      'JAVASCRIPT': 'javascript',
      'NODEJS': 'javascript',
      'JAVA': 'java',
      'CSHARP': 'csharp',
    };
    return langMap[challenge.tech_stack] || 'javascript';
  };

  return (
    <div className="code-challenge">
      {/* Challenge Info */}
      <div className="challenge-header">
        <div className="challenge-meta">
          <span className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
            {challenge.difficulty}
          </span>
          <span className="xp-badge">+{challenge.xp_reward} XP</span>
          <span className="tech-badge">{challenge.tech_stack}</span>
        </div>

        {isActive && (
          <CountdownTimer
            timeLeft={timeLeft}
            totalTime={challenge.time_limit}
          />
        )}
      </div>

      {/* Description */}
      <div className="challenge-description">
        <h3 className="text-lg font-semibold text-white mb-2">Challenge</h3>
        <p className="text-white/70 text-sm">{challenge.question}</p>
      </div>

      {/* Ready State */}
      {isReady && (
        <div className="quiz-ready">
          <p className="text-white/70 mb-4">Ready to start coding?</p>
          <button onClick={onStart} className="btn-primary">
            Start Challenge
          </button>
        </div>
      )}

      {/* Active State */}
      {isActive && (
        <>
          {/* Code Editor */}
          <div className="code-editor-compact">
            <div className="editor-header">
              <span className="text-xs text-white/50">solution.{getLanguage()}</span>
            </div>
            <div className="h-64">
              <CodeEditor
                language={getLanguage()}
                value={code}
                onChange={onCodeChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="challenge-actions">
            <button
              onClick={onSubmit}
              disabled={!code.trim() || isSubmitting}
              className="btn-submit"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

