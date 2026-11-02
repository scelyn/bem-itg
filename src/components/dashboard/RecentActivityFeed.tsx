import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  FileText,
  MessageSquare,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export interface AuditLogItem {
  id: string;
  action: string;
  module: string;
  targetId?: string | null;
  details?: string | null;
  createdAt: string;
  user?: {
    username: string;
    fullName: string;
    roleId: string;
  } | null;
}

interface RecentActivityFeedProps {
  logs: AuditLogItem[];
  isLoading?: boolean;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  logs,
  isLoading = false,
}) => {
  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN_SUCCESS')) {
      return {
        label: 'Login Berhasil',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: ShieldCheck,
      };
    }
    if (action.includes('LOGIN_FAILED') || action.includes('DENIED')) {
      return {
        label: 'Akses Ditolak',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: ShieldAlert,
      };
    }
    if (action.includes('USER_CREATED')) {
      return {
        label: 'Buat Akun',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: UserCheck,
      };
    }
    if (action.includes('ASPIRATION')) {
      return {
        label: 'Aspirasi',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: MessageSquare,
      };
    }
    if (action.includes('NEWS') || action.includes('DOCUMENT')) {
      return {
        label: 'Konten / Dokumen',
        bg: 'bg-blue-50 text-brand-blue border-blue-200',
        icon: FileText,
      };
    }
    return {
      label: action.replace(/_/g, ' '),
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: KeyRound,
    };
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return 'Baru saja';
      if (diffMin < 60) return `${diffMin} menit yang lalu`;
      if (diffHour < 24) return `${diffHour} jam yang lalu`;
      if (diffDay === 1) return 'Kemarin';
      return `${diffDay} hari yang lalu`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,42,98,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy tracking-tight">
            Aktivitas Sistem Terbaru
          </h2>
          <p className="text-xs text-slate-500">Jejak audit keamanan & mutasi data</p>
        </div>

        <Link
          to="/dashboard/super-admin/audit-logs"
          className="text-xs font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1 transition-colors"
        >
          <span>Lihat Semua</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="text-xs font-semibold text-slate-600">Belum Ada Aktivitas Tercatat</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Setiap aksi pengelola dan peristiwa autentikasi akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {logs.map((log) => {
            const badge = getActionBadge(log.action);
            const Icon = badge.icon;
            const actorName = log.user?.fullName || log.user?.username || 'Sistem Otomatis';

            return (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${badge.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800">
                        {actorName}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono text-[11px] mt-0.5 line-clamp-1">
                      Modul: <span className="font-semibold text-slate-700">{log.module}</span>
                      {log.details && (
                        <span className="text-slate-400 ml-1.5">• {log.details}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 shrink-0 font-mono mt-0.5">
                  {formatRelativeTime(log.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

