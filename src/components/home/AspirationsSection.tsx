import React, { useState } from 'react';
import { Megaphone, Lock, Send, CheckCircle, SearchCheck, Check } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { PrimaryButton } from '../common/PrimaryButton';
import { initialAspirations } from '../../data/aspirations';
import { AspirationCategory, AspirationUrgency, AspirationTicket } from '../../types';

export const AspirationsSection: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderName, setSenderName] = useState('');
  const [senderNim, setSenderNim] = useState('');
  const [category, setCategory] = useState<AspirationCategory>('Fasilitas & Infrastruktur Kampus');
  const [urgency, setUrgency] = useState<AspirationUrgency>('Normal');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);

  // Tracker state
  const [trackInput, setTrackInput] = useState('ASP-2026-089');
  const [trackedTicket, setTrackedTicket] = useState<AspirationTicket>(initialAspirations[0]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 'ASP-2026-' + Math.floor(100 + Math.random() * 900);
    setGeneratedTicket(newId);

    // Auto-load in tracker
    setTrackInput(newId);
    setTrackedTicket({
      ticketId: newId,
      title: title || 'Aspirasi Mahasiswa Baru',
      body,
      category,
      urgency,
      isAnonymous,
      senderName,
      senderNim,
      status: 'Baru Diterima',
      createdAt: 'Hari ini',
      pipeline: [
        { step: 1, title: '1. Aspirasi Diterima Sistem', description: 'Tervalidasi melalui portal online BEM ITG KOLEKTIVA.', status: 'completed' },
        { step: 2, title: '2. Telaah Biro Advokasi', description: 'Sedang diverifikasi oleh staf komisi advokasi.', status: 'in-progress' },
        { step: 3, title: '3. Audiensi Pimpinan Universitas', description: 'Diagendakan ke forum dekanat/rektorat.', status: 'pending' },
        { step: 4, title: '4. Penerbitan Kebijakan & Solusi', description: 'Hasil keputusan resmi akan diumumkan terbuka.', status: 'pending' },
      ],
    });

    setTitle('');
    setBody('');
    setSenderName('');
    setSenderNim('');
  };

  const handleTrack = () => {
    setIsSearching(true);
    const found = initialAspirations.find(
      (a) => a.ticketId.toLowerCase() === trackInput.trim().toLowerCase()
    );

    setTimeout(() => {
      if (found) {
        setTrackedTicket(found);
      } else {
        setTrackedTicket({
          ticketId: trackInput.toUpperCase() || 'ASP-2026-089',
          title: 'Aspirasi Terverifikasi Sistem',
          body: 'Dokumen aspirasi dalam pemrosesan awal birokrasi kampus.',
          category: 'Fasilitas & Infrastruktur Kampus',
          urgency: 'Normal',
          isAnonymous: true,
          status: 'Sedang Ditelaah Komisi',
          createdAt: '2026-10-30',
          pipeline: [
            { step: 1, title: '1. Aspirasi Diterima Sistem', description: 'Tervalidasi online.', status: 'completed' },
            { step: 2, title: '2. Telaah Biro Advokasi', description: 'Sedang dalam review bukti awal.', status: 'in-progress' },
            { step: 3, title: '3. Audiensi Pimpinan Universitas', description: 'Menunggu jadwal sidang.', status: 'pending' },
            { step: 4, title: '4. Penerbitan Kebijakan & Solusi', description: 'Belum diterbitkan.', status: 'pending' },
          ],
        });
      }
      setIsSearching(false);
    }, 400);
  };

  return (
    <section id="aspirations" className="pt-16 sm:pt-20 pb-20 sm:pb-24 bg-brand-navy relative overflow-hidden text-white">
      {/* Subtle organic ambient color washes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[250px] bg-brand-blue/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(0,62,205,0.2)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-yellow/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">

        <SectionHeading
          badgeText="Ruang Aspirasi Terpadu"
          badgeIcon={<Megaphone className="w-3.5 h-3.5" />}
          title="Your Voice Matters."
          description="Setiap suara punya arti. Sampaikan kritik fasilitas, masukan akademik, maupun ide gerakan tanpa rasa takut. Didukung privasi terjaga dan opsi anonim."
          align="center"
          theme="dark"
          className="mb-16"
        />

        {/* Main Dual Panel: Submit vs Track Aspirasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">

          {/* Left Panel: Interactive Submission Form */}
          <div className="lg:col-span-7 glass-card-dark rounded-3xl p-6 sm:p-8 border border-white/15 shadow-glass-dark">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-wrap gap-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-white">Formulir Penyampaian Aspirasi</h3>
                <p className="text-xs text-slate-300">Diterima langsung oleh Komisi Aspirasi BEM</p>
              </div>

              {/* Anonymous Switch */}
              <div className="flex items-center gap-2 bg-brand-navy/90 px-3 py-1.5 rounded-full border border-white/15">
                <span className={`text-xs font-semibold ${isAnonymous ? 'text-brand-yellow' : 'text-slate-300'}`}>
                  {isAnonymous ? 'Mode Anonim' : 'Mode Teridentifikasi'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none p-0.5 ${isAnonymous ? 'bg-brand-yellow' : 'bg-white/20'
                    }`}
                  aria-label="Toggle Mode Anonim"
                >
                  <div
                    className={`w-4 h-4 bg-brand-navy rounded-full transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Identified Fields (Shown if Anonymous is OFF) */}
              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required={!isAnonymous}
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Contoh: Dimas Prakoso"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">NPM / Program Studi</label>
                    <input
                      type="text"
                      required={!isAnonymous}
                      value={senderNim}
                      onChange={(e) => setSenderNim(e.target.value)}
                      placeholder="2106728xxx / Informatika"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">Kategori Bidang</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AspirationCategory)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
                  >
                    <option value="Fasilitas & Infrastruktur Kampus">Fasilitas & Infrastruktur</option>
                    <option value="Kebijakan UKT & Finansial">Kebijakan UKT & Finansial</option>
                    <option value="Layanan Akademik & Dosen">Layanan Akademik & Kurikulum</option>
                    <option value="Keamanan & Ruang Aman Kampus">Keamanan & Ruang Aman</option>
                    <option value="Kegiatan Kemahasiswaan & Ormawa">Kegiatan Kemahasiswaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">Tingkat Urgensi</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as AspirationUrgency)}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
                  >
                    <option value="Normal">Normal (Kajian Rutin)</option>
                    <option value="Mendesak">Mendesak (Tindakan Cepat)</option>
                    <option value="Kritis">Kritis (Hak Terancam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1.5">Judul Aspirasi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tuliskan intisari pokok masalah atau usulan..."
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1.5">
                  Deskripsi Lengkap & Lokasi Terkait
                </label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Jelaskan kronologi, rincian keluhan, atau ide konkret secara terperinci..."
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                  Data terlindungi enkripsi internal BEM ITG.
                </span>

                <PrimaryButton type="submit" size="md" icon={<Send className="w-3.5 h-3.5 stroke-[2.5]" />}>
                  Kirim Aspirasi
                </PrimaryButton>
              </div>
            </form>

            {/* Success Alert Box */}
            {generatedTicket && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4" /> Aspirasi Berhasil Dikirimkan!
                </div>
                <p>
                  ID Tiket Pelacakan Anda:{' '}
                  <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                    {generatedTicket}
                  </span>
                </p>
                <p className="text-[11px] text-emerald-400/90">
                  Simpan tiket ini untuk memeriksa tahapan verifikasi tanpa memerlukan login akun.
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Real-time Ticket Tracker */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-card-dark rounded-3xl p-6 sm:p-8 border border-white/15 shadow-glass-dark">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-blue/30 text-brand-yellow flex items-center justify-center font-bold">
                  <SearchCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Lacak Status Aspirasi</h3>
                  <p className="text-xs text-slate-300">Transparansi alur tindak lanjut publik</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Masukkan ID Tiket yang kamu terima untuk melihat posisi telaah dokumen di meja tim advokasi atau komisi pimpinan.
              </p>

              {/* Search Ticket Input */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder="Contoh: ASP-2026-089"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs font-mono focus:border-brand-yellow focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={handleTrack}
                  disabled={isSearching}
                  className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-[#e0142b] text-white font-bold text-xs shadow-clay-red transition-all"
                >
                  {isSearching ? 'Memeriksa...' : 'Lacak'}
                </button>
              </div>

              {/* Dynamic Pipeline Display */}
              <div className="space-y-4 bg-brand-navy/90 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nomor Dokumen</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {trackedTicket.ticketId}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
                    {trackedTicket.status}
                  </span>
                </div>

                {/* Pipeline Steps */}
                <div className="space-y-3 pt-2">
                  {trackedTicket.pipeline.map((step) => {
                    const isDone = step.status === 'completed';
                    const isInProgress = step.status === 'in-progress';

                    return (
                      <div key={step.step} className={`flex items-start gap-3 ${!isDone && !isInProgress ? 'opacity-40' : ''}`}>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isDone
                            ? 'bg-emerald-500 text-brand-navy'
                            : isInProgress
                              ? 'bg-brand-yellow text-brand-navy animate-pulse'
                              : 'bg-white/10 text-slate-300'
                            }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.step}
                        </div>
                        <div>
                          <h5
                            className={`text-xs font-bold ${isDone ? 'text-white' : isInProgress ? 'text-brand-yellow' : 'text-slate-300'
                              }`}
                          >
                            {step.title}
                          </h5>
                          <p className="text-[10px] text-slate-300/80">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>


          </div>

        </div>

      </div>
    </section>
  );
};

