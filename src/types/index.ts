// User Types
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar?: string;
  role: 'STUDENT' | 'ADMIN';
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
}

// Auth Types
export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Tech Stack Types
export interface TechStack {
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  order_index: number;
}

// Chapter & Lesson Types
export interface Chapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  chapter_id: string;
  tech_stack: string;
  title: string;
  description: string;
  type: 'ASSIGNMENT' | 'THEORY' | 'QUIZ' | 'CHALLENGE';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  theory_content: string;
  video_url?: string;
  starter_code?: string;
  hints?: string;
  order_index: number;
  estimated_time: number;
  xp_reward: number;
  is_completed?: boolean;
  progress?: {
    id: string;
    is_completed: boolean;
    completed_at?: string;
    best_score: number;
    attempts: number;
    time_spent_secs: number;
    xp_earned: number;
  };
}

// Challenge Types
export interface Challenge {
  id: string;
  type: 'QUIZ' | 'CODE';
  question: string;
  options?: string[];
  difficulty: string;
  xp_reward: number;
  time_limit: number;
  tech_stack: string;
}

// Progress & Stats Types
export interface UserStats {
  total_xp: number;
  level: number;
  lessons_completed: number;
  current_streak: number;
  longest_streak: number;
  success_rate: number;
  global_rank: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar?: string;
  total_xp: number;
  level: number;
}

// Activity Feed Types
export interface Activity {
  id: string;
  user: {
    id: string;
    display_name: string;
    avatar?: string;
    level: number;
  };
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'ACHIEVEMENT' | 'LEVEL_UP' | 'STREAK' | 'CHALLENGE' | 'SYSTEM';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// API Response Type
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Test Result Type
export interface TestResult {
  title: string;
  passed: boolean;
  expected_output: string;
  actual_output: string;
}

