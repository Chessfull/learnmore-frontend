'use client';

import type { Lesson } from '@/types';
import { CodeEditorPanel } from './CodeEditorPanel';
import { QuizPanel } from './QuizPanel';

interface EditorPanelProps {
  lesson: Lesson;
}

export function EditorPanel({ lesson }: EditorPanelProps) {
  if (lesson.type === 'QUIZ') {
    return <QuizPanel lesson={lesson} />;
  }

  return <CodeEditorPanel lesson={lesson} />;
}

