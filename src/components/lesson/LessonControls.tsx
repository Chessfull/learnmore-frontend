'use client';

import api from '@/lib/api';
import type { Lesson } from '@/types';
import { ChevronDown, ChevronLeft, ChevronRight, FileText, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LessonControlsProps {
  lesson: Lesson;
  contentMode: 'video' | 'text';
  onContentModeChange: (mode: 'video' | 'text') => void;
  isContentCollapsed: boolean;
  onToggleCollapse: () => void;
  allLessons?: any[];
}

export function LessonControls({ 
  lesson, 
  contentMode, 
  onContentModeChange,
  isContentCollapsed,
  onToggleCollapse,
  allLessons: propAllLessons = []
}: LessonControlsProps) {
  const router = useRouter();
  const [chaptersWithLessons, setChaptersWithLessons] = useState<any[]>([]);
  const [allLessons, setAllLessons] = useState<any[]>(propAllLessons);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    if (propAllLessons.length > 0) {
      setAllLessons(propAllLessons);
      const currentIndex = propAllLessons.findIndex((l: any) => l.id === lesson.id);
      setCurrentLessonIndex(currentIndex);
    }
  }, [propAllLessons, lesson.id]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/tech-stacks/${lesson.tech_stack}/chapters`);
        const chapters = response.data.data || [];
        
        // Fetch lessons for each chapter
        const chaptersWithData = await Promise.all(
          chapters.map(async (chapter: any) => {
            try {
              const lessonsRes = await api.get(`/chapters/${chapter.id}/lessons`);
              const chapterData = lessonsRes.data.data || lessonsRes.data;
              return {
                ...chapter,
                lessons: chapterData.lessons || [],
              };
            } catch (error) {
              console.error(`Failed to fetch lessons for chapter ${chapter.id}:`, error);
              return {
                ...chapter,
                lessons: [],
              };
            }
          })
        );
        
        setChaptersWithLessons(chaptersWithData);
        
        // Only set allLessons if not provided by prop
        if (propAllLessons.length === 0) {
          const flatLessons = chaptersWithData.flatMap((ch: any) => ch.lessons);
          setAllLessons(flatLessons);
          
          // Find current lesson index
          const currentIndex = flatLessons.findIndex((l: any) => l.id === lesson.id);
          setCurrentLessonIndex(currentIndex);
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    };

    fetchChapters();
  }, [lesson.tech_stack, lesson.id, propAllLessons.length]);

  const hasVideo = Boolean(lesson.video_url);

  const handleLessonChange = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
    setIsDropdownOpen(false);
  };

  const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1;
  const hasPrevLesson = currentLessonIndex > 0;

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      router.push(`/lesson/${prevLesson.id}`);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Content Panel Toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
        title={isContentCollapsed ? 'Show lesson content' : 'Hide lesson content'}
      >
        {isContentCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Video/Text Toggle */}
      {hasVideo && !isContentCollapsed && (
        <div className="toggle-group">
          <button
            onClick={() => onContentModeChange('video')}
            className={`toggle-btn ${contentMode === 'video' ? 'active' : ''}`}
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => onContentModeChange('text')}
            className={`toggle-btn ${contentMode === 'text' ? 'active' : ''}`}
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lesson Dropdown */}
      <div className="relative flex-1 max-w-md">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
        >
          <span className="flex-1 truncate text-left text-xs md:text-sm">{lesson.title}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-[#0a0f1c]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
              {chaptersWithLessons.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border-b border-white/5 last:border-0">
                  <div className="px-4 py-3 bg-white/5 text-xs font-semibold text-[#00d4ff] uppercase tracking-wider">
                    Chapter {chapterIndex + 1}: {chapter.title}
                  </div>
                  {chapter.lessons && chapter.lessons.length > 0 ? (
                    chapter.lessons.map((chapterLesson: any, lessonIndex: number) => (
                      <button
                        key={chapterLesson.id}
                        onClick={() => handleLessonChange(chapterLesson.id)}
                        className={`w-full px-6 py-2.5 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${
                          chapterLesson.id === lesson.id ? 'bg-[#00d4ff]/10 text-[#00d4ff] font-medium' : 'text-white/70'
                        }`}
                      >
                        <span className="text-xs text-white/40">{lessonIndex + 1}.</span>
                        <span className="flex-1">{chapterLesson.title}</span>
                        {chapterLesson.is_completed && (
                          <span className="text-[#00ff88] text-xs">✓</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-2 text-xs text-white/40">No lessons yet</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Previous Lesson Button */}
      <button
        onClick={handlePrevLesson}
        disabled={!hasPrevLesson}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Previous lesson"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next Lesson Button */}
      <button
        onClick={handleNextLesson}
        disabled={!hasNextLesson}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Next lesson"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

