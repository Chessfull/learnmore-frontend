'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

interface PlanetProps {
  techStack: {
    name: string;
    display_name: string;
    description: string;
    icon: string;
    color: string;
    order_index: number;
  };
  position: { top: string; left: string };
  animationDelay: number;
  onClick: () => void;
  onHover: (hovered: boolean, element?: HTMLElement) => void;
}

export function Planet({ techStack, position, animationDelay, onClick, onHover }: PlanetProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onHover(true, e.currentTarget);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  // Map tech stack name to planet image
  const getPlanetImage = (name: string) => {
    const imageMap: Record<string, string> = {
      'GO': '/images/planets/go-planet.png',
      'PYTHON': '/images/planets/python-planet.png',
      'JAVA': '/images/planets/java-planet.png',
      'CSHARP': '/images/planets/csharp-planet.png',
      'NODEJS': '/images/planets/nodejs-planet.png',
    };
    return imageMap[name] || '/images/planets/go-planet.png';
  };

  return (
    <div
      className={clsx(
        'planet-item',
        isHovered && 'planet-hovered'
      )}
      style={{
        ...position,
        animationDelay: `${animationDelay}s`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Planet Image */}
      <div className="planet-image-wrapper">
        <Image
          src={getPlanetImage(techStack.name)}
          alt={techStack.display_name}
          width={210}
          height={210}
          className="planet-image"
          sizes="(max-width: 768px) 150px, (max-width: 1024px) 180px, 210px"
        />
        {/* Glow Effect */}
        <div
          className="planet-glow"
          style={{
            backgroundColor: techStack.color || '#00d4ff',
          }}
        />
      </div>

      {/* Planet Name */}
      <div className="planet-name-wrapper">
        <p className="planet-name">{techStack.display_name}</p>
        <p className="planet-description">{techStack.description}</p>
      </div>
    </div>
  );
}

