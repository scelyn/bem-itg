import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getRoleDisplayName } from '../../context/AuthContext';
import { LogOut, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTabTitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTabTitle,
}) => {
  const { user, logout, isBackendConnected } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true, state: null });
  };

  const getRoleBadgeClasses = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/15 text-purple-700 border-purple-300 dark:border-purple-500/30 dark:text-purple-300';
      case 'admin':
        return 'bg-blue-500/15 text-blue-700 border-blue-300 dark:border-blue-500/30 dark:text-blue-300';
      case 'editor':
        return 'bg-amber-500/15 text-amber-800 border-amber-300 dark:border-amber-500/30 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Organization Identity */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group" title="Kembali ke Portal Publik">
              <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="font-heading font-black text-brand-yellow text-sm tracking-wider">ITG</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-heading font-extrabold text-sm text-brand-navy tracking-tight leading-tight">
                  BEM ITG KOLEKTIVA
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Panel Manajemen Terpadu
                </div>
              </div>
            </Link>

            <span className="text-slate-300 hidden md:inline">/</span>

            {/* Role Badge */}
            {user && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeClasses(
                    user.role
                  )}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{getRoleDisplayName(user.role)}</span>
                </span>
                {activeTabTitle && (
                  <span className="hidden lg:inline text-xs font-medium text-slate-500">
                    • {activeTabTitle}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* View Public Website Link */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-blue rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </Link>

            {/* User Info Capsule */}
            {user && (
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              data-testid="logout-button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200"
              title="Keluar dari sesi ini"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Backend notice banner if running standalone/dev mode */}
      {!isBackendConnected && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Modus Arsitektur RBAC Terpasang:</strong> Sesi saat ini berjalan dengan akun terverifikasi. Ketika API server backend aktif, sesi akan otomatis diverifikasi melalui endpoint resmi (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">POST /api/auth/login</code>).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-mono">
        BEM ITG KOLEKTIVA Management Panel &copy; {new Date().getFullYear()} • Role-Based Access Control (RBAC) System
      </footer>
    </div>
  );
};
