import React, { createContext, useContext, useState, useEffect } from 'react';

interface InfoModalData {
  title: string;
  body: string;
  badge?: string;
  meta?: string;
  isDownload?: boolean;
}

interface ModalContextType {
  isAspirasiModalOpen: boolean;
  openAspirasiModal: () => void;
  closeAspirasiModal: () => void;
  isInfoModalOpen: boolean;
  infoModalData: InfoModalData | null;
  openInfoModal: (title: string, body: string, options?: { badge?: string; meta?: string; isDownload?: boolean }) => void;
  closeInfoModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAspirasiModalOpen, setIsAspirasiModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState<InfoModalData | null>(null);

  const openAspirasiModal = () => setIsAspirasiModalOpen(true);
  const closeAspirasiModal = () => setIsAspirasiModalOpen(false);

  const openInfoModal = (title: string, body: string, options?: { badge?: string; meta?: string; isDownload?: boolean }) => {
    setInfoModalData({
      title,
      body,
      badge: options?.badge || 'Terverifikasi Tanda Tangan Digital',
      meta: options?.meta,
      isDownload: options?.isDownload ?? true,
    });
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setInfoModalData(null);
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAspirasiModal();
        closeInfoModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isAspirasiModalOpen,
        openAspirasiModal,
        closeAspirasiModal,
        isInfoModalOpen,
        infoModalData,
        openInfoModal,
        closeInfoModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};

