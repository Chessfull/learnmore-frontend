'use client';

import type { Lesson } from '@/types';
import { MarkdownContent } from './MarkdownContent';

interface ContentPanelProps {
  lesson: Lesson;
  mode: 'video' | 'text';
  isCollapsed: boolean;
}

export function ContentPanel({ lesson, mode, isCollapsed }: ContentPanelProps) {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="content-panel">
      {mode === 'video' && lesson.video_url ? (
        <div className="video-wrapper">
          <div className="video-container">
            <iframe
              src={lesson.video_url}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        <MarkdownContent content={lesson.theory_content || ''} />
      )}
    </div>
  );
}

