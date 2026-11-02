import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  PenSquare,
  FilePlus,
  MessageSquareText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const QuickActionsPanel: React.FC = () => {
  const actions = [
    {
      title: 'Kelola Pengguna',
      description: 'Tambah admin baru atau atur hak akses akun',
      to: '/dashboard/super-admin/users',
      icon: UserPlus,
      color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    },
    {
      title: 'Tindak Lanjuti Aspirasi',
      description: 'Review tiket baru dan perbarui alur advokasi',
      to: '/dashboard/super-admin/aspirations',
      icon: MessageSquareText,
      color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    },
    {
      title: 'Tulis Warta Redaksi',
      description: 'Penyusunan draf berita & rilis pers resmi',
      to: '/dashboard/super-admin/news',
      icon: PenSquare,
      color: 'bg-blue-50 text-brand-blue group-hover:bg-brand-blue group-hover:text-white',
    },
    {
      title: 'Arsip Dokumen Legal',
      description: 'Unggah SK, PO, LPJ, dan pedoman organisasi',
      to: '/dashboard/super-admin/documents',
      icon: FilePlus,
      color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      title: 'Inspeksi Audit Keamanan',
      description: 'Lihat riwayat autentikasi dan mutasi data',
      to: '/dashboard/super-admin/audit-logs',
      icon: ShieldAlert,
      color: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,42,98,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-base sm:text-lg text-brand-navy tracking-tight">
            Aksi Cepat Super Admin
          </h2>
          <p className="text-xs text-slate-500">Pintasan modul pengelolaan sistem</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              to={act.to}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200/80 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${act.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-navy transition-colors">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {act.description}
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
