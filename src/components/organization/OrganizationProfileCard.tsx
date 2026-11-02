import React, { useState } from 'react';
import { Linkedin, Instagram, Mail, UserCheck, Shield, Sparkles } from 'lucide-react';
import { CabinetMember } from '../../types';

interface OrganizationProfileCardProps {
  member: CabinetMember;
  variant?: 'carousel' | 'hierarchy' | 'compact';
  isCenter?: boolean;
  className?: string;
  onClick?: () => void;
}

export const OrganizationProfileCard: React.FC<OrganizationProfileCardProps> = ({
  member,
  variant = 'carousel',
  isCenter = false,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Aspect ratio is 3:4 (standard editorial portrait)
  const isPresident = member.level === 'presiden';
  const isWapres = member.level === 'wapres';

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
        isCenter
          ? 'shadow-glow-blue border-2 border-brand-yellow/80 ring-2 ring-brand-yellow/30'
          : 'border border-white/10 hover:border-brand-yellow/50 shadow-glass'
      } bg-brand-navy text-white select-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Depth ambient glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
          isCenter || isPresident
            ? 'bg-brand-yellow/20 opacity-100'
            : 'bg-brand-blue/30 opacity-60 group-hover:opacity-100'
        }`}
      />

      {/* =================================================================== */}
      {/* 1. PORTRAIT PHOTOGRAPHY FRAME (3:4 Ratio)                           */}
      {/* =================================================================== */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-brand-darkcard/90 flex items-center justify-center">
        {member.image && !imgError ? (
          <img
            src={member.image}
            alt={member.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Graceful Editorial Portrait Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-brand-navy via-brand-darkcard to-brand-navy relative overflow-hidden">
            {/* Geometric background grid lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFBC00_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Initials & Emblem circle */}
            <div className="relative mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-navy p-[2px] shadow-clay-blue group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-2xl bg-brand-navy flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-yellow tracking-wider">
                    {member.initial}
                  </span>
                  <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-white/5 text-[8px] font-mono uppercase text-slate-400">
                    BEM ITG
                  </div>
                </div>
              </div>

              {/* Status indicator badge on avatar */}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-navy border-2 border-brand-yellow flex items-center justify-center text-brand-yellow shadow-sm">
                {isPresident ? (
                  <Sparkles className="w-3 h-3 text-brand-yellow" />
                ) : (
                  <Shield className="w-3 h-3 text-brand-yellow" />
                )}
              </span>
            </div>

            {/* Placeholder notification tag if unassigned official */}
            {member.isPlaceholder ? (
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-slate-300 tracking-wide text-center">
                Foto Belum Diunggah
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/30 border border-brand-blue/50 text-[10px] font-medium text-slate-200">
                Kabinet Kolektiva
              </span>
            )}
          </div>
        )}

        {/* Top Floating Badge: Ministry / Level Tag */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-heading font-extrabold tracking-wider uppercase backdrop-blur-md border shadow-sm ${
              isPresident
                ? 'bg-brand-red text-white border-brand-red/80 shadow-clay-red'
                : isWapres
                ? 'bg-brand-yellow text-brand-navy border-brand-yellow/80 shadow-clay-yellow'
                : 'bg-brand-navy/90 text-brand-yellow border-white/20'
            }`}
          >
            {member.ministryName || (isPresident ? 'Presiden' : isWapres ? 'Wapres' : 'Kabinet')}
          </span>

          {member.order && (
            <span className="px-2 py-0.5 rounded-md bg-brand-navy/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-white/10">
              #{String(member.order).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. DEDICATED INFORMATION PANEL DIRECTLY BELOW PORTRAIT              */}
      {/* =================================================================== */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-gradient-to-b from-brand-navy to-brand-darkcard border-t border-white/10">
        <div className="space-y-1.5">
          {/* Position label in Selective Yellow */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
            <span className="text-[11px] font-heading font-bold text-brand-yellow uppercase tracking-wider line-clamp-1">
              {member.position}
            </span>
          </div>

          {/* Member Name */}
          <h4
            className={`font-heading font-bold text-white leading-tight line-clamp-1 ${
              variant === 'hierarchy' || isPresident
                ? 'text-lg sm:text-xl'
                : 'text-base sm:text-lg'
            } ${member.isPlaceholder ? 'text-slate-300 italic' : ''}`}
            title={member.name}
          >
            {member.name}
          </h4>

          {/* Faculty / Institution */}
          <p className="text-xs text-slate-300/80 line-clamp-1">
            {member.faculty}
          </p>

          {/* Short Bio (shown in hierarchy or leadership cards) */}
          {(variant === 'hierarchy' || isPresident || isWapres) && member.bio && (
            <p className="text-xs text-slate-300/70 pt-2 line-clamp-2 leading-relaxed border-t border-white/5">
              {member.bio}
            </p>
          )}
        </div>

        {/* Footer: Social links or active verification */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{member.period || 'Masa Bakti 2026/2027'}</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-blue hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                aria-label={`LinkedIn ${member.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-red hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                aria-label={`Instagram ${member.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-yellow hover:text-brand-navy text-slate-300 flex items-center justify-center transition-colors"
                aria-label={`Email ${member.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

