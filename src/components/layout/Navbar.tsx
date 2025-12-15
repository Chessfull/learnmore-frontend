'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { getAvatarUrl, getUserInitials } from '@/lib/utils/avatar';
import { useAuthStore } from '@/store/authStore';
import { clsx } from 'clsx';
import { Bell, LogOut, Menu, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { NotificationPanel } from './NotificationPanel';

const getNavLinks = (isAdmin: boolean) => [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/courses', label: 'Courses' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/leaderboard', label: 'Leaderboard' },
  ...(isAdmin ? [{ href: '/admin', label: 'Contents' }] : []),
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navLinks = getNavLinks(user?.role === 'ADMIN');

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/logo/logo.png"
              alt="Learn More"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="text-white font-semibold hidden sm:block">LearnMore</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors relative',
                  pathname === link.href
                    ? 'text-[#00d4ff]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00d4ff] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-white/70 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-[#00d4ff] text-[#0a0f1c] text-xs font-bold rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5"
              >
                {getAvatarUrl(user?.avatar) ? (
                  <img
                    src={getAvatarUrl(user?.avatar)!}
                    alt={user?.display_name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00d4ff] flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(user?.display_name || '')}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0a0f1c]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{user?.display_name}</p>
                    <p className="text-xs text-white/50">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'block px-4 py-2 text-sm font-medium rounded-lg',
                  pathname === link.href
                    ? 'text-[#00d4ff] bg-[#00d4ff]/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center gap-2 rounded-lg mt-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

