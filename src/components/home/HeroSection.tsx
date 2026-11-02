import React from 'react';
import { ArrowDown, MessageSquarePlus } from 'lucide-react';
import { useModals } from '../../context/ModalContext';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

export const HeroSection: React.FC = () => {
  const { openAspirasiModal } = useModals();

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden text-white">
      {/* 1. Immersive Photographic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/BEM ITG.jpeg"
          onError={(e) => {
            // Fallback in case of path differences
            (e.currentTarget as HTMLImageElement).src = '/public/BEM ITG.jpeg';
          }}
          alt="Kampus Institut Teknologi Garut"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          loading="eager"
        />

        {/* 2. Cinematic Royal Blue & Persian Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#002A62]/85 via-[#002A62]/70 to-[#002A62]" />

        {/* Subtle radial depth highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(0,62,205,0.4)_0%,transparent_75%)]" />

        {/* 3. Seamless Bottom Transition Zone into AboutSection */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#002A62]/80 to-[#002A62]" />
      </div>

      {/* 4. Hero Content Composition */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10 text-center flex flex-col items-center">


        {/* Main Editorial Headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.08] mb-6 drop-shadow-md">
          Suara Mahasiswa, <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-white">
            Gerak Bersama.
            {/* Hand-drawn stylistic underline accent in brand yellow */}
            <svg
              className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 text-brand-yellow"
              viewBox="0 0 300 20"
              fill="none"
              aria-hidden="true"
            >
              <path d="M5 14C80 4 220 4 295 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg md:text-xl text-slate-100/95 font-normal max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow">
          Ruang digital untuk mengenal organisasi, mengikuti gerakan BEM, dan menyampaikan aspirasi demi perubahan yang lebih baik.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 w-full sm:w-auto">
          <a href="#about" className="w-full sm:w-auto">
            <SecondaryButton
              variant="yellow"
              size="lg"
              icon={<ArrowDown className="w-4 h-4 text-brand-navy group-hover:translate-y-1 transition-transform" />}
              className="w-full sm:w-auto text-brand-navy font-bold shadow-clay-yellow"
            >
              Jelajahi Portal
            </SecondaryButton>
          </a>

          <PrimaryButton
            size="lg"
            onClick={openAspirasiModal}
            icon={<MessageSquarePlus className="w-4 h-4 text-white" />}
            className="w-full sm:w-auto shadow-clay-red"
          >
            Sampaikan Aspirasi
          </PrimaryButton>
        </div>

      </div>
    </section>
  );
};
