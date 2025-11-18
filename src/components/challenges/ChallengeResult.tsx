'use client';

import { CheckCircle2, Trophy, XCircle, Zap } from 'lucide-react';

interface ChallengeResultProps {
  result: {
    is_correct: boolean;
    xp_earned: number;
    time_taken: number;
    new_total_xp: number;
    new_level: number;
  };
  onNextChallenge: () => void;
}

export function ChallengeResult({ result, onNextChallenge }: ChallengeResultProps) {
  const isCorrect = result.is_correct;

  return (
    <div className={`challenge-result ${isCorrect ? 'result-correct' : 'result-incorrect'}`}>
      {/* Result Icon */}
      <div className="result-icon-wrapper">
        {isCorrect ? (
          <CheckCircle2 className="result-icon result-icon-correct" />
        ) : (
          <XCircle className="result-icon result-icon-incorrect" />
        )}
      </div>

      {/* Result Title */}
      <h2 className="result-title">
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </h2>

      {/* Stats */}
      <div className="result-stats">
        {isCorrect && (
          <>
            <div className="result-stat">
              <Zap className="w-6 h-6 text-[#00d4ff]" />
              <div>
                <div className="xp-earned">+{result.xp_earned} XP</div>
                <div className="text-xs text-white/50">Total: {result.new_total_xp} XP</div>
              </div>
            </div>

            <div className="result-stat">
              <Trophy className="w-6 h-6 text-[#f59e0b]" />
              <div>
                <div className="text-xl font-bold">Level {result.new_level}</div>
                <div className="text-xs text-white/50">Current Level</div>
              </div>
            </div>

            <div className="result-stat">
              <div className="stat-icon bg-[#8b5cf6]/20">
                <span className="text-[#8b5cf6] text-xl">⚡</span>
              </div>
              <div>
                <div className="text-xl font-bold">{result.time_taken}s</div>
                <div className="text-xs text-white/50">Time Taken</div>
              </div>
            </div>

            {/* Speed Bonus */}
            {result.time_taken < 30 && (
              <div className="speed-bonus">
                <span className="text-2xl">🚀</span>
                <span className="ml-2">Speed Bonus!</span>
              </div>
            )}
          </>
        )}

        {!isCorrect && (
          <div className="text-center">
            <p className="text-white/70 mb-4">
              Don&apos;t worry! Practice makes perfect.
            </p>
            <p className="text-sm text-white/50">
              Try another challenge to improve your skills.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="result-actions">
        <button onClick={onNextChallenge} className="btn-primary">
          {isCorrect ? 'Next Challenge' : 'Try Again'}
        </button>
      </div>

      {/* Confetti Animation for Correct Answer */}
      {isCorrect && <div className="confetti-container" />}
    </div>
  );
}

