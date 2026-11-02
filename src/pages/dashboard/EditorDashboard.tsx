import React, { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  PenTool,
  Newspaper,
  Eye,
  Plus,
  Edit3,
  CheckCircle2,
  Clock,
  BookmarkCheck,
  Search
} from 'lucide-react';

export const EditorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      id: 'art-01',
      title: 'Pelantikan Pengurus BEM ITG KOLEKTIVA Periode 2024/2025 Resmi Digelar',
      category: 'Rilis Pers',
      status: 'Terpublikasi',
      date: '28 Oktober 2024',
      views: 1240,
      featured: true,
    },
    {
      id: 'art-02',
      title: 'Kajian Strategis: Rekomendasi Alokasi Fasilitas Laboratorium Komputer ITG',
      category: 'Kajian & Opini',
      status: 'Terpublikasi',
      date: '25 Oktober 2024',
      views: 890,
      featured: false,
    },
    {
      id: 'art-03',
      title: 'Agenda Dialog Terbuka: Dekan dan Mahasiswa Menyambut Ujian Tengah Semester',
      category: 'Agenda',
      status: 'Draf Review',
      date: '02 November 2024',
      views: 0,
      featured: false,
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout activeTabTitle="Editor Newsroom">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#8B6B00] via-[#5C4500] to-[#2B1F00] rounded-3xl p-6 sm:p-8 md:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(255,220,100,0.2),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-200 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <PenTool className="w-3.5 h-3.5" />
            <span>Editorial & Publishing • Editor Redaksi</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-2">
            Meja Redaksi, {user?.fullName?.split(' ')[0] || 'Editor'}
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Kelola publikasi warta berita, esai, siaran pers, dan liputan kegiatan BEM ITG KOLEKTIVA untuk portal publik <code className="font-mono text-amber-300">/news</code>.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Berita Terbit</div>
            <div className="text-2xl font-bold font-heading text-slate-900">16 Artikel</div>
            <div className="text-[11px] text-emerald-600 font-medium">Tayang di Portal</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Draf Redaksi</div>
            <div className="text-2xl font-bold font-heading text-slate-900">3 Naskah</div>
            <div className="text-[11px] text-amber-600 font-medium">Menunggu Kurasi</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Total Pembaca</div>
            <div className="text-2xl font-bold font-heading text-slate-900">4.820 Views</div>
            <div className="text-[11px] text-emerald-600 font-medium">Bulan Berjalan</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">Rubrik Aktif</div>
            <div className="text-2xl font-bold font-heading text-slate-900">4 Rubrik</div>
            <div className="text-[11px] text-slate-500">Pers, Kampus, Opini, Agenda</div>
          </div>
        </div>
      </div>

      {/* 3. Article Newsroom Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-600" />
              Koleksi Artikel & Kurasi Editorial
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sunting isi warta, kelola status terbit, dan atur berita yang ditampilkan pada headline utama.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari naskah artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-60"
              />
            </div>

            <button
              type="button"
              className="py-2 px-3.5 bg-brand-navy hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Judul Berita</th>
                <th className="py-3 px-3">Kategori Rubrik</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {art.featured && (
                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Headline
                        </span>
                      )}
                      <span>{art.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600">{art.category}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      art.status === 'Terpublikasi'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {art.status === 'Terpublikasi' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {art.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{art.date}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{art.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="p-1.5 text-slate-500 hover:text-brand-blue rounded hover:bg-slate-100 transition-colors"
                        title="Sunting Artikel"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
