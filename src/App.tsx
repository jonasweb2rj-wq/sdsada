import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MetricsSection } from './components/MetricsSection';
import { PropertyCard } from './components/PropertyCard';
import { PropertyFilters, FilterCategory } from './components/PropertyFilters';
import { FinancingCalculator } from './components/FinancingCalculator';
import { InteractiveMap } from './components/InteractiveMap';
import { AboutMariaJulia } from './components/AboutMariaJulia';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { ExitIntentPopup } from './components/ExitIntentPopup';
import { CookieBanner } from './components/CookieBanner';
import { LegalModal } from './components/LegalModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { CinematicIntro } from './components/CinematicIntro';
import { AssistantWidget } from './components/AssistantWidget';
import { Property, PortalContent } from './types/property';
import { StorageService } from './services/storageService';
import { FirebaseService } from './services/firebaseService';
import { MessageCircle, Search, ArrowUpDown, Instagram, Calendar } from 'lucide-react';

export default function App() {
  // 6-Second Cinematic Handwriting Intro state
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Theme state: defaults to pure light theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('maju_theme') === 'dark';
  });

  // Portal Content
  const [portal, setPortal] = useState<PortalContent>(() => StorageService.getPortalContent());

  // Properties
  const [properties, setProperties] = useState<Property[]>(() => StorageService.getActiveProperties());

  // Active section for nav highlighting
  const [activeSection, setActiveSection] = useState('inicio');

  // Property Filters & Search
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchParams, setSearchParams] = useState({
    city: '',
    type: '',
    minBedrooms: 0,
    priceRange: ''
  });
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'area_desc'>('featured');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleTargetProperty, setScheduleTargetProperty] = useState<Property | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

  // React to Real-Time Firebase Firestore & Local Storage updates
  useEffect(() => {
    // 1. Subscribe to real-time property changes from Firestore database
    const unsubProps = FirebaseService.subscribeToProperties((firebaseProps) => {
      StorageService.setLocalProperties(firebaseProps);
      setProperties(firebaseProps.filter((p) => !p.isDeleted));
    });

    // 2. Subscribe to real-time portal content changes from Firestore database
    const unsubPortal = FirebaseService.subscribeToPortalContent((firebasePortal) => {
      StorageService.setLocalPortalContent(firebasePortal);
      setPortal(firebasePortal);
    });

    const handleStorageUpdate = () => {
      setProperties(StorageService.getActiveProperties());
      setPortal(StorageService.getPortalContent());
    };
    window.addEventListener('maju_properties_updated', handleStorageUpdate);
    window.addEventListener('maju_portal_updated', handleStorageUpdate);

    return () => {
      unsubProps();
      unsubPortal();
      window.removeEventListener('maju_properties_updated', handleStorageUpdate);
      window.removeEventListener('maju_portal_updated', handleStorageUpdate);
    };
  }, []);

  // Sync theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('maju_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('maju_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScheduleVisit = (property?: Property) => {
    setScheduleTargetProperty(property || null);
    setIsScheduleOpen(true);
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'cookies') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // Filter Category Tabs
    if (filterCategory === 'criciuma') {
      result = result.filter((p) => p.city === 'Criciúma');
    } else if (filterCategory === 'rincao') {
      result = result.filter((p) => p.city === 'Balneário Rincão');
    } else if (filterCategory === 'financing') {
      result = result.filter((p) => p.isBankFinancing);
    } else if (filterCategory === 'builder') {
      result = result.filter((p) => p.isDirectBuilder);
    } else if (filterCategory === 'featured') {
      result = result.filter((p) => p.isFeatured);
    }

    // Hero search filter params
    if (searchParams.city) {
      result = result.filter((p) => p.city.toLowerCase() === searchParams.city.toLowerCase());
    }
    if (searchParams.type) {
      result = result.filter((p) => p.type.toLowerCase().includes(searchParams.type.toLowerCase()));
    }
    if (searchParams.minBedrooms > 0) {
      result = result.filter((p) => p.bedrooms >= searchParams.minBedrooms);
    }
    if (searchParams.priceRange) {
      if (searchParams.priceRange === 'ate_500k') {
        result = result.filter((p) => p.price <= 500000);
      } else if (searchParams.priceRange === '500k_1m') {
        result = result.filter((p) => p.price > 500000 && p.price <= 1000000);
      } else if (searchParams.priceRange === '1m_2m') {
        result = result.filter((p) => p.price > 1000000 && p.price <= 2000000);
      } else if (searchParams.priceRange === 'acima_2m') {
        result = result.filter((p) => p.price > 2000000);
      }
    }

    // Sort order
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area_desc') {
      result.sort((a, b) => b.privateArea - a.privateArea);
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [properties, filterCategory, searchParams, sortBy]);

  // Counts for filters
  const filterCounts = useMemo(() => ({
    all: properties.length,
    criciuma: properties.filter((p) => p.city === 'Criciúma').length,
    rincao: properties.filter((p) => p.city === 'Balneário Rincão').length,
    financing: properties.filter((p) => p.isBankFinancing).length,
    builder: properties.filter((p) => p.isDirectBuilder).length,
    featured: properties.filter((p) => p.isFeatured).length
  }), [properties]);

  const whatsappGeneralUrl = `https://wa.me/${portal.whatsapp}?text=${encodeURIComponent(
    'Olá Maria Júlia, gostaria de um atendimento exclusivo para encontrar meu imóvel ideal em Criciúma ou Balneário Rincão.'
  )}`;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 transition-colors duration-300 font-sans selection:bg-amber-400/30 selection:text-amber-900">
      
      {/* Top Navigation */}
      <Navbar
        portal={portal}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section with automatic properties slideshow */}
        <HeroSection
          portal={portal}
          properties={properties}
          onSearch={(params) => setSearchParams(params)}
          onOpenSchedule={() => handleScheduleVisit()}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
        />

        {/* Rigorous Metrics */}
        <MetricsSection portal={portal} />

        {/* Featured Properties Section */}
        <section id="imoveis" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-700">
                Portfólio Imobiliário Exclusivo
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 mt-1">
                Imóveis Selecionados em <span className="gold-gradient-text">Criciúma & Rincão</span>
              </h2>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
              >
                <option value="featured">Destaques Primeiro</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="area_desc">Maior Área Privativa</option>
              </select>
            </div>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="mb-8">
            <PropertyFilters
              currentCategory={filterCategory}
              onSelectCategory={(cat) => setFilterCategory(cat)}
              counts={filterCounts}
            />
          </div>

          {/* Search notice if active */}
          {(searchParams.city || searchParams.type || searchParams.minBedrooms > 0 || searchParams.priceRange) && (
            <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>
                Filtro ativo: {searchParams.city || 'Todas as cidades'} · {searchParams.type || 'Todos os tipos'} · {searchParams.minBedrooms > 0 ? `${searchParams.minBedrooms}+ quartos` : ''}
              </span>
              <button
                onClick={() => setSearchParams({ city: '', type: '', minBedrooms: 0, priceRange: '' })}
                className="underline hover:text-amber-700 cursor-pointer font-semibold"
              >
                Limpar Busca
              </button>
            </div>
          )}

          {/* Property Cards Grid */}
          {filteredAndSortedProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <Search className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <div className="font-serif text-lg font-bold text-neutral-900">Nenhum imóvel encontrado nesta seleção</div>
              <p className="text-xs text-neutral-600 mt-1">
                Tente ajustar os filtros ou fale diretamente com a Maria Júlia para buscar imóveis off-market.
              </p>
              <button
                onClick={() => {
                  setFilterCategory('all');
                  setSearchParams({ city: '', type: '', minBedrooms: 0, priceRange: '' });
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-semibold shadow-xs"
              >
                Ver Todos os Imóveis
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onSelect={(p) => setSelectedProperty(p)}
                  onScheduleVisit={(p) => handleScheduleVisit(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Interactive Financing Calculator */}
        <FinancingCalculator portal={portal} />

        {/* Interactive Neighborhood & City Map */}
        <InteractiveMap
          properties={properties}
          onSelectProperty={(p) => setSelectedProperty(p)}
        />

        {/* About Maria Júlia Section */}
        <AboutMariaJulia
          portal={portal}
          onOpenSchedule={() => handleScheduleVisit()}
        />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Blog & Real Estate Advice (Automatically aligned with all registered properties) */}
        <BlogSection
          properties={properties}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onScheduleVisit={(prop) => handleScheduleVisit(prop)}
        />
      </main>

      {/* Footer with exact center "Área Restrita" button & "Ver Abertura" */}
      <Footer
        portal={portal}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPrivacy={() => handleOpenLegal('privacy')}
        onOpenTerms={() => handleOpenLegal('terms')}
        onOpenCookies={() => handleOpenLegal('cookies')}
        onNavigate={handleNavigate}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* FLOATING ACTION ELEMENTS (Designed so none obstructs site content) */}
      
      {/* LEFT SIDE: Assistente Corretora IA */}
      <AssistantWidget
        portal={portal}
        properties={properties}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        onScheduleVisit={(prop) => handleScheduleVisit(prop)}
        onNavigate={handleNavigate}
      />

      {/* RIGHT SIDE: Official Instagram + WhatsApp compact floating stack */}
      <div className="fixed bottom-[74px] sm:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Official Instagram Button */}
        <a
          href="https://www.instagram.com/majudgamba"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Seguir Maria Júlia no Instagram @majudgamba"
          aria-label="Instagram da Corretora"
        >
          <Instagram className="w-5 h-5 text-white" />
          
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-neutral-900/90 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md backdrop-blur-xs">
            Instagram @majudgamba
          </span>
        </a>

        {/* Official WhatsApp Button */}
        <a
          href={whatsappGeneralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Falar no WhatsApp com Maria Júlia"
          aria-label="WhatsApp da Corretora"
        >
          <MessageCircle className="w-5 h-5 fill-white text-white" />

          {/* Tooltip on hover */}
          <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-neutral-900/90 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md backdrop-blur-xs">
            WhatsApp Maria Júlia
          </span>
        </a>
      </div>

      {/* Ultra Mobile Bottom Quick Bar (Max 60px height <= 15% viewport) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-200/90 px-3 py-2 flex items-center gap-2 shadow-2xl">
        <a
          href={whatsappGeneralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-11 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Falar no WhatsApp</span>
        </a>
        <button
          onClick={() => handleScheduleVisit()}
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar Visita</span>
        </button>
      </div>

      {/* Modals & Overlays */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onScheduleVisit={(p) => {
          setSelectedProperty(null);
          handleScheduleVisit(p);
        }}
      />

      <ScheduleVisitModal
        property={scheduleTargetProperty}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        portal={portal}
        onUpdatePortal={(newContent) => setPortal(newContent)}
        onSelectPropertyForPreview={(prop) => {
          setIsAdminOpen(false);
          setSelectedProperty(prop);
        }}
      />

      <LegalModal
        isOpen={isLegalOpen}
        initialTab={legalTab}
        onClose={() => setIsLegalOpen(false)}
      />

      <CookieBanner
        onOpenPrivacyPolicy={() => handleOpenLegal('privacy')}
      />

      <ExitIntentPopup />

      {/* 6-Second Cinematic Handwriting Intro */}
      {showIntro && (
        <CinematicIntro
          brokerName={portal.brokerName || 'Maria Júlia Gamba'}
          creci={portal.creci || 'CRECI/SC 77301-F'}
          onComplete={() => setShowIntro(false)}
        />
      )}

    </div>
  );
}
