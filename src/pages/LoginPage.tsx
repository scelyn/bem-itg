import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, getDashboardPathByRole } from '../context/AuthContext';
import {
  LogIn,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, user, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // If already authenticated, redirect to their authorized role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetDashboard = getDashboardPathByRole(user.role);
      navigate(targetDashboard, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const cleanId = identifier.trim();
    if (!cleanId) {
      setFormError('Harap masukkan username atau email akun Anda.');
      return;
    }

    if (!password) {
      setFormError('Harap masukkan kata sandi Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit credentials to backend authentication endpoint
      // 2. Role is retrieved strictly from the verified server response, NEVER from client form inputs
      const verifiedUser = await login({
        identifier: cleanId,
        password,
      });

      // 3. Automatically redirect to role-specific dashboard
      const targetPath = getDashboardPathByRole(verifiedUser.role);
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      setFormError(
        err.message || 'Gagal memproses autentikasi. Silakan periksa kredensial Anda.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-800 flex flex-col justify-between font-sans selection:bg-brand-yellow/30 selection:text-brand-navy relative overflow-x-hidden">
      {/* 1. Subtle, Clean Ambient Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Persian Blue Ambient Glow at top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-blue/[0.035] rounded-full blur-3xl" />
        {/* Soft Selective Yellow Glow at bottom right */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-yellow/[0.025] rounded-full blur-3xl" />
        {/* Subtle, Minimalist Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#002A62_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.025]" />
      </div>

      {/* 2. Top Header Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-100">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-navy transition-all duration-200 group px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 border border-slate-200/70"
        >
          <ArrowLeft className="w-4 h-4 text-brand-blue group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </Link>


      </header>

      {/* 3. Main Content: Single Centered Card Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 my-auto">
        <div className="w-full max-w-[420px] sm:max-w-[440px] bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,42,98,0.06)] transition-all">

          {/* Item 1: Tiga logo kecil sejajar secara horizontal (32-44px, object-contain, no boxes) */}
          <div className="flex items-center justify-center gap-5 sm:gap-6 mb-5">
            <img
              src="/logo-itg.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logi-itg.png';
              }}
              alt="Institut Teknologi Garut"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 hover:scale-105"
              loading="eager"
            />
            <img
              src="/logo-bem.png"
              alt="BEM ITG"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 hover:scale-105"
              loading="eager"
            />
            <img
              src="/logo-kolektiva.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo-kabinet.png';
              }}
              alt="Kabinet KOLEKTIVA"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 hover:scale-105"
              loading="eager"
            />
          </div>

          {/* Item 2: Garis pemisah tipis */}
          <div className="w-full h-px bg-slate-100 mb-5" />

          {/* Item 3: Label kecil PORTAL INTERNAL BEM ITG */}
          <div className="text-center mb-1.5">

          </div>

          {/* Item 4: Headline Selamat Datang Kembali */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-[20px] text-brand-navy tracking-tight text-center mb-4">
            Selamat Datang Kembali
          </h1>


          {/* Error Notification Alert */}
          {(formError || error) && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/90 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {formError || error}
              </div>
            </div>
          )}

          {/* Login Form: Purely Identifier + Password (NO ROLE SELECTION) */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Item 6: Input Email atau Username */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email atau Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan email atau username"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            {/* Item 7: Input Password dengan toggle show/hide */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Kata Sandi
                </label>
                <span className="text-[11px] text-slate-400">
                  Wajib diisi
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Item 8: Tombol Masuk ke Dashboard */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-heading font-bold text-sm text-white bg-brand-navy hover:bg-brand-blue active:scale-[0.99] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Item 9: Keterangan kecil Akses khusus pengelola BEM ITG */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span>Akses khusus pengelola BEM ITG</span>
          </div>

        </div>
      </main>

      {/* 4. Minimalist Institutional Footer */}

    </div>
  );
};
