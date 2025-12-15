'use client';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import { LeaderboardEntry } from './LeaderboardEntry';

interface LeaderboardUser {
  rank: number;
  user_id: string;
  display_name: string;
  avatar?: string;
  total_xp: number;
  level: number;
}

export function Top20List() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserPosition, setCurrentUserPosition] = useState<LeaderboardUser | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const limit = 10; // Always show only top 10
      const response = await api.get(`/leaderboard/global?limit=${limit}&page=1`);
      
      // Extract entries from the response
      let data = [];
      if (response.data?.data?.entries) {
        data = Array.isArray(response.data.data.entries) ? response.data.data.entries : [];
      } else if (response.data?.entries) {
        data = Array.isArray(response.data.entries) ? response.data.entries : [];
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      setEntries(data.slice(0, 10)); // Only keep top 10
      
      // Extract current user position if available
      const userPos = response.data?.data?.user_position;
      if (userPos && userPos.rank > 10) {
        setCurrentUserPosition(userPos);
      } else {
        setCurrentUserPosition(null);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="top20-panel">
      <div className="top20-header">
        <h2>🏆 Top Rankings</h2>
        <p className="text-xs text-white/50 mt-1">Top 10</p>
      </div>
      
      <div className="top20-list flex-1 overflow-y-auto">
        {isLoading && entries.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            Loading rankings...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            No rankings yet
          </div>
        ) : (
          <>
            {entries.map((entry) => (
              <LeaderboardEntry
                key={entry.user_id}
                entry={entry}
                isCurrentUser={user?.id === entry.user_id}
              />
            ))}
            
            {/* Show current user position if not in top 10 */}
            {currentUserPosition && (
              <>
                <div className="my-2 text-center text-white/30 text-sm">
                  ⋯
                </div>
                <LeaderboardEntry
                  key={currentUserPosition.user_id}
                  entry={currentUserPosition}
                  isCurrentUser={true}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
