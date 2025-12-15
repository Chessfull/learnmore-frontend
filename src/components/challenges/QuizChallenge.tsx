'use client';

import api from '@/lib/api';
import { CheckCircle, Timer, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface QuizOption {
  text: string;
  is_correct: boolean;
}

interface QuizChallengeProps {
  challenge: any;
  onComplete: () => void;
}

export function QuizChallenge({ challenge, onComplete }: QuizChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(challenge.time_limit);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(Date.now());

  const options: QuizOption[] = challenge.options ? JSON.parse(challenge.options) : [];
  const optionLabels = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !isSubmitted) {
          handleSubmit(true); // Auto-submit when time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSubmit = async (isTimeout = false) => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await api.post('/challenges/submit', {
        challenge_id: challenge.id,
        answer: selectedOption || '',
        time_taken: timeTaken,
      });

      const resultData = response.data?.data || response.data;
      setResult(resultData);
      
      if (resultData.is_correct) {
        toast.success(`Correct! +${resultData.xp_earned} XP! 🎉`);
      } else {
        toast.error(`Wrong answer! +${resultData.xp_earned} XP for trying!`);
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      {/* Timer */}
      <div className="mb-6 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20">
        <Timer className="w-5 h-5 text-[#00d4ff]" />
        <span className={`text-2xl font-mono font-bold ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-3xl p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        {/* Challenge Info */}
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] text-sm font-semibold">
            {challenge.difficulty}
          </span>
          <span className="text-white/70 text-sm">
            {challenge.xp_reward_correct} XP
          </span>
        </div>

        {/* Title & Question */}
        <h2 className="text-2xl font-bold text-white mb-4">{challenge.title}</h2>
        <p className="text-white/80 text-lg mb-8 leading-relaxed">{challenge.question}</p>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {options.map((option, index) => {
            const label = optionLabels[index];
            const isSelected = selectedOption === label;
            const isCorrect = result && option.is_correct;
            const isWrong = result && isSelected && !option.is_correct;

            return (
              <button
                key={index}
                onClick={() => !isSubmitted && setSelectedOption(label)}
                disabled={isSubmitted}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                  ${isSubmitted && isCorrect ? 'bg-green-500/20 border-green-400' : ''}
                  ${isWrong ? 'bg-red-500/20 border-red-400' : ''}
                  ${!isSubmitted && isSelected ? 'bg-[#00d4ff]/20 border-[#00d4ff]' : ''}
                  ${!isSubmitted && !isSelected ? 'bg-white/5 border-white/10 hover:bg-white/10' : ''}
                  ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold text-xl w-8">{label}</span>
                  <span className="text-white flex-1">{option.text}</span>
                  {isSubmitted && isCorrect && <CheckCircle className="w-6 h-6 text-green-400" />}
                  {isWrong && <XCircle className="w-6 h-6 text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit / Continue Button */}
        {!isSubmitted ? (
          <button
            onClick={() => handleSubmit()}
            disabled={!selectedOption}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-4">
            {result && !result.is_correct && result.correct_answer && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/70 text-sm mb-1">Correct Answer:</p>
                <p className="text-white font-semibold">{result.correct_answer}</p>
              </div>
            )}
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg hover:scale-105 transition-transform"
            >
              Next Challenge 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
