import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Tag } from 'lucide-react';
import { newsArticles } from '../data/news';
import { NewsArticle } from '../types';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const article: NewsArticle | undefined = newsArticles.find((a: NewsArticle) => a.slug === slug);

  if (!article) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-5 text-center">
        <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">Artikel Tidak Ditemukan</h2>
        <p className="text-slate-600 text-sm mb-6">Artikel yang Anda cari mungkin telah dipindahkan atau belum diterbitkan.</p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-navy text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Warta
        </Link>
      </div>
    );
  }

  const relatedArticles: NewsArticle[] = newsArticles.filter((a: NewsArticle) => a.id !== article.id).slice(0, 3);

  return (
    <div className="pt-28 pb-20 bg-brand-white text-brand-navy">
      {/* Top Breadcrumb & Title */}
      <section className="bg-brand-navy text-white py-16 px-5 sm:px-8 border-b border-white/10 relative overflow-hidden hero-mesh">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-yellow hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Seluruh Warta
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-yellow text-brand-navy font-heading">
              {article.category}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> {article.publishedDate}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-yellow" /> {article.readTime}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 flex-wrap gap-4 text-xs text-slate-300">
            <div>
              <span className="block font-semibold text-white">{article.department}</span>
              <span className="text-[11px] text-slate-400">Nomor Publikasi: {article.archiveNumber}</span>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan artikel telah disalin ke clipboard!');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Bagikan Artikel
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Article Body */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden mb-10 shadow-lg border border-brand-border">
          <img src={article.coverImage} alt={article.title} className="w-full h-80 sm:h-[450px] object-cover" />
        </div>

        {/* Lead Excerpt */}
        <p className="text-lg sm:text-xl text-brand-blue font-medium leading-relaxed mb-8 border-l-4 border-brand-yellow pl-5 italic">
          {article.excerpt}
        </p>

        {/* Paragraphs */}
        <div className="space-y-6 text-slate-700 text-base leading-relaxed">
          {article.content.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-brand-border flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-brand-blue" />
          <span className="text-xs font-bold text-slate-600 mr-2">Topik:</span>
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-brand-slate text-brand-navy border border-brand-border text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-12 border-t border-brand-border">
          <h3 className="font-heading font-bold text-2xl text-brand-navy mb-8">Warta Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel: NewsArticle) => (
              <div key={rel.id} className="bg-brand-slate p-5 rounded-2xl border border-brand-border space-y-3">
                <span className="text-[10px] uppercase font-bold text-brand-blue block tracking-wider">
                  {rel.category}
                </span>
                <h4 className="font-heading font-bold text-sm text-brand-navy line-clamp-2">
                  <Link to={`/news/${rel.slug}`} className="hover:underline">
                    {rel.title}
                  </Link>
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
