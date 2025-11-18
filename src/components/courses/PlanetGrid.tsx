'use client';

import { SpaceLoading } from '@/components/ui/SpaceLoading';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Planet } from './Planet';
import { RoadmapPreview } from './RoadmapPreview';

interface TechStack {
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  order_index: number;
}

export function PlanetGrid() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });

  // Planet positions (organic layout)
  const planetPositions = [
    { top: '10%', left: '15%' },
    { top: '8%', left: '55%' },
    { top: '45%', left: '75%' },
    { top: '65%', left: '25%' },
    { top: '58%', left: '60%' },
  ];

  useEffect(() => {
    const fetchTechStacks = async () => {
      try {
        const response = await api.get('/tech-stacks');
        setTechStacks(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch tech stacks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechStacks();
  }, []);

  const handlePlanetClick = async (techStack: TechStack) => {
    try {
      // Check if user has progress in this tech stack
      const resumeResponse = await api.get('/progress/resume');
      const resumeData = resumeResponse.data.data;
  
      if (resumeData && resumeData.tech_stack === techStack.name) {
        // Resume from last lesson
        router.push(`/lesson/${resumeData.lesson_id}`);
      } else {
        // Get chapters first
        const chaptersResponse = await api.get(`/tech-stacks/${techStack.name}/chapters`);
        const chapters = chaptersResponse.data.data;
  
        if (chapters && chapters.length > 0) {
          // Get lessons for the first chapter (AYRI ENDPOINT!)
          const lessonsResponse = await api.get(`/chapters/${chapters[0].id}/lessons`);
          const chapterWithLessons = lessonsResponse.data.data;
          
          if (chapterWithLessons.lessons && chapterWithLessons.lessons.length > 0) {
            const firstLesson = chapterWithLessons.lessons[0];
            router.push(`/lesson/${firstLesson.id}`);
          } else {
            console.error('No lessons available for this chapter');
          }
        } else {
          console.error('No chapters available for this tech stack');
        }
      }
    } catch (error) {
      console.error('Failed to navigate to lesson:', error);
    }
  };

  const handlePlanetHover = (techStack: string, hovered: boolean, element?: HTMLElement) => {
    if (hovered && element) {
      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        // Calculate position relative to container
        const relativeTop = rect.top - containerRect.top;
        const relativeLeft = rect.left - containerRect.left;
        
        // Check space on right side
        const spaceOnRight = containerRect.width - (relativeLeft + rect.width);
        
        // Position preview: right side if space available, otherwise left side
        const previewWidth = 320;
        const gap = 20;
        
        let left: number;
        if (spaceOnRight > previewWidth + gap) {
          // Show on right
          left = relativeLeft + rect.width + gap;
        } else {
          // Show on left
          left = Math.max(gap, relativeLeft - previewWidth - gap);
        }
        
        // Center vertically with the planet
        const top = Math.max(gap, relativeTop - 50);

        setPreviewPosition({ top, left });
        setHoveredPlanet(techStack);
      }
    } else {
      setHoveredPlanet(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <SpaceLoading message="Scanning the cosmos for programming languages..." />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="planet-grid-container">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Planets */}
      {techStacks.map((techStack, index) => (
        <Planet
          key={techStack.name}
          techStack={techStack}
          position={planetPositions[index % planetPositions.length]}
          animationDelay={index}
          onClick={() => handlePlanetClick(techStack)}
          onHover={(hovered, element) => handlePlanetHover(techStack.name, hovered, element)}
        />
      ))}

      {/* Roadmap Preview */}
      {hoveredPlanet && (
        <RoadmapPreview
          techStack={hoveredPlanet}
          position={previewPosition}
          onClose={() => setHoveredPlanet(null)}
        />
      )}
    </div>
  );
}

