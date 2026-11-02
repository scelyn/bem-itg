import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  X,
  Linkedin,
  Instagram,
  Mail,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCarouselMembers } from '../../data/organization';
import { OrganizationProfileCard } from '../organization/OrganizationProfileCard';
import { CabinetMember } from '../../types';

export const OrganizationPreview: React.FC = () => {
  const members: CabinetMember[] = getCarouselMembers();

  // State for spotlight modal inspection
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);

  // Marquee is paused strictly when spotlight modal is active
  const isModalOpen = selectedMemberIndex !== null;

  // Selected member for detail inspection
  const selectedMember = selectedMemberIndex !== null ? members[selectedMemberIndex] : null;

  const handleOpenSpotlight = (index: number) => {
    setSelectedMemberIndex(index);
  };

  const handleCloseSpotlight = () => {
    setSelectedMemberIndex(null);
  };

  const handleNextSpotlight = () => {
    if (selectedMemberIndex === null) {
      setSelectedMemberIndex(0);
    } else {
      setSelectedMemberIndex((selectedMemberIndex + 1) % members.length);
    }
  };

  const handlePrevSpotlight = () => {
    if (selectedMemberIndex === null) {
      setSelectedMemberIndex(members.length - 1);
    } else {
      setSelectedMemberIndex((selectedMemberIndex - 1 + members.length) % members.length);
    }
  };

  return (
    <section
      id="organization"
      className="pt-20 sm:pt-28 pb-0 bg-brand-navy relative overflow-hidden text-white"
    >
      {/* Dynamic Ambient Background Mesh */}
      <div className="absolute inset-0 pointer-events-none hero-mesh opacity-80" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">

        {/* ================================================================= */}
        {/* 1. SECTION EDITORIAL HEADER                                       */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/40 text-brand-yellow text-xs font-heading font-extrabold tracking-wider uppercase mb-5 shadow-clay-yellow">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Di Balik Gerak Kolektiva</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-5">
            Kenali Mereka yang <span className="text-brand-yellow">Bergerak Bersama.</span>
          </h2>


        </div>

      </div>

      {/* =================================================================== */}
      {/* 2. CONTINUOUS HORIZONTAL MARQUEE TRACK (FULL-WIDTH SEAMLESS LOOP)   */}
      {/* Moves continuously from right to left across all screens (Desktop & Mobile) */}
      {/* =================================================================== */}
      <div className="relative w-full py-6 select-none overflow-hidden">
        {/* Ambient Gradient Fade Masks on Left & Right Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-brand-navy to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-brand-navy to-transparent z-20 pointer-events-none" />

        {/* The Continuous Infinite Marquee Container */}
        <div
          className={`flex w-max animate-marquee-continuous ${
            isModalOpen ? 'marquee-paused' : ''
          }`}
          style={{
            animationPlayState: isModalOpen ? 'paused' : 'running',
          }}
        >
          {/* Group 1: 29 Official Cabinet Members */}
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 shrink-0">
            {members.map((member, idx) => (
              <div
                key={`set1-${member.id}`}
                className="w-[260px] sm:w-[290px] shrink-0 cursor-pointer transition-transform hover:-translate-y-1.5"
                onClick={() => handleOpenSpotlight(idx)}
              >
                <OrganizationProfileCard
                  member={member}
                  variant="carousel"
                />
              </div>
            ))}
          </div>

          {/* Group 2: Exact Duplicate for Mathematically Seamless Infinite Looping */}
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 shrink-0" aria-hidden="true">
            {members.map((member, idx) => (
              <div
                key={`set2-${member.id}`}
                className="w-[260px] sm:w-[290px] shrink-0 cursor-pointer transition-transform hover:-translate-y-1.5"
                onClick={() => handleOpenSpotlight(idx)}
              >
                <OrganizationProfileCard
                  member={member}
                  variant="carousel"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. MARQUEE CONTROLS & BOTTOM NAVIGATION BAR                         */}
      {/* =================================================================== */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto pt-6 border-t border-white/10">

          {/* Member Count & Prev/Next Inspection Controls */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-wider">
              {members.length} Pejabat Kabinet
            </span>
            <span className="text-slate-500">•</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevSpotlight}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-blue border border-white/15 text-white flex items-center justify-center transition-all"
                aria-label="Inspeksi Pejabat Sebelumnya"
                title="Inspeksi Pejabat Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSpotlight}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-blue border border-white/15 text-white flex items-center justify-center transition-all"
                aria-label="Inspeksi Pejabat Selanjutnya"
                title="Inspeksi Pejabat Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Hint */}


          {/* Primary CTA to Dedicated Organization Chart Page */}
          <Link
            to="/organization"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-brand-red hover:bg-brand-red/90 text-white font-heading font-bold text-sm shadow-clay-red transition-all duration-300 hover:scale-105 active:scale-95 group shrink-0"
          >
            <span>Lihat Struktur Lengkap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>
      </div>

      {/* =================================================================== */}
      {/* ORGANIC TRANSITION ZONE: ORGANIZATION → NEWS (#F9FBFE CANVAS)       */}
      {/* =================================================================== */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none -mb-1 mt-14 sm:mt-16">
        <svg
          className="w-full h-12 sm:h-20 text-[#F9FBFE] fill-current"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C480,20 960,20 1440,80 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* =================================================================== */}
      {/* 4. SPOTLIGHT INSPECTION MODAL (When Member is Selected)             */}
      {/* Pauses marquee and displays full details without chasing cards      */}
      {/* =================================================================== */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-brand-navy rounded-3xl p-6 sm:p-8 border-2 border-brand-yellow/60 shadow-glass-dark text-white space-y-6">

            {/* Top Close Button & Index Tag */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy text-[11px] font-heading font-extrabold uppercase tracking-wider">
                {selectedMember.ministryName || 'Presidium Eksekutif'}
              </span>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400">
                  {selectedMemberIndex! + 1} dari {members.length}
                </span>
                <button
                  onClick={handleCloseSpotlight}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-red text-white flex items-center justify-center transition-colors"
                  aria-label="Tutup Detail"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

              {/* Avatar / Portrait Frame */}
              <div className="w-32 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden bg-brand-darkcard border border-brand-yellow/40 shrink-0 flex items-center justify-center shadow-inner relative">
                {selectedMember.image ? (
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-gradient-to-tr from-brand-blue to-brand-navy">
                  <span className="font-heading font-black text-3xl text-brand-yellow">
                    {selectedMember.initial}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">BEM ITG</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <span className="text-xs font-heading font-bold text-brand-yellow uppercase tracking-wider block">
                  {selectedMember.position}
                </span>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {selectedMember.name}
                </h3>

                <p className="text-xs text-slate-300">
                  {selectedMember.faculty}
                </p>

                {selectedMember.bio && (
                  <p className="text-xs text-slate-300/80 leading-relaxed pt-2 border-t border-white/10">
                    {selectedMember.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-3">
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-blue text-slate-200 flex items-center justify-center transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {selectedMember.instagram && (
                    <a
                      href={selectedMember.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-red text-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {selectedMember.email && (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-yellow hover:text-brand-navy text-slate-200 flex items-center justify-center transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  <span className="text-[10px] text-slate-400 ml-2 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Masa Bakti 2026/2027</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Actions: Previous, Next, & Close/Resume */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSpotlight}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  onClick={handleNextSpotlight}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleCloseSpotlight}
                className="px-4 py-1.5 rounded-xl bg-brand-yellow text-brand-navy font-heading font-bold text-xs shadow-clay-yellow hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup Detail</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
