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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
          
          {/* Show description below video */}
          {lesson.description && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-sm font-semibold text-[#00d4ff] mb-2">About this lesson</h3>
              <p className="text-white/70 text-sm leading-relaxed">{lesson.description}</p>
            </div>
          )}
        </div>
      ) : (
        <MarkdownContent content={lesson.theory_content || ''} />
      )}
    </div>
  );
}

