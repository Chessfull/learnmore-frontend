'use client';

import api from '@/lib/api';
import type { Lesson } from '@/types';
import { Lightbulb, Play, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { OutputConsole } from './OutputConsole';

interface CodeEditorPanelProps {
  lesson: Lesson;
}

export function CodeEditorPanel({ lesson }: CodeEditorPanelProps) {
  const router = useRouter();
  const [code, setCode] = useState(lesson.starter_code || '');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'idle' | 'run' | 'submit'>('idle');
  const [showHints, setShowHints] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

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
        setXpEarned(result.xp_earned || lesson.xp_reward);
        setOutput(`✅ All tests passed! You earned ${result.xp_earned || lesson.xp_reward} XP!`);
        
        // Show success for 2 seconds, then optionally navigate to next lesson
        setTimeout(() => {
          // Could add "Next Lesson" button or auto-navigate
        }, 2000);
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
    <div className="editor-panel">
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs text-white/50 font-mono">{lesson.title}.{getLanguage()}</span>
        </div>
        
        {lesson.hints && lesson.hints.length > 0 && (
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            Hints ({lesson.hints.length})
          </button>
        )}
      </div>

      {/* Hints Panel */}
      {showHints && lesson.hints && (
        <div className="px-4 py-3 bg-[#f59e0b]/10 border-b border-[#f59e0b]/20">
          <h4 className="text-sm font-semibold text-[#f59e0b] mb-2">💡 Hints:</h4>
          <ul className="space-y-1">
            {lesson.hints.map((hint, index) => (
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
  );
}

