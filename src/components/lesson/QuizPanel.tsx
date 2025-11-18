'use client';

import type { Lesson } from '@/types';
import { CheckCircle, Send, XCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizPanelProps {
  lesson: Lesson;
}

export function QuizPanel({ lesson }: QuizPanelProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock quiz data - in real app, this would come from lesson.quiz_data
  const quizData = {
    question: lesson.theory_content || 'What is the correct answer?',
    options: [
      'Option A - First answer',
      'Option B - Second answer',
      'Option C - Third answer',
      'Option D - Fourth answer',
    ],
    correctAnswer: 0, // Index of correct answer
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    try {
      setIsSubmitting(true);

      // In real app, submit to backend
      // const response = await api.post('/lessons/quiz/submit', {
      //   lesson_id: lesson.id,
      //   answer: selectedAnswer,
      // });

      // Mock validation
      const correct = selectedAnswer === quizData.correctAnswer;
      setIsCorrect(correct);
      setIsSubmitted(true);

      if (correct) {
        setFeedback(`✅ Correct! You earned ${lesson.xp_reward} XP!`);
      } else {
        setFeedback('❌ Incorrect. Please try again!');
      }
    } catch (error: any) {
      console.error('Failed to submit quiz:', error);
      setFeedback(`Error: ${error.response?.data?.message || 'Failed to submit answer'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback('');
  };

  return (
    <div className="editor-panel quiz-panel">
      <div className="flex flex-col h-full">
        {/* Quiz Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Quiz Time! 🎯</h3>
          <p className="text-sm text-white/60">Select the correct answer and submit.</p>
        </div>

        {/* Quiz Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-white leading-relaxed">{quizData.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {quizData.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const showResult = isSubmitted;
              const isCorrectAnswer = index === quizData.correctAnswer;
              
              let optionClass = 'quiz-option';
              if (isSelected) optionClass += ' selected';
              if (showResult && isSelected && !isCorrect) optionClass += ' incorrect';
              if (showResult && isCorrectAnswer) optionClass += ' correct';

              return (
                <button
                  key={index}
                  onClick={() => !isSubmitted && setSelectedAnswer(index)}
                  disabled={isSubmitted}
                  className={optionClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="quiz-radio">
                      {showResult && isCorrectAnswer && <CheckCircle className="w-4 h-4" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                      {(!showResult || (!isCorrectAnswer && !isSelected)) && (
                        <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                      )}
                    </div>
                    <span className="flex-1 text-left">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg border ${
              isCorrect
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <p className="font-medium">{feedback}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff] hover:bg-[#00b8ff] text-[#0a0f1c] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          ) : (
            <>
              {!isCorrect && (
                <button
                  onClick={handleRetry}
                  className="flex-1 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200"
                >
                  Try Again
                </button>
              )}
              {isCorrect && (
                <button
                  onClick={() => {/* Navigate to next lesson */}}
                  className="flex-1 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-200"
                >
                  Next Lesson →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

