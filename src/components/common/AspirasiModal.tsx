import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useModals } from '../../context/ModalContext';
import { PrimaryButton } from './PrimaryButton';

export const AspirasiModal: React.FC = () => {
  const { isAspirasiModalOpen, closeAspirasiModal, openInfoModal } = useModals();
  const [category, setCategory] = useState('Advokasi UKT & Sanggahan Finansial');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!isAspirasiModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = 'ASP-2026-' + Math.floor(100 + Math.random() * 900);
    closeAspirasiModal();
    setTitle('');
    setBody('');
    openInfoModal(
      'Aspirasi Berhasil Dikirimkan!',
      `Terima kasih telah menyuarakan pendapatmu! Tiket pelacakan Anda adalah [${randomTicket}]. Anda dapat melacak progres kajian melalui menu Ruang Aspirasi atau halaman Lacak Aspirasi.`,
      { badge: 'Tiket Resmi Terbit: ' + randomTicket, isDownload: false }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card-dark rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-white/20 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeAspirasiModal}
          className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-brand-red text-white flex items-center justify-center font-bold shadow-clay-red">
            <Send className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-white">Sampaikan Suaramu</h3>
            <p className="text-xs text-slate-300/70">Kritik, saran, & advokasi langsung ke BEM ITG KOLEKTIVA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">Kategori Masalah</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
            >
              <option>Advokasi UKT & Sanggahan Finansial</option>
              <option>Fasilitas Kelas & Laboratorium Rusak</option>
              <option>Keamanan & Penerangan Kampus</option>
              <option>Layanan Birokrasi Akademik</option>
              <option>Ide Inisiatif Program BEM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">Judul Ringkas</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: AC Gedung A lantai 3 mati total"
              className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1">Detail Keluhan / Masukan</label>
            <textarea
              rows={4}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tuliskan sedetail mungkin untuk mempermudah investigasi tim advokasi..."
              className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/10 text-white text-xs focus:border-brand-yellow focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="modalAnon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-brand-red focus:ring-0 bg-brand-navy border-white/20"
            />
            <label htmlFor="modalAnon" className="text-xs text-slate-300 cursor-pointer">
              Kirimkan secara Anonim (Sembunyikan identitas)
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeAspirasiModal}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <PrimaryButton type="submit" size="sm">
              Kirimkan Sekarang
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

