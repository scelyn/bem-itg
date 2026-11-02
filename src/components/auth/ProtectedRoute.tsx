import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, getDashboardPathByRole, getRoleDisplayName } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-medium tracking-wide">Memverifikasi Sesi & Hak Akses...</p>
      </div>
    );
  }

  // 1. Unauthenticated: Redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role Check: If user does not have permission for this route
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const userDashboard = getDashboardPathByRole(user.role);

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-slate-800/90 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-3">
            403 • Akses Terbatas (RBAC)
          </span>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-3">
            Otoritas Tidak Memadai
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Akun Anda terdaftar dengan hak akses{' '}
            <span className="font-bold text-brand-yellow">
              {getRoleDisplayName(user.role)}
            </span>
            . Halaman ini memerlukan otorisasi khusus:{' '}
            <span className="font-semibold text-slate-100">
              {allowedRoles.map((r) => getRoleDisplayName(r)).join(' atau ')}
            </span>
            .
          </p>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-700/50 mb-6 text-left text-xs space-y-1.5 font-mono text-slate-400">
            <div><span className="text-slate-500">User:</span> {user.fullName}</div>
            <div><span className="text-slate-500">Email:</span> {user.email}</div>
            <div><span className="text-slate-500">Active Role:</span> <span className="text-amber-400">{user.role}</span></div>
            <div><span className="text-slate-500">Target Path:</span> {location.pathname}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={userDashboard}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/30"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard Saya
            </Link>

            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authorized
  return children ? <>{children}</> : null;
};
