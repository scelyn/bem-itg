import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Database,
  KeyRound,
  Activity,
  FileCheck,
  CheckCircle2,
  Lock,
  Server
} from 'lucide-react';

const ROLE_SPECIFICATIONS = [
  {
    id: 'spec_super_admin',
    title: 'Super Admin (Administrator Utama)',
    role: 'super_admin',
    scope: 'Akses Penuh: Manajemen Akun, Audit Keamanan, Master Config, Seluruh Modul',
    level: 'Tier 1 • Root Level',
  },
  {
    id: 'spec_admin',
    title: 'Admin Operasional (Sekretariat Jenderal)',
    role: 'admin',
    scope: 'Disposisi Aspirasi, Arsip Dokumen Hukum & SK, Manajemen Anggota Kabinet',
    level: 'Tier 2 • Operational',
  },
  {
    id: 'spec_editor',
    title: 'Editor Redaksi (Biro Medinfo)',
    role: 'editor',
    scope: 'Newsroom Editorial, Penulisan Berita, Kurasi Headline & Rubrik',
    level: 'Tier 3 • Publishing',
  },
];

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout activeTabTitle="Super Admin Console">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#002A62] via-[#003ECD] to-[#001D45] rounded-3xl p-6 sm:p-8 md:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(255,188,0,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-yellow/20 text-brand-yellow rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-brand-yellow/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Highest Privilege Level • Super Admin</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-2">
            Selamat Datang, {user?.fullName || 'Presidium BEM'}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Anda memegang hak kendali penuh atas arsitektur sistem, delegasi wewenang peran, audit keamanan, dan integritas data seluruh modul BEM ITG KOLEKTIVA.
          </p>
        </div>
      </div>

      {/* 2. System Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Akun Pengelola</div>
            <div className="text-2xl font-bold font-heading text-slate-900">3 Role Aktif</div>
            <div className="text-[11px] text-emerald-600 font-medium">RBAC Terverifikasi</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Status Sistem</div>
            <div className="text-2xl font-bold font-heading text-slate-900">Normal</div>
            <div className="text-[11px] text-slate-500">Node.js / React 18 SPA</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Audit Logs</div>
            <div className="text-2xl font-bold font-heading text-slate-900">100% Tercatat</div>
            <div className="text-[11px] text-amber-700">Audit Sesi Pengguna</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">API Readiness</div>
            <div className="text-2xl font-bold font-heading text-slate-900">Siap Pasang</div>
            <div className="text-[11px] text-blue-600 font-mono">POST /api/auth/login</div>
          </div>
        </div>
      </div>

      {/* 3. Core Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* User Role Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                Matriks Hak Akses & Akun Terdaftar
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Data peran diverifikasi dari kredensial tersimpan, bukan dipilih di halaman login.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
              3 Entitas Terverifikasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Identitas Pengguna</th>
                  <th className="py-3 px-3">Role Otoritas</th>
                  <th className="py-3 px-3">Hak Akses Modul</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ROLE_SPECIFICATIONS.map((spec) => (
                  <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{spec.title}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{spec.level}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        spec.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : spec.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {spec.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {spec.scope}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terkonfigurasi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System & Backend Integration Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-brand-navy">
              <Server className="w-5 h-5 text-brand-blue" />
              <h3 className="font-heading font-bold text-base text-slate-900">
                Spesifikasi API Backend
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Arsitektur frontend telah menerapkan kontrak autentikasi standar industri. Siapkan layanan backend dengan endpoint berikut:
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl">
                <span className="text-emerald-400 font-bold">POST</span> /api/auth/login
                <div className="text-[11px] text-slate-400 mt-1">
                  Body: {'{ identifier, password }'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Return: {'{ token, user: { role, ... } }'}
                </div>
              </div>

              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                <span className="text-blue-600 font-bold">GET</span> /api/auth/me
                <div className="text-[11px] text-slate-500 mt-1">
                  Header: Authorization Bearer &lt;token&gt;
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Role diambil dari payload JWT/database terverifikasi. Klien menolak penentuan role dari form input.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
