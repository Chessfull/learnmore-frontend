/**
 * Avatar utility functions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Get full avatar URL from relative or absolute path
 * @param avatarPath - Avatar path from API (can be relative or absolute)
 * @returns Full avatar URL
 */
export function getAvatarUrl(avatarPath: string | null | undefined): string | null {
  if (!avatarPath) return null;

  // If already a full URL (http/https), return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  // If relative path (starts with /), prepend API base URL
  if (avatarPath.startsWith('/')) {
    return `${API_BASE_URL}${avatarPath}`;
  }

  // If it's just a filename, assume it's in /uploads/avatars/
  return `${API_BASE_URL}/uploads/avatars/${avatarPath}`;
}

/**
 * Get user initials from display name
 * @param displayName - User's display name
 * @returns Initials (first letter of first and last name)
 */
export function getUserInitials(displayName: string): string {
  if (!displayName) return '?';
  
  const names = displayName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

