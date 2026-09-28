import React, { useState } from 'react';
import { X, BedDouble, Bath, Car, Maximize2, MapPin, Calendar, MessageCircle, FileText, Download, ShieldCheck, Flame, Check, Share2, Sparkles, Lightbulb } from 'lucide-react';
import { Property } from '../types/property';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onScheduleVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onScheduleVisit
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá Maria Júlia, tenho muito interesse no imóvel ${property.code} - ${property.title} no ${property.neighborhood}, ${property.city}. Poderia me passar a disponibilidade e detalhes da negociação?`
  );
  const whatsappUrl = `https://wa.me/5548991827701?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white border border-neutral-200 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-neutral-900">
        
        {/* Sticky Header with Close & Actions */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 font-bold">
              {property.code}
            </span>
            <span className="text-xs text-neutral-600 font-medium hidden sm:inline">
              {property.neighborhood}, {property.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Compartilhar imóvel"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Main Gallery Area */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
              <img
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {property.isUrgentOffer && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-md">
                  <Flame className="w-4 h-4" />
                  <span>Oportunidade Exclusiva</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-amber-500 scale-102 shadow-xs' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Badges & Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-200">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-800 font-bold">
                  {property.type} · {property.builder || 'Exclusivo'}
                </span>
                <span className="text-neutral-400">·</span>
                <span className="text-xs text-neutral-600 font-medium">
                  {property.city} · Bairro {property.neighborhood}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight">
                {property.title}
              </h2>
              {property.address && (
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{property.address}</span>
                </p>
              )}
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-xs text-neutral-500 uppercase block font-medium">Valor de Venda</span>
              <div className="font-serif text-3xl sm:text-4xl font-extrabold text-neutral-950 tabular-nums">
                {formattedPrice}
              </div>
              {property.condoFee && (
                <span className="text-xs text-neutral-500 block mt-0.5">
                  Condomínio: R$ {property.condoFee}/mês
                </span>
              )}
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#faf9f6] border border-neutral-200">
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
                <Maximize2 className="w-4 h-4 text-amber-700" />
                <span>Área Privativa</span>
              </div>
              <div className="font-serif text-2xl font-bold text-neutral-950 tabular-nums">
                {property.privateArea} m²
              </div>
              {property.totalArea && (
                <div className="text-[11px] text-neutral-500">Total: {property.totalArea} m²</div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
                <BedDouble className="w-4 h-4 text-amber-700" />
                <span>Dormitórios</span>
              </div>
              <div className="font-serif text-2xl font-bold text-neutral-950 tabular-nums">
                {property.bedrooms}
              </div>
              <div className="text-[11px] text-neutral-500">sendo {property.suites} suíte(s)</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
                <Bath className="w-4 h-4 text-amber-700" />
                <span>Banheiros</span>
              </div>
              <div className="font-serif text-2xl font-bold text-neutral-950 tabular-nums">
                {property.bathrooms}
              </div>
              <div className="text-[11px] text-neutral-500">Lavabo integrado</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
                <Car className="w-4 h-4 text-amber-700" />
                <span>Vagas de Garagem</span>
              </div>
              <div className="font-serif text-2xl font-bold text-neutral-950 tabular-nums">
                {property.garageSpots}
              </div>
              <div className="text-[11px] text-neutral-500">Privativas e cobertas</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-neutral-950">
              Sobre o Imóvel
            </h3>
            <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Dica de Ouro de Maria Júlia */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Dica de Ouro da Corretora Maria Júlia (CRECI 77301-F)</span>
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed font-normal">
              {property.isBankFinancing
                ? `Imóvel com excelente taxa de liquidez no bairro ${property.neighborhood}. 100% regularizado para financiamento habitacional Caixa com aprovação ágil em 24h, permitindo amortização com FGTS e composição de renda familiar.`
                : `Oportunidade sólida em ${property.city}. As condições de pagamento facilitadas direto com a construtora proporcionam excelente poder de compra e flexibilidade na entrada.`}
            </p>
          </div>

          {/* Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-950">
                Diferenciais & Lazer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/90 text-xs text-neutral-800">
                    <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Documents / Floorplans download list */}
          {property.documents && property.documents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-neutral-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <span>Plantas e Documentos Oficiais</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-amber-400 text-neutral-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="text-xs font-semibold truncate">{doc.name}</span>
                    </div>
                    <Download className="w-4 h-4 text-neutral-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Conversion Footer */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-[11px] text-neutral-500 block">Atendimento com Maria Júlia</span>
            <span className="font-serif font-bold text-neutral-950 text-sm">CRECI/SC 77301-F · Agilidade & Segurança</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onScheduleVisit(property)}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-neutral-300"
            >
              <Calendar className="w-4 h-4 text-neutral-700" />
              <span>Agendar Visita</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-neutral-950" />
              <span>Negociar no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
