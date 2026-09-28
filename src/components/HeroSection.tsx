import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Building2, BedDouble, ShieldCheck, ChevronRight, ChevronLeft, Sparkles, Clock, Eye, SlidersHorizontal, Flame } from 'lucide-react';
import { Property, PortalContent } from '../types/property';

interface HeroSectionProps {
  portal?: PortalContent;
  onSearch: (filters: { city: string; type: string; minBedrooms: number; priceRange: string }) => void;
  onOpenSchedule: () => void;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  portal,
  onSearch,
  onOpenSchedule,
  properties = [],
  onSelectProperty
}) => {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [priceRange, setPriceRange] = useState('');

  // Extract property slides
  const slides = useMemo(() => {
    const activeProps = properties.filter((p) => p.isFeatured || p.status === 'Disponível');
    const displayProps = activeProps.length > 0 ? activeProps : properties;

    if (displayProps.length === 0) {
      return [
        {
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
          title: 'Residencial Alto Padrão em Criciúma',
          location: 'Bairro Michel, Criciúma',
          price: 'R$ 1.650.000',
          type: 'Cobertura',
          code: 'MJ-101',
          property: null as Property | null
        }
      ];
    }

    return displayProps.slice(0, 6).map((prop) => ({
      property: prop,
      imageUrl: prop.images && prop.images[0]
        ? prop.images[0]
        : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
      title: prop.title,
      location: `${prop.neighborhood}, ${prop.city}`,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
      }).format(prop.price),
      type: prop.type,
      code: prop.code
    }));
  }, [properties]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Automatic slideshow transition every 6 seconds with animated progress line
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    setProgress(0);
    const intervalTime = 6000;
    const stepTime = 50;
    const stepIncrement = (stepTime / intervalTime) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => clearInterval(progressTimer);
  }, [slides.length, isPaused, currentSlide]);

  const nextSlide = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city, type, minBedrooms, priceRange });
    const el = document.getElementById('imoveis');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const applyQuickFilter = (newCity: string, newType: string) => {
    setCity(newCity);
    setType(newType);
    onSearch({ city: newCity, type: newType, minBedrooms, priceRange });
    const el = document.getElementById('imoveis');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeSlideData = slides[currentSlide];

  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center overflow-hidden bg-neutral-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with Ultra-Smooth GPU Transitions */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out gpu-smooth ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        {/* Cinematic Multi-Layer Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-neutral-950/20 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 z-20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full flex flex-col justify-between min-h-[85vh]">
        
        {/* Top Floating Badge & Live Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-xl border border-amber-400/40 text-xs font-semibold text-amber-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400 beacon-pulse" />
            <span>Consultoria Imobiliária Oficial CRECI/SC 77301-F</span>
          </div>

          {/* Active property live card */}
          {activeSlideData && activeSlideData.property && (
            <div
              onClick={() => onSelectProperty && onSelectProperty(activeSlideData.property!)}
              className="group/tag inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-950/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl hover:border-amber-400/60 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  {activeSlideData.type} · {activeSlideData.code}
                </div>
                <div className="text-xs font-semibold text-neutral-200 truncate max-w-[180px] sm:max-w-[240px]">
                  {activeSlideData.location}
                </div>
              </div>
              <div className="pl-3 border-l border-white/20 text-right">
                <div className="font-serif text-sm font-bold text-amber-300 tabular-nums">
                  {activeSlideData.price}
                </div>
                <span className="text-[10px] text-neutral-300 flex items-center justify-end gap-1 group-hover/tag:text-white">
                  <span>Ver Imóvel</span>
                  <ChevronRight className="w-3 h-3 group-hover/tag:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center Headline & Value Proposition */}
        <div className="max-w-3xl mb-8">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.14] mb-5 drop-shadow-lg">
            Sua conquista e <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">patrimônio exclusivo</span> começam aqui.
          </h1>
          <p className="text-base sm:text-xl text-neutral-200 font-normal leading-relaxed drop-shadow-md max-w-2xl">
            Seleção criteriosa de coberturas, apartamentos de alto padrão e condomínios fechados em Criciúma e Balneário Rincão com assessoria completa até as chaves.
          </p>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider mr-1 hidden sm:inline">
            Destaques:
          </span>
          <button
            onClick={() => applyQuickFilter('Balneário Rincão', '')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-medium backdrop-blur-md transition-all cursor-pointer hover:border-amber-400/50"
          >
            🌊 Balneário Rincão
          </button>
          <button
            onClick={() => applyQuickFilter('Criciúma', 'Cobertura')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-medium backdrop-blur-md transition-all cursor-pointer hover:border-amber-400/50"
          >
            ✨ Coberturas Criciúma
          </button>
          <button
            onClick={() => applyQuickFilter('Criciúma', 'Casa em Condomínio')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-medium backdrop-blur-md transition-all cursor-pointer hover:border-amber-400/50"
          >
            🏡 Condomínios Fechados
          </button>
          <button
            onClick={() => applyQuickFilter('', 'Apartamento')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-medium backdrop-blur-md transition-all cursor-pointer hover:border-amber-400/50"
          >
            🏢 Apartamentos
          </button>
        </div>

        {/* Ultra Search Card - Desktop 5 columns / Mobile 1-2 columns */}
        <div className="w-full bg-white/95 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border border-amber-400/30 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
            
            {/* City selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Cidade</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all cursor-pointer"
              >
                <option value="">Todas as Cidades</option>
                <option value="Criciúma">Criciúma</option>
                <option value="Balneário Rincão">Balneário Rincão</option>
              </select>
            </div>

            {/* Type selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Tipo de Imóvel</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all cursor-pointer"
              >
                <option value="">Todos os Tipos</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Casa em Condomínio">Casa em Condomínio</option>
                <option value="Casa Residencial">Casa Residencial</option>
                <option value="Terreno em Condomínio">Terreno em Condomínio</option>
              </select>
            </div>

            {/* Bedrooms selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                <span>Dormitórios</span>
              </label>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all cursor-pointer"
              >
                <option value={0}>Qualquer quantidade</option>
                <option value={2}>2+ Quartos</option>
                <option value={3}>3+ Quartos</option>
                <option value={4}>4+ Quartos</option>
              </select>
            </div>

            {/* Price Range selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>Faixa de Valor</span>
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all cursor-pointer"
              >
                <option value="">Todas as Faixas</option>
                <option value="ate-500k">Até R$ 500.000</option>
                <option value="500k-1m">R$ 500.000 a R$ 1.000.000</option>
                <option value="1m-2m">R$ 1.000.000 a R$ 2.000.000</option>
                <option value="acima-2m">Acima de R$ 2.000.000</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md hover:shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4 text-neutral-950" />
                <span>Buscar Imóveis</span>
              </button>
            </div>
          </form>
        </div>

        {/* Carousel Controls & Slide Timeline */}
        <div className="mt-8 flex items-center justify-between text-white/90">
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/20 transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Próximo slide"
              className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/20 transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-neutral-300 font-mono ml-2">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs mx-6">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-75 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quick Schedule Trigger */}
          <button
            onClick={onOpenSchedule}
            className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Agendar Atendimento VIP</span>
          </button>
        </div>

      </div>
    </section>
  );
};
