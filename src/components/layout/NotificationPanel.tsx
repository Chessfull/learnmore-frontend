'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Bell, CheckCheck, Flame, Trophy, Zap } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT':
        return <Award className="w-5 h-5 text-[#00ff88]" />;
      case 'LEVEL_UP':
        return <Zap className="w-5 h-5 text-[#00d4ff]" />;
      case 'STREAK':
        return <Flame className="w-5 h-5 text-[#ff6b6b]" />;
      case 'CHALLENGE':
        return <Trophy className="w-5 h-5 text-[#ffd700]" />;
      default:
        return <Bell className="w-5 h-5 text-[#8b5cf6]" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 mt-2 w-96 max-h-[600px] bg-[#0a0f1c]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#00d4ff] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
              </div>
              {unreadCount > 0 && (
                <p className="text-sm text-white/50">
                  {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/50 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                    className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                      !notification.is_read ? 'bg-[#00d4ff]/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-[#00d4ff] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-white/60 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-white/40">
                          {formatTime(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

