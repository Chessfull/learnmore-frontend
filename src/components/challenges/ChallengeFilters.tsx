'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';

interface ChallengeFiltersProps {
  filters: { techStack: string; difficulty: string };
  onFiltersChange: (filters: { techStack: string; difficulty: string }) => void;
}

export function ChallengeFilters({ filters, onFiltersChange }: ChallengeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const techStacks = [
    { value: 'GO', label: 'Go' },
    { value: 'PYTHON', label: 'Python' },
    { value: 'JAVASCRIPT', label: 'JavaScript' },
    { value: 'JAVA', label: 'Java' },
    { value: 'CSHARP', label: 'C#' },
  ];
  const difficulties = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
        {(filters.techStack || filters.difficulty) && (
          <span className="w-2 h-2 rounded-full bg-[#00d4ff]" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Panel */}
          <div className="absolute right-0 mt-2 w-64 bg-[#0a0f1c]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">
                Tech Stack
              </label>
              <select
                value={filters.techStack}
                onChange={(e) => onFiltersChange({ ...filters, techStack: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
              >
                <option value="">All Tech Stacks</option>
                {techStacks.map((tech) => (
                  <option key={tech.value} value={tech.value}>
                    {tech.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#00d4ff] focus:outline-none transition-colors"
              >
                <option value="">All Difficulties</option>
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                onFiltersChange({ techStack: '', difficulty: '' });
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}

