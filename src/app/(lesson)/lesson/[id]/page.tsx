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
  const [allLessons, setAllLessons] = useState<any[]>([]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/lessons/${lessonId}`);
        const lessonData = response.data.data;
        setLesson(lessonData);

        // Default to text mode (user can toggle to video)
        setContentMode('text');

        // Fetch all lessons for navigation
        if (lessonData.tech_stack) {
          try {
            const roadmapRes = await api.get(`/progress/roadmap/${lessonData.tech_stack}`);
            const roadmapData = roadmapRes.data?.data || roadmapRes.data;
            
            // Flatten lessons from all chapters
            const flatLessons: any[] = [];
            if (roadmapData.chapters) {
              roadmapData.chapters.forEach((chapter: any) => {
                if (chapter.lessons) {
                  chapter.lessons.forEach((lesson: any) => {
                    flatLessons.push({
                      id: lesson.id,
                      title: lesson.title,
                      order_index: lesson.order_index,
                      is_completed: lesson.is_completed,
                    });
                  });
                }
              });
            }
            flatLessons.sort((a, b) => a.order_index - b.order_index);
            setAllLessons(flatLessons);
          } catch (error) {
            console.error('Failed to fetch lesson navigation:', error);
          }
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

  const handleLessonComplete = async () => {
    try {
      // Mark lesson as complete on backend
      await api.post(`/progress/mark-complete/${lessonId}`, {
        score: 100 // For theory lessons, always 100%
      });

      // Show success message (XP will be awarded by backend)
      // Find next lesson
      const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
      if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        window.location.href = `/lesson/${nextLesson.id}`;
      } else {
        // No more lessons, return to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Failed to mark lesson complete:', error);
      alert('Failed to save progress. Please try again.');
    }
  };

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
          allLessons={allLessons}
        />
      </header>
      
      <main className={`lesson-content ${isContentCollapsed ? 'content-collapsed' : ''} ${lesson.type === 'THEORY' ? 'theory-mode' : ''}`}>
        <ContentPanel
          lesson={lesson}
          mode={contentMode}
          isCollapsed={isContentCollapsed}
        />
        <EditorPanel 
          lesson={lesson}
          onLessonComplete={handleLessonComplete}
        />
      </main>
    </div>
  );
}

