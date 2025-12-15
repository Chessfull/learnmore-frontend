'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  is_locked: boolean;
}

interface Chapter {
  chapter_id: string;
  chapter_name: string;
  description: string;
  order_index: number;
  total_lessons: number;
  completed_lessons: number;
  progress: number;
  is_unlocked: boolean;
  lessons: Lesson[];
}

interface RoadmapPreviewProps {
  techStack: string;
  position: { top: number; left: number };
  onClose: () => void;
  onHover?: (hovered: boolean) => void;
}

export function RoadmapPreview({ techStack, position, onClose, onHover }: RoadmapPreviewProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        // Fetch roadmap with progress data
        const response = await api.get(`/progress/roadmap/${techStack}`);
        const roadmapData = response.data.data || response.data;
        const chaptersData = roadmapData.chapters || [];
        
        setChapters(chaptersData);
        
        // Calculate total lessons from total_lessons field
        const total = chaptersData.reduce(
          (sum: number, chapter: Chapter) => sum + (chapter.total_lessons || 0),
          0
        );
        setTotalLessons(total);
      } catch (error) {
        console.error('Failed to fetch roadmap preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [techStack]);

  const handleChapterClick = async (chapter: Chapter, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      // Use lessons from roadmap (already loaded)
      if (chapter.lessons && chapter.lessons.length > 0) {
        const firstLesson = chapter.lessons[0];
        if (firstLesson && firstLesson.id) {
          router.push(`/lesson/${firstLesson.id}`);
          onClose();
        } else {
          console.error('Lesson ID is missing');
        }
      } else {
        console.error('No lessons available for this chapter');
      }
    } catch (error) {
      console.error('Failed to navigate to chapter:', error);
    }
  };

  return (
    <div
      className="roadmap-preview"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <GlassCard padding="md" glow="cyan">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-2">Learning Roadmap</h3>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="w-6 h-6 mx-auto border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chapters.length === 0 ? (
          <div className="py-4 text-center text-white/50 text-sm">
            No chapters available yet
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {chapters.slice(0, 5).map((chapter: Chapter, index) => {
              const completedLessons = chapter.completed_lessons || 0;
              const totalLessons = chapter.total_lessons || 0;
              const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
              
              return (
                <button
                  key={chapter.chapter_id}
                  onClick={(e) => handleChapterClick(chapter, e)}
                  className="w-full flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <span className="text-[#00d4ff] font-semibold text-sm shrink-0">
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {chapter.chapter_name || 'Untitled Chapter'}
                      </p>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-white/50">
                      {completedLessons}/{totalLessons} lessons completed
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#00d4ff] shrink-0 mt-0.5 transition-colors" />
                </button>
              );
            })}
            {chapters.length > 5 && (
              <p className="text-xs text-white/40 text-center pt-2">
                +{chapters.length - 5} more chapters
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-center text-sm text-[#00d4ff] font-medium">
            Click planet to start your journey! 🚀
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

