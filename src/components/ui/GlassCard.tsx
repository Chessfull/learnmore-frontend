import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'green' | 'purple' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function GlassCard({ 
  children, 
  className, 
  hover = false, 
  glow = 'none',
  padding = 'md' 
}: GlassCardProps) {
  const glowColors = {
    none: '',
    cyan: 'shadow-[0_0_30px_rgba(0,212,255,0.15)]',
    green: 'shadow-[0_0_30px_rgba(0,255,136,0.15)]',
    purple: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl',
        hover && 'hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer',
        glowColors[glow],
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

