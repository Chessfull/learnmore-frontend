'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Chapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lesson_count?: number;
}

interface RoadmapPreviewProps {
  techStack: string;
  position: { top: number; left: number };
  onClose: () => void;
  onHover?: (hovered: boolean) => void;
}

export function RoadmapPreview({ techStack, position, onClose, onHover }: RoadmapPreviewProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await api.get(`/tech-stacks/${techStack}/chapters`);
        const chaptersData = response.data.data || [];
        setChapters(chaptersData);
        
        // Calculate total lessons from lesson_count field
        const total = chaptersData.reduce(
          (sum: number, chapter: any) => sum + (chapter.lesson_count || 0),
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

  return (
    <div
      className="roadmap-preview"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={onClose}
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
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {chapters.slice(0, 5).map((chapter: any, index) => (
              <div
                key={chapter.id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-[#00d4ff] font-semibold text-sm shrink-0">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-white/50">
                    {chapter.lesson_count || 0} lessons
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
              </div>
            ))}
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

