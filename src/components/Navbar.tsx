import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Moon, Sun, Menu, X, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { PortalContent } from '../types/property';

interface NavbarProps {
  portal: PortalContent;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  portal,
  darkMode,
  onToggleDarkMode,
  onNavigate,
  activeSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll for compact header & reading progress bar
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          setScrolled(currentScroll > 24);

          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setScrollProgress((currentScroll / totalHeight) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'imoveis', label: 'Imóveis' },
    { id: 'sobre', label: 'Sobre Maria Júlia' },
    { id: 'financiamento', label: 'Simulador' },
    { id: 'blog', label: 'Blog & Dicas' },
    { id: 'contato', label: 'Contato' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = `https://wa.me/${portal.whatsapp}?text=${encodeURIComponent(
    'Olá Maria Júlia, conheci seu portal e gostaria de atendimento exclusivo para compra ou investimento em imóveis.'
  )}`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-neutral-200/80'
          : 'bg-white/80 backdrop-blur-md shadow-2xs border-neutral-200/60'
      }`}
    >
      {/* Top Subtle Reading Progress Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-200/40 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-16 sm:h-18' : 'h-20 sm:h-22'
        }`}
      >
        {/* Zone 1: Brand Wordmark (Single clean element) */}
        <div className="flex items-center gap-3">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('inicio');
            }}
            className="flex flex-col group cursor-pointer focus:outline-hidden"
          >
            <span
              className={`font-handwriting font-normal text-neutral-950 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all duration-300 leading-none tracking-wide pt-1 ${
                scrolled ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
              }`}
            >
              {portal.brokerName}
            </span>
            <span className="text-[9.5px] sm:text-[10.5px] font-medium tracking-[0.25em] uppercase text-amber-800 dark:text-amber-400 -mt-0.5 flex items-center gap-1.5">
              <span className="tracking-[0.25em]">Corretora de Imóveis</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[9px] sm:text-[10px] tracking-normal font-semibold">
                {portal.creci}
              </span>
            </span>
          </a>
        </div>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1.5 transition-colors cursor-pointer text-[13px] tracking-wide ${
                  isActive ? 'text-neutral-950 font-semibold' : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Alternar tema visual"
            className="p-2 sm:p-2.5 rounded-xl text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer active:scale-95"
            title={darkMode ? 'Tema Claro' : 'Tema Escuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* WhatsApp Primary CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-neutral-950" />
            <span>Atendimento VIP</span>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="lg:hidden p-2 rounded-xl text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Touch-friendly & fast) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/98 backdrop-blur-2xl border-b border-neutral-200/90 shadow-2xl p-6 transition-all animate-fade-in z-50 max-h-[calc(100vh-65px)] overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center justify-between w-full min-h-[48px] px-4 py-3 rounded-xl text-left text-base font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                      : 'text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-neutral-400'}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full min-h-[48px] px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-neutral-950" />
                <span>Conversar no WhatsApp</span>
              </a>

              <div className="text-center text-xs text-neutral-500 py-1">
                Atendimento direto com Maria Júlia · {portal.creci}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
