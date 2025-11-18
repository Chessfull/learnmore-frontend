'use client';

import { Activity } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'LESSON_COMPLETED':
        return '📚';
      case 'ACHIEVEMENT_EARNED':
        return '🏆';
      case 'LEVEL_UP':
        return '⬆️';
      case 'STREAK_MILESTONE':
        return '🔥';
      case 'CHALLENGE_COMPLETED':
        return '⚔️';
      default:
        return '✨';
    }
  };

  const getRelativeTime = () => {
    try {
      return formatDistanceToNow(new Date(activity.created_at), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className="activity-item">
      <div className="activity-avatar">
        {activity.user.avatar ? (
          <Image
            src={activity.user.avatar}
            alt={activity.user.display_name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] text-sm font-bold">
            {activity.user.display_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="activity-content">
        <div className="activity-text">
          <span className="activity-icon">{getActivityIcon()}</span>
          {' '}
          <strong>{activity.user.display_name}</strong>
          {' '}
          {activity.description}
        </div>
        <div className="activity-time">{getRelativeTime()}</div>
      </div>
    </div>
  );
}

