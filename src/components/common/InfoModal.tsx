import React from 'react';
import { Check, FileCheck2, X, Download } from 'lucide-react';
import { useModals } from '../../context/ModalContext';
import { PrimaryButton } from './PrimaryButton';

export const InfoModal: React.FC = () => {
  const { isInfoModalOpen, closeInfoModal, infoModalData } = useModals();

  if (!isInfoModalOpen || !infoModalData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card-dark rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-white/20 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={closeInfoModal}
          className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center mb-4">
          <FileCheck2 className="w-6 h-6" />
        </div>

        <h3 className="font-heading font-bold text-xl text-white mb-2">{infoModalData.title}</h3>
        <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed mb-6">
          {infoModalData.body}
        </p>

        {infoModalData.badge && (
          <div className="p-3.5 rounded-xl bg-brand-navy border border-white/10 flex items-center justify-between text-xs mb-6">
            <span className="text-slate-400">Status Keabsahan:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> {infoModalData.badge}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {infoModalData.isDownload && (
            <button
              onClick={() => {
                alert(`Mengunduh berkas: ${infoModalData.title}...`);
                closeInfoModal();
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Salinan
            </button>
          )}
          <PrimaryButton onClick={closeInfoModal} size="sm">
            Tutup
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

