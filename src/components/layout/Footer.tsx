import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Linkedin, Radio, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy pt-20 pb-12 border-t border-white/[0.08] text-slate-300 relative overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-yellow/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">

          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo-kolektiva.png"
                alt="Logo BEM ITG KOLEKTIVA"
                className="h-11 sm:h-12 w-auto object-contain drop-shadow"
              />
              <div>
                <span className="font-heading font-bold text-lg text-white tracking-wide block">
                  BEM ITG KOLEKTIVA
                </span>
                <span className="text-xs text-slate-300/80 tracking-wider uppercase font-medium">
                  Badan Eksekutif Mahasiswa Institut Teknologi Garut
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300/80 leading-relaxed max-w-sm">
              Wadah independen perjuangan, kreasi, dan pengabdian seluruh mahasiswa ITG. Berkomitmen menghadirkan
              pergerakan yang berakar, solutif, dan inklusif demi kemajuan almamater dan bangsa.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-brand-navy text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-brand-navy text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-brand-navy text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-brand-navy text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-brand-navy text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                aria-label="Podcast Spotify"
              >
                <Radio className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links: Navigasi */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Navigasi Utama
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300/80">
              <li>
                <Link to="/" className="hover:text-brand-yellow transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-yellow transition-colors">
                  Visi & Misi Kabinet
                </Link>
              </li>
              <li>
                <Link to="/organization" className="hover:text-brand-yellow transition-colors">
                  Struktur Pengurus
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-brand-yellow transition-colors">
                  Warta & Publikasi
                </Link>
              </li>
              <li>
                <Link to="/aspirations" className="hover:text-brand-yellow transition-colors">
                  Ruang Aspirasi
                </Link>
              </li>
              <li>
                <Link to="/legal-documents" className="hover:text-brand-yellow transition-colors">
                  Produk Hukum Resmi
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Layanan Mahasiswa */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Layanan Terpadu
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300/80">
              <li>
                <Link to="/aspirations/track" className="hover:text-brand-yellow transition-colors">
                  Lacak Tiket Aspirasi
                </Link>
              </li>
              <li>
                <Link to="/news?category=Advokasi" className="hover:text-brand-yellow transition-colors">
                  Advokasi Bantuan UKT
                </Link>
              </li>
              <li>
                <Link to="/about#pillars" className="hover:text-brand-yellow transition-colors">
                  Satgas Anti-Kekerasan
                </Link>
              </li>
              <li>
                <Link to="/legal-documents" className="hover:text-brand-yellow transition-colors">
                  Peminjaman Ruang Ormawa
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-brand-yellow transition-colors">
                  Inkubasi Bisnis Kampus
                </Link>
              </li>
              <li>
                <Link to="/news?category=Event" className="hover:text-brand-yellow transition-colors">
                  Kalender Kegiatan Ormawa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Secretariat Address */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Sekretariat Pusat
            </h4>
            <p className="text-xs text-slate-300/80 leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
              <span>
                Gedung Sekretriat Organisasi Mahasiswa Lantai 2, Kampus Institut Teknologi Garut, Jl. Mayor Syamsu No. 1, Garut 44151.
              </span>
            </p>
            <div className="space-y-2 text-xs text-slate-200 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-yellow" />
                <span>bem@itg.ac.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-yellow" />
                <span>+62-8123-4567-8910</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright and Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            BEMITGKOLEKTIVA &copy; 2026
          </div>
          <div className="flex items-center gap-6">
            <Link to="/legal-documents" className="hover:text-brand-yellow transition-colors">
              Kebijakan Privasi
            </Link>
            <Link to="/legal-documents" className="hover:text-brand-yellow transition-colors">
              Pedoman Komunitas
            </Link>
            <Link to="/legal-documents" className="hover:text-brand-yellow transition-colors">
              Akses API Ormawa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

