import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsArticles } from '../../data/news';

export const LatestNewsSection: React.FC = () => {
  const featured = newsArticles[0];
  const secondaryArticles = newsArticles.slice(1, 4);

  return (
    <section id="news" className="pt-16 sm:pt-20 pb-0 bg-[#F9FBFE] text-brand-navy relative overflow-hidden">
      {/* Subtle organic color washes (low opacity) */}
      <div className="absolute top-12 -right-20 w-80 h-80 bg-brand-blue/[0.025] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 -left-20 w-72 h-72 bg-brand-yellow/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ================================================================= */}
        {/* A. HEADER (Clean, Calm, Generous Whitespace)                     */}
        {/* ================================================================= */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-6 h-0.5 bg-brand-yellow" />
            <span className="text-xs font-heading font-bold tracking-widest uppercase text-slate-500">
              KABAR KOLEKTIVA
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-navy tracking-tight leading-tight mb-3">
            Cerita dari Setiap Gerak.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Catatan advokasi, pengabdian masyarakat, dan dinamika pemikiran mahasiswa BEM ITG KOLEKTIVA.
          </p>
        </div>

        {/* Thin divider line */}
        <div className="w-full h-px bg-slate-200 mt-8 mb-12 sm:mb-16" />

        {/* ================================================================= */}
        {/* B. ARTIKEL UTAMA (Two-Column Editorial Layout)                    */}
        {/* ================================================================= */}
        {featured && (
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group">
            
            {/* Foto Artikel Besar */}
            <Link
              to={`/news/${featured.slug}`}
              className="lg:col-span-7 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 block"
            >
              <img
                src={featured.coverImage}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </Link>

            {/* Informasi Artikel Utama */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-brand-blue font-semibold">{featured.category}</span>
                <span>•</span>
                <span>{featured.publishedDate}</span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy group-hover:text-brand-blue transition-colors leading-tight">
                <Link to={`/news/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  to={`/news/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors group/link"
                >
                  <span>Baca selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-red group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </article>
        )}

        {/* ================================================================= */}
        {/* C. ARTIKEL LAINNYA (Simple Horizontal Grid Below Main Article)    */}
        {/* ================================================================= */}
        <div className="mt-14 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {secondaryArticles.map((article) => (
              <article key={article.id} className="group flex flex-col space-y-2.5">
                
                {/* Thumbnail Kecil */}
                <Link
                  to={`/news/${article.slug}`}
                  className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 block"
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </Link>

                {/* Kategori & Tanggal */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
                  <span className="text-brand-blue font-semibold">{article.category}</span>
                  <span>•</span>
                  <span>{article.publishedDate}</span>
                </div>

                {/* Judul Artikel */}
                <h4 className="font-heading font-bold text-base text-brand-navy group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                  <Link to={`/news/${article.slug}`}>
                    {article.title}
                  </Link>
                </h4>

              </article>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* D. CTA (Simple Text Link to /news)                                */}
        {/* ================================================================= */}
        <div className="mt-14 pt-6 text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-brand-navy hover:text-brand-red transition-colors group"
          >
            <span>Jelajahi Semua Artikel</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-red group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* ================================================================= */}
      {/* ORGANIC TRANSITION ZONE: NEWS → ASPIRATIONS (ROYAL BLUE RISES)    */}
      {/* ================================================================= */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none -mb-1 mt-16 sm:mt-20">
        <svg
          className="w-full h-12 sm:h-20 text-brand-navy fill-current"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};
