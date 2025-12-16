'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import api from '@/lib/api';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NoProgressState } from './NoProgressState';

interface Chapter {
  chapter_id: string;
  chapter_name: string;
  chapter_order: number;
  completed_lessons: number;
  total_lessons: number;
  lessons: Array<{
    id: string;
    title: string;
    order_index: number;
    is_completed: boolean;
  }>;
}

interface ResumeData {
  tech_stack: string;
  chapter_id: string;
  order_index: number;
  lesson: {
    id: string;
    title: string;
    order_index: number;
    chapter_id: string;
  };
}

interface RoadmapData {
  tech_stack: string;
  chapters: Chapter[];
  current_chapter_id: string;
  current_lesson_id: string;
  current_lesson_title: string;
}

export function ChapterRoadmap() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        // Check if user has any progress
        const resumeResponse = await api.get('/progress/resume');
        const resumeData: ResumeData = resumeResponse.data?.data || resumeResponse.data;

        console.log('📍 Resume data received:', resumeData); // Debug log

        if (!resumeData || !resumeData.lesson || !resumeData.tech_stack) {
          console.log('❌ No progress - showing Begin Journey');
          setHasProgress(false);
          setIsLoading(false);
          return;
        }

        setHasProgress(true);

        // Fetch roadmap for the tech stack
        const roadmapResponse = await api.get(`/progress/roadmap/${resumeData.tech_stack}`);
        const roadmapDataResponse = roadmapResponse.data?.data || roadmapResponse.data;

        console.log('🗺️ Roadmap data received:', roadmapDataResponse); // Debug log

        // Use chapter_id from either the direct field or from lesson
        const chapterId = resumeData.chapter_id || resumeData.lesson.chapter_id;

        setRoadmapData({
          tech_stack: resumeData.tech_stack,
          chapters: roadmapDataResponse.chapters || [],
          current_chapter_id: chapterId,
          current_lesson_id: resumeData.lesson.id,
          current_lesson_title: resumeData.lesson.title,
        });

        console.log('✅ Roadmap state set, scrolling to chapter:', chapterId); // Debug log

        // Scroll to current chapter after data loads
        setTimeout(() => scrollToCurrentChapter(chapterId), 300);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
        setHasProgress(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const scrollToCurrentChapter = (chapterId: string) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const currentNode = container.querySelector<HTMLElement>(`[data-chapter-id="${chapterId}"]`);
    
    if (currentNode) {
      currentNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newPosition =
        scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    // Navigate to the first incomplete lesson in the chapter, or first lesson if all complete
    const targetLesson = chapter.lessons.find(l => !l.is_completed) || chapter.lessons[0];
    if (targetLesson) {
      router.push(`/lesson/${targetLesson.id}`);
    }
  };

  const getChapterStatus = (chapter: Chapter, currentChapterId: string): 'completed' | 'current' | 'available' => {
    if (chapter.chapter_id === currentChapterId) return 'current';
    if (chapter.completed_lessons === chapter.total_lessons && chapter.total_lessons > 0) return 'completed';
    return 'available'; // All chapters are available (no lock system)
  };

  const getPlanetImage = (techStack: string): string => {
    const stackMap: { [key: string]: string } = {
      'GO': '/images/planets/go-planet.png',
      'PYTHON': '/images/planets/python-planet.png',
      'JAVA': '/images/planets/java-planet.png',
      'NODEJS': '/images/planets/nodejs-planet.png',
    };
    return stackMap[techStack] || '/images/planets/go-planet.png';
  };

  const getPlanetTheme = (techStack: string) => {
    const themes: { [key: string]: { primary: string; secondary: string; glow: string; name: string } } = {
      'GO': {
        primary: '#00d4ff',
        secondary: '#0099cc',
        glow: 'rgba(0, 212, 255, 0.4)',
        name: 'Go'
      },
      'PYTHON': {
        primary: '#ffd43b',
        secondary: '#306998',
        glow: 'rgba(255, 212, 59, 0.4)',
        name: 'Python'
      },
      'JAVA': {
        primary: '#f89820',
        secondary: '#5382a1',
        glow: 'rgba(248, 152, 32, 0.4)',
        name: 'Java'
      },
      'NODEJS': {
        primary: '#68a063',
        secondary: '#303030',
        glow: 'rgba(104, 160, 99, 0.4)',
        name: 'Node.js'
      },
    };
    return themes[techStack] || themes['GO'];
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

  const currentChapter = roadmapData?.chapters.find(c => c.chapter_id === roadmapData.current_chapter_id);
  const techStackDisplay = roadmapData?.tech_stack
    ? roadmapData.tech_stack.split('_').map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')
    : 'Unknown';
  
  const planetTheme = getPlanetTheme(roadmapData?.tech_stack || 'GO');
  const planetImage = getPlanetImage(roadmapData?.tech_stack || 'GO');

  return (
    <GlassCard padding="none" glow="purple" className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Giant Background Planet - Moved to upper right, static, less opacity */}
      <div className="absolute right-[5%] top-[8%] w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] opacity-15 pointer-events-none z-0">
        <Image
          src={planetImage}
          alt="Background planet"
          fill
          sizes="400px"
          className="object-contain"
          style={{ filter: `drop-shadow(0 0 60px ${planetTheme.glow})` }}
        />
      </div>

      {/* Atmospheric Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${planetTheme.glow}, transparent 50%)`
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 p-6 lg:p-8 flex flex-col h-full">
        {/* Tech Stack Badge - Top Left */}
        <div className="absolute top-6 left-6 z-20">
          <div 
            className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-xl border-2 shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${planetTheme.primary}15, ${planetTheme.secondary}10)`,
              borderColor: planetTheme.primary,
              boxShadow: `0 0 30px ${planetTheme.glow}, inset 0 0 20px ${planetTheme.glow}`
            }}
          >
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src={planetImage}
                alt={`${planetTheme.name} icon`}
                fill
                sizes="40px"
                className="object-contain animate-[spin_15s_linear_infinite]"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">Current Mission</p>
              <h3 
                className="text-xl font-bold leading-tight"
                style={{ color: planetTheme.primary }}
              >
                {planetTheme.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Header - Continue Journey */}
        <div className="flex items-start justify-between mb-6 mt-20">
          <div
            className="group relative flex items-center gap-6 rounded-2xl bg-linear-to-r from-[#101b3a] via-[#141f3f] to-[#101b3a] px-6 py-4 border border-white/10 cursor-pointer transition-all hover:shadow-[0_0_50px_rgba(0,212,255,0.25)]"
            onClick={() => roadmapData && router.push(`/lesson/${roadmapData.current_lesson_id}`)}
            style={{
              borderColor: `${planetTheme.primary}40`,
              boxShadow: `0 0 40px ${planetTheme.glow}`
            }}
          >
            <div className="relative w-20 h-20 shrink-0">
              <div 
                className="absolute inset-0 rounded-full blur-xl group-hover:opacity-50 transition-opacity"
                style={{ backgroundColor: `${planetTheme.primary}40` }}
              />
              <Image
                src="/images/pilot-hands.png"
                alt="Pilot hands"
                fill
                sizes="80px"
                className="object-contain pointer-events-none select-none"
              />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50 font-medium">Continue Journey</p>
              <h2 className="text-2xl font-bold text-white mt-1">{currentChapter?.chapter_name}</h2>
              <p className="text-white/70 text-sm mt-1">
                Next stop: <span className="font-semibold" style={{ color: planetTheme.primary }}>{roadmapData?.current_lesson_title}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Space Map - Chapter Journey */}
        <div className="flex-1 relative">
          {/* Background Stars */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="space-stars" />
          </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:border-[#00d4ff]/60 hover:bg-[#0a162a] transition-all shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:border-[#00d4ff]/60 hover:bg-[#0a162a] transition-all shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Chapters Roadmap */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide h-full py-12 px-12 relative"
        >
          <div className="flex items-center gap-8 min-w-max relative h-full">
            {roadmapData?.chapters.map((chapter, index) => {
              const status = getChapterStatus(chapter, roadmapData.current_chapter_id);
              const isCurrent = status === 'current';
              const isCompleted = status === 'completed';
              const isAvailable = status === 'available';
              const progress = chapter.total_lessons > 0 
                ? Math.round((chapter.completed_lessons / chapter.total_lessons) * 100) 
                : 0;

              return (
                <div key={chapter.chapter_id} className="flex items-center gap-8">
                  {/* Chapter Node */}
                  <div
                    data-chapter-id={chapter.chapter_id}
                    onClick={() => handleChapterClick(chapter)}
                    className={`
                      relative flex flex-col items-center gap-3 cursor-pointer transition-all duration-300
                      ${isCurrent ? 'scale-110' : 'scale-100 hover:scale-105'}
                    `}
                  >
                    {/* Chapter Circle - Planet Texture */}
                    <div
                      className={`
                        relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden
                        transition-all duration-300 border-2
                        ${isCurrent 
                          ? `border-4 shadow-[0_0_40px]` 
                          : isCompleted
                          ? 'shadow-[0_0_30px_rgba(34,197,94,0.4)] border-green-400'
                          : 'border-white/20 hover:border-white/40'
                        }
                      `}
                      style={isCurrent ? {
                        borderColor: planetTheme.primary,
                        boxShadow: `0 0 40px ${planetTheme.glow}`
                      } : {}}
                    >
                      {/* Planet Texture Background */}
                      <div className="absolute inset-0">
                        <Image
                          src="/images/dashboard-planet-circle.png"
                          alt="Planet texture"
                          fill
                          sizes="96px"
                          className={`object-cover ${isCompleted ? 'brightness-125 saturate-150' : isAvailable ? 'brightness-90' : ''}`}
                        />
                        {/* Gradient Overlay */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: isCurrent 
                              ? `radial-gradient(circle at center, ${planetTheme.primary}40, ${planetTheme.secondary}60)`
                              : isCompleted
                              ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.4), rgba(16, 185, 129, 0.6))'
                              : 'radial-gradient(circle at center, rgba(100, 116, 139, 0.5), rgba(71, 85, 105, 0.7))'
                          }}
                        />
                      </div>

                      {/* Icon */}
                      <div className="relative z-10">
                        {isCompleted ? (
                          <Check className="w-10 h-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" strokeWidth={3} />
                        ) : (
                          <span className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{index + 1}</span>
                        )}
                      </div>

                      {/* Pulsing ring for current */}
                      {isCurrent && (
                        <>
                          <div 
                            className="absolute inset-0 rounded-full border-4 animate-pulse"
                            style={{ 
                              borderColor: planetTheme.primary,
                              boxShadow: `0 0 20px ${planetTheme.glow}`
                            }}
                          />
                          <div 
                            className="absolute inset-[-8px] rounded-full border-2 opacity-60"
                            style={{ 
                              borderColor: planetTheme.primary,
                              animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}
                          />
                        </>
                      )}
                    </div>

                    {/* Chapter Info */}
                    <div className="text-center max-w-[140px]">
                      <h3
                        className="font-semibold text-sm leading-tight mb-1"
                        style={{
                          color: isCurrent ? planetTheme.primary : isCompleted ? '#4ade80' : 'rgba(255,255,255,0.7)'
                        }}
                      >
                        {chapter.chapter_name}
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full transition-all duration-500"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: isCompleted ? '#4ade80' : isCurrent ? planetTheme.primary : '#6b7280'
                          }}
                        />
                      </div>
                      
                      <p className="text-xs text-white/50">
                        {chapter.completed_lessons}/{chapter.total_lessons} lessons
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < roadmapData.chapters.length - 1 && (
                    <div
                      className={`
                        h-1 w-12 transition-colors
                        ${isCompleted ? 'bg-linear-to-r from-green-400 to-gray-600' : 'bg-gray-700'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .space-stars {
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(1px 1px at 10% 20%, white, transparent),
            radial-gradient(2px 2px at 30% 50%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 60% 30%, white, transparent),
            radial-gradient(2px 2px at 80% 70%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 40% 80%, white, transparent);
          background-size: 300px 300px;
          animation: twinkle 6s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </GlassCard>
  );
}

