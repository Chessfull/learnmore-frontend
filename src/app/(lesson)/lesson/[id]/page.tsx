'use client';

import { ContentPanel } from '@/components/lesson/ContentPanel';
import { EditorPanel } from '@/components/lesson/EditorPanel';
import { LessonControls } from '@/components/lesson/LessonControls';
import { ReturnButton } from '@/components/lesson/ReturnButton';
import { SpaceLoading } from '@/components/ui/SpaceLoading';
import api from '@/lib/api';
import type { Lesson } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentMode, setContentMode] = useState<'video' | 'text'>('text');
  const [isContentCollapsed, setIsContentCollapsed] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/lessons/${lessonId}`);
        setLesson(response.data.data);

        // Default to video mode if video URL exists
        if (response.data.data.video_url) {
          setContentMode('video');
        }
      } catch (err: any) {
        console.error('Failed to fetch lesson:', err);
        setError(err.response?.data?.message || 'Failed to load lesson');
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  if (isLoading) {
    return <SpaceLoading fullScreen message="Loading lesson data..." />;
  }

  if (error || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-[#0a0f1c] to-[#1a1f3c]">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error || 'Lesson not found'}
          </p>
          <ReturnButton />
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <header className="lesson-header">
        <ReturnButton />
        <LessonControls
          lesson={lesson}
          contentMode={contentMode}
          onContentModeChange={setContentMode}
          isContentCollapsed={isContentCollapsed}
          onToggleCollapse={() => setIsContentCollapsed(!isContentCollapsed)}
        />
      </header>
      
      <main className={`lesson-content ${isContentCollapsed ? 'content-collapsed' : ''}`}>
        <ContentPanel
          lesson={lesson}
          mode={contentMode}
          isCollapsed={isContentCollapsed}
        />
        <EditorPanel lesson={lesson} />
      </main>
    </div>
  );
}

