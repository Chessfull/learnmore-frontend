'use client';

import { clsx } from 'clsx';
import { Check, Sparkles } from 'lucide-react';

interface RoadmapNodeProps {
  lesson: {
    id: string;
    title: string;
    order_index: number;
  };
  status: 'completed' | 'current' | 'upcoming';
  onClick?: () => void;
  showConnector?: boolean;
  isCurrent?: boolean;
}

export function RoadmapNode({ lesson, status, onClick, showConnector = true, isCurrent }: RoadmapNodeProps) {
  const isClickable = status === 'current' || status === 'upcoming';
  const nodeSize = status === 'current' ? 'w-16 h-16' : 'w-14 h-14';
  const statusIcon = () => {
    if (status === 'completed') return <Check className="w-5 h-5" />;
    if (status === 'current')
      return (
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
      );
    return null;
  };

  return (
    <div className="relative flex flex-col items-center text-center px-2" title={lesson.title}>
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={clsx(
          'flex items-center justify-center rounded-full border transition-all duration-300',
          nodeSize,
          status === 'completed' && 'bg-linear-to-b from-[#0f2d24] to-[#0b1f18] border-[#00ff88]/30 text-[#00ff88]',
          status === 'current' &&
            'bg-linear-to-b from-[#ff8c42] to-[#f45d22] border-[#ffd29c]/60 text-white shadow-[0_0_25px_rgba(244,93,34,0.6)]',
          status === 'upcoming' && 'bg-[#1a2034] border-white/10 text-white/50',
          isClickable && 'cursor-pointer hover:scale-110',
          !isClickable && 'cursor-default'
        )}
      >
        {statusIcon()}
        {status === 'upcoming' && (
          <div className="w-2 h-2 rounded-full bg-white/50" />
        )}
      </button>

      {isCurrent && (
        <div className="flex flex-col items-center mt-2">
          <span className="text-xs font-medium text-[#ffbe5c]">You are here</span>
          <div className="w-0.5 h-4 bg-[#ffbe5c]/70 mt-1" />
        </div>
      )}

      <p
        className={clsx(
          'mt-3 text-xs font-medium leading-tight line-clamp-2 max-w-[140px]',
          status === 'completed' && 'text-[#a2ffce]',
          status === 'current' && 'text-white',
          status === 'upcoming' && 'text-white/60'
        )}
      >
        {lesson.title}
      </p>

      {showConnector && (
        <svg
          className="mt-6"
          width="110"
          height="40"
          viewBox="0 0 110 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`roadmap-gradient-${lesson.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#ffbe5c" />
              <stop offset="100%" stopColor="#7a7d92" />
            </linearGradient>
          </defs>
          <path
            d="M 0 20 Q 55 0 110 20"
            stroke={`url(#roadmap-gradient-${lesson.id})`}
            strokeWidth="2"
            strokeDasharray={status === 'upcoming' ? '6,6' : '0'}
            opacity={status === 'upcoming' ? 0.4 : 0.7}
          />
        </svg>
      )}
    </div>
  );
}

