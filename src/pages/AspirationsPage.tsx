import React, { useState } from 'react';
import { Send, Lock, ShieldCheck, CheckCircle2, ArrowRight, User, EyeOff, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AspirationCategory, AspirationUrgency } from '../types';

export const AspirationsPage: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderName, setSenderName] = useState('');
  const [senderNim, setSenderNim] = useState('');
  const [category, setCategory] = useState<AspirationCategory>('Fasilitas & Infrastruktur Kampus');
  const [urgency, setUrgency] = useState<AspirationUrgency>('Normal');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newId = 'ASP-2026-' + Math.floor(100 + Math.random() * 900);
      setSubmittedTicket(newId);
      setIsSubmitting(false);
      setTitle('');
      setBody('');
    }, 400);
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setTitle('');
    setBody('');
    setSenderName('');
    setSenderNim('');
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-navy">
      {/* ========================================================================= */}
      {/* 1. EXPRESSIVE EDITORIAL PAGE HEADER                                       */}
      {/* ========================================================================= */}
      <section className="bg-brand-navy text-white pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-8 relative overflow-hidden">
        {/* Ambient subtle light accents */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand-blue/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
            {/* Left Column: Expressive Typography */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Eyebrow: Pure text with letter spacing and subtle accent bar, no container */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-yellow font-heading">
                <span className="w-8 h-[2px] bg-brand-yellow rounded-full" />
                <span>Kanal Partisipasi & Dialog Terbuka</span>
              </div>

              {/* Expressive Editorial Headline in Space Grotesk */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.08]">
                <span className="block font-medium text-slate-200">Setiap Suara,</span>
                <span className="block font-black text-white mt-1 sm:mt-2">
                  Menyalakan <span className="text-brand-yellow">Perubahan</span>.
                </span>
                <span className="block font-light text-slate-300 text-2xl sm:text-3xl lg:text-4xl mt-3 sm:mt-4 tracking-normal">
                  Ruang Dialog Inklusif Mahasiswa ITG.
                </span>
              </h1>
            </div>

            {/* Right Column: Editorial Companion Copy */}
            <div className="lg:col-span-5 space-y-4 lg:pb-3 lg:border-l lg:border-white/15 lg:pl-8">
              <p className="text-base sm:text-lg text-slate-200/95 font-normal leading-relaxed font-sans">
                BEM ITG KOLEKTIVA hadir untuk mendengar gagasan, kritik kebijakan, laporan fasilitas kampus, hingga permohonan advokasi.
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed font-sans">
                Sampaikan keresahan Anda secara terbuka maupun anonim tanpa rasa ragu. Setiap suara mahasiswa adalah energi pembenahan bersama.
              </p>
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
      {/* 2. FORM & INFORMATION WORKSPACE                                           */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left: Interactive Submission Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors">
            
            {/* Form Header */}
            <div className="pb-6 mb-6 border-b border-brand-border">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
                Formulir Aspirasi & Advokasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
                Ditinjau dan dikawal langsung oleh Kementerian Advokasi BEM ITG.
              </p>
            </div>

            {/* Mode Privasi Selector (Human & Approachable) */}
            <div className="mb-6 p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-heading font-bold transition-all ${
                  isAnonymous
                    ? 'bg-brand-navy text-brand-yellow shadow-sm'
                    : 'text-slate-600 hover:text-brand-navy'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mode Anonim (Rahasia)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-heading font-bold transition-all ${
                  !isAnonymous
                    ? 'bg-brand-navy text-brand-yellow shadow-sm'
                    : 'text-slate-600 hover:text-brand-navy'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sertakan Identitas</span>
              </button>
            </div>

            {/* Success Receipt State */}
            {submittedTicket ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5 text-emerald-700 font-heading font-extrabold text-lg sm:text-xl">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <span>Aspirasi Berhasil Diterima Sistem!</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                  Terima kasih atas partisipasi aktif Anda. Aspirasi ini telah tercatat dalam sistem advokasi BEM ITG KOLEKTIVA dengan nomor tiket:
                </p>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">ID Tiket Pelacakan</span>
                    <span className="font-mono font-black text-xl text-brand-navy">{submittedTicket}</span>
                  </div>
                  <Link
                    to={`/aspirations/track?ticket=${submittedTicket}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-navy text-brand-yellow hover:bg-brand-blue hover:text-white font-heading font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>Lacak Tiket Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs font-bold text-slate-600 hover:text-brand-navy hover:underline"
                  >
                    + Kirim Aspirasi Lainnya
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Identified Mode Inputs */}
                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                        Nama Lengkap <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="text"
                        required={!isAnonymous}
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Contoh: Muhammad Fikri"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-brand-navy text-xs placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                        NPM / Program Studi <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="text"
                        required={!isAnonymous}
                        value={senderNim}
                        onChange={(e) => setSenderNim(e.target.value)}
                        placeholder="220672001 / Teknik Sipil"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-brand-navy text-xs placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Category & Urgency Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                      Kategori Bidang
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as AspirationCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 focus:outline-none transition-all"
                    >
                      <option value="Fasilitas & Infrastruktur Kampus">Fasilitas & Infrastruktur</option>
                      <option value="Kebijakan UKT & Finansial">Kebijakan UKT & Finansial</option>
                      <option value="Layanan Akademik & Dosen">Layanan Akademik & Kurikulum</option>
                      <option value="Keamanan & Ruang Aman Kampus">Keamanan & Ruang Aman</option>
                      <option value="Kegiatan Kemahasiswaan & Ormawa">Kegiatan Kemahasiswaan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                      Tingkat Urgensi
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as AspirationUrgency)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 focus:outline-none transition-all"
                    >
                      <option value="Normal">Normal (Kajian Rutin)</option>
                      <option value="Mendesak">Mendesak (Tindakan Cepat)</option>
                      <option value="Kritis">Kritis (Hak Terancam)</option>
                    </select>
                  </div>
                </div>

                {/* Subject / Title */}
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                    Judul Aspirasi <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Intisari pokok permasalahan atau gagasan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs placeholder:text-slate-400 focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 focus:outline-none transition-all"
                  />
                </div>

                {/* Details / Body */}
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                    Rincian Keterangan & Harapan Tindak Lanjut <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Uraikan kronologi persoalan, lokasi spesifik, pihak terkait, dan solusi yang Anda harapkan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs placeholder:text-slate-400 focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 focus:outline-none transition-all resize-y"
                  />
                </div>

                {/* Submit Row */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                    <Lock className="w-4 h-4 text-brand-blue shrink-0" />
                    <span>
                      {isAnonymous
                        ? 'Pengiriman anonim: identitas tidak direkam.'
                        : 'Identitas terjaga dalam etika pendampingan ormawa.'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand-red hover:bg-red-600 disabled:opacity-60 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-clay-red transition-all active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Aspirasi Sekarang'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Right: Privacy & Process Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Privacy & Trust Guide */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-navy">Keamanan & Kejelasan Privasi</h3>
                  <p className="text-xs text-slate-500 font-sans">Ketahui bagaimana suara Anda diperlakukan.</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 font-sans leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-brand-navy block font-heading">1. Opsi Anonim Tanpa Jejak</span>
                  <p className="text-slate-600">
                    Nama dan identitas pribadi tidak dicatat maupun diteruskan ke pihak mana pun. Cocok untuk kritik kebijakan sensitif atau masukan umum.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-bold text-brand-navy block font-heading">2. Opsi Teridentifikasi</span>
                  <p className="text-slate-600">
                    Disarankan untuk laporan yang memerlukan tindak lanjut personal (seperti banding UKT, masalah nilai akademik, atau hak beasiswa).
                  </p>
                </div>
              </div>

              {/* Follow-up Flow */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading block">
                  Alur Tindak Lanjut Aspirasi
                </span>
                <div className="space-y-2 text-xs text-slate-600 font-sans">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-navy/10 text-brand-navy font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-semibold text-brand-navy">Verifikasi Awal:</span> Penelaahan pokok persoalan dan kejelasan bukti oleh narahubung advokasi.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-navy/10 text-brand-navy font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-semibold text-brand-navy">Konsolidasi Data:</span> Aspirasi dihimpun menjadi rumusan telaah kebijakan atau nota advokasi.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-navy/10 text-brand-navy font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="font-semibold text-brand-navy">Audiensi & Penyelesaian:</span> Penyampaian ke pimpinan institut serta pengawalan hingga tuntas.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Access (Secondary Pathway) */}
            <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-bold uppercase tracking-wider font-heading">
                <Clock className="w-4 h-4 text-brand-blue" />
                <span>Sudah Mengirim Sebelumnya?</span>
              </div>
              <h4 className="font-heading font-bold text-base text-brand-navy">
                Pelacakan Status Aspirasi
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Masukkan kode tiket unik yang Anda terima untuk memantau perkembangan tindak lanjut dokumen oleh tim advokasi.
              </p>
              <div className="pt-2">
                <Link
                  to="/aspirations/track"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-brand-navy/20 hover:border-brand-navy text-brand-navy hover:bg-brand-navy/5 font-heading font-bold text-xs transition-colors shadow-sm"
                >
                  <span>Buka Halaman Pelacakan Tiket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
