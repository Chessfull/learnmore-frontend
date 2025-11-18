'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';

interface ChallengeFiltersProps {
  filters: { techStack: string; difficulty: string };
  onFiltersChange: (filters: { techStack: string; difficulty: string }) => void;
}

export function ChallengeFilters({ filters, onFiltersChange }: ChallengeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const techStacks = ['GO', 'PYTHON', 'JAVASCRIPT', 'JAVA', 'CSHARP'];
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div className="challenge-filters">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-toggle"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label">Tech Stack</label>
            <select
              value={filters.techStack}
              onChange={(e) => onFiltersChange({ ...filters, techStack: e.target.value })}
              className="filter-select"
            >
              <option value="">All</option>
              {techStacks.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value })}
              className="filter-select"
            >
              <option value="">All</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              onFiltersChange({ techStack: '', difficulty: '' });
              setIsOpen(false);
            }}
            className="filter-reset"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

