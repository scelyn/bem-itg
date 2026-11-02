import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  ShieldCheck,
  MessageSquareText,
  Newspaper,
  FileText,
  Network,
  History,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* =============================================================================
   1. MANAJEMEN PENGGUNA (Real /api/users Integration)
   ============================================================================= */
export const SuperAdminUsersPage: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error(`Gagal memuat pengguna (Status ${res.status})`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke API pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
            Manajemen Pengguna Pengelola
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola akun Super Admin, Admin Operasional, dan Editor Redaksi BEM ITG
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Daftar Akun Terdaftar ({users.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">Database Supabase PostgreSQL</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Pengguna</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Terakhir Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2].map((i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-6 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Tidak ada akun pengelola yang ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-400">@{u.username}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                        {u.roleName || u.roleId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('id-ID') : 'Belum pernah'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =============================================================================
   2. ROLE & PERMISSIONS PAGE
   ============================================================================= */
export const SuperAdminRolesPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Role & Permissions (RBAC)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Matriks hak akses dan hirarki wewenang pengelola portal BEM ITG KOLEKTIVA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Super Administrator</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Hak akses penuh seluruh modul sistem, audit log, manajemen akun, dan konfigurasi master.
          </p>
          <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            26 Izin Operasional
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Admin Operasional</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Pengelolaan alur aspirasi, disposisi, pengarsipan dokumen legal, serta publikasi berita resmi.
          </p>
          <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-50 text-brand-blue rounded-full border border-blue-200">
            19 Izin Operasional
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Newspaper className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 mb-1">Editor Redaksi</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Penyusunan warta berita, artikel opini, liputan acara, dan draf redaksi Medinfo.
          </p>
          <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            6 Izin Operasional
          </span>
        </div>
      </div>
    </div>
  );
};

/* =============================================================================
   3. ASPIRASI MAHASISWA PAGE
   ============================================================================= */
export const SuperAdminAspirationsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Aspirasi & Advokasi Mahasiswa
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau seluruh tiket aspirasi masuk dan perbarui tahapan alur advokasi
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-3">
          <MessageSquareText className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-base text-slate-800 mb-1">
          Kanal Advokasi Terintegrasi
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
          Tiket aspirasi dari mahasiswa di halaman publik otomatis tercatat dan dapat ditelaah oleh
          Admin dan Super Admin sesuai 4 tahapan pipeline.
        </p>
        <Link
          to="/aspirations/track"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <span>Buka Pelacakan Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

/* =============================================================================
   4. MANAJEMEN BERITA PAGE
   ============================================================================= */
export const SuperAdminNewsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Manajemen Berita & Warta
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola publikasi warta redaksi, artikel opini, dan draf berita kabinet
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Newspaper className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-base text-slate-800 mb-1">
          Newsroom Editorial KOLEKTIVA
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
          Modul penulisan berita dengan dukungan slug SEO-friendly, pemilihan rubrik, dan hak penerbitan (publish)
          resmi dari Super Admin.
        </p>
        <Link
          to="/news"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <span>Lihat Warta di Portal Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

/* =============================================================================
   5. DOKUMEN LEGAL PAGE
   ============================================================================= */
export const SuperAdminDocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Arsip Dokumen Legal & Surat
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pengarsipan resmi Surat Keputusan (SK), Pedoman Organisasi (PO), LPJ, dan SOP
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-brand-red flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-base text-slate-800 mb-1">
          Arsip Dokumen Terverifikasi
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
          Setiap dokumen memiliki nomor surat terdaftar yang unik, kategori hukum resmi, dan sertifikasi
          keabsahan dari kementerian terkait.
        </p>
        <Link
          to="/legal-documents"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <span>Buka Arsip Dokumen Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

/* =============================================================================
   6. ORGANISASI KABINET PAGE
   ============================================================================= */
export const SuperAdminOrganizationPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Struktur Organisasi & Kabinet
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Susunan pimpinan BEM ITG, kementerian kabinet, dan fungsionaris aktif
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
          <Network className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-base text-slate-800 mb-1">
          Kabinet KOLEKTIVA 2026–2027
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
          Hierarki kepengurusan Presiden Mahasiswa, Wakil Presiden, Sekretaris Kabinet, dan 7 Kementerian
          dikelola secara terpusat pada database.
        </p>
        <Link
          to="/organization"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <span>Lihat Struktur Organisasi Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

/* =============================================================================
   7. AUDIT LOG SISTEM PAGE
   ============================================================================= */
export const SuperAdminAuditLogsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Audit Log & Riwayat Keamanan
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Jejak audit seluruh aktivitas autentikasi, perubahan status, dan interaksi sistem
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
          <History className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-bold text-base text-slate-800 mb-1">
          Immutable Security Trail
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
          Setiap login, pembuatan akun, dan perubahan status otomatis dicatat dengan waktu, IP address,
          dan identitas pelaku di tabel audit_logs Supabase PostgreSQL.
        </p>
        <Link
          to="/dashboard/super-admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <span>Kembali ke Overview</span>
        </Link>
      </div>
    </div>
  );
};

/* =============================================================================
   8. PENGATURAN SISTEM PAGE
   ============================================================================= */
export const SuperAdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="font-heading font-extrabold text-2xl text-brand-navy tracking-tight">
          Pengaturan Sistem & Konfigurasi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Parameter operasional portal, integrasi database, dan preferensi kabinet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Koneksi Database</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Database aktif menggunakan Supabase PostgreSQL dengan pooler port 6543 dan Prisma 6 ORM.
          </p>
          <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
            Status: Terhubung & Aktif
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
            <span>Autentikasi & Keamanan</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Enkripsi kata sandi menggunakan bcryptjs (12 salt rounds) dan session token JWT (8 jam).
          </p>
          <div className="text-[11px] font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 inline-block">
            Status: Proteksi Aktif
          </div>
        </div>
      </div>
    </div>
  );
};
