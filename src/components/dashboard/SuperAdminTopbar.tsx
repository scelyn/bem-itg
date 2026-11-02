import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings,
  History,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardBreadcrumb } from './DashboardBreadcrumb';

interface SuperAdminTopbarProps {
  onOpenMobileSidebar: () => void;
}

export const SuperAdminTopbar: React.FC<SuperAdminTopbarProps> = ({
  onOpenMobileSidebar,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,42,98,0.02)]">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Buka navigasi sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <DashboardBreadcrumb />
      </div>

      {/* Right: Search + System Status + Notifications + User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Bar (Hidden on very small screens) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul atau data..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
          />
        </div>

        {/* Database Live Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PostgreSQL Live</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Pemberitahuan"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-red ring-2 ring-white" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Pemberitahuan Sistem</span>
                <span className="text-[10px] font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full">
                  Supabase Live
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Supabase PostgreSQL Aktif</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Koneksi database PostgreSQL versi 17 terhubung dan siap menangani data portal.
                  </p>
                </div>

                <div className="p-3 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>RBAC Matrix Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sistem otentikasi JWT dan 26 permissions aktif menjaga keamanan modul pengelola.
                  </p>
                </div>
              </div>

              <div className="pt-2 px-3 border-t border-slate-100 text-center">
                <Link
                  to="/dashboard/super-admin/audit-logs"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[11px] font-semibold text-brand-blue hover:text-brand-navy transition-colors inline-block"
                >
                  Lihat Riwayat Audit Log Lengkap →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Button */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            aria-label="Menu profil Super Admin"
          >
            {/* Avatar Pill */}
            <div className="w-8 h-8 rounded-full bg-brand-navy text-brand-yellow font-heading font-black text-xs flex items-center justify-center shadow-sm">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {user?.fullName?.split(' ')[0] || user?.username || 'Super Admin'}
              </div>
              <div className="text-[10px] font-mono text-brand-blue font-semibold uppercase tracking-wider">
                Root Admin
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.fullName || user?.username}
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                  {user?.email}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Tier 1 • Super Admin</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/dashboard/super-admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Pengaturan Sistem</span>
                </Link>

                <Link
                  to="/dashboard/super-admin/audit-logs"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition-colors"
                >
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Jejak Audit Keamanan</span>
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Lihat Website Publik</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
