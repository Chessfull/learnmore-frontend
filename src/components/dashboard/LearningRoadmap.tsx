'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export function LearningRoadmap() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        // First, check if user has any progress
        const resumeResponse = await api.get('/progress/resume');
        const resumeData: ResumeData = resumeResponse.data.data;

        if (!resumeData || !resumeData.tech_stack) {
          // No progress yet
          setHasProgress(false);
          setIsLoading(false);
          return;
        }

        setHasProgress(true);

        // Fetch roadmap for the tech stack
        const roadmapResponse = await api.get(`/progress/roadmap/${resumeData.tech_stack}`);
        const lessons: Lesson[] = roadmapResponse.data.data || [];

        setRoadmapData({
          tech_stack: resumeData.tech_stack,
          lessons,
          current_lesson_index: resumeData.order_index,
        });

        // Scroll to current lesson after data loads
        setTimeout(() => scrollToCurrentLesson(), 300);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
        setHasProgress(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const scrollToCurrentLesson = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const centerPosition = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTo({ left: centerPosition, behavior: 'smooth' });
    }
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
  ): 'completed' | 'current' | 'upcoming' | 'locked' => {
    if (lesson.is_completed) return 'completed';
    if (lesson.order_index === currentIndex) return 'current';
    if (lesson.order_index < currentIndex) return 'completed';
    if (lesson.order_index === currentIndex + 1) return 'upcoming';
    return 'upcoming'; // Can change to 'locked' if you want to lock future lessons
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
    <GlassCard padding="lg" glow="purple">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          {techStackDisplay} - Continue Learning
        </h2>
      </div>

      {/* Roadmap Container */}
      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0a0f1c] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-[#0a0f1c] transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Scrollable Roadmap */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide py-12 px-12"
        >
          <div className="flex items-center gap-16 min-w-max">
            {visibleLessons.map((lesson, index) => (
              <RoadmapNode
                key={lesson.id}
                lesson={lesson}
                status={getLessonStatus(lesson, roadmapData?.current_lesson_index || 0)}
                onClick={() => handleLessonClick(lesson.id)}
                showConnector={index < visibleLessons.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

