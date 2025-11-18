# Phase 0: Proje Setup + Ortak Componentler İmplementasyonu

## ÖNEMLİ NOTLAR

**Backend Erişimi:** Backend projesi `../learnmore-go` klasöründe. API endpoint uyumsuzluğu olursa backend'i inceleyip düzeltme önerebilirsin.

**Duplicate Kontrolü:** Her dosya oluşturmadan önce var mı kontrol et. Varsa güncelle, yoksa oluştur. Aynı dosyanın farklı lokasyonlarda olmasını engelle.

**Hata Yönetimi:** Tüm componentlerde proper error handling olacak. Görsel/asset eksikse CSS placeholder kullan ve yaptığın işlemler sonunda bana mesaj içinde UYARI olarak bildir. Şurda şu asset bulunumadı placeholder kullandım gibi.

---

## Cursor Implementasyon Promptu

Phase 0 PROMPT BAŞLANGIÇ
Phase 0'ı başlatıyoruz - Proje Setup ve Ortak Componentler. Bu phase'de tüm temel yapıyı kuracak ve ortak componentleri oluşturacaksın.

**ÖNEMLİ KURALLAR:**

1. Her dosya oluşturmadan önce var mı kontrol et - varsa güncelle, yoksa oluştur
2. Duplicate dosya oluşturma - tek bir lokasyon kullan
3. Görsel/asset eksikse CSS placeholder kullan ve sonunda mesaj içinde bana UYARI olarak bildir
4. API hatası olursa user-friendly mesaj göster ve console'a logla
5. Backend projesi `../learnmore-go` klasöründe - endpoint uyumsuzluğu olursa incele

---

## Görev Listesi

### BÖLÜM 1: Temel Setup

#### 1.1 API Client

`src/lib/api.ts` oluştur/güncelle:

```typescript
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        localStorage.setItem("access_token", data.data.access_token);
        localStorage.setItem("refresh_token", data.data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 1.2 TypeScript Types

`src/types/index.ts` oluştur/güncelle:

```typescript
// User Types
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar?: string;
  role: "STUDENT" | "ADMIN";
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
  title: string;
  description: string;
  type: "ASSIGNMENT" | "THEORY" | "QUIZ" | "CHALLENGE";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  theory_content: string;
  video_url?: string;
  starter_code?: string;
  hints?: string;
  xp_reward: number;
  is_completed?: boolean;
}

// Challenge Types
export interface Challenge {
  id: string;
  type: "QUIZ" | "CODE";
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
  type: "ACHIEVEMENT" | "LEVEL_UP" | "STREAK" | "CHALLENGE" | "SYSTEM";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// API Response Type
export interface ApiResponse<T> {
  status: "success" | "error";
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
```

#### 1.3 Auth Store

`src/store/authStore.ts` oluştur/güncelle:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import api from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post("/auth/login", { email, password });
          const { user, access_token, refresh_token } = response.data.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          const message =
            error.response?.data?.error?.message || "Login failed";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (email, password, displayName) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post("/auth/register", {
            email,
            password,
            display_name: displayName,
          });
          const { user, access_token, refresh_token } = response.data.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          const message =
            error.response?.data?.error?.message || "Registration failed";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          api
            .post("/auth/logout", { refresh_token: refreshToken })
            .catch(() => {});
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) {
            set({ isLoading: false });
            return;
          }

          const response = await api.get("/auth/me");
          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

#### 1.4 Tailwind Config

`tailwind.config.ts` güncelle (mevcut config'i koru, extend kısmını ekle):

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0a0f1c",
          darker: "#050810",
          purple: "#1a0a2e",
          blue: "#0d1b2a",
        },
        accent: {
          cyan: "#00d4ff",
          green: "#00ff88",
          purple: "#8b5cf6",
          pink: "#ff006e",
        },
      },
      backgroundImage: {
        "space-gradient": "linear-gradient(to bottom, #0a0f1c, #1a0a2e)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 1.5 Global Styles

`src/app/globals.css` güncelle (mevcut Tailwind imports'ları koru):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-space-dark text-white antialiased;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl;
  }

  .btn-primary {
    @apply bg-accent-cyan text-space-dark font-semibold px-6 py-3 rounded-xl 
           hover:bg-accent-cyan/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-white/10 text-white font-semibold px-6 py-3 rounded-xl 
           border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50;
  }

  .input-field {
    @apply w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
           text-white placeholder-white/50 focus:border-accent-cyan 
           focus:outline-none transition-colors;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

---

### BÖLÜM 2: Intro Video ve Landing Page Temeli

#### 2.1 Root Layout

`src/app/layout.tsx` güncelle:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnMore - Space-Themed Learning Platform",
  description:
    "Learn programming languages through an immersive space adventure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 2.2 Providers Component

`src/components/providers/Providers.tsx` oluştur:

```typescript
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
```

#### 2.3 Landing Page with Intro Video

`src/app/page.tsx` güncelle:

Bu sayfa:

1. Intro video oynatır
2. Video bitince auth durumuna göre içerik gösterir
3. Logged in ise dashboard'a redirect

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && videoEnded) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, videoEnded, router]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleVideoError = () => {
    console.warn(
      "UYARI: Intro video yüklenemedi - public/videos/intro/intro-video.mp4"
    );
    setVideoError(true);
    setVideoEnded(true);
  };

  // Skip video for development if it doesn't exist
  const skipVideo = () => {
    setVideoEnded(true);
  };

  return (
    <div className="relative min-h-screen bg-space-dark overflow-hidden">
      {/* Star Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars" />
      </div>

      {/* Intro Video */}
      <AnimatePresence>
        {!videoEnded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10 bg-black"
          >
            {!videoError ? (
              <video
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                className="w-full h-full object-cover"
              >
                <source src="/videos/intro/intro-video.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/50">Video yüklenemedi</p>
              </div>
            )}

            {/* Skip button for development */}
            <button
              onClick={skipVideo}
              className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm"
            >
              Skip →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Shows after video */}
      {videoEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-0 min-h-screen flex items-center justify-center p-4"
        >
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : isAuthenticated ? (
            <div className="text-white">Redirecting to dashboard...</div>
          ) : (
            <div className="text-white text-2xl">
              {/* Auth panels will be added in Phase 1 */}
              <p>Welcome to LearnMore</p>
              <p className="text-sm text-white/50 mt-2">
                Auth panels coming in Phase 1
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* CSS Stars */}
      <style jsx>{`
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
              2px 2px at 20px 30px,
              white,
              transparent
            ), radial-gradient(
              2px 2px at 40px 70px,
              rgba(255, 255, 255, 0.8),
              transparent
            ), radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(
              2px 2px at 160px 120px,
              rgba(255, 255, 255, 0.9),
              transparent
            ), radial-gradient(1px 1px at 230px 80px, white, transparent);
          background-size: 250px 250px;
          animation: twinkle 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
```

---

### BÖLÜM 3: UI Components

#### 3.1 Button Component

`src/components/ui/Button.tsx` oluştur:

```typescript
import { forwardRef } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-accent-cyan text-space-dark hover:bg-accent-cyan/90",
      secondary:
        "bg-white/10 text-white border border-white/20 hover:bg-white/20",
      ghost: "text-white hover:bg-white/10",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
```

#### 3.2 GlassCard Component

`src/components/ui/GlassCard.tsx` oluştur:

```typescript
import { clsx } from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "green" | "purple" | "none";
  padding?: "none" | "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = "none",
  padding = "md",
}: GlassCardProps) {
  const glowColors = {
    none: "",
    cyan: "shadow-[0_0_30px_rgba(0,212,255,0.15)]",
    green: "shadow-[0_0_30px_rgba(0,255,136,0.15)]",
    purple: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl",
        hover &&
          "hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer",
        glowColors[glow],
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
```

#### 3.3 Input Component

`src/components/ui/Input.tsx` oluştur:

```typescript
import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/50",
              "focus:outline-none transition-colors",
              error
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-accent-cyan",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

#### 3.4 SpaceLoading Component

`src/components/ui/SpaceLoading.tsx` oluştur:

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const spaceFacts = [
  "The International Space Station travels at about 28,000 km/h",
  "A day on Venus is longer than its year",
  "Neutron stars can spin 600 times per second",
  "There are more stars in the universe than grains of sand on Earth",
  "The footprints on the Moon will last for 100 million years",
  "One million Earths could fit inside the Sun",
  "Space is completely silent",
  "The sunset on Mars appears blue",
  "Jupiter's Great Red Spot is shrinking",
  "Saturn's rings are mostly made of ice",
];

interface SpaceLoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function SpaceLoading({
  fullScreen = false,
  message,
}: SpaceLoadingProps) {
  const [fact, setFact] = useState("");

  useEffect(() => {
    const randomFact =
      spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    setFact(randomFact);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated planet/loader */}
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Message or fact */}
      <div className="text-center max-w-md">
        {message && <p className="text-white font-medium mb-2">{message}</p>}
        <p className="text-white/60 text-sm italic">💫 {fact}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-space-dark flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}
```

---

### BÖLÜM 4: Layout Components

#### 4.1 Navbar Component

`src/components/layout/Navbar.tsx` oluştur:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-space-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">LM</span>
            </div>
            <span className="text-white font-semibold hidden sm:block">
              LearnMore
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  pathname === link.href
                    ? "text-accent-cyan"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-cyan rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-white/70 hover:text-white">
              <Bell className="w-5 h-5" />
              {/* Notification badge - will be dynamic */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-cyan rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-space-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-1">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white">
                      {user?.display_name}
                    </p>
                    <p className="text-xs text-white/50">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
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
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
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
                  "block px-4 py-2 text-sm font-medium rounded-lg",
                  pathname === link.href
                    ? "text-accent-cyan bg-accent-cyan/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
```

#### 4.2 Footer Component

`src/components/layout/Footer.tsx` oluştur:

```typescript
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-space-dark/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <span className="text-white font-bold text-xs">LM</span>
            </div>
            <span className="text-white/50 text-sm">
              © {new Date().getFullYear()} LearnMore. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/50 hover:text-white text-sm">
              About
            </Link>
            <Link href="#" className="text-white/50 hover:text-white text-sm">
              Privacy
            </Link>
            <Link href="#" className="text-white/50 hover:text-white text-sm">
              Terms
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/50 hover:text-white">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/50 hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

#### 4.3 Main Layout (Protected Routes)

`src/app/(main)/layout.tsx` oluştur:

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SpaceLoading } from "@/components/ui/SpaceLoading";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <SpaceLoading fullScreen message="Loading your space journey..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-space-dark">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

### BÖLÜM 5: Placeholder Pages

Şimdilik boş placeholder sayfalar oluştur:

#### 5.1 Dashboard Page

`src/app/(main)/dashboard/page.tsx`:

```typescript
export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="text-white/50 mt-2">Coming in Phase 2</p>
    </div>
  );
}
```

#### 5.2 Courses Page

`src/app/(main)/courses/page.tsx`:

```typescript
export default function CoursesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Courses</h1>
      <p className="text-white/50 mt-2">Coming in Phase 3</p>
    </div>
  );
}
```

#### 5.3 Challenges Page

`src/app/(main)/challenges/page.tsx`:

```typescript
export default function ChallengesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Challenges</h1>
      <p className="text-white/50 mt-2">Coming in Phase 5</p>
    </div>
  );
}
```

#### 5.4 Leaderboard Page

`src/app/(main)/leaderboard/page.tsx`:

```typescript
export default function LeaderboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
      <p className="text-white/50 mt-2">Coming in Phase 6</p>
    </div>
  );
}
```

---

## Test Checklist

Phase tamamlandığında şunları test et:

- [ ] Proje hatasız çalışıyor (`npm run dev`)
- [ ] Landing page açılıyor
- [ ] Intro video oynuyor (veya skip butonu çalışıyor)
- [ ] Video bitince içerik görünüyor
- [ ] Stars animasyonu çalışıyor
- [ ] Dashboard/Courses/Challenges/Leaderboard sayfaları açılıyor
- [ ] Navbar görünüyor ve linkler çalışıyor
- [ ] Footer görünüyor
- [ ] Mobile responsive
- [ ] Console'da critical error yok

---

## Tamamlandığında Bildir

İşlemler tamamlandığında şu formatta rapor ver:

```
✅ TAMAMLANDI

Oluşturulan dosyalar:
- [dosya listesi]

Güncellenen dosyalar:
- [dosya listesi]

⚠️ UYARILAR:
- [eksik görsel veya asset varsa]
- [API endpoint uyumsuzluğu varsa]
- [diğer dikkat edilmesi gerekenler]

🔍 SONRAKİ ADIM:
Phase 1 için hazırım. Auth panellerini (Login/Register) ekleyeceğiz.
```

Phase 0 PROMPT BİTİŞ

Phase 1 PROMPT BAŞLANGIÇ
Phase 1'i başlatıyoruz - Landing Page. Bu sayfa kullanıcının ilk gördüğü sayfa ve auth durumuna göre farklı içerik gösteriyor.
Mevcut Durum
Şu an landing page'de:

Intro video oynatılıyor ✓
Video bitince arka plan uzay boşluğu kalıyor ✓
Auth durumuna göre "Logged In" veya "Logged Out" text gösteriliyor

Hedef
Video bittikten sonra:

Logged Out: Login/Register form (sol) + Demo video (sağ)
Logged In: Dashboard'a redirect

Görev Listesi

1. Landing Page Ana Yapısı
   src/app/page.tsx güncelle:
   Akış:

Sayfa yüklendiğinde intro video oynar (mevcut)
Video bitince animasyonlu şekilde iki panel belirir
Auth check: Eğer logged in ise /dashboard'a redirect
Logged out ise paneller gösterilir

2. Sol Panel - Auth Panel
   src/components/auth/AuthPanel.tsx oluştur:
   Özellikler:

Tab sistemi: Login | Register
Glassmorphism card
Animasyonlu geçiş (Framer Motion)

Login Form:

Email input
Password input
"Remember me" checkbox
"Forgot password?" link (placeholder)
Login button
Divider: "or continue with"
OAuth buttons: GitHub, Google

Register Form:

Display name input
Email input
Password input
Confirm password input
Terms checkbox
Register button
OAuth buttons: GitHub, Google

Form Validation:

Email format check
Password min 8 karakter
Passwords match (register)
Required fields

API Calls:

Login: POST /auth/login
Register: POST /auth/register
GitHub OAuth: Redirect to GET /auth/github
Google OAuth: Redirect to GET /auth/google

3. Sağ Panel - Demo Video
   src/components/auth/DemoVideoPanel.tsx oluştur:
   Özellikler:

Glassmorphism card
Video thumbnail (placeholder)
Play button overlay
Tıklandığında video oynar (modal veya inline)
Alt kısımda kısa açıklama text

API Call:

GET /content/demo-video - Video URL al

Placeholder State:

Thumbnail göster
"Watch Demo" veya "See LearnMore in Action" text
Play icon

4. OAuth Callback Handler
   src/app/auth/callback/page.tsx oluştur:
   Özellikler:

URL params'dan token'ları al
LocalStorage'a kaydet
Dashboard'a redirect
Error handling

5. Animasyonlar
   Panel Giriş Animasyonu:
   typescript// Framer Motion variants
   const panelVariants = {
   hidden: {
   opacity: 0,
   y: 50,
   scale: 0.95
   },
   visible: {
   opacity: 1,
   y: 0,
   scale: 1,
   transition: {
   duration: 0.6,
   ease: "easeOut"
   }
   }
   };
   Sol panel 0.3s delay, sağ panel 0.5s delay
6. Responsive Tasarım
   Desktop (lg+):

İki panel yan yana (grid veya flex)
Sol %45, Sağ %45, arası boşluk

Tablet (md):

İki panel yan yana ama daha dar

Mobile (sm):

Paneller üst üste
Auth panel üstte
Demo video altta

Stil Notları
Panel Container
css.panels-container {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 3rem;
max-width: 1200px;
margin: 0 auto;
padding: 2rem;
}

@media (max-width: 768px) {
.panels-container {
grid-template-columns: 1fr;
}
}
Auth Card
css.auth-card {
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1.5rem;
padding: 2.5rem;
}
Tab Stili
css.tab-active {
color: #00d4ff;
border-bottom: 2px solid #00d4ff;
}

.tab-inactive {
color: rgba(255, 255, 255, 0.5);
}
OAuth Button
css.oauth-btn {
display: flex;
align-items: center;
justify-content: center;
gap: 0.75rem;
width: 100%;
padding: 0.75rem;
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 0.75rem;
transition: all 0.2s;
}

.oauth-btn:hover {
background: rgba(255, 255, 255, 0.1);
border-color: rgba(255, 255, 255, 0.2);
}
Demo Video Card
css.demo-card {
position: relative;
aspect-ratio: 16/9;
overflow: hidden;
border-radius: 1rem;
cursor: pointer;
}

.play-overlay {
position: absolute;
inset: 0;
display: flex;
align-items: center;
justify-content: center;
background: rgba(0, 0, 0, 0.3);
}

.play-icon {
width: 80px;
height: 80px;
background: rgba(0, 212, 255, 0.9);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
transition: transform 0.2s;
}

.demo-card:hover .play-icon {
transform: scale(1.1);
}

Dosya Yapısı Sonuç
src/
├── app/
│ ├── page.tsx (güncellendi)
│ └── auth/
│ └── callback/
│ └── page.tsx
├── components/
│ └── auth/
│ ├── AuthPanel.tsx
│ ├── LoginForm.tsx
│ ├── RegisterForm.tsx
│ ├── OAuthButtons.tsx
│ └── DemoVideoPanel.tsx

Error Handling
Auth Errors

Invalid credentials: Toast ile "Invalid email or password"
Email already exists: Form altında error message
Network error: Toast ile "Connection error, please try again"

Form Errors

Real-time validation
Submit'te tüm errors göster
Clear errors on input change

Test Checklist
Phase tamamlandığında şunları test edeceğim:

Video oynadıktan sonra paneller smooth animate oluyor
Login/Register tab switch çalışıyor
Form validation çalışıyor
Login başarılı -> Dashboard'a redirect
Register başarılı -> Dashboard'a redirect
GitHub OAuth redirect çalışıyor
Google OAuth redirect çalışıyor
OAuth callback token'ları kaydediyor
Demo video placeholder görünüyor
Play button tıklanabiliyor
Mobile responsive
Loading states gösteriliyor
Error messages gösteriliyor

Hazır olduğunda bana bildir, test edeceğim.

Tamamlandığında Bildir
İşlemler tamamlandığında şu formatta rapor ver:
✅ TAMAMLANDI

Oluşturulan/Güncellenen dosyalar:

- [dosya listesi]

⚠️ UYARILAR:

- [Google icon SVG yoksa belirt]
- [Demo video thumbnail yoksa belirt]
- [API endpoint uyumsuzluğu varsa belirt]

🔍 SONRAKİ ADIM:
Phase 2 için hazırım. Dashboard sayfasını (stats, roadmap) ekleyeceğiz.
Phase 1 PROMPT BİTİŞ

PHASE 2 PROMPT BAŞLANGIÇ
Phase 2'yi başlatıyoruz - User Dashboard. Bu, kullanıcının giriş yaptıktan sonra gördüğü ana sayfa.
Sayfa Yapısı
Wireframe'deki gibi (Image 3):

Sabit Navbar (Phase 0'da oluşturuldu) - "Dashboard" aktif
Sol Panel (%20): Hoşgeldin mesajı + Stat kartı
Sağ Panel (%80): Öğrenme yol haritası
Sabit Footer (Phase 0'da oluşturuldu)

Görev Listesi

1. Dashboard Page
src/app/(main)/dashboard/page.tsx oluştur:
Layout:
tsx<div className="dashboard-container">
  <aside className="left-panel">
    <WelcomeCard />
    <StatsCard />
  </aside>
  <main className="right-panel">
    <LearningRoadmap />
  </main>
</div>
2. Welcome Card
   src/components/dashboard/WelcomeCard.tsx oluştur:
   İçerik:

"Welcome back, {username}!"
"I hope you have a wonderful day."
Şık tipografi, gradient text veya glow effect

3. Stats Card
   src/components/dashboard/StatsCard.tsx oluştur:
   İçerik (GlassCard içinde):

Your Current Rank: #{rank} (global rank)
Your Current Score: {total_xp} XP
Current Streak: {streak} 🔥 days
Today's Quote: Daily motivational quote

API Calls:

GET /progress/stats - Rank, XP, streak
GET /content/daily-quote - Günlük quote

Stil:

Her stat item için icon + label + value
Quote için italik, farklı font
Subtle separators between items

4. Learning Roadmap
   src/components/dashboard/LearningRoadmap.tsx oluştur:
   İçerik:
   Bu en karmaşık component. Kullanıcının öğrenme yolculuğunu gösteren görsel bir harita.
   Yapı:

Sağ üstte: "{TechStack} - Continue Learning" başlık
Ana alan: Yatay scrollable ders dizisi
Her ders bir "node" olarak gösterilir (numaralı daire)

Ders Node'ları:

Tamamlanan (Completed):

Yeşil dolu daire
Check icon
"Discovered" label
Ders ismi

Mevcut (Current):

Cyan pulsing glow
"You are here" arrow indicator
Ders ismi
"Continue" butonu

Gelecek (Upcoming):

Outline daire (boş)
"To be discovered" veya ders ismi
Locked veya unlocked durumu

Görünüm:

Merkeze mevcut ders
Solda 3 önceki ders (tamamlanmış)
Sağda 3 sonraki ders (gelecek)
Dersler arasında connecting line (eğimli çizgi)

Eğer henüz hiçbir derse başlanmadıysa:

Placeholder: Planet ikonları ile "Start your journey!"
"Choose a course to begin" mesajı
Courses sayfasına yönlendiren CTA

API Calls:

GET /progress/resume - Son kaldığı ders
GET /progress/roadmap/:techStack - Roadmap verisi

5. Roadmap Node Component
   src/components/dashboard/RoadmapNode.tsx oluştur:
   typescriptinterface RoadmapNodeProps {
   lesson: {
   id: string;
   title: string;
   order_index: number;
   };
   status: 'completed' | 'current' | 'upcoming' | 'locked';
   onClick?: () => void;
   }
   Stil Variants:

Completed: Green filled, check icon
Current: Cyan glow, pulsing animation
Upcoming: White outline, normal
Locked: Gray, lock icon

6. Connecting Lines
   Dersler arasındaki bağlantı çizgileri:
   Yaklaşım 1: SVG
   tsx<svg className="connector-line">
   <path d="M0,50 Q50,0 100,50" stroke="rgba(255,255,255,0.3)" />
   </svg>
   Yaklaşım 2: CSS pseudo-elements
   css.node::after {
   content: '';
   position: absolute;
   right: -60px;
   top: 50%;
   width: 60px;
   height: 2px;
   background: linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
   }
7. No Progress State
   src/components/dashboard/NoProgressState.tsx oluştur:
   Kullanıcı henüz ders almadıysa:

Planet ikonları (Go, Python, Java, C#)
"Begin your space journey!"
"Select a programming language to start learning"
"Go to Courses" button

Responsive Tasarım
Desktop (lg+):

Sol panel sabit %20
Sağ panel %80

Tablet (md):

Sol panel üstte (full width)
Sağ panel altta (full width)

Mobile (sm):

Tek kolon layout
Roadmap horizontal scroll

Stil Notları
Dashboard Container
css.dashboard-container {
display: grid;
grid-template-columns: 280px 1fr;
gap: 2rem;
padding: 2rem;
min-height: calc(100vh - navbar - footer);
}

@media (max-width: 1024px) {
.dashboard-container {
grid-template-columns: 1fr;
}
}
Stats Card Items
css.stat-item {
display: flex;
align-items: center;
gap: 1rem;
padding: 1rem 0;
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
width: 40px;
height: 40px;
display: flex;
align-items: center;
justify-content: center;
background: rgba(0, 212, 255, 0.1);
border-radius: 0.5rem;
color: #00d4ff;
}

.stat-value {
font-size: 1.5rem;
font-weight: bold;
}

.stat-label {
font-size: 0.875rem;
color: rgba(255, 255, 255, 0.6);
}
Roadmap Node
css.roadmap-node {
position: relative;
display: flex;
flex-direction: column;
align-items: center;
gap: 0.5rem;
}

.node-circle {
width: 60px;
height: 60px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-weight: bold;
font-size: 1.25rem;
}

.node-completed {
background: #00ff88;
color: #0a0f1c;
}

.node-current {
background: transparent;
border: 3px solid #00d4ff;
color: #00d4ff;
box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
animation: pulse 2s infinite;
}

.node-upcoming {
background: transparent;
border: 2px solid rgba(255, 255, 255, 0.3);
color: rgba(255, 255, 255, 0.6);
}

@keyframes pulse {
0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.5); }
50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.8); }
}
Quote Styling
css.daily-quote {
font-style: italic;
font-size: 0.9rem;
color: rgba(255, 255, 255, 0.8);
padding: 1rem;
background: rgba(139, 92, 246, 0.1);
border-radius: 0.5rem;
border-left: 3px solid #8b5cf6;
}

.quote-author {
margin-top: 0.5rem;
font-style: normal;
font-size: 0.8rem;
color: rgba(255, 255, 255, 0.5);
}

Dosya Yapısı Sonuç
src/
├── app/
│ └── (main)/
│ └── dashboard/
│ └── page.tsx
└── components/
└── dashboard/
├── WelcomeCard.tsx
├── StatsCard.tsx
├── LearningRoadmap.tsx
├── RoadmapNode.tsx
└── NoProgressState.tsx

API Response Örnekleri
GET /progress/stats
json{
"total_xp": 1250,
"level": 5,
"lessons_completed": 12,
"current_streak": 7,
"longest_streak": 14,
"success_rate": 85.5,
"global_rank": 42
}
GET /content/daily-quote
json{
"quote": "The only way to do great work is to love what you do.",
"author": "Steve Jobs"
}
GET /progress/resume
json{
"tech_stack": "GO",
"chapter_id": "...",
"lesson_id": "...",
"lesson_title": "Statements",
"order_index": 5
}

Test Checklist

Dashboard sayfası yükleniyor
Welcome mesajında username görünüyor
Stats kartında rank, XP, streak görünüyor
Daily quote görünüyor
Roadmap render oluyor
Tamamlanan dersler yeşil
Mevcut ders pulsing glow
Gelecek dersler outline
"Continue" tıklandığında lesson sayfasına gidiyor
Ders yoksa NoProgressState görünüyor
Mobile responsive

Hazır olduğunda bana bildir, test edeceğim.

Tamamlandığında Bildir
İşlemler tamamlandığında şu formatta rapor ver:
✅ TAMAMLANDI

Oluşturulan/Güncellenen dosyalar:

- [dosya listesi]

⚠️ UYARILAR:

- [API endpoint uyumsuzluğu varsa belirt]
- [Daily quote API çalışmıyorsa belirt]
- [Progress/resume API sorunu varsa belirt]

🔍 SONRAKİ ADIM:
Phase 3 için hazırım. Courses sayfasını (planet grid) ekleyeceğiz.
PHASE 2 PROMPT BİTİŞ

PHASE 3 PROMPT BAŞLANGIÇ
Phase 3'ü başlatıyoruz - Courses Page. Bu sayfa kullanıcının programlama dili seçtiği ve öğrenme yolculuğuna başladığı sayfa.
Sayfa Yapısı
Wireframe'deki gibi (Image 2):

Sabit Navbar - "Courses" aktif
Sol Panel (%20): Typewriter animasyonlu karşılama metni
Sağ Panel (%80): Gezegen tasarımlı dil seçimleri
Sabit Footer

Görev Listesi

1. Courses Page
src/app/(main)/courses/page.tsx oluştur:
Layout:
tsx<div className="courses-container">
  <aside className="left-panel">
    <WelcomeMessage />
  </aside>
  <main className="right-panel">
    <PlanetGrid />
  </main>
</div>
2. Welcome Message Component
   src/components/courses/WelcomeMessage.tsx oluştur:
   Özellikler:

GlassCard içinde
Typewriter animasyonu ile metin yazılır

Metin:
Welcome captain {username}!

Please select which language you want to discover from right!

You can preview your roadmap by hovering on the related planet!
Typewriter Animasyonu:

Her karakter sırayla belirir
Cursor blink effect
Farklı hızlarda yazım (virgül, nokta sonrası pause)

Typewriter Implementation:
typescript// Custom hook veya component
const useTypewriter = (text: string, speed: number = 50) => {
const [displayText, setDisplayText] = useState('');

useEffect(() => {
let index = 0;
const timer = setInterval(() => {
if (index < text.length) {
setDisplayText(text.slice(0, index + 1));
index++;
} else {
clearInterval(timer);
}
}, speed);

    return () => clearInterval(timer);

}, [text, speed]);

return displayText;
}; 3. Planet Grid Component
src/components/courses/PlanetGrid.tsx oluştur:
Özellikler:

5 gezegen dağınık şekilde (tam grid değil, organic layout)
Her gezegen hover'da scale up + glow
Hover'da roadmap preview tooltip/modal

API Call:

GET /tech-stacks - Tüm dilleri al

Layout:
Organik yerleşim için manual positioning veya creative grid:
css.planet-grid {
position: relative;
height: 100%;
}

.planet:nth-child(1) { top: 10%; left: 20%; }
.planet:nth-child(2) { top: 5%; left: 60%; }
.planet:nth-child(3) { top: 40%; left: 80%; }
.planet:nth-child(4) { top: 60%; left: 30%; }
.planet:nth-child(5) { top: 55%; left: 65%; } 4. Planet Component
src/components/courses/Planet.tsx oluştur:
typescriptinterface PlanetProps {
techStack: {
name: string;
display_name: string;
description: string;
icon: string;
color: string;
};
onClick: () => void;
}
Özellikler:

Gezegen görseli/CSS
İsim label altında
Hover state: scale(1.1), glow effect
Float animasyonu (sürekli hafif yukarı aşağı)
Tıklandığında lesson sayfasına yönlendir

5. Roadmap Preview
   src/components/courses/RoadmapPreview.tsx oluştur:
   Hover'da görünen tooltip/popover:

Ana konu başlıkları (chapters)
Her chapter için lesson sayısı
"Click to start journey!" CTA
Toplam ders sayısı, tahmini süre

API Call:

GET /tech-stacks/:techStack/chapters - Hover'da lazy load

Stil:
css.roadmap-preview {
position: absolute;
width: 300px;
background: rgba(10, 15, 28, 0.95);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 1rem;
padding: 1.5rem;
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
z-index: 50;
} 6. Loading State
Gezegenler yüklenirken:

SpaceLoading component
Veya skeleton planets

Animasyonlar
Float Animation (Gezegenler)
css@keyframes float {
0%, 100% { transform: translateY(0); }
50% { transform: translateY(-15px); }
}

.planet {
animation: float 6s ease-in-out infinite;
}

/_ Farklı delay'ler _/
.planet:nth-child(1) { animation-delay: 0s; }
.planet:nth-child(2) { animation-delay: 1s; }
.planet:nth-child(3) { animation-delay: 2s; }
.planet:nth-child(4) { animation-delay: 3s; }
.planet:nth-child(5) { animation-delay: 4s; }
Hover Glow
css.planet:hover {
transform: scale(1.1);
filter: drop-shadow(0 0 30px var(--planet-color));
}
Typewriter Cursor
css.typewriter-cursor {
display: inline-block;
width: 2px;
height: 1.2em;
background: #00d4ff;
margin-left: 2px;
animation: blink 0.8s infinite;
}

@keyframes blink {
0%, 50% { opacity: 1; }
51%, 100% { opacity: 0; }
}

Responsive Tasarım
Desktop (lg+):

İki panel yan yana
Gezegenler geniş alanda spread out

Tablet (md):

Sol panel üstte
Gezegenler 3'lü grid

Mobile (sm):

Tek kolon
Gezegenler 2'li grid veya list

Stil Notları
Courses Container
css.courses-container {
display: grid;
grid-template-columns: 280px 1fr;
gap: 2rem;
padding: 2rem;
min-height: calc(100vh - navbar - footer);
}
Welcome Card
css.welcome-card {
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1.5rem;
padding: 2rem;
}

.welcome-text {
font-size: 1.1rem;
line-height: 1.8;
color: rgba(255, 255, 255, 0.9);
}

.username-highlight {
color: #00d4ff;
font-weight: 600;
}
Planet Item
css.planet-item {
position: absolute;
display: flex;
flex-direction: column;
align-items: center;
cursor: pointer;
transition: transform 0.3s ease;
}

.planet-image {
width: 120px;
height: 120px;
border-radius: 50%;
object-fit: cover;
}

.planet-name {
margin-top: 0.5rem;
font-size: 1.25rem;
font-weight: 600;
color: white;
}

Dosya Yapısı Sonuç
src/
├── app/
│ └── (main)/
│ └── courses/
│ └── page.tsx
├── components/
│ └── courses/
│ ├── WelcomeMessage.tsx
│ ├── PlanetGrid.tsx
│ ├── Planet.tsx
│ └── RoadmapPreview.tsx
└── hooks/
└── useTypewriter.ts

Navigation
Planet tıklandığında:

Kullanıcının o dilde progress'i var mı kontrol et
Varsa: Resume point'ten devam (lesson sayfası)
Yoksa: İlk ders'e yönlendir

typescriptconst handlePlanetClick = async (techStack: string) => {
try {
const resume = await api.get(`/progress/resume?tech_stack=${techStack}`);
if (resume.data.data) {
router.push(`/lesson/${resume.data.data.lesson_id}`);
} else {
// İlk chapter'ın ilk dersi
const chapters = await api.get(`/tech-stacks/${techStack}/chapters`);
const firstLesson = chapters.data.data[0]?.lessons[0];
if (firstLesson) {
router.push(`/lesson/${firstLesson.id}`);
}
}
} catch (error) {
// Handle error
}
};

Test Checklist

Courses sayfası yükleniyor
Typewriter animasyonu çalışıyor
Username doğru gösteriliyor
Gezegenler render oluyor
Float animasyonu çalışıyor
Hover'da scale + glow
Hover'da roadmap preview görünüyor
Preview'da chapter listesi
Planet tıklandığında lesson'a redirect
Loading state var
Mobile responsive

Hazır olduğunda bana bildir, test edeceğim.

Tamamlandığında Bildir
İşlemler tamamlandığında şu formatta rapor ver:
✅ TAMAMLANDI

Oluşturulan/Güncellenen dosyalar:

- [dosya listesi]

⚠️ UYARILAR:

- [Planet görselleri yoksa - CSS placeholder kullanıldı]
- [Tech-stacks API sorunu varsa belirt]
- [Chapters API sorunu varsa belirt]

🔍 SONRAKİ ADIM:
Phase 4 için hazırım. Lesson Screen (code editor, quiz) ekleyeceğiz.
PHASE 3 PROMPT BİTİŞ

PHASE 4 PROMPT BAŞLANGIÇ
Phase 4'ü başlatıyoruz - Lesson Screen. Bu, kullanıcıların dersleri öğrendiği ana eğitim ekranı. En karmaşık sayfa olduğu için dikkatli ve modüler geliştireceğiz.
Sayfa Yapısı
Bu sayfada Navbar ve Footer YOK!

Sol üst: "Return to Dashboard" butonu
Sağ üst: Video/Text toggle + Ders dropdown
Sol Panel: İçerik (Video veya Text)
Sağ Panel: Code Editor veya Quiz

Görev Listesi

1. Lesson Page
src/app/(main)/lesson/[id]/page.tsx oluştur:
Önemli: Bu sayfa (main) layout'undan çıkarılmalı (Navbar/Footer olmaması için) veya ayrı bir layout kullanmalı.
Layout:
tsx<div className="lesson-container">
  <header className="lesson-header">
    <ReturnButton />
    <LessonControls />
  </header>
  <main className="lesson-content">
    <ContentPanel />
    <EditorPanel />
  </main>
</div>
2. Lesson Layout (No Navbar/Footer)
   src/app/(main)/lesson/layout.tsx oluştur:

Auth kontrolü var
Navbar ve Footer yok
Full screen deneyim

3. Return Button
   src/components/lesson/ReturnButton.tsx
   Özellikler:

"← Return to Dashboard" text
Tıklandığında /dashboard'a git
Hover effect

4. Lesson Controls
   src/components/lesson/LessonControls.tsx
   İçerik:

Video/Text Toggle: Yan yana iki buton
Ders Dropdown: Current chapter'daki tüm dersler

Toggle State:

Video aktif: Video icon highlighted
Text aktif: FileText icon highlighted
LocalStorage'da tercih saklanabilir

5. Content Panel
   src/components/lesson/ContentPanel.tsx
   Mod'a göre içerik:
   Video Mode:

YouTube embed veya video player
API'dan gelen video URL
Responsive 16:9 aspect ratio

Text Mode:

Markdown rendered content
Syntax highlighting for code blocks
Smooth scroll

API Response'dan gelen:

theory_content: Markdown string
video_url: YouTube embed URL (opsiyonel)

6. Markdown Renderer
   src/components/lesson/MarkdownContent.tsx
   Özellikler:

GitHub flavored markdown
Syntax highlighting (prism veya highlight.js)
Custom styling for headings, lists, code blocks
Responsive images

Library: react-markdown + rehype-highlight
bashnpm install react-markdown rehype-highlight remark-gfm 7. Editor Panel
src/components/lesson/EditorPanel.tsx
İki mod:

Code Editor - Assignment type
Quiz - Quiz type

Lesson type'a göre render:
typescript{lesson.type === 'QUIZ' ? (
<QuizPanel lesson={lesson} />
) : (
<CodeEditorPanel lesson={lesson} />
)} 8. Code Editor Panel
src/components/lesson/CodeEditorPanel.tsx
Özellikler:

Monaco Editor
Starter code pre-filled
Run button (preview)
Submit button (test against cases)
Output console
Test results display

API Calls:

POST /code-execution/run - Önizleme
POST /code-execution/submit - Submit ve test

Layout:
+------------------+
| Monaco Editor |
+------------------+
| Run | Submit |
+------------------+
| Output/Tests |
+------------------+ 9. Monaco Editor Setup
src/components/lesson/CodeEditor.tsx
typescriptimport Editor from '@monaco-editor/react';

interface CodeEditorProps {
language: string;
value: string;
onChange: (value: string) => void;
readOnly?: boolean;
}
Özellikler:

Language-aware syntax highlighting
Theme: vs-dark veya monokai
Font size: User preference'dan
Auto-complete (built-in)
Line numbers

10. Output Console
    src/components/lesson/OutputConsole.tsx
    Gösterir:

Kod çıktısı (run mode)
Test sonuçları (submit mode)
Error messages
Execution time

Test Result Item:
typescriptinterface TestResult {
title: string;
passed: boolean;
expected_output: string;
actual_output: string;
} 11. Quiz Panel
src/components/lesson/QuizPanel.tsx
Özellikler:

Soru text
4 şık (radio buttons)
Submit button
Result feedback
Next button (sonraki soruya/derse)

12. Lesson Navigation
    src/components/lesson/LessonNavigation.tsx
    Ders içi navigasyon:

Previous button
Next button
Progress indicator (3/10 gibi)

Ders tamamlandığında:

XP earned toast
Next lesson'a otomatik geç veya confirmation modal

13. Step/Assignment Flow
    Bir derste birden fazla adım olabilir:

Theory content (Video/Text)
Assignment 1 (Code)
Assignment 2 (Quiz)
Theory content 2
Final assignment

State management:
typescriptconst [currentStep, setCurrentStep] = useState(0);
const steps = lesson.steps || [{ type: 'content' }, { type: 'assignment' }];

Responsive Tasarım
Desktop (lg+):

İki panel yan yana (50% / 50%)
Resizable panels (opsiyonel)

Tablet (md):

İki panel yan yana (daha dar)
Veya tabs ile switch

Mobile (sm):

Tabs: Content | Editor
Tek seferde biri görünür

Stil Notları
Lesson Container
css.lesson-container {
height: 100vh;
display: flex;
flex-direction: column;
background: #0a0f1c;
}

.lesson-header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 1rem 2rem;
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lesson-content {
flex: 1;
display: grid;
grid-template-columns: 1fr 1fr;
overflow: hidden;
}
Content Panel
css.content-panel {
padding: 2rem;
overflow-y: auto;
}

.video-container {
position: relative;
padding-bottom: 56.25%; /_ 16:9 _/
height: 0;
}

.video-container iframe {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
border-radius: 0.5rem;
}
Editor Panel
css.editor-panel {
display: flex;
flex-direction: column;
border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-wrapper {
flex: 1;
min-height: 300px;
}

.editor-actions {
display: flex;
gap: 1rem;
padding: 1rem;
border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.output-console {
height: 200px;
padding: 1rem;
background: rgba(0, 0, 0, 0.3);
overflow-y: auto;
font-family: monospace;
font-size: 0.875rem;
}
Test Results
css.test-result {
display: flex;
align-items: center;
gap: 0.5rem;
padding: 0.5rem;
border-radius: 0.25rem;
margin-bottom: 0.5rem;
}

.test-passed {
background: rgba(0, 255, 136, 0.1);
color: #00ff88;
}

.test-failed {
background: rgba(255, 0, 0, 0.1);
color: #ff4444;
}
Toggle Buttons
css.toggle-group {
display: flex;
background: rgba(255, 255, 255, 0.05);
border-radius: 0.5rem;
padding: 0.25rem;
}

.toggle-btn {
padding: 0.5rem 1rem;
border-radius: 0.375rem;
transition: all 0.2s;
}

.toggle-btn.active {
background: rgba(0, 212, 255, 0.2);
color: #00d4ff;
}

Dosya Yapısı Sonuç
src/
├── app/
│ └── (main)/
│ └── lesson/
│ ├── layout.tsx
│ └── [id]/
│ └── page.tsx
└── components/
└── lesson/
├── ReturnButton.tsx
├── LessonControls.tsx
├── ContentPanel.tsx
├── MarkdownContent.tsx
├── EditorPanel.tsx
├── CodeEditorPanel.tsx
├── CodeEditor.tsx
├── OutputConsole.tsx
├── QuizPanel.tsx
└── LessonNavigation.tsx

API Response Örneği
GET /lessons/:id
json{
"id": "uuid",
"title": "Variables and Types",
"description": "Learn about Go variables",
"type": "ASSIGNMENT",
"difficulty": "BEGINNER",
"theory_content": "# Variables in Go\n\nIn Go, variables are...",
"video_url": "https://youtube.com/embed/...",
"starter_code": "package main\n\nfunc main() {\n // Your code here\n}",
"hints": ["Use var keyword", "Don't forget to import fmt"],
"xp_reward": 120,
"progress": {
"is_completed": false,
"best_score": 0
}
}
POST /code-execution/submit Response
json{
"submission_id": "uuid",
"status": "SUCCESS",
"score": 100,
"tests_passed": 3,
"tests_total": 3,
"test_results": [
{
"title": "Should print Hello",
"passed": true,
"expected_output": "Hello, World!",
"actual_output": "Hello, World!"
}
],
"execution_time": 150,
"xp_earned": 120
}

Flow & State Management
Lesson Completion Flow

User views content (video/text)
User clicks "Next" or scrolls to assignment
User writes code in editor
User clicks "Run" to preview
User clicks "Submit" to test
If all tests pass:

Show success message
Display XP earned
Mark lesson complete
Enable "Next Lesson" button

State
typescriptconst [mode, setMode] = useState<'video' | 'text'>('text');
const [code, setCode] = useState(lesson.starter_code || '');
const [output, setOutput] = useState('');
const [testResults, setTestResults] = useState<TestResult[]>([]);
const [isRunning, setIsRunning] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

Test Checklist

Lesson page yükleniyor
Navbar ve Footer yok
Return to Dashboard çalışıyor
Video/Text toggle çalışıyor
Ders dropdown çalışıyor
Markdown düzgün render oluyor
Video embed çalışıyor
Monaco Editor yükleniyor
Starter code görünüyor
Run button kod çalıştırıyor
Output console çıktı gösteriyor
Submit button test sonuçları gösteriyor
Passed/Failed testler renkleniyor
XP earned gösteriliyor
Next lesson navigasyonu çalışıyor
Quiz mode çalışıyor
Mobile responsive (tabs)

Hazır olduğunda bana bildir, test edeceğim.

Tamamlandığında Bildir
İşlemler tamamlandığında şu formatta rapor ver:
✅ TAMAMLANDI

Oluşturulan/Güncellenen dosyalar:

- [dosya listesi]

⚠️ UYARILAR:

- [Monaco Editor yükleme sorunu varsa]
- [Code execution API sorunu varsa]
- [Video URL format uyumsuzluğu varsa]
- [Test cases API response formatı farklıysa]

🔍 SONRAKİ ADIM:
Phase 5 için hazırım. Challenges sayfasını (cockpit, timer) ekleyeceğiz.
PHASE 4 PROMPT BİTİŞ

PHASE 5 PROMPT BAŞLANGIÇ
Phase 5'i başlatıyoruz - Challenges Page. Bu sayfa uzay gemisi kokpiti konseptinde tasarlanacak ve kullanıcılar geri sayımlı sorular/code challenges ile puan kazanacak.
Sayfa Yapısı
Wireframe'deki gibi (Image 1):

Sabit Navbar - "Challenges" aktif
Ana içerik: Kokpit görünümü

Ön cam (windshield) içinde soru/challenge
Alt kısımda direksiyon tutan eller

Sabit Footer

Görev Listesi

1. Challenges Page
src/app/(main)/challenges/page.tsx oluştur:
Layout:
tsx<div className="challenges-container">
<CockpitView>
<ChallengeContent />
</CockpitView>
<PilotHands />
</div>
2. Cockpit View Component
   src/components/challenges/CockpitView.tsx
   Özellikler:

Full width container
Cockpit frame görsel/CSS overlay
İçerik (children) merkeze yerleşir
Ambient glow effects

Yapı:
tsx<div className="cockpit-container">

  <div className="cockpit-frame" />
  <div className="cockpit-content">
    {children}
  </div>
</div>
3. Pilot Hands Component
src/components/challenges/PilotHands.tsx
Özellikler:

Sayfanın altında fixed position
Direksiyon tutan eller görseli
Subtle animation (hafif hareket)

4. Challenge Content Component
   src/components/challenges/ChallengeContent.tsx
   State Machine:

Loading: Challenge yükleniyor
Ready: Challenge gösteriliyor, geri sayım başlamadı
Active: Geri sayım çalışıyor, kullanıcı cevaplıyor
Submitted: Cevap gönderildi, sonuç gösteriliyor
Complete: Sonuç gösterildi, next challenge için hazır

API Calls:

GET /challenges/random - Rastgele challenge al
POST /challenges/submit - Cevap gönder

5. Quiz Challenge Component
   src/components/challenges/QuizChallenge.tsx
   Type: QUIZ olduğunda render edilir
   Özellikler:

Soru text (büyük, okunaklı)
4 şık (A, B, C, D styled buttons)
Geri sayım timer (circular progress)
Seçilen şık highlight
Submit button

Stil:

Şıklar glassmorphism kartlar
Hover ve selected states
Keyboard shortcuts (1, 2, 3, 4)

6. Code Challenge Component
   src/components/challenges/CodeChallenge.tsx
   Type: CODE olduğunda render edilir
   Özellikler:

Challenge description
Monaco Editor (küçük boyut)
Timer
Submit button

7. Countdown Timer
   src/components/challenges/CountdownTimer.tsx
   Özellikler:

Circular progress indicator
Saniye gösterimi
Son 10 saniye warning (kırmızı)
Time up handling

Stil:
css.countdown-timer {
width: 80px;
height: 80px;
position: relative;
}

.timer-circle {
stroke: #00d4ff;
stroke-width: 4;
fill: none;
transform: rotate(-90deg);
transition: stroke-dashoffset 1s linear;
}

.timer-warning {
stroke: #ff4444;
}

.timer-text {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
font-size: 1.5rem;
font-weight: bold;
} 8. Challenge Result Component
src/components/challenges/ChallengeResult.tsx
Doğru cevap:

Yeşil checkmark animasyonu
"Correct! +{xp} XP" mesajı
Speed bonus varsa göster
"Next Challenge" button

Yanlış cevap:

Kırmızı X animasyonu
"Incorrect" mesajı
Doğru cevabı gösterme (opsiyonel)
"Try Again" button

9. Challenge Filters
   src/components/challenges/ChallengeFilters.tsx
   Opsiyonel filtreler (sağ üstte):

Tech Stack dropdown (GO, PYTHON, etc.)
Difficulty dropdown (BEGINNER, etc.)

Kokpit temasına uygun kontrol paneli görünümü

Animasyonlar
Timer Animation
typescript// Circular countdown
const circumference = 2 _ Math.PI _ 35; // radius 35
const offset = circumference \* (1 - timeLeft / totalTime);
Result Animations
Correct:

Scale up + fade in
Confetti effect (opsiyonel)
XP counter animation

Incorrect:

Shake animation
Red flash

Cockpit Ambiance

Subtle light flickering
Instrument panel blinks (CSS)

Responsive Tasarım
Desktop (lg+):

Full cockpit experience
Şıklar 2x2 grid

Tablet (md):

Scaled down cockpit
Şıklar 2x2 grid

Mobile (sm):

Simplified cockpit frame
Şıklar 1 column
Hands hidden

Stil Notları
Challenges Container
css.challenges-container {
position: relative;
min-height: calc(100vh - navbar - footer);
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 2rem;
overflow: hidden;
}
Cockpit View
css.cockpit-container {
position: relative;
width: 100%;
max-width: 900px;
aspect-ratio: 16/10;
}

.cockpit-frame {
position: absolute;
inset: 0;
background-image: url('/images/cockpit-frame.png');
background-size: contain;
background-repeat: no-repeat;
background-position: center;
pointer-events: none;
z-index: 10;
}

.cockpit-content {
position: absolute;
top: 15%;
left: 15%;
right: 15%;
bottom: 20%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem;
}
Quiz Options
css.quiz-options {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 1rem;
width: 100%;
max-width: 600px;
}

.quiz-option {
display: flex;
align-items: center;
gap: 1rem;
padding: 1rem 1.5rem;
background: rgba(255, 255, 255, 0.05);
border: 2px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
cursor: pointer;
transition: all 0.2s;
}

.quiz-option:hover {
background: rgba(255, 255, 255, 0.1);
border-color: rgba(0, 212, 255, 0.5);
}

.quiz-option.selected {
background: rgba(0, 212, 255, 0.1);
border-color: #00d4ff;
box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.option-letter {
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
background: rgba(255, 255, 255, 0.1);
border-radius: 0.5rem;
font-weight: bold;
}
Pilot Hands
css.pilot-hands {
position: fixed;
bottom: 0;
left: 50%;
transform: translateX(-50%);
width: 60%;
max-width: 600px;
pointer-events: none;
z-index: 5;
}

.pilot-hands img {
width: 100%;
height: auto;
}
Result Display
css.result-correct {
color: #00ff88;
text-align: center;
}

.result-incorrect {
color: #ff4444;
text-align: center;
}

.xp-earned {
font-size: 2rem;
font-weight: bold;
animation: countUp 0.5s ease-out;
}

@keyframes countUp {
from { transform: scale(0.5); opacity: 0; }
to { transform: scale(1); opacity: 1; }
}

Dosya Yapısı Sonuç
src/
├── app/
│ └── (main)/
│ └── challenges/
│ └── page.tsx
└── components/
└── challenges/
├── CockpitView.tsx
├── PilotHands.tsx
├── ChallengeContent.tsx
├── QuizChallenge.tsx
├── CodeChallenge.tsx
├── CountdownTimer.tsx
├── ChallengeResult.tsx
└── ChallengeFilters.tsx

API Response Örnekleri
GET /challenges/random
json{
"id": "uuid",
"type": "QUIZ",
"question": "What is the output of fmt.Println(1 + 2)?",
"options": ["12", "3", "1 + 2", "Error"],
"difficulty": "BEGINNER",
"xp_reward": 50,
"time_limit": 300,
"tech_stack": "GO"
}
POST /challenges/submit
json{
"id": "uuid",
"is_correct": true,
"xp_earned": 75,
"time_taken": 45,
"new_total_xp": 575,
"new_level": 5
}

Flow

Sayfa yüklenir → Challenge fetch edilir
Challenge görünür, "Start" button
Start'a basınca timer başlar
Kullanıcı seçim yapar
Submit'e basar veya zaman biter
Sonuç gösterilir
"Next Challenge" → Yeni challenge fetch

Test Checklist

Challenges page yükleniyor
Cockpit frame görünüyor
Challenge fetch ediliyor
Geri sayım timer çalışıyor
Quiz şıkları tıklanabiliyor
Seçili şık highlight
Submit çalışıyor
Doğru/Yanlış sonuç gösteriliyor
XP earned gösteriliyor
Next challenge çalışıyor
Code challenge mode çalışıyor
Timer bitince auto-submit
Pilot hands görünüyor
Mobile responsive

Hazır olduğunda bana bildir, test edeceğim.

Tamamlandığında Bildir
İşlemler tamamlandığında şu formatta rapor ver:
✅ TAMAMLANDI

Oluşturulan/Güncellenen dosyalar:

- [dosya listesi]

⚠️ UYARILAR:

- [Cockpit frame görseli yoksa - CSS placeholder kullanıldı]
- [Pilot hands görseli yoksa - gizlendi veya placeholder]
- [Challenges API response formatı farklıysa]
- [Timer/countdown sorunu varsa]

🔍 SONRAKİ ADIM:
Phase 6 için hazırım. Leaderboard sayfasını (podium, live feed) ekleyeceğiz.
PHASE 5 PROMPT BİTİŞ

PHASE 6 PROMPT BAŞLANGIÇ
Phase 6'yı başlatıyoruz - Leaderboard. Bu sayfa Top 20 listesi, Top 3 podyum görseli ve canlı aktivite feed'i içeriyor.
Sayfa Yapısı
Wireframe'deki gibi (Image 4):

Sabit Navbar - "Leaderboard" aktif
Sol Panel (%20): Top 20 listesi
Orta Panel (%45): Top 3 podyum
Sağ Panel (%35): Canlı aktivite feed
Sabit Footer

Görev Listesi

1. Leaderboard Page
src/app/(main)/leaderboard/page.tsx oluştur:
Layout:
tsx<div className="leaderboard-container">
  <aside className="left-panel">
    <Top20List />
  </aside>
  <main className="center-panel">
    <TopThreePodium />
  </main>
  <aside className="right-panel">
    <ActivityFeed />
  </aside>
</div>
2. Top 20 List Component
   src/components/leaderboard/Top20List.tsx
   Özellikler:

GlassCard içinde
Scrollable list
Her entry: Rank, Avatar, Name, XP
Current user highlight
"Show More" button (pagination)

API Call:

GET /leaderboard/global?limit=20

List Item:
typescriptinterface LeaderboardEntry {
rank: number;
user_id: string;
display_name: string;
avatar?: string;
total_xp: number;
level: number;
} 3. Leaderboard Entry Component
src/components/leaderboard/LeaderboardEntry.tsx
Özellikler:

Rank number (1, 2, 3 special styling)
Avatar (or default)
Display name
XP badge
Hover effect

Special Ranks:

#1: Gold accent
#2: Silver accent
#3: Bronze accent

4. Top Three Podium Component
   src/components/leaderboard/TopThreePodium.tsx
   Özellikler:

Görsel podyum veya CSS podyum
3 kullanıcı avatarı podyumda
Crown/medal ikonları
İsimler ve XP'ler

Layout:
[1st]
[2nd] [3rd]
Her kullanıcı için:

Avatar (büyük)
Crown/Medal icon
Display name
Total XP
Level badge

API Call:

Aynı global leaderboard'dan ilk 3

5. Activity Feed Component
   src/components/leaderboard/ActivityFeed.tsx
   Özellikler:

GlassCard içinde
Real-time updates (WebSocket)
Son aktiviteler listesi
Her entry: Avatar, İsim, Aksiyon, XP, Zaman

WebSocket Connection:

ws://localhost:8080/api/v1/ws/activity-feed
Fallback: REST polling

API Call (Fallback):

GET /activity-feed/recent

6. Activity Item Component
   src/components/leaderboard/ActivityItem.tsx
   Özellikler:

Küçük avatar
Display name
Action description
XP earned (opsiyonel)
Relative time (2m ago, just now)

Activity Types:

LESSON_COMPLETED: "{user} completed '{lesson}'"
ACHIEVEMENT_EARNED: "{user} earned '{badge}'"
LEVEL_UP: "{user} reached Level {n}"
STREAK_MILESTONE: "{user} has a {n} day streak"
CHALLENGE_COMPLETED: "{user} completed a challenge"

7. WebSocket Hook
   src/hooks/useActivityFeed.ts
   typescriptconst useActivityFeed = () => {
   const [activities, setActivities] = useState<Activity[]>([]);
   const [isConnected, setIsConnected] = useState(false);

useEffect(() => {
const token = localStorage.getItem('access_token');
const ws = new WebSocket(
`ws://localhost:8080/api/v1/ws/activity-feed?token=${token}`
);

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'activity') {
        setActivities(prev => [message.payload, ...prev].slice(0, 20));
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Reconnect logic
    };

    return () => ws.close();

}, []);

return { activities, isConnected };
}; 8. Leaderboard Tabs (Opsiyonel)
src/components/leaderboard/LeaderboardTabs.tsx
Farklı leaderboard'lar:

Global (All Time)
Weekly
Monthly
By Tech Stack

Responsive Tasarım
Desktop (lg+):

3 panel yan yana (20% / 45% / 35%)

Tablet (md):

Üstte podium (full width)
Altta: Top 20 (50%) | Activity (50%)

Mobile (sm):

Tabs: Rankings | Activity
Podium üstte her zaman görünür
Top 20 ve Activity tabs ile switch

Stil Notları
Leaderboard Container
css.leaderboard-container {
display: grid;
grid-template-columns: 280px 1fr 320px;
gap: 1.5rem;
padding: 2rem;
min-height: calc(100vh - navbar - footer);
}

@media (max-width: 1200px) {
.leaderboard-container {
grid-template-columns: 1fr 1fr;
grid-template-rows: auto 1fr;
}

.center-panel {
grid-column: 1 / -1;
}
}

@media (max-width: 768px) {
.leaderboard-container {
grid-template-columns: 1fr;
}
}
Top 20 Panel
css.top20-panel {
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
padding: 1.5rem;
overflow: hidden;
display: flex;
flex-direction: column;
}

.top20-header {
font-size: 1.25rem;
font-weight: bold;
margin-bottom: 1rem;
padding-bottom: 1rem;
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.top20-list {
flex: 1;
overflow-y: auto;
}

.show-more-btn {
margin-top: 1rem;
text-align: center;
color: #00d4ff;
cursor: pointer;
}
Leaderboard Entry
css.leaderboard-entry {
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.75rem;
border-radius: 0.5rem;
transition: background 0.2s;
}

.leaderboard-entry:hover {
background: rgba(255, 255, 255, 0.05);
}

.leaderboard-entry.current-user {
background: rgba(0, 212, 255, 0.1);
border: 1px solid rgba(0, 212, 255, 0.3);
}

.entry-rank {
width: 30px;
font-weight: bold;
color: rgba(255, 255, 255, 0.6);
}

.entry-rank.gold { color: #ffd700; }
.entry-rank.silver { color: #c0c0c0; }
.entry-rank.bronze { color: #cd7f32; }

.entry-avatar {
width: 36px;
height: 36px;
border-radius: 50%;
object-fit: cover;
}

.entry-name {
flex: 1;
font-weight: 500;
}

.entry-xp {
font-size: 0.875rem;
color: #00d4ff;
font-weight: 600;
}
Podium
css.podium-container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem;
}

.podium-title {
font-size: 1.5rem;
font-weight: bold;
margin-bottom: 2rem;
}

.podium {
display: flex;
align-items: flex-end;
gap: 1rem;
}

.podium-place {
display: flex;
flex-direction: column;
align-items: center;
}

.podium-avatar {
width: 80px;
height: 80px;
border-radius: 50%;
object-fit: cover;
border: 3px solid;
margin-bottom: 0.5rem;
}

.podium-1st .podium-avatar { border-color: #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
.podium-2nd .podium-avatar { border-color: #c0c0c0; }
.podium-3rd .podium-avatar { border-color: #cd7f32; }

.podium-crown {
color: #ffd700;
margin-bottom: -10px;
z-index: 10;
}

.podium-platform {
width: 100px;
display: flex;
flex-direction: column;
align-items: center;
padding: 1rem;
border-radius: 0.5rem 0.5rem 0 0;
}

.podium-1st .podium-platform {
height: 120px;
background: linear-gradient(to top, rgba(255, 215, 0, 0.2), transparent);
}

.podium-2nd .podium-platform {
height: 90px;
background: linear-gradient(to top, rgba(192, 192, 192, 0.2), transparent);
}

.podium-3rd .podium-platform {
height: 60px;
background: linear-gradient(to top, rgba(205, 127, 50, 0.2), transparent);
}
Activity Feed
css.activity-feed {
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
padding: 1.5rem;
overflow: hidden;
display: flex;
flex-direction: column;
}

.feed-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1rem;
}

.feed-status {
display: flex;
align-items: center;
gap: 0.5rem;
font-size: 0.75rem;
}

.status-dot {
width: 8px;
height: 8px;
border-radius: 50%;
}

.status-dot.connected { background: #00ff88; }
.status-dot.disconnected { background: #ff4444; }

.feed-list {
flex: 1;
overflow-y: auto;
}

.activity-item {
display: flex;
gap: 0.75rem;
padding: 0.75rem 0;
border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.activity-avatar {
width: 32px;
height: 32px;
border-radius: 50%;
flex-shrink: 0;
}

.activity-content {
flex: 1;
}

.activity-text {
font-size: 0.875rem;
line-height: 1.4;
}

.activity-text strong {
color: #00d4ff;
}

.activity-time {
font-size: 0.75rem;
color: rgba(255, 255, 255, 0.5);
margin-top: 0.25rem;
}

Dosya Yapısı Sonuç
src/
├── app/
│ └── (main)/
│ └── leaderboard/
│ └── page.tsx
├── components/
│ └── leaderboard/
│ ├── Top20List.tsx
│ ├── LeaderboardEntry.tsx
│ ├── TopThreePodium.tsx
│ ├── ActivityFeed.tsx
│ ├── ActivityItem.tsx
│ └── LeaderboardTabs.tsx
└── hooks/
└── useActivityFeed.ts

API Response Örnekleri
GET /leaderboard/global
json{
"data": [
{
"rank": 1,
"user_id": "uuid",
"display_name": "SpaceMaster",
"avatar": "/uploads/avatars/...",
"total_xp": 15000,
"level": 25
},
...
]
}
WebSocket Activity Message
json{
"type": "activity",
"payload": {
"id": "uuid",
"user": {
"id": "uuid",
"display_name": "John",
"avatar": "...",
"level": 5
},
"type": "LESSON_COMPLETED",
"description": "John completed 'Variables'",
"created_at": "2024-11-17T10:30:00Z"
}
}

Test Checklist

Leaderboard page yükleniyor
Top 20 list görünüyor
Rank 1-3 özel renklerde
Current user highlight
Show More çalışıyor
Top 3 podium render oluyor
Crown/medal ikonları
Activity feed görünüyor
WebSocket bağlantısı kuruluyor
Live updates geliyor
Relative time (2m ago) doğru
WebSocket fail -> REST fallback
Mobile responsive
Avatarlar yükleniyor

Hazır olduğunda bana bildir, test edeceğim.

Tamamlandığında Bildir
İşlemler tamamlandığında şu formatta rapor ver:
✅ TAMAMLANDI

Oluşturulan/Güncellenen dosyalar:

- [dosya listesi]

⚠️ UYARILAR:

- [Podium görseli yoksa - CSS placeholder kullanıldı]
- [WebSocket bağlantı sorunu varsa]
- [Leaderboard API response formatı farklıysa]
- [Activity feed API sorunu varsa]

🎉 PROJE TAMAMLANDI!
Tüm ana sayfalar ve özellikler implemente edildi.
Şimdi test, polish ve ek özellikler için hazır.
PHASE 6 PROMPT BİTİŞ
