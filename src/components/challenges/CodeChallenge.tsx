'use client';

import api from '@/lib/api';
import { CheckCircle, Play, Timer } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CodeEditor = dynamic(() => import('@monaco-editor/react').then(mod => ({ default: mod.Editor })), { ssr: false });

interface CodeChallengeProps {
  challenge: any;
  onComplete: () => void;
}

export function CodeChallenge({ challenge, onComplete }: CodeChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(challenge.time_limit);
  const [code, setCode] = useState(challenge.starter_code || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [showHints, setShowHints] = useState(false);

  const hints: string[] = challenge.hints ? JSON.parse(challenge.hints) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !isSubmitted) {
          handleSubmit(); // Auto-submit when time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await api.post('/challenges/submit', {
        challenge_id: challenge.id,
        answer: code,
        time_taken: timeTaken,
      });

      const resultData = response.data?.data || response.data;
      setResult(resultData);
      
      if (resultData.is_correct) {
        toast.success(`All tests passed! +${resultData.xp_earned} XP! 🎉`);
      } else {
        toast.error(`Some tests failed! +${resultData.xp_earned} XP for trying!`);
      }
    } catch (error) {
      toast.error('Failed to submit code');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen pt-20 pb-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{challenge.title}</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] text-sm font-semibold">
              {challenge.difficulty}
            </span>
            <span className="text-white/70 text-sm">{challenge.xp_reward_correct} XP</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <Timer className="w-5 h-5 text-[#00d4ff]" />
            <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-bold hover:scale-105 transition-transform"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Left Panel - Instructions */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4">📝 Challenge Description</h3>
          <p className="text-white/80 leading-relaxed mb-6">{challenge.question}</p>

          {/* Hints */}
          {hints.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-[#00d4ff] hover:text-[#00b8e6] font-semibold mb-2"
              >
                💡 {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              {showHints && (
                <ul className="space-y-2">
                  {hints.map((hint, index) => (
                    <li key={index} className="text-white/70 text-sm">
                      • {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Test Results */}
          {result && result.test_results && (
            <div className="mt-6">
              <h4 className="text-lg font-bold text-white mb-3">🧪 Test Results</h4>
              <div className="space-y-2">
                {JSON.parse(result.test_results).map((test: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      test.passed ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className={`w-4 h-4 ${test.passed ? 'text-green-400' : 'text-red-400'}`} />
                      <span className="text-white font-semibold text-sm">
                        Test {index + 1}: {test.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <div className="text-white/70 text-xs">
                      <div>Input: {test.input}</div>
                      <div>Expected: {test.expected}</div>
                      {!test.passed && test.actual && <div>Got: {test.actual}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          {isSubmitted && (
            <button
              onClick={onComplete}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:scale-105 transition-transform"
            >
              Next Challenge 🚀
            </button>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="rounded-2xl bg-[#1e1e1e] border border-white/10 overflow-hidden">
          <CodeEditor
            height="100%"
            defaultLanguage={challenge.tech_stack.toLowerCase()}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              readOnly: isSubmitted,
            }}
          />
        </div>
      </div>
    </div>
  );
}
