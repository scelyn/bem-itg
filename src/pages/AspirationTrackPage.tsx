import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchCheck, Check, ArrowLeft, PhoneCall } from 'lucide-react';
import { initialAspirations } from '../data/aspirations';
import { AspirationTicket, PipelineStep } from '../types';

export const AspirationTrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryTicket = searchParams.get('ticket') || 'ASP-2026-089';

  const [inputVal, setInputVal] = useState(queryTicket);
  const [ticket, setTicket] = useState<AspirationTicket>(initialAspirations[0]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (queryTicket) {
      setInputVal(queryTicket);
      const found = initialAspirations.find(
        (a: AspirationTicket) => a.ticketId.toLowerCase() === queryTicket.toLowerCase()
      );
      if (found) {
        setTicket(found);
      }
    }
  }, [queryTicket]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const found = initialAspirations.find(
      (a: AspirationTicket) => a.ticketId.toLowerCase() === inputVal.trim().toLowerCase()
    );

    setTimeout(() => {
      if (found) {
        setTicket(found);
      } else {
        setTicket({
          ticketId: inputVal.trim().toUpperCase() || 'ASP-2026-089',
          title: 'Aspirasi Terverifikasi Sistem',
          body: 'Laporan telah dicatat ke dalam buku register advokasi kampus.',
          category: 'Fasilitas & Infrastruktur Kampus',
          urgency: 'Normal',
          isAnonymous: true,
          status: 'Sedang Ditelaah Komisi',
          createdAt: '2026-10-30',
          pipeline: [
            { step: 1, title: '1. Aspirasi Diterima Sistem', description: 'Tervalidasi online.', status: 'completed' },
            { step: 2, title: '2. Telaah Biro Advokasi', description: 'Sedang dalam review bukti awal.', status: 'in-progress' },
            { step: 3, title: '3. Audiensi Pimpinan Universitas', description: 'Menunggu jadwal sidang dekanat.', status: 'pending' },
            { step: 4, title: '4. Penerbitan Kebijakan & Solusi', description: 'Belum diterbitkan.', status: 'pending' },
          ],
        });
      }
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="pt-28 pb-20 bg-brand-white text-brand-navy">
      {/* Header Banner */}
      <section className="bg-brand-navy text-white py-16 px-5 sm:px-8 border-b border-white/10 relative overflow-hidden hero-mesh">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Link
            to="/aspirations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-yellow hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Form Aspirasi
          </Link>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Lacak Status & Progres Aspirasi
          </h1>
          <p className="text-slate-200/90 text-sm sm:text-base max-w-xl mx-auto">
            Pantau transparansi tahapan telaah kajian, proses audiensi ke rektorat, hingga penerbitan solusi.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-10">
        
        {/* Ticket Lookup Box */}
        <form onSubmit={handleSearch} className="bg-brand-slate p-5 rounded-3xl border border-brand-border flex flex-col sm:flex-row gap-3 shadow-sm">
          <div className="relative flex-1">
            <SearchCheck className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Masukkan ID Tiket (Contoh: ASP-2026-089)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-brand-border text-brand-navy text-sm font-mono uppercase focus:border-brand-blue focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-8 py-3 rounded-2xl bg-brand-red text-white font-heading font-bold text-xs shadow-clay-red hover:bg-[#e0142b] transition-all"
          >
            {isSearching ? 'Memeriksa...' : 'Lacak Status'}
          </button>
        </form>

        {/* Ticket Detail Card */}
        <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-sm space-y-8">
          
          {/* Metadata Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Nomor Tiket Terdaftar
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-2xl text-brand-navy">{ticket.ticketId}</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-yellow/20 text-brand-navy border border-brand-yellow/40">
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
              <div>Kategori: <strong className="text-brand-navy">{ticket.category}</strong></div>
              <div>Tingkat Urgensi: <strong className="text-brand-red">{ticket.urgency}</strong></div>
              <div>Tanggal Masuk: {ticket.createdAt}</div>
            </div>
          </div>

          {/* Title & Body */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-xl text-brand-navy">{ticket.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-brand-slate p-4 rounded-2xl border border-brand-border">
              {ticket.body}
            </p>
          </div>

          {/* 4-Step Pipeline Progression */}
          <div className="space-y-4 pt-4">
            <h4 className="font-heading font-bold text-base text-brand-navy">Tahapan Penanganan Advokasi</h4>

            <div className="relative border-l-2 border-brand-blue/30 ml-4 pl-6 space-y-8">
              {ticket.pipeline.map((step: PipelineStep) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';

                return (
                  <div key={step.step} className="relative">
                    {/* Circle marker on line */}
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : isInProgress
                          ? 'bg-brand-yellow text-brand-navy border-yellow-500 animate-pulse'
                          : 'bg-white text-slate-400 border-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.step}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h5
                          className={`font-heading font-bold text-sm ${
                            isCompleted
                              ? 'text-emerald-700'
                              : isInProgress
                              ? 'text-brand-navy'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h5>
                        {step.date && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                            {step.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Help Banner */}
          <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-slate p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-brand-red shrink-0" />
              <div>
                <h5 className="font-heading font-bold text-xs text-brand-navy">Pertanyaan Terkait Progres?</h5>
                <p className="text-[11px] text-slate-500">Hubungi langsung narahubung Komisi Aspirasi BEM ITG</p>
              </div>
            </div>
            <a
              href="https://wa.me/6281299887766"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs transition-colors shrink-0"
            >
              Hubungi via WhatsApp
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
