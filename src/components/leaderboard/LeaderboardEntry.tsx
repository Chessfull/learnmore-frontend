'use client';

import Image from 'next/image';

interface LeaderboardEntryProps {
  entry: {
    rank: number;
    display_name: string;
    avatar?: string;
    total_xp: number;
    level: number;
  };
  isCurrentUser?: boolean;
}

export function LeaderboardEntry({ entry, isCurrentUser = false }: LeaderboardEntryProps) {
  const getRankClass = () => {
    if (entry.rank === 1) return 'gold';
    if (entry.rank === 2) return 'silver';
    if (entry.rank === 3) return 'bronze';
    return '';
  };

  const getRankDisplay = () => {
    if (entry.rank === 1) return '👑';
    if (entry.rank === 2) return '🥈';
    if (entry.rank === 3) return '🥉';
    return `#${entry.rank}`;
  };

  return (
    <div className={`leaderboard-entry ${isCurrentUser ? 'current-user' : ''}`}>
      <div className={`entry-rank ${getRankClass()}`}>
        {getRankDisplay()}
      </div>
      
      <div className="entry-avatar">
        {entry.avatar ? (
          <Image
            src={entry.avatar}
            alt={entry.display_name}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] font-bold">
            {entry.display_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="entry-info">
        <div className="entry-name">{entry.display_name}</div>
        <div className="entry-level">Level {entry.level}</div>
      </div>

      <div className="entry-xp">
        {entry.total_xp.toLocaleString()} XP
      </div>
    </div>
  );
}

