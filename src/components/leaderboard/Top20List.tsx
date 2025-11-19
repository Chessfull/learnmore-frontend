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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLeaderboard = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/leaderboard/global?limit=20&page=${pageNum}`);
      // Ensure data is always an array - handle multiple response formats
      let data = [];
      if (response.data?.data) {
        data = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      
      if (pageNum === 1) {
        setEntries(data);
      } else {
        setEntries(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 20);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      // Ensure entries is always an array even on error
      if (pageNum === 1) {
        setEntries([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLeaderboard(nextPage);
  };

  return (
    <div className="top20-panel">
      <div className="top20-header">
        <h2>🏆 Top Rankings</h2>
      </div>
      
      <div className="top20-list">
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
          </>
        )}
      </div>

      {hasMore && entries.length > 0 && (
        <button
          onClick={handleShowMore}
          disabled={isLoading}
          className="show-more-btn"
        >
          {isLoading ? 'Loading...' : 'Show More'}
        </button>
      )}
    </div>
  );
}

