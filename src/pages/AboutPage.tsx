import React from 'react';
import { Scale, Lightbulb, Users2, Cpu, Award, HeartHandshake } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { KolektivaCardStack } from '../components/home/KolektivaCardStack';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-white text-brand-navy">
      {/* ========================================================================= */}
      {/* 1. EXPRESSIVE EDITORIAL PAGE HEADER                                       */}
      {/* ========================================================================= */}
      <section className="bg-brand-navy text-white pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-8 relative overflow-hidden">
        {/* Ambient subtle light accents blending from brand colors */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand-blue/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
            {/* Left Column: Expressive Typography */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Eyebrow: Pure text with letter spacing and subtle accent bar, no container */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-yellow font-heading">
                <span className="w-8 h-[2px] bg-brand-yellow rounded-full" />
                <span>Profil Resmi & Filosofi Gerakan</span>
              </div>

              {/* Expressive Editorial Headline in Space Grotesk */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.08]">
                <span className="block font-medium text-slate-200">Mengenal Lebih Dekat,</span>
                <span className="block font-black text-white mt-1 sm:mt-2">
                  BEM ITG <span className="text-brand-yellow">KOLEKTIVA</span>.
                </span>
                <span className="block font-light text-slate-300 text-2xl sm:text-3xl lg:text-4xl mt-3 sm:mt-4 tracking-normal">
                  Keluarga Mahasiswa Institut Teknologi Garut.
                </span>
              </h1>
            </div>

            {/* Right Column: Editorial Companion Copy */}
            <div className="lg:col-span-5 space-y-4 lg:pb-3 lg:border-l lg:border-white/15 lg:pl-8">
              <p className="text-base sm:text-lg text-slate-200/95 font-normal leading-relaxed font-sans">
                Menghubungkan suara mahasiswa, memperjuangkan hak akademik, dan memacu keunggulan inovasi Institut Teknologi Garut.
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed font-sans">
                Wadah pergerakan inklusif yang berdiri di atas fondasi kolaborasi, keterlibatan aktif, dan integritas nyata demi kemajuan almamater.
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 space-y-16">

        {/* Philosophy & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue">
              <span className="w-4 h-[2px] bg-brand-blue" />
              Makna di Balik Kolektiva
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-navy leading-tight">
              Perubahan adalah <span className="relative inline-block text-brand-navy">
                Kerja Bersama
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-brand-yellow/50 -z-10 rounded-full" />
              </span>.
            </h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed border-l-2 border-brand-blue/30 pl-5">
              <p>
                Kolektiva adalah keyakinan bahwa perubahan tidak lahir dari kerja individual semata, melainkan melalui keterlibatan, kolaborasi, dan kerja sama.
              </p>
              <p>
                Bagi BEM ITG, Kolektiva merepresentasikan BEM sebagai rumah bersama bagi seluruh mahasiswa. Ruang yang terbuka, inklusif, dan tidak dimiliki oleh kelompok tertentu, melainkan tumbuh dari kontribusi setiap individu di dalamnya.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link to="/organization">
                <PrimaryButton size="md">
                  Lihat Susunan Pengurus
                </PrimaryButton>
              </Link>
              <Link
                to="/legal-documents"
                className="px-5 py-2.5 rounded-full border border-brand-border hover:border-brand-blue text-xs font-heading font-bold text-brand-navy transition-all"
              >
                Unduh SK Kabinet
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center w-full">
            <KolektivaCardStack />
          </div>
        </div>

        {/* Vision & Mission Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-glass">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-yellow text-brand-navy inline-block mb-4 font-heading">
              Visi Utama
            </span>
            <h3 className="font-heading font-bold text-2xl text-white mb-4 leading-snug">
              Episentrum Pergerakan Intelektual, Solutif, dan Berkeadilan
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              "Mewujudkan BEM Institut Teknologi Garut sebagai rumah bersama mahasiswa yang Progresif, kolaboratif, dan berintegritas dalam mengembangkan potensi mahasiswa serta membangun kampus yang inovatif dan berdampak."
            </p>
            <div className="space-y-3 border-t border-white/10 pt-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-yellow" />
                <span>Berakar pada Tridharma Perguruan Tinggi</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-brand-yellow" />
                <span>Kolaboratif Bersama HMD, UKM, & Senat Mahasiswa</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-sm">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue/10 text-brand-blue inline-block mb-4 font-heading">
              Misi Strategis
            </span>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">Advokasi Mahasiswa Komprehensif</h4>
                  <p className="text-xs text-slate-600">Menghadirkan pendampingan finansial UKT yang transparan serta ruang aman bebas kekerasan.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">Pengembangan Karya & Inkubasi</h4>
                  <p className="text-xs text-slate-600">Mendorong hilirisasi riset teknologi, wirausaha mahasiswa, dan delegasi kompetisi nasional.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">Digitalisasi Tata Kelola & Transparansi</h4>
                  <p className="text-xs text-slate-600">Menerapkan sistem administrasi online, keterbukaan laporan kas, dan kanal partisipasi interaktif.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Movement */}
        <div>
          <SectionHeading
            badgeText="Pilar Aksi"
            title="4 Pilar Gerakan Kolektiva"
            description="Fondasi seluruh kementerian dalam merumuskan kebijakan dan program kerja tahun 2026/2027."
            theme="light"
            className="mb-8"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-navy">Advokasi Berkeadilan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengawalan pembiayaan UKT adil, beasiswa merata, serta pendampingan hak akademik mahasiswa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-navy">Karya & Inovasi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fasilitasi riset aplikatif, inkubasi wirausaha rintisan muda, serta pameran teknologi lintas prodi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center">
                <Users2 className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-navy">Pengabdian Berkelanjutan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gerakan desa binaan terpadu, respon tanggap bencana relawan kampus, dan literasi pesisir Garut.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-brand-navy">Digital & Keterbukaan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digitalisasi seluruh arsip surat, transparansi kas real-time, dan kanal aspirasi modern.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

