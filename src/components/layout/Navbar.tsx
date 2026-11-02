import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Threshold for transitioning from State A (transparent hero) to State B (floating glass)
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // On inner pages, always use the scrolled/glass navigation appearance by default
  const showGlassState = isScrolled || !isHomePage;

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Tentang', to: '/about' },
    { label: 'Kabinet', to: '/organization' },
    { label: 'Warta & Gerak', to: '/news' },
    { label: 'Aspirasi', to: '/aspirations' },
    { label: 'Produk Hukum', to: '/legal-documents' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex justify-center px-3 sm:px-4 transition-all duration-300 ease-in-out ${
        showGlassState ? 'pt-3 sm:pt-4' : 'pt-4 sm:pt-6'
      }`}
    >
      <div
        className={`w-full max-w-6xl flex items-center justify-between rounded-full transition-all duration-300 ease-in-out ${
          showGlassState
            ? 'glass-nav py-2 px-3 sm:py-2.5 sm:px-6 shadow-glass border border-white/15'
            : 'bg-transparent py-2.5 px-2 sm:py-3 sm:px-4 border border-transparent shadow-none'
        }`}
      >
        {/* Official Cabinet Logo */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img
            src="/logo-kolektiva.png"
            alt="Logo BEM ITG KOLEKTIVA"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
          />
          <div className="leading-tight">
            <span className="font-heading font-bold text-xs sm:text-sm md:text-base tracking-wide text-white flex items-center gap-1 sm:gap-1.5 drop-shadow-sm whitespace-nowrap">
              BEM ITG KOLEKTIVA
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-ping shrink-0" />
            </span>
            <span
              className={`text-[8px] sm:text-[10px] tracking-widest uppercase font-medium block transition-colors duration-300 ${
                showGlassState ? 'text-slate-300' : 'text-slate-200/90'
              }`}
            >
              Institut Teknologi Garut
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav
          className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
            showGlassState
              ? 'bg-brand-navy/60 border border-white/10 backdrop-blur-md'
              : 'bg-black/25 border border-white/10 backdrop-blur-sm'
          }`}
        >
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-250 ${
                  active
                    ? 'text-brand-yellow font-bold after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-brand-yellow after:rounded-full'
                    : 'text-white hover:text-brand-yellow hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            to="/login"
            className={`relative group overflow-hidden px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-white font-heading font-bold text-xs transition-all duration-300 flex items-center gap-1.5 sm:gap-2 active:scale-95 ${
              showGlassState
                ? 'bg-brand-red shadow-clay-red hover:bg-[#e0142b]'
                : 'bg-brand-red shadow-lg hover:bg-[#e0142b] border border-white/20'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Login Admin</span>
            <span className="sm:hidden text-[11px]">Login</span>
            <span className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 sm:p-2.5 rounded-full text-white transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] ${
              showGlassState
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-black/30 hover:bg-black/40 border border-white/20'
            }`}
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 sm:top-20 inset-x-3 sm:inset-x-4 glass-nav rounded-3xl p-4 sm:p-5 border border-white/20 shadow-2xl flex flex-col gap-1 md:hidden animate-in fade-in slide-in-from-top-3 duration-200 bg-brand-navy/95 backdrop-blur-2xl z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-between min-h-[44px] ${
                  active
                    ? 'text-brand-yellow font-bold bg-white/10 border-l-2 border-brand-yellow pl-3'
                    : 'text-white hover:text-brand-yellow hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10 mt-1">
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="w-full py-3 rounded-full bg-brand-red text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-clay-red active:scale-95 transition-all min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
