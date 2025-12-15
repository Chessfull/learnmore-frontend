'use client';

import api from '@/lib/api';
import type { Lesson } from '@/types';
import { Lightbulb, Play, Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CodeEditor } from './CodeEditor';
import { OutputConsole } from './OutputConsole';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface CodeEditorPanelProps {
  lesson: Lesson;
  onLessonComplete?: () => void;
}

export function CodeEditorPanel({ lesson, onLessonComplete }: CodeEditorPanelProps) {
  const router = useRouter();
  const [code, setCode] = useState(lesson.starter_code || '');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'idle' | 'run' | 'submit'>('idle');
  const [showHints, setShowHints] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  
  // Parse hints from JSON string to array
  const parsedHints = (() => {
    if (!lesson.hints) return [];
    if (Array.isArray(lesson.hints)) return lesson.hints; // Already an array
    try {
      const parsed = JSON.parse(lesson.hints);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse hints:', error);
      return [];
    }
  })();

  const getLanguage = () => {
    const langMap: Record<string, string> = {
      'GO': 'go',
      'PYTHON': 'python',
      'JAVASCRIPT': 'javascript',
      'NODEJS': 'javascript',
      'JAVA': 'java',
      'CSHARP': 'csharp',
    };
    return langMap[lesson.tech_stack] || 'javascript';
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setMode('run');
      setOutput('Running your code...');
      setTestResults([]);

      const response = await api.post('/code-execution/run', {
        lesson_id: lesson.id,
        code: code,
        language: getLanguage(),
      });

      const result = response.data.data;
      setOutput(result.output || result.error || 'Code executed successfully');
    } catch (error: any) {
      console.error('Failed to run code:', error);
      setOutput(`Error: ${error.response?.data?.message || 'Failed to execute code'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setMode('submit');
      setOutput('Testing your solution...');
      setTestResults([]);

      const response = await api.post('/code-execution/submit', {
        lesson_id: lesson.id,
        code: code,
        language: getLanguage(),
      });

      const result = response.data.data;
      setTestResults(result.test_results || []);
      
      if (result.status === 'SUCCESS') {
        const xp = result.xp_earned || lesson.xp_reward;
        setOutput(`✅ All tests passed! You earned ${xp} XP!`);
        
        // Load and show fireworks animation
        try {
          const response = await fetch('/animations/correct-answer.json');
          const animData = await response.json();
          setAnimationData(animData);
          setShowFireworks(true);
          
          // Show success toast
          toast.success(`🎉 +${xp} XP Earned!`, {
            duration: 3000,
            position: 'top-center',
            style: {
              background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
            },
          });
          
          // Hide animation after 3 seconds and navigate to next lesson
          setTimeout(() => {
            setShowFireworks(false);
            if (onLessonComplete) {
              onLessonComplete();
            } else {
              router.push('/dashboard');
            }
          }, 3000);
        } catch (error) {
          console.error('Failed to load animation:', error);
          toast.success(`🎉 +${xp} XP Earned!`, { duration: 3000 });
          setTimeout(() => {
            if (onLessonComplete) {
              onLessonComplete();
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        }
      } else {
        setOutput(`❌ ${result.tests_passed}/${result.tests_total} tests passed. Keep trying!`);
      }
    } catch (error: any) {
      console.error('Failed to submit code:', error);
      setOutput(`Error: ${error.response?.data?.message || 'Failed to submit code'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Fireworks Animation Overlay */}
      {showFireworks && animationData && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full max-w-2xl max-h-2xl">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
            />
          </div>
        </div>
      )}

      <div className="editor-panel">
        {/* Editor Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs text-white/50 font-mono">{lesson.title}.{getLanguage()}</span>
        </div>
        
        {parsedHints.length > 0 && (
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            Hints ({parsedHints.length})
          </button>
        )}
      </div>

      {/* Hints Panel */}
      {showHints && parsedHints.length > 0 && (
        <div className="px-4 py-3 bg-[#f59e0b]/10 border-b border-[#f59e0b]/20">
          <h4 className="text-sm font-semibold text-[#f59e0b] mb-2">💡 Hints:</h4>
          <ul className="space-y-1">
            {parsedHints.map((hint, index) => (
              <li key={index} className="text-xs text-white/70">
                {index + 1}. {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Editor */}
      <div className="editor-wrapper">
        <CodeEditor
          language={getLanguage()}
          value={code}
          onChange={setCode}
        />
      </div>

      {/* Action Buttons */}
      <div className="editor-actions">
        <button
          onClick={handleRun}
          disabled={isRunning || isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isRunning || isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff] hover:bg-[#00b8ff] text-[#0a0f1c] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </div>

      {/* Output Console */}
      <OutputConsole
        output={output}
        testResults={testResults}
        mode={mode}
      />
      </div>
    </>
  );
}

