import React, { useState } from 'react';
import { MapPin, Navigation, Eye, ExternalLink } from 'lucide-react';
import { Property } from '../types/property';

interface InteractiveMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  onSelectProperty
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(properties[0] || null);
  const [activeZone, setActiveZone] = useState<'all' | 'criciuma' | 'rincao'>('all');

  const filteredProperties = properties.filter((p) => {
    if (activeZone === 'criciuma') return p.city === 'Criciúma';
    if (activeZone === 'rincao') return p.city === 'Balneário Rincão';
    return true;
  });

  return (
    <section className="py-20 bg-white border-t border-neutral-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 mb-2">
              <Navigation className="w-3.5 h-3.5 text-amber-700" />
              <span>Geolocalização & Bairros Nobres</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
              Explore imóveis em <span className="gold-gradient-text">Criciúma & Rincão</span>
            </h2>
          </div>

          {/* Map Region Tabs */}
          <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl border border-neutral-300">
            <button
              onClick={() => setActiveZone('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeZone === 'all' ? 'bg-amber-400 text-neutral-950 shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Todas as Regiões
            </button>
            <button
              onClick={() => setActiveZone('criciuma')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeZone === 'criciuma' ? 'bg-amber-400 text-neutral-950 shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Criciúma (Cidade)
            </button>
            <button
              onClick={() => setActiveZone('rincao')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeZone === 'rincao' ? 'bg-amber-400 text-neutral-950 shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Balneário Rincão (Praia)
            </button>
          </div>
        </div>

        {/* Map Container and Property Preview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Visual Interactive Map Canvas */}
          <div className="lg:col-span-8 bg-[#f5f4f0] rounded-2xl border border-neutral-300 overflow-hidden relative min-h-[460px] shadow-sm flex flex-col justify-between p-6">
            
            {/* Top legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-200/90 shadow-xs max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span>{filteredProperties.length} imóveis disponíveis nesta área</span>
              </div>
              <span className="text-[11px] text-neutral-500">Clique no pin para ver detalhes</span>
            </div>

            {/* Stylized Architectural Map Graphic Simulation */}
            <div className="absolute inset-0 z-0">
              <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="light-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#f7f6f2" />
                <rect width="100%" height="100%" fill="url(#light-grid)" />
                {/* Simulated Coastline of Balneário Rincão */}
                <path
                  d="M 650 0 Q 600 250 560 500 T 520 800"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="80"
                  strokeLinecap="round"
                  className="opacity-40"
                />
                <path
                  d="M 680 0 Q 630 250 590 500 T 550 800"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="50"
                  strokeLinecap="round"
                  className="opacity-50"
                />
                {/* Simulated Road Arteries SC-445 */}
                <path d="M 100 450 Q 300 350 550 200" fill="none" stroke="#cbd5e1" strokeWidth="6" />
                <path d="M 120 100 L 450 350" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                <path d="M 250 50 L 250 500" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              </svg>

              {/* Geographic Region Labels */}
              <div className="absolute top-12 left-14 font-serif text-lg font-bold text-neutral-400 select-none">
                Criciúma (Centro / Pio Corrêa)
              </div>
              <div className="absolute bottom-16 right-20 font-serif text-lg font-bold text-sky-600/70 select-none">
                Oceano Atlântico · Balneário Rincão
              </div>
            </div>

            {/* Interactive Property Pins scattered across the canvas */}
            <div className="relative z-10 flex-1 w-full h-full min-h-[300px]">
              {filteredProperties.map((prop, idx) => {
                // Computed visually balanced positions based on city
                const isRincao = prop.city === 'Balneário Rincão';
                const leftPos = isRincao ? 60 + (idx % 3) * 12 : 18 + (idx % 3) * 14;
                const topPos = isRincao ? 25 + (idx % 4) * 16 : 30 + (idx % 3) * 18;
                const isSelected = selectedProperty?.id === prop.id;

                return (
                  <button
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 cursor-pointer ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20'
                    }`}
                  >
                    <div
                      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg transition-colors border ${
                        isSelected
                          ? 'bg-amber-400 text-neutral-950 font-bold border-neutral-950'
                          : 'bg-neutral-900 text-white font-medium border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'fill-neutral-950 text-neutral-950' : 'text-amber-400'}`} />
                      <span className="text-[11px] whitespace-nowrap">
                        R$ {(prop.price / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom map note */}
            <div className="relative z-10 self-start text-[11px] text-neutral-600 bg-white/95 px-3 py-1 rounded-md border border-neutral-200">
              Sul de Santa Catarina · Eixo Criciúma ↔ Rincão (Via SC-445 Rápida)
            </div>

          </div>

          {/* Selected Property Preview Side Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            {selectedProperty ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-amber-400">
                    {selectedProperty.code}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-neutral-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-white">
                    {selectedProperty.neighborhood}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                    {selectedProperty.city} · {selectedProperty.type}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-neutral-950 mt-1 line-clamp-2">
                    {selectedProperty.title}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-neutral-50 text-center text-xs">
                  <div>
                    <span className="text-neutral-500 text-[10px] block">Área</span>
                    <strong className="text-neutral-900">{selectedProperty.privateArea}m²</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">Quartos</span>
                    <strong className="text-neutral-900">{selectedProperty.bedrooms} dorms</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block">Vagas</span>
                    <strong className="text-neutral-900">{selectedProperty.garageSpots} vagas</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-medium">Investimento</span>
                    <span className="font-serif text-xl font-bold text-neutral-950 tabular-nums">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(selectedProperty.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Ver Imóvel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-neutral-500 text-xs">
                Selecione um imóvel no mapa para visualizar os detalhes
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
