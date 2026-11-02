import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, ShieldCheck, FileBadge, BookOpen } from 'lucide-react';
import { legalDocuments } from '../data/documents';
import { LegalDocument } from '../types';
import { useModals } from '../context/ModalContext';

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openInfoModal } = useModals();

  const doc: LegalDocument | undefined = legalDocuments.find((d: LegalDocument) => d.id === id);

  if (!doc) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-5 text-center">
        <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">Dokumen Tidak Ditemukan</h2>
        <p className="text-slate-600 text-sm mb-6 font-sans">Berkas hukum yang Anda cari tidak tersedia dalam repositori terbuka.</p>
        <Link
          to="/legal-documents"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-navy text-white text-xs font-heading font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Repositori Arsip
        </Link>
      </div>
    );
  }

  const handleDownload = () => {
    openInfoModal(
      `Unduh Dokumen: ${doc.title}`,
      `File PDF "${doc.code}" telah diverifikasi secara digital oleh Biro Kesekretariatan BEM ITG KOLEKTIVA. Tautan arsip resmi siap diakses.`,
      { badge: doc.verifiedStatus, isDownload: true }
    );
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-navy">
      {/* ========================================================================= */}
      {/* 1. ARCHIVAL DOSSIER HEADER                                                */}
      {/* ========================================================================= */}
      <section className="bg-brand-navy text-white pt-32 sm:pt-40 pb-20 sm:pb-28 px-5 sm:px-8 relative overflow-hidden">
        {/* Ledger grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-40" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand-blue/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            to="/legal-documents"
            className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-brand-yellow hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Repositori Arsip</span>
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-md bg-white/10 text-brand-yellow font-mono text-xs font-bold border border-brand-yellow/30">
              {doc.code}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white font-heading">
              {doc.categoryLabel}
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Tahun {doc.year}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
            {doc.title}
          </h1>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-brand-yellow" />
              <span>BERKAS RESMI: <strong>{doc.fileFormat}</strong> ({doc.fileSize})</span>
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-red hover:bg-red-600 text-white font-heading font-bold text-xs shadow-clay-red transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Salinan PDF Resmi</span>
            </button>
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
      {/* 2. OFFICIAL DOSSIER RECORD DETAILS                                        */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 pb-28 space-y-8">
        
        {/* Verification Status Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4 text-emerald-900">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-heading font-bold text-sm text-emerald-950">Status Keabsahan Dokumen Terverifikasi</h4>
            <p className="text-xs text-emerald-800 mt-0.5 font-sans leading-relaxed">{doc.verifiedStatus}</p>
          </div>
        </div>

        {/* Overview & Scope */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center">
              <FileBadge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-brand-navy">Ringkasan & Ruang Lingkup Ketetapan</h3>
              <p className="text-xs text-slate-500 font-sans">Dokumentasi hukum resmi ormawa mahasiswa ITG.</p>
            </div>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            {doc.description}
          </p>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block font-medium">Klasifikasi Arsip</span>
              <span className="font-heading font-bold text-brand-navy text-sm">{doc.categoryLabel}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block font-medium">Validasi Digital</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">SHA-256 Validated</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-400 block font-medium">Hak Akses & Distribusi</span>
              <span className="font-heading font-bold text-brand-navy text-sm">Publik / Sivitas ITG</span>
            </div>
          </div>
        </div>

        {/* Action / Physical Copy Guidance */}
        <div className="p-6 sm:p-8 rounded-3xl bg-brand-navy text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glass">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-yellow" />
              <h4 className="font-heading font-bold text-lg text-white">Butuh Salinan Cetak atau Stempel Basah?</h4>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Kunjungi Sekretariat BEM ITG KOLEKTIVA di Gedung PUSGIWA Lantai 2 untuk pengesahan berkas fisik.
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-xl bg-brand-yellow text-brand-navy font-heading font-bold text-xs shadow-clay-yellow hover:bg-[#e6a800] transition-all shrink-0 active:scale-95"
          >
            Unduh Berkas Sekarang
          </button>
        </div>

      </div>
    </div>
  );
};
