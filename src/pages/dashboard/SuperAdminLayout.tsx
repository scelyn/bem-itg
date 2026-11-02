import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SuperAdminSidebar } from '../../components/dashboard/SuperAdminSidebar';
import { SuperAdminTopbar } from '../../components/dashboard/SuperAdminTopbar';

export const SuperAdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-800 flex font-sans selection:bg-brand-yellow/30 selection:text-brand-navy">
      {/* 1. Sidebar Component (Desktop Sticky + Mobile Drawer) */}
      <SuperAdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <SuperAdminTopbar
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-200/80 bg-white/60 py-3.5 px-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BEM ITG KOLEKTIVA &copy; {new Date().getFullYear()} • Panel Super Admin</span>
          <span className="text-[11px] text-slate-400">Arsitektur RBAC Terpadu • Supabase PostgreSQL</span>
        </footer>
      </div>
    </div>
  );
};

