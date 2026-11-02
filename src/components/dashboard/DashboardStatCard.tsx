import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  accentColor?: string;
  isLoading?: boolean;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-brand-blue',
  accentColor = 'border-slate-200/80',
  isLoading = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border ${accentColor} p-5 shadow-[0_2px_12px_-2px_rgba(0,42,98,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,42,98,0.08)] transition-all duration-200 flex flex-col justify-between relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 block mb-1">
            {title}
          </span>
          {isLoading ? (
            <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <div className="font-heading font-black text-2xl sm:text-3xl text-brand-navy tracking-tight">
              {value}
            </div>
          )}
        </div>

        <div
          className={`w-11 h-11 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtitle && (
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pt-2 border-t border-slate-100">
          {isLoading ? (
            <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
          ) : (
            <span>{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

