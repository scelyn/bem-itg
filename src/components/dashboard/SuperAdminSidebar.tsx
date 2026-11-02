import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  MessageSquareText,
  Newspaper,
  FileText,
  Network,
  History,
  Settings,
  ExternalLink,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SuperAdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { logout, user } = useAuth();

  const navItems = [
    {
      to: '/dashboard/super-admin',
      label: 'Overview',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/dashboard/super-admin/users',
      label: 'Manajemen Pengguna',
      icon: Users,
    },
    {
      to: '/dashboard/super-admin/roles',
      label: 'Role & Permissions',
      icon: ShieldCheck,
    },
    {
      to: '/dashboard/super-admin/aspirations',
      label: 'Aspirasi Mahasiswa',
      icon: MessageSquareText,
    },
    {
      to: '/dashboard/super-admin/news',
      label: 'Manajemen Berita',
      icon: Newspaper,
    },
    {
      to: '/dashboard/super-admin/documents',
      label: 'Dokumen Legal',
      icon: FileText,
    },
    {
      to: '/dashboard/super-admin/organization',
      label: 'Organisasi Kabinet',
      icon: Network,
    },
    {
      to: '/dashboard/super-admin/audit-logs',
      label: 'Audit Log Sistem',
      icon: History,
    },
    {
      to: '/dashboard/super-admin/settings',
      label: 'Pengaturan Sistem',
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#001D45] text-slate-100 select-none relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-24 h-24 bg-brand-yellow/10 rounded-full blur-xl pointer-events-none" />

      {/* 1. Brand Identity Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between relative z-10">
        <Link
          to="/dashboard/super-admin"
          className="flex items-center gap-3 overflow-hidden group"
          title="Super Admin Console"
        >
          {/* Logo Capsule */}
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200 p-1">
            <img
              src="/logo-bem.png"
              alt="BEM ITG"
              className="w-full h-full object-contain"
            />
          </div>

          {!isCollapsed && (
            <div className="overflow-hidden transition-all duration-200">
              <div className="font-heading font-black text-sm tracking-tight text-white flex items-center gap-1.5 leading-none mb-1">
                <span>BEM ITG</span>
                <span className="text-brand-yellow text-xs font-mono font-bold">KOLEKTIVA</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-brand-yellow border border-amber-400/30">
                Super Admin
              </div>
            </div>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Tutup menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar relative z-10">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400/80">
            Menu Utama
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/8'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar on the left */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-yellow rounded-r-full shadow-[0_0_8px_#FFBC00]" />
                  )}

                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isActive ? 'text-brand-yellow scale-110' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {/* Tooltip on collapsed state */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* 3. Bottom Actions & Profile Footer */}
      <div className="p-3 border-t border-white/10 space-y-1 relative z-10 bg-black/10">
        {/* View Public Website */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-colors ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'Buka Website Publik' : undefined}
        >
          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span>Website Publik</span>}
        </Link>

        {/* User Mini Profile */}
        {!isCollapsed && user && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 my-1 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold font-mono text-xs shrink-0 border border-brand-yellow/30">
              {user.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden text-left flex-1">
              <div className="text-xs font-bold text-white truncate">
                {user.fullName || user.username}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            logout();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'Keluar dari Sesi' : undefined}
        >
          <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
          {!isCollapsed && <span>Keluar (Logout)</span>}
        </button>

        {/* Desktop Collapse Toggle Bar at the very bottom */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs gap-1.5 cursor-pointer mt-1"
          aria-label={isCollapsed ? 'Buka sidebar' : 'Ciutkan sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] font-mono">Sembunyikan Menu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar (Fixed on the left) */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay backdrop + slide-in panel) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 ease-out z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

