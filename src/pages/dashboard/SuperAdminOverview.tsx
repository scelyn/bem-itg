import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  MessageSquareText,
  AlertCircle,
  Newspaper,
  FileText,
  RefreshCw,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardStatCard } from '../../components/dashboard/DashboardStatCard';
import { RecentActivityFeed, AuditLogItem } from '../../components/dashboard/RecentActivityFeed';
import { QuickActionsPanel } from '../../components/dashboard/QuickActionsPanel';

interface SystemMetrics {
  totalAspirations: number;
  pendingAspirations: number;
  totalNews: number;
  publishedNews: number;
  totalDocuments: number;
  totalUsers: number;
  aspirationsByStatus: { status: string; _count: { id: number } }[];
  usersByRole?: { roleId: string; _count: { id: number } }[];
  activePeriod?: {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    theme?: string;
  } | null;
}

export const SuperAdminOverview: React.FC = () => {
  const { user, token } = useAuth();

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stats/metrics', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat metrik sistem (Status ${response.status})`);
      }

      const data = await response.json();
      if (data.success) {
        setMetrics(data.metrics);
        setRecentLogs(data.recentAuditLogs || []);
      } else {
        throw new Error(data.message || 'Gagal memproses data metrik.');
      }
    } catch (err: any) {
      setError(err.message || 'Tidak dapat terhubung ke server backend.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Format today's date in Indonesian
  const getIndonesianDate = () => {
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const periodName = metrics?.activePeriod?.name || 'Kabinet KOLEKTIVA';
  const periodYears = metrics?.activePeriod
    ? `${metrics.activePeriod.startYear}–${metrics.activePeriod.endYear}`
    : '2026–2027';

  // Grouped aspiration statuses
  const aspirationStatusMap = (metrics?.aspirationsByStatus || []).reduce<Record<string, number>>(
    (acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome Header Banner (Modern Editorial KOLEKTIVA) */}
      <div className="bg-gradient-to-r from-[#001D45] via-[#002A62] to-[#003ECD] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        {/* Subtle Ambient Decorative Accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,188,0,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Eyebrow & Live Date */}
          <div className="flex items-center gap-2 flex-wrap mb-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/20 text-brand-yellow rounded-full font-mono font-bold uppercase tracking-wider border border-brand-yellow/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Super Admin Console</span>
            </span>

            <span className="text-white/40 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
              <span>{getIndonesianDate()}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-2">
            Selamat Datang, {user?.fullName?.split(' ')[0] || user?.username || 'Super Administrator'}
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl mb-4 font-normal">
            Anda memegang wewenang penuh atas arsitektur sistem, tata kelola akun pengelola,
            penelaahan aspirasi mahasiswa, serta arsip resmi digital BEM ITG.
          </p>

          {/* Active Period Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-slate-200 font-medium">
            <Layers className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
            <span>
              Periode Aktif: <strong className="text-white">{periodName} ({periodYears})</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Error state notification if fetch failed */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchMetrics}
            className="px-3 py-1 bg-white hover:bg-rose-100 border border-rose-300 rounded-lg font-semibold text-rose-700 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* 2. Statistik Ringkasan (5 Cards Berdasarkan API Backend) */}
      <section aria-label="Statistik Ringkasan Portal">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy tracking-tight">
              Metrik Ringkasan Sistem
            </h2>
            <p className="text-xs text-slate-500">Data terintegrasi langsung dari database Supabase</p>
          </div>

          <button
            type="button"
            onClick={fetchMetrics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-navy bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer disabled:opacity-60"
            title="Muat ulang metrik data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Total Pengguna Pengelola */}
          <DashboardStatCard
            title="Pengguna Pengelola"
            value={metrics?.totalUsers ?? 0}
            subtitle="Akun Admin & Editor Terdaftar"
            icon={Users}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
            isLoading={isLoading}
          />

          {/* Card 2: Total Aspirasi Masuk */}
          <DashboardStatCard
            title="Aspirasi Masuk"
            value={metrics?.totalAspirations ?? 0}
            subtitle="Tiket Aspirasi Mahasiswa"
            icon={MessageSquareText}
            iconBgColor="bg-blue-50"
            iconColor="text-brand-blue"
            isLoading={isLoading}
          />

          {/* Card 3: Aspirasi Belum Ditindaklanjuti */}
          <DashboardStatCard
            title="Perlu Tindak Lanjut"
            value={metrics?.pendingAspirations ?? 0}
            subtitle="Status Baru / Telaah Komisi"
            icon={AlertCircle}
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
            accentColor="border-amber-200/80"
            isLoading={isLoading}
          />

          {/* Card 4: Berita Terpublikasi */}
          <DashboardStatCard
            title="Warta Berita"
            value={metrics?.publishedNews ?? metrics?.totalNews ?? 0}
            subtitle={`Dari ${metrics?.totalNews ?? 0} total artikel`}
            icon={Newspaper}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            isLoading={isLoading}
          />

          {/* Card 5: Dokumen Legal Resmi */}
          <DashboardStatCard
            title="Dokumen Legal"
            value={metrics?.totalDocuments ?? 0}
            subtitle="SK, PO, LPJ, & Pedoman"
            icon={FileText}
            iconBgColor="bg-rose-50"
            iconColor="text-brand-red"
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* 3. Grid Dua Kolom: Status Aspirasi & Quick Actions / Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Kolom Kiri (2 Kolom di Desktop): Status Aspirasi & Aktivitas Audit */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Ringkasan Status Penanganan Aspirasi */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,42,98,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy tracking-tight">
                  Alur Penanganan Aspirasi
                </h3>
                <p className="text-xs text-slate-500">Distribusi status tiket advokasi mahasiswa</p>
              </div>

              <Link
                to="/dashboard/super-admin/aspirations"
                className="text-xs font-semibold text-brand-blue hover:text-brand-navy flex items-center gap-1 transition-colors"
              >
                <span>Kelola Advokasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Status Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block mb-1">
                  Baru Diterima
                </span>
                <span className="text-xl font-heading font-black text-amber-900">
                  {aspirationStatusMap['Baru Diterima'] || 0}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-left">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-700 block mb-1">
                  Telaah Komisi
                </span>
                <span className="text-xl font-heading font-black text-blue-900">
                  {aspirationStatusMap['Sedang Ditelaah Komisi'] || 0}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-left">
                <span className="text-[10px] font-mono font-bold uppercase text-purple-700 block mb-1">
                  Audiensi
                </span>
                <span className="text-xl font-heading font-black text-purple-900">
                  {aspirationStatusMap['Audiensi Pimpinan'] || 0}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-left">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block mb-1">
                  Selesai
                </span>
                <span className="text-xl font-heading font-black text-emerald-900">
                  {aspirationStatusMap['Selesai & Diterbitkan'] || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Aktivitas Terbaru dari Audit Log */}
          <RecentActivityFeed logs={recentLogs} isLoading={isLoading} />
        </div>

        {/* Kolom Kanan (1 Kolom di Desktop): Quick Actions & System Info */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <QuickActionsPanel />

          {/* Role Specification & Authority Pill */}
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-brand-yellow/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Otoritas Keamanan (RBAC)
              </span>
            </div>

            <h4 className="font-heading font-bold text-base text-white mb-2">
              Super Administrator Root Level
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Akun Anda memiliki izin eksekusi terhadap 26 operasi sistem pada database Supabase,
              termasuk pembuatan akun baru dan akses audit trail.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Host Database</span>
              <span className="text-emerald-400 font-semibold">Supabase PostgreSQL 17</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

