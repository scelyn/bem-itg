import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'red' | 'blue' | 'navy' | 'emerald' | 'white';
  className?: string;
  size?: 'xs' | 'sm';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'yellow',
  className,
  size = 'xs',
}) => {
  const sizeClasses = {
    xs: 'px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase',
    sm: 'px-3 py-1 text-xs font-bold tracking-wide',
  };

  const variantClasses = {
    yellow: 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40',
    red: 'bg-brand-red/20 text-brand-red border border-brand-red/40',
    blue: 'bg-brand-blue/20 text-blue-300 border border-brand-blue/40',
    navy: 'bg-brand-navy/80 text-brand-white border border-white/10',
    emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    white: 'bg-white/10 text-white border border-white/20 backdrop-blur-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-heading',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

