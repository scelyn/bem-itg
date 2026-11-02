import React, { useState } from 'react';
import { Search, FileText, Download, Eye, ShieldCheck, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { legalDocuments } from '../data/documents';
import { LegalDocument, DocumentCategory } from '../types';
import { useModals } from '../context/ModalContext';

export const LegalDocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | DocumentCategory>('all');
  const { openInfoModal } = useModals();

  const categories: { key: 'all' | DocumentCategory; label: string }[] = [
    { key: 'all', label: 'Semua Dokumen' },
    { key: 'sk', label: 'Surat Keputusan (SK)' },
    { key: 'po', label: 'Peraturan Organisasi (PO)' },
    { key: 'lpj', label: 'LPJ Publik' },
    { key: 'sop', label: 'Pedoman & SOP' },
  ];

  const filtered: LegalDocument[] = legalDocuments.filter((doc: LegalDocument) => {
    const matchesCat = selectedCat === 'all' || doc.category === selectedCat;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Featured document: The constitutional master SK (doc-1) when viewing all and no search query
  const isDefaultView = selectedCat === 'all' && !searchQuery.trim();
  const featuredDoc = isDefaultView ? filtered.find((d) => d.id === 'doc-1') || filtered[0] : null;
  const catalogDocs = featuredDoc ? filtered.filter((d) => d.id !== featuredDoc.id) : filtered;

  const handleDownload = (title: string, code: string, verifiedStatus: string) => {
    openInfoModal(
      `Unduh Dokumen: ${title}`,
      `File PDF "${code}" telah diverifikasi secara digital oleh Biro Kesekretariatan BEM ITG KOLEKTIVA. Tautan arsip resmi siap diakses.`,
      { badge: verifiedStatus, isDownload: true }
    );
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-navy">
      {/* ========================================================================= */}
      {/* 1. EXPRESSIVE EDITORIAL PAGE HEADER                                       */}
      {/* ========================================================================= */}
      <section className="bg-brand-navy text-white pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-8 relative overflow-hidden">
        {/* Archival ledger line accents in background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand-blue/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
            {/* Left Column: Expressive Typography */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Eyebrow: Unboxed text with letter spacing and subtle accent bar */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-yellow font-heading">
                <span className="w-8 h-[2px] bg-brand-yellow rounded-full" />
                <span>Arsip Digital & Keterbukaan Informasi</span>
              </div>

              {/* Expressive Editorial Headline in Space Grotesk */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.08]">
                <span className="block font-medium text-slate-200">Keterbukaan Gerak,</span>
                <span className="block font-black text-white mt-1 sm:mt-2">
                  Arsip Resmi <span className="text-brand-yellow">KOLEKTIVA</span>.
                </span>
                <span className="block font-light text-slate-300 text-2xl sm:text-3xl lg:text-4xl mt-3 sm:mt-4 tracking-normal">
                  Dokumentasi Hukum & Tata Kelola Organisasi.
                </span>
              </h1>
            </div>

            {/* Right Column: Editorial Companion Copy */}
            <div className="lg:col-span-5 space-y-4 lg:pb-3 lg:border-l lg:border-white/15 lg:pl-8">
              <p className="text-base sm:text-lg text-slate-200/95 font-normal leading-relaxed font-sans">
                Pusat repositori digital terbuka bagi seluruh mahasiswa ITG untuk mengakses Surat Keputusan, Peraturan Organisasi, pedoman operasional, dan laporan pertanggungjawaban BEM.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-300">
                <span className="text-brand-yellow font-bold uppercase">Repositori Terbuka</span>
                <span>•</span>
                <span>Kabinet 2026/2027</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Organic curved transition into Cool White surface */}
        <div className="absolute inset-x-0 bottom-0 translate-y-[1px] pointer-events-none">
          <svg
            className="w-full h-12 sm:h-20 text-brand-white fill-current"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIGITAL ARCHIVE WORKSPACE & REPOSITORY                                  */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 pb-28 space-y-12">

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 border-b border-brand-border">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((c) => {
              const active = selectedCat === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setSelectedCat(c.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading whitespace-nowrap transition-all ${
                    active
                      ? 'bg-brand-navy text-brand-yellow font-bold shadow-md'
                      : 'bg-white text-slate-600 hover:text-brand-navy border border-brand-border hover:bg-brand-slate font-medium'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, nomor surat (SK/PO)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-brand-border text-brand-navy text-xs placeholder:text-slate-400 focus:border-brand-navy focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content Section */}
        {filtered.length === 0 ? (
          /* Graceful Empty State */
          <div className="text-center py-20 px-4 bg-brand-slate/50 rounded-3xl border border-brand-border space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy/10 text-brand-navy mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-brand-navy">Dokumen Tidak Ditemukan</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
              Tidak ditemukan arsip berkas dengan kata kunci "{searchQuery}" pada kategori yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCat('all');
              }}
              className="px-5 py-2 rounded-full bg-brand-navy text-white text-xs font-heading font-bold hover:bg-brand-blue transition-colors"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* =================================================================== */}
            {/* FEATURED DOCUMENT SHOWCASE (Dokumen Pokok Landasan Kabinet)          */}
            {/* =================================================================== */}
            {featuredDoc && (
              <div className="bg-white rounded-3xl border border-brand-border hover:border-brand-blue/40 transition-all p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left: Official Dossier Preview Plate */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy via-brand-navy to-[#001D45] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-white/10 shadow-glass">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Official Document Emblem & Tag */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-yellow" />
                        <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-brand-yellow">
                          Dokumen Landasan Kabinet
                        </span>
                      </div>
                      <span className="font-mono text-xs text-slate-300">
                        {featuredDoc.year}
                      </span>
                    </div>

                    {/* Official Code & Seal Title */}
                    <div className="space-y-3 mb-6">
                      <span className="font-mono text-xs text-brand-yellow/90 bg-white/10 px-2.5 py-1 rounded border border-white/15 inline-block">
                        {featuredDoc.code}
                      </span>
                      <h3 className="font-heading font-bold text-xl text-white leading-snug">
                        {featuredDoc.title}
                      </h3>
                    </div>

                    {/* Technical File Ledger */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                      <span>FORMAT: {featuredDoc.fileFormat} ({featuredDoc.fileSize})</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-sans font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> Sah Digital
                      </span>
                    </div>
                  </div>

                  {/* Right: Detailed Archival Context & Action */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-2 flex-wrap text-xs font-sans">
                      <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue font-heading font-bold text-[11px] uppercase tracking-wider">
                        {featuredDoc.categoryLabel}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-mono">{featuredDoc.code}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">Tahun Penerbitan {featuredDoc.year}</span>
                    </div>

                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy group-hover:text-brand-blue transition-colors leading-tight">
                      <Link to={`/legal-documents/${featuredDoc.id}`}>
                        {featuredDoc.title}
                      </Link>
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                      {featuredDoc.description}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-sans flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{featuredDoc.verifiedStatus}</span>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <Link
                        to={`/legal-documents/${featuredDoc.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-heading font-bold text-xs transition-colors shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Buka & Pelajari Dokumen</span>
                      </Link>
                      <button
                        onClick={() => handleDownload(featuredDoc.title, featuredDoc.code, featuredDoc.verifiedStatus)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white font-heading font-bold text-xs shadow-clay-red transition-all active:scale-[0.98]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh Salinan PDF ({featuredDoc.fileSize})</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* ARCHIVAL LEDGER LIST (Daftar Dokumen Resmi Lainnya)                */}
            {/* =================================================================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/60 font-heading">
                  <span className="w-6 h-[2px] bg-brand-navy/40" />
                  <span>Daftar Arsip Dokumen Resmi</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {catalogDocs.length} Dokumen Tersedia
                </span>
              </div>

              <div className="space-y-4">
                {catalogDocs.map((doc: LegalDocument) => (
                  <article
                    key={doc.id}
                    className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-brand-blue/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left: Code, Category, Title & Excerpt */}
                    <div className="space-y-2.5 max-w-3xl">
                      {/* Top Metadata */}
                      <div className="flex items-center gap-2.5 flex-wrap text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-brand-navy text-brand-yellow font-mono font-bold text-[11px]">
                          {doc.code}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-heading font-semibold text-brand-blue text-xs uppercase tracking-wider">
                          {doc.categoryLabel}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">Tahun {doc.year}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
                        <Link to={`/legal-documents/${doc.id}`}>
                          {doc.title}
                        </Link>
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-2">
                        {doc.description}
                      </p>

                      {/* Verification Status */}
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-sans pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{doc.verifiedStatus}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex lg:flex-col sm:flex-row items-stretch sm:items-center lg:items-end justify-between lg:justify-center gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-[11px] font-mono text-slate-400 hidden lg:block text-right mb-1">
                        {doc.fileFormat} • {doc.fileSize}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          to={`/legal-documents/${doc.id}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy font-heading font-bold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Link>
                        <button
                          onClick={() => handleDownload(doc.title, doc.code, doc.verifiedStatus)}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-red hover:bg-red-600 text-white font-heading font-bold text-xs shadow-sm transition-colors active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh PDF</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
