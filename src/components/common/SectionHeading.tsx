import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  theme?: 'dark' | 'light';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  badgeIcon,
  title,
  description,
  align = 'left',
  theme = 'dark',
  className,
}) => {
  const isCenter = align === 'center';
  const isLight = theme === 'light';

  return (
    <div
      className={cn(
        'space-y-3',
        isCenter ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl',
        className
      )}
    >
      {badgeText && (
        <div className={cn('inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider', isLight ? 'text-brand-blue' : 'text-brand-yellow')}>
          <span className={cn('w-4 h-[2px]', isLight ? 'bg-brand-blue' : 'bg-brand-yellow')} />
          {badgeIcon && <span>{badgeIcon}</span>}
          <span>{badgeText}</span>
        </div>
      )}

      <h2
        className={cn(
          'font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight',
          isLight ? 'text-brand-navy' : 'text-brand-white'
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'text-sm sm:text-base leading-relaxed',
            isLight ? 'text-slate-600' : 'text-slate-300/85'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

