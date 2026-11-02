import React, { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  FileText,
  Users,
  Clock,
  Send,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const mockTickets = [
    {
      id: 'ASP-2024-001',
      title: 'Penerangan & WiFi Lambat di Gedung D Lantai 3',
      category: 'Fasilitas & Infrastruktur Kampus',
      urgency: 'Mendesak',
      status: 'Sedang Ditelaah Komisi',
      date: '2024-10-31',
      author: 'Mahasiswa Informatika (Anonim)',
    },
    {
      id: 'ASP-2024-002',
      title: 'Transparansi Alokasi Anggaran Kegiatan Ormawa Semester Ganjil',
      category: 'Kebijakan UKT & Finansial',
      urgency: 'Kritis',
      status: 'Audiensi Pimpinan',
      date: '2024-10-28',
      author: 'Perwakilan Himpunan Mahasiswa',
    },
    {
      id: 'ASP-2024-003',
      title: 'Permohonan Ruang Kolaborasi Kreatif Mahasiswa',
      category: 'Kegiatan Kemahasiswaan & Ormawa',
      urgency: 'Normal',
      status: 'Baru Diterima',
      date: '2024-11-01',
      author: 'Bagas Pratama (2206012)',
    },
  ];

  return (
    <DashboardLayout activeTabTitle="Operational Admin">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#003ECD] via-[#002A62] to-[#0A192F] rounded-3xl p-6 sm:p-8 md:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-400/20 text-blue-200 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational Management • Administrator</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-2">
            Halo, {user?.fullName || 'Admin BEM ITG'}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Pusat kendali operasional BEM ITG KOLEKTIVA untuk menindaklanjuti aspirasi mahasiswa, mengarsipkan dokumen legal resmi, dan memperbarui struktur kepengurusan.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Aspirasi Masuk</div>
            <div className="text-2xl font-bold font-heading text-slate-900">48 Total</div>
            <div className="text-[11px] text-amber-600 font-medium">6 Perlu Tindak Lanjut</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Dokumen Legal</div>
            <div className="text-2xl font-bold font-heading text-slate-900">12 Terbit</div>
            <div className="text-[11px] text-emerald-600 font-medium">Semua Terverifikasi</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Kabinet KOLEKTIVA</div>
            <div className="text-2xl font-bold font-heading text-slate-900">24 Pengurus</div>
            <div className="text-[11px] text-slate-500">6 Kementerian Aktif</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Respon Rata-rata</div>
            <div className="text-2xl font-bold font-heading text-slate-900">&lt; 48 Jam</div>
            <div className="text-[11px] text-emerald-600 font-medium">Sesuai SLA</div>
          </div>
        </div>
      </div>

      {/* 3. Operational Section: Aspirasi Workflow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-blue" />
              Disposisi & Tindak Lanjut Aspirasi Mahasiswa
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pantau dan alirkan aspirasi yang masuk melalui formulir publik ke komisi telaah atau pimpinan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Penyaring:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">Semua Kategori</option>
              <option value="fasilitas">Fasilitas Kampus</option>
              <option value="finansial">UKT & Finansial</option>
              <option value="ormawa">Kemahasiswaan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Kode Tiket</th>
                <th className="py-3 px-3">Subjek Aspirasi</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Urgensi</th>
                <th className="py-3 px-3">Status Pipeline</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{ticket.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{ticket.title}</div>
                    <div className="text-[11px] text-slate-400">Pengirim: {ticket.author} • {ticket.date}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{ticket.category}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      ticket.urgency === 'Kritis'
                        ? 'bg-red-100 text-red-700'
                        : ticket.urgency === 'Mendesak'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ticket.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-brand-blue border border-blue-200">
                      <Clock className="w-3 h-3" />
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-semibold text-brand-blue hover:text-white hover:bg-brand-blue rounded border border-brand-blue/30 transition-colors"
                    >
                      Disposisi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Unggah Dokumen Legal Baru</h3>
              <p className="text-xs text-slate-500">Terbitkan SK, SOP, AD/ART ke direktori publik</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Dokumen yang diunggah akan otomatis tampil di halaman Arsip Digital KOLEKTIVA (<code className="font-mono text-brand-blue">/legal-documents</code>) setelah diverifikasi nomor suratnya.
          </p>
          <button
            type="button"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            Buka Form Input Dokumen
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">Pembaruan Struktur Kabinet</h3>
              <p className="text-xs text-slate-500">Kelola susunan pengurus, foto, dan kontak kementerian</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Pembaruan profil anggota akan langsung tersinkronisasi ke marquee carousel homepage dan halaman Organisasi (<code className="font-mono text-brand-blue">/organization</code>).
          </p>
          <button
            type="button"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-3.5 h-3.5" />
            Kelola Anggota Kabinet
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
