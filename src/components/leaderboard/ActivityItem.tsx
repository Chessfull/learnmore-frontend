'use client';

import { Activity } from '@/hooks/useActivityFeed';
import { getAvatarUrl, getUserInitials } from '@/lib/utils/avatar';
import { formatDistanceToNow } from 'date-fns';

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
        {getAvatarUrl(activity.user.avatar) ? (
          <img
            src={getAvatarUrl(activity.user.avatar)!}
            alt={activity.user.display_name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff] text-sm font-bold">
            {getUserInitials(activity.user.display_name)}
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

