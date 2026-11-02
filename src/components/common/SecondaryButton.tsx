import React from 'react';
import { cn } from '../../utils/cn';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'navy' | 'light' | 'yellow' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  className,
  variant = 'navy',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-8 py-3.5 text-sm sm:text-base',
  };

  const variantClasses = {
    navy: 'bg-brand-navy/90 hover:bg-brand-navy text-white border border-white/10 hover:border-brand-yellow/50 shadow-clay',
    light: 'bg-brand-white hover:bg-white text-brand-navy border border-brand-border hover:border-brand-blue shadow-sm',
    yellow: 'bg-brand-yellow hover:bg-[#e6a800] text-brand-navy font-bold shadow-clay-yellow',
    blue: 'bg-brand-blue/90 hover:bg-brand-blue text-white border border-white/10 shadow-clay-blue',
  };

  return (
    <button
      className={cn(
        'rounded-full font-heading font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

