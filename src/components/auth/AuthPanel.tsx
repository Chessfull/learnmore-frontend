'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthTab = 'login' | 'register';

export function AuthPanel() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  return (
    <GlassCard padding="lg" glow="cyan" className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {activeTab === 'login' ? 'Ready for take-off?' : 'Join LearnMore'}
        </h2>


        <p className="text-white/60">
          {activeTab === 'login'
            ? 'Join thousands of developers exploring the code universe'
            : 'Start your programming adventure in space'}
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('login')}
          className={clsx(
            'relative pb-3 px-4 text-sm font-semibold transition-colors',
            activeTab === 'login' ? 'text-[#00d4ff]' : 'text-white/50 hover:text-white/70'
          )}
        >
          Login
          {activeTab === 'login' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={clsx(
            'relative pb-3 px-4 text-sm font-semibold transition-colors',
            activeTab === 'register' ? 'text-[#00d4ff]' : 'text-white/50 hover:text-white/70'
          )}
        >
          Register
          {activeTab === 'register' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Form Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </motion.div>
    </GlassCard>
  );
}

