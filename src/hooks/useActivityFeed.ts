'use client';

import { useCallback, useEffect, useState } from 'react';

export interface Activity {
  id: string;
  user: {
    id: string;
    display_name: string;
    avatar?: string;
    level: number;
  };
  type: 'LESSON_COMPLETED' | 'ACHIEVEMENT_EARNED' | 'LEVEL_UP' | 'STREAK_MILESTONE' | 'CHALLENGE_COMPLETED';
  description: string;
  created_at: string;
}

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connect = useCallback(() => {
    // Only connect in browser environment
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No access token found, skipping WebSocket connection');
      return;
    }

    try {
      const wsUrl = `ws://localhost:8080/api/v1/ws/activity-feed?token=${token}`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        setIsConnected(true);
        console.log('Activity feed WebSocket connected');
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'activity') {
            setActivities((prev) => [message.payload, ...prev].slice(0, 20));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.warn('WebSocket connection failed - using polling fallback');
        setIsConnected(false);
      };

      websocket.onclose = () => {
        setIsConnected(false);
        // Don't spam reconnection attempts - let the polling fallback handle it
        console.log('Activity feed WebSocket closed');
      };

      setWs(websocket);

      return websocket;
    } catch (error) {
      console.warn('WebSocket not available - using polling fallback');
      return undefined;
    }
  }, []);

  useEffect(() => {
    const websocket = connect();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [connect]);

  return { activities, isConnected, setActivities };
};

