import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { KolektivaCardStack } from './KolektivaCardStack';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative text-brand-navy overflow-hidden">

      {/* ========================================================================= */}
      {/* 1. SEAMLESS HERO-TO-ABOUT TRANSITION ZONE (EXPRESSIVE EDITORIAL HEADER)   */}
      {/* ========================================================================= */}
      <div className="bg-[#002A62] text-white pt-16 sm:pt-20 pb-28 sm:pb-36 px-5 sm:px-8 relative overflow-hidden">
        {/* Ambient subtle light accents blending naturally from hero */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand-blue/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end"
          >
            {/* Left Column: Expressive Manifesto Typography */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Eyebrow: Unboxed text with letter spacing and subtle accent bar */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-yellow font-heading">
                <span className="w-8 h-[2px] bg-brand-yellow rounded-full" />
                <span>Ruang Untuk Bertumbuh</span>
              </div>

              {/* Expressive Editorial Headline in Space Grotesk */}
              <h2 className="font-heading text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.08]">
                <span className="block font-medium text-slate-200">Satu Rumah,</span>
                <span className="block font-black text-white mt-1 sm:mt-2">
                  Banyak <span className="text-brand-yellow">Suara</span>.
                </span>
                <span className="block font-light text-slate-300 text-2xl sm:text-3xl lg:text-4xl mt-3 sm:mt-4 tracking-normal">
                  Satu Gerak Bersama.
                </span>
              </h2>
            </div>

            {/* Right Column: Editorial Companion Copy */}
            <div className="lg:col-span-5 space-y-4 lg:pb-3 lg:border-l lg:border-white/15 lg:pl-8">
              <p className="text-base sm:text-lg text-slate-200/95 font-normal leading-relaxed font-sans">
                BEM ITG hadir sebagai ruang bersama bagi seluruh mahasiswa untuk terlibat, bertumbuh, menyampaikan gagasan, dan menciptakan perubahan nyata.
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed font-sans">
                Menghubungkan keragaman latar belakang menjadi satu kekuatan kolektif yang inklusif, berani, dan berkesinambungan bagi kemajuan almamater.
              </p>
            </div>
          </motion.div>
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
      </div>

      {/* ========================================================================= */}
      {/* 2. COOL WHITE SURFACE: KOLEKTIVA PHILOSOPHY & INTERACTIVE CARD STACK      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-b from-brand-white via-brand-white to-[#F4F7FC] pt-8 sm:pt-12 pb-20 px-5 sm:px-8 relative overflow-hidden">
        {/* Subtle organic background washes (low opacity, non-intrusive) */}
        <div className="absolute top-1/4 -right-24 w-[480px] h-[480px] bg-brand-blue/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -left-24 w-[400px] h-[400px] bg-brand-yellow/[0.025] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">

          {/* Editorial Philosophy & Card Stack Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4">

            {/* Left Column: Philosophy Narrative */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Eyebrow: Unboxed text with letter spacing and subtle accent bar */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-blue font-heading">
                <span className="w-8 h-[2px] bg-brand-blue rounded-full" />
                <span>Makna di Balik Kolektiva</span>
              </div>

              {/* Prominent KOLEKTIVA Word */}
              <div className="flex items-baseline gap-3">
                <span className="font-heading font-black text-4xl sm:text-6xl text-brand-blue tracking-tight">
                  KOLEKTIVA
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Kabinet 2026/2027
                </span>
              </div>

              {/* Main Philosophical Headline */}
              <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-brand-navy tracking-tight leading-snug">
                Perubahan adalah{' '}
                <span className="relative inline-block text-brand-navy">
                  Kerja Bersama
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-brand-yellow/50 -z-10 rounded-full" />
                </span>.
              </h3>

              {/* Official Philosophical Supporting Content */}
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed border-l-2 border-brand-blue/30 pl-5">
                <p>
                  Kolektiva adalah keyakinan bahwa perubahan tidak lahir dari kerja individual semata, melainkan melalui keterlibatan, kolaborasi, dan kerja sama.
                </p>
                <p>
                  Bagi BEM ITG, Kolektiva merepresentasikan BEM sebagai rumah bersama bagi seluruh mahasiswa. Ruang yang terbuka, inklusif, dan tidak dimiliki oleh kelompok tertentu, melainkan tumbuh dari kontribusi setiap individu di dalamnya.
                </p>
              </div>


            </motion.div>

            {/* Right Column: Interactive Swipeable Card Stack */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex justify-center w-full"
            >
              <KolektivaCardStack />
            </motion.div>

          </div>

          {/* ========================================================================= */}
          {/* 3. VISI UTAMA & 4 MOVEMENT PILLARS (EDITORIAL BENTO)                      */}
          {/* ========================================================================= */}
          <div className="pt-10 border-t border-brand-border space-y-12">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <SectionHeading
                badgeText="Arah Kebijakan"
                title="Visi & Pilar Gerakan Kabinet."
                theme="light"
              />

            </div>

            {/* Bento Grid: Visi & Identitas */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Bento 1: Vision (Large 8 cols) */}
              <div className="md:col-span-8 bg-brand-navy text-white rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-glass">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow mb-5 font-heading">
                    <span className="w-5 h-[2px] bg-brand-yellow rounded-full" />
                    <span>Visi Utama</span>
                  </div>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white leading-snug mb-4">
                    "Mewujudkan BEM Institut Teknologi Garut sebagai rumah bersama mahasiswa yang Progresif, kolaboratif, dan berintegritas dalam mengembangkan potensi mahasiswa serta membangun kampus yang inovatif dan berdampak."
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 mt-6">
                  <div className="space-y-1">
                    <span className="text-brand-yellow font-heading font-black text-xl">01. Solutif</span>
                    <p className="text-xs text-slate-300">
                      Bukan sekadar mengkritisi, namun menghadirkan alternatif rumusan solusi nyata bagi kampus.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-brand-yellow font-heading font-black text-xl">02. Progresif</span>
                    <p className="text-xs text-slate-300">
                      Mendorong akselerasi riset terapan, adaptasi digital, dan advokasi berbasis data.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-brand-yellow font-heading font-black text-xl">03. Inklusif</span>
                    <p className="text-xs text-slate-300">
                      Mewadahi seluruh spektrum latar belakang fakultas, minat keilmuan, dan identitas mahasiswa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bento 2: Quick Identity Card (4 cols) */}
              <div className="md:col-span-4 bg-gradient-to-b from-brand-slate to-white rounded-3xl p-8 border border-brand-border flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border flex items-center justify-center p-2 shadow-sm mb-6">
                    <img
                      src="/logo-kolektiva.png"
                      alt="Official Logo BEM ITG KOLEKTIVA"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="font-heading font-bold text-xl text-brand-navy mb-2">Identitas Resmi Kabinet</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Roda sinergi melambangkan kesatuan rumpun program studi di ITG yang melangkah seirama mengarungi dinamika almamater menuju kejayaan bersama.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Masa Bakti</span>
                    <span className="font-bold text-brand-navy"> 2026 – 2027</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Sekretariat</span>
                    <span className="font-bold text-brand-navy">Pusgiwa ITG Lt. 2</span>
                  </div>
                </div>
              </div>






            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ORGANIC TRANSITION ZONE: ABOUT → ORGANIZATION (ROYAL BLUE RISES)       */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none -mt-1 bg-[#F4F7FC]">
        <svg
          className="w-full h-12 sm:h-20 text-brand-navy fill-current"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C480,20 960,20 1440,80 L1440,80 L0,80 Z" />
        </svg>
      </div>

    </section>
  );
};
