import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'navy';
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'dark',
  className,
  hoverEffect = false,
  ...props
}) => {
  const variantClasses = {
    dark: 'glass-card-dark text-brand-white shadow-glass-dark',
    light: 'glass-card-light text-brand-navy shadow-glass',
    navy: 'bg-brand-navy/90 text-brand-white border border-white/10 shadow-clay',
  };

  return (
    <div
      className={cn(
        'rounded-3xl p-6 sm:p-8 transition-all duration-300',
        variantClasses[variant],
        hoverEffect && 'hover:border-brand-yellow/40 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

