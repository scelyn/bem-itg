import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  'super-admin': 'Overview',
  users: 'Manajemen Pengguna',
  roles: 'Role & Permissions',
  aspirations: 'Aspirasi Mahasiswa',
  news: 'Manajemen Berita',
  documents: 'Dokumen Legal',
  organization: 'Organisasi Kabinet',
  'audit-logs': 'Audit Log Sistem',
  settings: 'Pengaturan Sistem',
};

export const DashboardBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Expected segments: ['dashboard', 'super-admin', ...]
  const subSegments = pathSegments.slice(2);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
      <Link
        to="/dashboard/super-admin"
        className="flex items-center gap-1 hover:text-brand-navy transition-colors text-slate-600"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

      {subSegments.length === 0 ? (
        <span className="font-semibold text-brand-navy">Overview</span>
      ) : (
        <>
          <Link
            to="/dashboard/super-admin"
            className="hover:text-brand-navy transition-colors text-slate-500 hidden sm:inline"
          >
            Overview
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:inline" />
          <span className="font-semibold text-brand-navy truncate">
            {ROUTE_LABELS[subSegments[0]] || subSegments[0]}
          </span>
        </>
      )}
    </nav>
  );
};

