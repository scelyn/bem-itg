import React, { useState } from 'react';
import { Search, FileText, Download } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { legalDocuments } from '../../data/documents';
import { DocumentCategory } from '../../types';
import { useModals } from '../../context/ModalContext';

export const LegalDocumentsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | DocumentCategory>('all');
  const { openInfoModal } = useModals();

  const filterTabs: { key: 'all' | DocumentCategory; label: string }[] = [
    { key: 'all', label: 'Semua Dokumen' },
    { key: 'sk', label: 'Surat Keputusan (SK)' },
    { key: 'po', label: 'Peraturan Organisasi' },
    { key: 'lpj', label: 'LPJ Publik' },
    { key: 'sop', label: 'Pedoman & SOP' },
  ];

  const filteredDocs = legalDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleDownload = (title: string, code: string, verifiedStatus: string) => {
    openInfoModal(
      `Unduh Dokumen: ${title}`,
      `File PDF "${code}" telah diverifikasi secara digital oleh Biro Kesekretariatan BEM ITG KOLEKTIVA. Tautan arsip resmi siap diakses.`,
      { badge: verifiedStatus, isDownload: true }
    );
  };

  return (
    <section id="documents" className="py-24 bg-brand-white relative border-b border-brand-border text-brand-navy">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            badgeText="Keterbukaan Arsip Digital"
            title="Produk Hukum & Arsip Resmi."
            theme="light"
          />
          <p className="text-slate-600 max-w-md text-sm leading-relaxed">
            Pusat unduhan surat keputusan, peraturan organisasi kemahasiswaan, panduan teknis operasional, dan laporan pertanggungjawaban terbuka bagi seluruh sivitas akademika ITG.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-brand-slate p-4 rounded-2xl border border-brand-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau nomor surat..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-brand-border text-brand-navy text-xs focus:border-brand-blue focus:outline-none"
            />
          </div>

          {/* Filter Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {filterTabs.map((tab) => {
              const active = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                    active
                      ? 'bg-brand-red text-white font-bold shadow-clay-red'
                      : 'bg-white text-slate-600 hover:text-brand-navy border border-brand-border font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-6 border border-brand-border hover:border-brand-blue/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-brand-blue/10 text-brand-blue text-[10px] font-bold font-mono">
                    {doc.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{doc.year}</span>
                </div>
                <h4 className="font-heading font-bold text-base text-brand-navy group-hover:text-brand-blue transition-colors leading-snug mb-2">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {doc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <FileText className="w-3.5 h-3.5 text-brand-blue" /> {doc.fileFormat} • {doc.fileSize}
                </span>
                <button
                  onClick={() => handleDownload(doc.title, doc.code, doc.verifiedStatus)}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-brand-red text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

