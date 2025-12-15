'use client';

import type { Lesson } from '@/types';
import { CodeEditorPanel } from './CodeEditorPanel';
import { QuizPanel } from './QuizPanel';

interface EditorPanelProps {
  lesson: Lesson;
  onLessonComplete?: () => void;
}

export function EditorPanel({ lesson, onLessonComplete }: EditorPanelProps) {
  if (lesson.type === 'THEORY') {
    return (
      <div className="editor-panel flex items-center justify-center bg-[#0a0f1c]/50">
        <div className="text-center p-6 max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Theory Lesson</h3>
          <p className="text-white/70 text-sm mb-5">
            Review the content on the left to complete this lesson.
          </p>
          <button
            onClick={() => onLessonComplete?.()}
            className="px-6 py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Mark Complete & Continue →
          </button>
        </div>
      </div>
    );
  }

  if (lesson.type === 'QUIZ') {
    return <QuizPanel lesson={lesson} onComplete={onLessonComplete} />;
  }

  return <CodeEditorPanel lesson={lesson} onLessonComplete={onLessonComplete} />;
}

