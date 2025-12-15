'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NoProgressState } from './NoProgressState';
import { RoadmapNode } from './RoadmapNode';

interface Lesson {
  id: string;
  title: string;
  order_index: number;
  is_completed?: boolean;
}

interface ResumeData {
  tech_stack: string;
  chapter_id: string;
  lesson_id: string;
  lesson_title: string;
  order_index: number;
}

interface RoadmapData {
  tech_stack: string;
  lessons: Lesson[];
  current_lesson_index: number;
  current_lesson_id: string;
  current_lesson_title: string;
}

export function LearningRoadmap() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProgress, setHasProgress] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        // First, check if user has any progress
        const resumeResponse = await api.get('/progress/resume');
        const resumeData = resumeResponse.data?.data || resumeResponse.data;

        console.log('🔍 DEBUG - Full resume response:', resumeResponse); // Full response
        console.log('🔍 DEBUG - Parsed resume data:', resumeData); // Parsed data
        console.log('🔍 DEBUG - Has lesson?', !!resumeData?.lesson);
        console.log('🔍 DEBUG - Has tech_stack?', !!resumeData?.tech_stack);

        // Check if user has started any lesson
        // Backend returns null/empty lesson when no progress
        if (!resumeData || !resumeData.lesson || !resumeData.tech_stack) {
          console.log('❌ No progress found - showing Begin Journey');
          // No progress yet - show the "Begin Journey" state
          setHasProgress(false);
          setIsLoading(false);
          return;
        }

        console.log('✅ Progress found! Tech Stack:', resumeData.tech_stack);

        // User has progress - show the roadmap
        setHasProgress(true);

        // Fetch roadmap for the tech stack
        const roadmapResponse = await api.get(`/progress/roadmap/${resumeData.tech_stack}`);
        const roadmapDataResponse = roadmapResponse.data?.data || roadmapResponse.data;

        console.log('Roadmap data:', roadmapDataResponse); // Debug log

        // Flatten lessons from all chapters
        const allLessons: Lesson[] = [];
        if (roadmapDataResponse.chapters) {
          roadmapDataResponse.chapters.forEach((chapter: any) => {
            if (chapter.lessons) {
              chapter.lessons.forEach((lesson: any) => {
                allLessons.push({
                  id: lesson.id,
                  title: lesson.title,
                  order_index: lesson.order_index,
                  is_completed: lesson.is_completed,
                });
              });
            }
          });
        }

        // Sort lessons by order_index
        allLessons.sort((a, b) => a.order_index - b.order_index);

        // Find current lesson index from resume data
        const currentLessonOrderIndex = resumeData.order_index || resumeData.lesson.order_index || 0;

        const currentLessonId = resumeData.lesson.id;
        const currentLessonTitle = resumeData.lesson.title;

        setRoadmapData({
          tech_stack: resumeData.tech_stack,
          lessons: allLessons,
          current_lesson_index: currentLessonOrderIndex,
          current_lesson_id: currentLessonId,
          current_lesson_title: currentLessonTitle,
        });
        setCurrentLesson({
          id: currentLessonId,
          title: currentLessonTitle,
        });

        // Scroll to current lesson after data loads
        setTimeout(() => scrollToCurrentLesson(currentLessonId), 300);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
        // If there's an error, assume no progress
        setHasProgress(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const scrollToCurrentLesson = (lessonId?: string) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    if (lessonId) {
      const currentNode = container.querySelector<HTMLElement>(`[data-lesson-id="${lessonId}"]`);
      if (currentNode) {
        currentNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        return;
      }
    }
  useEffect(() => {
    if (hasProgress && currentLesson?.id) {
      scrollToCurrentLesson(currentLesson.id);
    }
  }, [currentLesson?.id, hasProgress]); 

    const centerPosition = (container.scrollWidth - container.clientWidth) / 2;
    container.scrollTo({ left: centerPosition, behavior: 'smooth' });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition =
        scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const getLessonStatus = (
    lesson: Lesson,
    currentIndex: number
  ): 'completed' | 'current' | 'upcoming' => {
    if (lesson.is_completed) return 'completed';
    if (lesson.order_index === currentIndex) return 'current';
    if (lesson.order_index < currentIndex) return 'completed';
    if (lesson.order_index === currentIndex + 1) return 'upcoming';
    return 'upcoming';
  };

  // Get visible lessons (3 before, current, 3 after)
  const getVisibleLessons = () => {
    if (!roadmapData) return [];
    
    const currentIdx = roadmapData.lessons.findIndex(
      (l) => l.order_index === roadmapData.current_lesson_index
    );
    
    if (currentIdx === -1) return roadmapData.lessons;

    // Return all lessons for scrolling, but center the current one
    return roadmapData.lessons;
  };

  if (isLoading) {
    return (
      <GlassCard padding="lg" glow="purple">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      </GlassCard>
    );
  }

  if (!hasProgress) {
    return <NoProgressState />;
  }

  const visibleLessons = getVisibleLessons();
  const techStackDisplay = roadmapData?.tech_stack
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <GlassCard padding="lg" glow="purple" className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div
          className="group relative flex items-center gap-6 rounded-2xl bg-linear-to-r from-[#101b3a] via-[#141f3f] to-[#101b3a] px-6 py-4 border border-white/10 shadow-[0_0_40px_rgba(0,212,255,0.15)] cursor-pointer transition-all hover:border-[#00d4ff]/40 hover:shadow-[0_0_50px_rgba(0,212,255,0.25)]"
          onClick={() => currentLesson?.id && router.push(`/lesson/${currentLesson.id}`)}
        >
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-[#00d4ff]/20 blur-xl group-hover:bg-[#00d4ff]/30 transition-colors" />
            <Image
              src="/images/pilot-hands.png"
              alt="Pilot hands"
              fill
              sizes="100px"
              className="object-contain pointer-events-none select-none"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Continue Journey</p>
            <h2 className="text-3xl font-semibold text-white mt-2">{techStackDisplay} Mission</h2>
            <p className="text-white/70 text-sm mt-1">
              Next stop: <span className="text-white font-semibold">{currentLesson?.title}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Container */}
      <div className="relative flex-1 flex items-center">
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="stars twinkle" />
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-[#070d1c]/70 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:border-[#00d4ff]/60 hover:bg-[#0a162a] transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-[#070d1c]/70 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:border-[#00d4ff]/60 hover:bg-[#0a162a] transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Scrollable Roadmap */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide py-16 px-16 relative"
        >
          <div className="flex items-center gap-12 min-w-max relative">
            {visibleLessons.map((lesson, index) => {
              const status = getLessonStatus(lesson, roadmapData?.current_lesson_index || 0);
              return (
                <div key={lesson.id} data-lesson-id={lesson.id}>
                  <RoadmapNode
                    lesson={lesson}
                    status={status}
                    onClick={() => handleLessonClick(lesson.id)}
                    showConnector={index < visibleLessons.length - 1}
                    isCurrent={status === 'current'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .stars {
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.5), transparent),
            radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.7), transparent);
          background-size: 200px 200px;
          animation: drift 20s linear infinite;
        }
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
      `}</style>
    </GlassCard>
  );
}

