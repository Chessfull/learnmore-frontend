'use client';

import api from '@/lib/api';
import type { Lesson } from '@/types';
import { ChevronDown, FileText, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LessonControlsProps {
  lesson: Lesson;
  contentMode: 'video' | 'text';
  onContentModeChange: (mode: 'video' | 'text') => void;
}

export function LessonControls({ lesson, contentMode, onContentModeChange }: LessonControlsProps) {
  const router = useRouter();
  const [chaptersWithLessons, setChaptersWithLessons] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/tech-stacks/${lesson.tech_stack}/chapters`);
        setChaptersWithLessons(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    };

    fetchChapters();
  }, [lesson.tech_stack]);

  const hasVideo = Boolean(lesson.video_url);

  const handleLessonChange = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Video/Text Toggle */}
      {hasVideo && (
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
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all duration-200 min-w-[200px]"
        >
          <span className="flex-1 truncate text-left text-sm">{lesson.title}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#1a1f3c]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50">
            {chaptersWithLessons.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="border-b border-white/5 last:border-0">
                <div className="px-4 py-2 text-xs font-semibold text-[#00d4ff] uppercase tracking-wider">
                  {chapterIndex + 1}. {chapter.title}
                </div>
                {chapter.lessons?.map((chapterLesson: any, lessonIndex: number) => (
                  <button
                    key={chapterLesson.id}
                    onClick={() => handleLessonChange(chapterLesson.id)}
                    className={`w-full px-6 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                      chapterLesson.id === lesson.id ? 'bg-[#00d4ff]/10 text-[#00d4ff]' : 'text-white/70'
                    }`}
                  >
                    <span className="text-xs text-white/40 mr-2">{lessonIndex + 1}.</span>
                    {chapterLesson.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

