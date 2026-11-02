import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { cabinetMembers, ministriesData } from '../data/organization';
import { OrganizationProfileCard } from '../components/organization/OrganizationProfileCard';
import { CabinetMember, MinistryGroup } from '../types';

export const OrganizationPage: React.FC = () => {
  const [selectedMinistryFilter, setSelectedMinistryFilter] = useState<string>('all');

  const presiden = cabinetMembers.find((m) => m.level === 'presiden')!;
  const wapres = cabinetMembers.find((m) => m.level === 'wapres')!;
  const sekabMembers = cabinetMembers.filter((m) => m.level === 'sekab');

  const filteredMinistries = selectedMinistryFilter === 'all'
    ? ministriesData
    : ministriesData.filter((m) => m.id === selectedMinistryFilter);

  return (
    <div className="min-h-screen bg-brand-white text-brand-navy">

      {/* =================================================================== */}
      {/* 1. EXPRESSIVE EDITORIAL PAGE HEADER                                 */}
      {/* =================================================================== */}
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
                <span>Bagan Hierarki & Penggerak Kabinet</span>
              </div>

              {/* Expressive Editorial Headline in Space Grotesk */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.08]">
                <span className="block font-medium text-slate-200">Di Balik Gerak,</span>
                <span className="block font-black text-white mt-1 sm:mt-2">
                  Struktur Kabinet <span className="text-brand-yellow">KOLEKTIVA</span>.
                </span>
                <span className="block font-light text-slate-300 text-2xl sm:text-3xl lg:text-4xl mt-3 sm:mt-4 tracking-normal">
                  BEM Institut Teknologi Garut 2026/2027.
                </span>
              </h1>
            </div>

            {/* Right Column: Editorial Companion Copy */}
            <div className="lg:col-span-5 space-y-4 lg:pb-3 lg:border-l lg:border-white/15 lg:pl-8">
              <p className="text-base sm:text-lg text-slate-200/95 font-normal leading-relaxed font-sans">
                Mengenal para penggerak yang mendedikasikan gagasan, tenaga, dan waktu untuk memimpin serta melayani seluruh mahasiswa ITG.
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed font-sans">
                Sinergi kepemimpinan eksekutif dan kementerian teknis dalam merawat integritas serta mewujudkan perubahan nyata bagi kampus.
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

      {/* =================================================================== */}
      {/* 2. DIRECT ORGANIZATIONAL HIERARCHY                                  */}
      {/* =================================================================== */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 pb-28">

        {/* ================================================================= */}
        {/* 1. PRESIDEN BEM                                                   */}
        {/* ================================================================= */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-3 font-heading">
            <span className="w-4 h-[2px] bg-brand-red rounded-full" />
            <span>Presiden BEM</span>
          </div>

          <div className="w-full max-w-[340px]">
            <OrganizationProfileCard
              member={presiden}
              variant="hierarchy"
              className="border-2 border-brand-yellow/60 ring-4 ring-brand-yellow/10 shadow-glow-yellow"
            />
          </div>

          {/* Connecting Line (Presiden to Wapres) */}
          <div className="flex flex-col items-center my-6">
            <div className="w-1 h-12 bg-gradient-to-b from-brand-yellow via-brand-blue to-brand-navy rounded-full" />
            <div className="w-6 h-6 rounded-full bg-brand-navy border-2 border-brand-yellow flex items-center justify-center -mt-1 shadow-sm">
              <ArrowDown className="w-3 h-3 text-brand-yellow" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. WAKIL PRESIDEN BEM                                             */}
        {/* ================================================================= */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-blue mb-3 font-heading">
            <span className="w-4 h-[2px] bg-brand-blue rounded-full" />
            <span>Wakil Presiden BEM</span>
          </div>

          <div className="w-full max-w-[320px]">
            <OrganizationProfileCard
              member={wapres}
              variant="hierarchy"
              className="border-2 border-brand-blue/50 ring-2 ring-brand-blue/10 shadow-glow-blue"
            />
          </div>

          {/* Connecting Line (Wapres to Sekab) */}
          <div className="flex flex-col items-center my-6">
            <div className="w-1 h-12 bg-gradient-to-b from-brand-blue via-brand-navy to-brand-yellow rounded-full" />
            <div className="w-6 h-6 rounded-full bg-brand-navy border-2 border-brand-yellow flex items-center justify-center -mt-1 shadow-sm">
              <ArrowDown className="w-3 h-3 text-brand-yellow" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. SEKRETARIS KABINET (SEKAB)                                     */}
        {/* ================================================================= */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-yellow mb-2 font-heading">
            <span className="w-4 h-[2px] bg-brand-yellow rounded-full" />
            <span>Sekretaris Kabinet (Sekab)</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mb-5 text-center max-w-md">
            Mendampingi kepemimpinan eksekutif dalam tata kelola administrasi, pengarsipan, dan koordinasi internal kabinet.
          </p>

          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
            {sekabMembers.map((sekab) => (
              <OrganizationProfileCard
                key={sekab.id}
                member={sekab}
                variant="hierarchy"
                className="border-2 border-brand-yellow/50 ring-2 ring-brand-yellow/10 shadow-glow-yellow"
              />
            ))}
          </div>

          {/* Connecting Line (Sekab to Ministries) */}
          <div className="flex flex-col items-center my-8">
            <div className="w-1 h-12 bg-gradient-to-b from-brand-yellow via-brand-navy to-brand-red rounded-full" />
            <div className="w-6 h-6 rounded-full bg-brand-navy border-2 border-brand-red flex items-center justify-center -mt-1 shadow-sm">
              <ArrowDown className="w-3 h-3 text-brand-red" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. DAFTAR KEMENTERIAN                                             */}
        {/* ================================================================= */}
        <div className="pt-2 space-y-10">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red mb-2 font-heading">
              <span className="w-4 h-[2px] bg-brand-red rounded-full" />
              <span>Kementerian Kabinet</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
              Pelaksana Program & Penggerak Aspirasi
            </h2>
          </div>

          {/* Ministry Filter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedMinistryFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                selectedMinistryFilter === 'all'
                  ? 'bg-brand-navy text-brand-yellow shadow-md'
                  : 'bg-white text-slate-600 hover:text-brand-navy border border-brand-border hover:bg-brand-slate'
              }`}
            >
              Semua Kementerian
            </button>
            {ministriesData.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMinistryFilter(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-medium transition-all ${
                  selectedMinistryFilter === m.id
                    ? 'bg-brand-navy text-brand-yellow font-bold shadow-md'
                    : 'bg-white text-slate-600 hover:text-brand-navy border border-brand-border hover:bg-brand-slate'
                }`}
              >
                {m.shortName}
              </button>
            ))}
          </div>

          {/* Ministries Roster */}
          <div className="space-y-12">
            {filteredMinistries.map((ministry: MinistryGroup) => (
              <div
                key={ministry.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm hover:border-brand-blue/30 transition-all duration-300"
              >
                {/* Ministry Header */}
                <div className="pb-6 mb-6 border-b border-brand-border">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue font-mono font-bold text-[11px] uppercase inline-block mb-2">
                    {ministry.shortName}
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-brand-navy">
                    {ministry.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    {ministry.description}
                  </p>
                </div>

                {/* Ministry Members Responsive Grid */}
                <div
                  className={`grid gap-6 ${
                    ministry.members.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                      : ministry.members.length === 3
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  }`}
                >
                  {ministry.members.map((member: CabinetMember) => (
                    <OrganizationProfileCard
                      key={member.id}
                      member={member}
                      variant="hierarchy"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
