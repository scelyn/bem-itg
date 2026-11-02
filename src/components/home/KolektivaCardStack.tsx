import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Handshake, Users, HeartHandshake, Home, Sparkles } from 'lucide-react';

interface ValueCard {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  theme: 'blue' | 'navy' | 'red' | 'yellow';
  icon: React.ReactNode;
  highlight: string;
}

const values: ValueCard[] = [
  {
    id: 'kolaborasi',
    number: '01',
    title: 'Kolaborasi',
    tagline: 'Kekuatan Lintas Disiplin',
    description:
      'Menghubungkan potensi, gagasan, dan kekuatan lintas program studi demi menciptakan perubahan yang berdampak nyata.',
    theme: 'blue',
    icon: <Handshake className="w-6 h-6 text-brand-yellow" />,
    highlight: 'Kekuatan Bersinergi',
  },
  {
    id: 'keterlibatan',
    number: '02',
    title: 'Keterlibatan',
    tagline: 'Partisipasi Terbuka',
    description:
      'Membuka ruang partisipasi aktif bagi setiap mahasiswa untuk menyuarakan ide dan mengambil bagian dalam gerakan bersama.',
    theme: 'red',
    icon: <Users className="w-6 h-6 text-white" />,
    highlight: 'Suara yang Didengar',
  },
  {
    id: 'inklusivitas',
    number: '03',
    title: 'Inklusivitas',
    tagline: 'Ruang Setara untuk Semua',
    description:
      'Merangkul keberagaman latar belakang, minat, dan aspirasi tanpa membatasi siapa pun untuk menjadi bagian dari perubahan.',
    theme: 'yellow',
    icon: <HeartHandshake className="w-6 h-6 text-brand-navy" />,
    highlight: 'Tanpa Sekat & Batas',
  },
  {
    id: 'kepemilikan-bersama',
    number: '04',
    title: 'Kepemilikan Bersama',
    tagline: 'Rumah Milik Bersama',
    description:
      'Menjadikan BEM sebagai rumah bersama yang tumbuh melalui kontribusi dan rasa memiliki seluruh keluarga besar mahasiswa.',
    theme: 'navy',
    icon: <Home className="w-6 h-6 text-brand-yellow" />,
    highlight: 'Tumbuh dari Kita',
  },
];

export const KolektivaCardStack: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % values.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + values.length) % values.length);
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Deck Viewport */}
      <div className="relative w-full max-w-lg h-[360px] sm:h-[380px] flex items-center justify-center select-none touch-pan-y">
        <AnimatePresence initial={false} mode="popLayout">
          {values.map((card, index) => {
            // Calculate relative offset from active card
            const offset = (index - currentIndex + values.length) % values.length;
            const isFront = offset === 0;

            // Only render top 3 cards for clean stacked depth
            if (offset > 2) return null;

            // Stack styling & positioning
            const yOffset = offset * 18;
            const scale = 1 - offset * 0.05;
            const rotation = offset === 0 ? 0 : offset === 1 ? 2.5 : -2;
            const zIndex = 30 - offset * 10;
            const opacity = offset === 0 ? 1 : offset === 1 ? 0.88 : 0.65;

            // Distinct themes based on official BEM palette
            const themeClasses = {
              blue: 'bg-gradient-to-br from-[#003ECD] to-[#002A62] text-white border-white/20 shadow-clay-blue',
              red: 'bg-gradient-to-br from-[#FF1833] to-[#002A62] text-white border-white/20 shadow-clay-red',
              yellow: 'bg-gradient-to-br from-[#002A62] via-[#001E47] to-[#003ECD] text-white border-brand-yellow/30 shadow-clay-yellow',
              navy: 'bg-gradient-to-br from-[#002A62] to-[#001633] text-white border-white/15 shadow-glass-dark',
            };

            return (
              <motion.div
                key={card.id}
                className={`absolute inset-x-2 sm:inset-x-4 top-0 rounded-3xl p-5 sm:p-8 flex flex-col justify-between border cursor-grab active:cursor-grabbing overflow-hidden ${themeClasses[card.theme]}`}
                style={{
                  height: '340px',
                  zIndex,
                }}
                initial={false}
                animate={{
                  y: yOffset,
                  scale,
                  rotate: rotation,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 26,
                }}
                drag={isFront ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) {
                    nextCard();
                  } else if (info.offset.x > 60) {
                    prevCard();
                  }
                }}
              >
                {/* Background Large Number Watermark */}
                <div
                  className="absolute right-3 -bottom-6 text-[7rem] sm:text-[9rem] font-heading font-black text-white/[0.07] select-none pointer-events-none leading-none"
                  aria-hidden="true"
                >
                  {card.number}
                </div>

                {/* Top Card Row: Badge & Number Tag */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold font-mono">
                    <span className="text-brand-yellow">{card.number}</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white uppercase tracking-wider line-clamp-1">{card.tagline}</span>
                  </div>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-inner shrink-0">
                    {card.icon}
                  </div>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 space-y-2 sm:space-y-3 my-auto">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-yellow" />
                    <span className="text-[10px] sm:text-xs font-bold text-brand-yellow uppercase tracking-widest font-heading">
                      Pilar Nilai Kolektiva
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200/95 leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Card Row */}
                <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-black/20 text-slate-200 font-medium text-[11px]">
                    {card.highlight}
                  </span>
                  <span className="text-slate-300/80 text-[11px] font-medium hidden sm:inline">
                    Geser kartu untuk lanjut &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Stack Controls & Pagination */}
      <div className="w-full max-w-lg mt-6 px-2 flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={prevCard}
          className="w-10 h-10 rounded-full bg-white hover:bg-brand-slate text-brand-navy border border-brand-border flex items-center justify-center shadow-sm hover:border-brand-blue transition-all active:scale-95"
          aria-label="Kartu Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Pagination Pill Indicators */}
        <div className="flex items-center gap-2">
          {values.map((v, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={v.id}
                onClick={() => goToCard(i)}
                className={`transition-all duration-300 rounded-full h-2.5 ${
                  isActive ? 'w-8 bg-brand-blue shadow-sm' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Lihat ${v.title}`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={nextCard}
          className="w-10 h-10 rounded-full bg-brand-navy hover:bg-brand-blue text-white flex items-center justify-center shadow-sm transition-all active:scale-95"
          aria-label="Kartu Berikutnya"
        >
          <ChevronRight className="w-5 h-5 text-brand-yellow" />
        </button>
      </div>
    </div>
  );
};

