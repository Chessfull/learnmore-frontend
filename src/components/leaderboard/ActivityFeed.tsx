'use client';

import { useActivityFeed } from '@/hooks/useActivityFeed';
import api from '@/lib/api';
import { useEffect } from 'react';
import { ActivityItem } from './ActivityItem';

export function ActivityFeed() {
  const { activities, isConnected, setActivities } = useActivityFeed();

  // Fallback: Fetch recent activities if WebSocket is not connected
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await api.get('/activity-feed/recent?limit=20');
        const data = response.data.data || [];
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      }
    };

    // Initial fetch
    fetchRecentActivities();

    // Polling fallback if WebSocket fails
    if (!isConnected) {
      const interval = setInterval(fetchRecentActivities, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, setActivities]);

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h2>⚡ Live Activity</h2>
        <div className="feed-status">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
          <span>{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      <div className="feed-list">
        {activities.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

