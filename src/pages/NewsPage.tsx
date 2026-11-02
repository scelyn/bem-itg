import React, { useState } from 'react';
import { Search, ArrowRight, Newspaper, Calendar, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsArticles } from '../data/news';
import { NewsArticle } from '../types';

export const NewsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Semua';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const categories = ['Semua', 'Kajian Strategis', 'Advokasi', 'Sosial Masyarakat', 'Event', 'Kajian Isu'];

  const filteredArticles = newsArticles.filter((article: NewsArticle) => {
    const matchesCategory =
      selectedCategory === 'Semua' ||
      article.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Separate the lead / featured story from the secondary stories
  const featuredArticle = filteredArticles.find((a) => a.isFeatured) || filteredArticles[0];
  const secondaryArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="min-h-screen bg-brand-white text-brand-navy">
      {/* ========================================================================= */}
      {/* 1. EXPRESSIVE EDITORIAL PAGE HEADER                                       */}
      {/* ========================================================================= */}
      <section className="bg-brand-navy text-white pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-8 relative overflow-hidden">
        {/* Ambient subtle light accents */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand-blue/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
            {/* Left Column: Expressive Typography */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Eyebrow: Pure text with letter spacing and subtle accent bar, no container */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-yellow font-heading">
                <span className="w-8 h-[2px] bg-brand-yellow rounded-full" />
                <span>Warta & Publikasi Resmi</span>
              </div>

              {/* Expressive Editorial Headline in Space Grotesk */}
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[4.25rem] font-bold text-white tracking-tight leading-[1.08]">
                <span className="block font-medium text-slate-200">Kabar Gerakan,</span>
                <span className="block font-black text-white mt-1 sm:mt-2">
                  Wacana & <span className="text-brand-yellow">Kebijakan</span>.
                </span>
                <span className="block font-light text-slate-300 text-2xl sm:text-3xl lg:text-4xl mt-3 sm:mt-4 tracking-normal">
                  BEM Institut Teknologi Garut.
                </span>
              </h1>
            </div>

            {/* Right Column: Editorial Companion Copy */}
            <div className="lg:col-span-5 space-y-4 lg:pb-3 lg:border-l lg:border-white/15 lg:pl-8">
              <p className="text-base sm:text-lg text-slate-200/95 font-normal leading-relaxed font-sans">
                Pusat rilis pers resmi, kertas kajian riset kebijakan kampus, dan kabar agenda kemahasiswaan Institut Teknologi Garut.
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed font-sans">
                Dokumentasi terpercaya atas dinamika intelektual dan pergerakan mahasiswa yang transparan serta independen.
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

      {/* ========================================================================= */}
      {/* 2. NEWSROOM DESK TOOLBAR & ARTICLES                                       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-12 pb-28">

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 border-b border-brand-border">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading whitespace-nowrap transition-all ${
                    active
                      ? 'bg-brand-navy text-brand-yellow font-bold shadow-md'
                      : 'bg-white text-slate-600 hover:text-brand-navy border border-brand-border hover:bg-brand-slate font-medium'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari warta, kajian, kata kunci..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-brand-border text-brand-navy text-xs placeholder:text-slate-400 focus:border-brand-navy focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content Section */}
        {filteredArticles.length === 0 ? (
          /* Graceful Empty State */
          <div className="text-center py-20 px-4 bg-brand-slate/50 rounded-3xl border border-brand-border space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy/10 text-brand-navy mx-auto flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-brand-navy">Tidak Ada Warta yang Cocok</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
              Tidak ditemukan publikasi dengan kata kunci "{searchQuery}" pada kategori {selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-5 py-2 rounded-full bg-brand-navy text-white text-xs font-heading font-bold hover:bg-brand-blue transition-colors"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {/* =================================================================== */}
            {/* BERITA UTAMA / FEATURED LEAD STORY                                  */}
            {/* =================================================================== */}
            {featuredArticle && (
              <article className="group bg-white rounded-3xl border border-brand-border hover:border-brand-blue/30 transition-all duration-300 p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Lead Image (Dominant Visual) */}
                  <div className="lg:col-span-7">
                    <Link
                      to={`/news/${featuredArticle.slug}`}
                      className="block relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-brand-navy shadow-inner"
                    >
                      {!brokenImages[featuredArticle.id] ? (
                        <img
                          src={featuredArticle.coverImage}
                          alt={featuredArticle.title}
                          onError={() => handleImageError(featuredArticle.id)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 space-y-2">
                          <Newspaper className="w-12 h-12 text-brand-yellow/60" />
                          <span className="text-xs font-mono uppercase">Foto Dokumentasi Rilis</span>
                        </div>
                      )}
                      {/* Subtle Overlay Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-brand-navy/90 text-brand-yellow border border-white/10 text-[10px] font-heading font-black uppercase tracking-wider backdrop-blur-md">
                          Warta Utama
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Lead Information */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Metadata row */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 font-sans flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-navy text-[11px] font-heading font-bold uppercase tracking-wider">
                        {featuredArticle.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {featuredArticle.publishedDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {featuredArticle.readTime}
                      </span>
                    </div>

                    {/* Prominent Lead Title */}
                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-navy group-hover:text-brand-blue transition-colors leading-tight">
                      <Link to={`/news/${featuredArticle.slug}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-sans">
                      {featuredArticle.excerpt}
                    </p>

                    {/* Footer Row */}
                    <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 font-sans">
                        {featuredArticle.department}
                      </span>
                      <Link
                        to={`/news/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-red group-hover:text-brand-navy transition-colors"
                      >
                        <span>Baca Lengkap</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                </div>
              </article>
            )}

            {/* =================================================================== */}
            {/* BERITA LAINNYA / SECONDARY EDITORIAL ARTICLES GRID                  */}
            {/* =================================================================== */}
            {secondaryArticles.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/60 font-heading">
                  <span className="w-6 h-[2px] bg-brand-navy/40" />
                  <span>Warta Terbaru Lainnya</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {secondaryArticles.map((article: NewsArticle) => (
                    <article
                      key={article.id}
                      className="group bg-white rounded-2xl border border-brand-border hover:border-brand-blue/30 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div>
                        {/* Thumbnail */}
                        <Link
                          to={`/news/${article.slug}`}
                          className="block relative aspect-[16/10] w-full overflow-hidden bg-brand-navy"
                        >
                          {!brokenImages[article.id] ? (
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              onError={() => handleImageError(article.id)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-4 text-slate-400">
                              <Newspaper className="w-8 h-8 text-brand-yellow/60" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-0.5 rounded-full bg-brand-navy/90 text-brand-yellow text-[10px] font-heading font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                              {article.category}
                            </span>
                          </div>
                        </Link>

                        {/* Text Content */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                            <span>{article.publishedDate}</span>
                            <span>{article.readTime}</span>
                          </div>

                          <h3 className="font-heading font-bold text-base sm:text-lg text-brand-navy group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                            <Link to={`/news/${article.slug}`}>
                              {article.title}
                            </Link>
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-sans">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-brand-border/40 pt-3">
                        <span className="text-[11px] text-slate-500 font-sans line-clamp-1">
                          {article.department}
                        </span>
                        <Link
                          to={`/news/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline shrink-0"
                        >
                          <span>Baca</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
