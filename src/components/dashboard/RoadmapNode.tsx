'use client';

import { clsx } from 'clsx';
import { Check, Lock } from 'lucide-react';

interface RoadmapNodeProps {
  lesson: {
    id: string;
    title: string;
    order_index: number;
  };
  status: 'completed' | 'current' | 'upcoming' | 'locked';
  onClick?: () => void;
  showConnector?: boolean;
}

export function RoadmapNode({ lesson, status, onClick, showConnector = true }: RoadmapNodeProps) {
  const isClickable = status === 'current' || status === 'upcoming';

  return (
    <div className="roadmap-node">
      {/* Node Circle */}
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={clsx(
          'node-circle',
          status === 'completed' && 'node-completed',
          status === 'current' && 'node-current',
          status === 'upcoming' && 'node-upcoming',
          status === 'locked' && 'node-locked',
          isClickable && 'cursor-pointer hover:scale-110 transition-transform duration-200',
          !isClickable && 'cursor-default'
        )}
      >
        {status === 'completed' && <Check className="w-6 h-6" />}
        {status === 'locked' && <Lock className="w-5 h-5" />}
        {(status === 'current' || status === 'upcoming') && (
          <span className="text-lg font-bold">{lesson.order_index}</span>
        )}
      </button>

      {/* Current Indicator */}
      {status === 'current' && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-[#00d4ff] mb-1">You are here</span>
            <div className="w-0.5 h-4 bg-[#00d4ff]" />
          </div>
        </div>
      )}

      {/* Lesson Title */}
      <div className="text-center mt-3">
        <p
          className={clsx(
            'text-sm font-medium',
            status === 'completed' && 'text-[#00ff88]',
            status === 'current' && 'text-[#00d4ff]',
            status === 'upcoming' && 'text-white/70',
            status === 'locked' && 'text-white/40'
          )}
        >
          {lesson.title}
        </p>
        {status === 'completed' && (
          <p className="text-xs text-white/50 mt-1">Discovered</p>
        )}
        {status === 'locked' && (
          <p className="text-xs text-white/40 mt-1">Locked</p>
        )}
      </div>

      {/* Connector Line */}
      {showConnector && (
        <svg
          className="connector-line"
          width="80"
          height="100"
          viewBox="0 0 80 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 50 Q 40 25 80 50"
            stroke={status === 'completed' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth="2"
            strokeDasharray={status === 'upcoming' || status === 'locked' ? '5,5' : '0'}
          />
        </svg>
      )}

      {/* Continue Button for Current Lesson */}
      {status === 'current' && onClick && (
        <button
          onClick={onClick}
          className="mt-2 px-4 py-1.5 bg-[#00d4ff] text-[#0a0f1c] text-xs font-semibold rounded-lg hover:bg-[#00d4ff]/90 transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  );
}

