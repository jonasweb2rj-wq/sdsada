import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BedDouble, Bath, Car, Maximize2, MapPin, Heart, Calendar, MessageCircle, ArrowUpRight, Flame, Clock, ChevronLeft, ChevronRight, Calculator, CheckCircle2, Sparkles } from 'lucide-react';
import { Property } from '../types/property';
import { StorageService } from '../services/storageService';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onScheduleVisit: (property: Property) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onScheduleVisit,
  isFavorite = false,
  onToggleFavorite
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Framer Motion 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Ultra smooth spring physics (GPU accelerated)
  const mouseXSpring = useSpring(x, { stiffness: 320, damping: 26 });
  const mouseYSpring = useSpring(y, { stiffness: 320, damping: 26 });

  // 3D rotations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);
  
  // Parallax layers
  const imageTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], ['-5px', '5px']);
  const imageTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], ['-5px', '5px']);
  const glossOpacity = useTransform(mouseYSpring, [-0.5, 0, 0.5], [0.15, 0, 0.15]);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply 3D tilt on devices with hover capability for optimal performance
    if (window.matchMedia('(hover: hover)').matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / rect.width - 0.5;
      const yPct = mouseY / rect.height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = StorageService.toggleFavorite(property.id);
    setFavorite(newStatus);
    if (onToggleFavorite) onToggleFavorite(property.id);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  // Fast estimate of 80% financing 360 months SAC 1st installment
  const estimatedFinanced = property.price * 0.8;
  const estimatedFirstInstallment = (estimatedFinanced / 360) + (estimatedFinanced * 0.0085);
  const formattedInstallment = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(estimatedFirstInstallment);

  const whatsappMessage = encodeURIComponent(
    `Olá Maria Júlia, tenho interesse no imóvel ${property.code} (${property.title}) em ${property.neighborhood}, ${property.city} no valor de ${formattedPrice}. Gostaria de mais detalhes e agendar uma visita!`
  );
  const whatsappUrl = `https://wa.me/5548991827701?text=${whatsappMessage}`;

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.article
        onClick={() => onSelect(property)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ scale: 1.015, z: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200/90 hover:border-amber-400/80 transition-colors duration-300 hover:shadow-2xl hover:shadow-neutral-900/12 cursor-pointer gpu-smooth will-change-transform"
      >
        {/* Dynamic 3D Specular Sheen Layer */}
        <motion.div
          style={{ opacity: glossOpacity }}
          className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-amber-200/10 to-white/20 transition-opacity duration-300"
        />

        {/* Image Showcase with Parallax Layer */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
          {/* Skeleton placeholder while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-neutral-700" />
            </div>
          )}

          <motion.div
            style={{
              x: imageTranslateX,
              y: imageTranslateY,
              scale: 1.06
            }}
            className="w-full h-full"
          >
            <img
              src={images[currentImgIndex]}
              alt={property.title}
              onLoad={() => setImgLoaded(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          {/* High Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-neutral-950/30 pointer-events-none z-10" />

          {/* Top Floating Badges (3D depth layer) */}
          <div
            style={{ transform: 'translateZ(30px)' }}
            className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20"
          >
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              {property.isUrgentOffer && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-rose-600 text-white shadow-md">
                  <Flame className="w-3 h-3 fill-white" />
                  <span>Oportunidade</span>
                </span>
              )}
              {property.isBankFinancing && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/95 text-emerald-900 border border-emerald-300 shadow-sm backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Financia até 80%</span>
                </span>
              )}
              {property.tags && property.tags.includes('Vista Mar') && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white/95 text-amber-900 border border-amber-300 shadow-sm backdrop-blur-md">
                  <span>Vista Mar</span>
                </span>
              )}
            </div>

            {/* Favorite Button with micro-bounce */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleFavoriteClick}
              aria-label="Favoritar imóvel"
              className="p-2 rounded-full bg-white/95 hover:bg-white text-neutral-800 pointer-events-auto shadow-md backdrop-blur-md cursor-pointer"
            >
              <Heart className={`w-4 h-4 transition-colors ${favorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-600'}`} />
            </motion.button>
          </div>

          {/* In-Card Gallery Arrows */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
              <button
                onClick={handlePrevImg}
                aria-label="Foto anterior"
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md pointer-events-auto cursor-pointer transition-transform active:scale-90"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextImg}
                aria-label="Próxima foto"
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md pointer-events-auto cursor-pointer transition-transform active:scale-90"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bottom Location, Code & Photo Counter */}
          <div
            style={{ transform: 'translateZ(25px)' }}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white pointer-events-none z-20"
          >
            <div className="flex items-center gap-1.5 font-medium bg-black/75 px-2.5 py-1 rounded-md backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-[190px] text-neutral-100">{property.neighborhood}, {property.city}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {images.length > 1 && (
                <span className="text-[10px] font-mono bg-black/75 px-2 py-1 rounded-md backdrop-blur-md text-amber-300">
                  {currentImgIndex + 1}/{images.length}
                </span>
              )}
              <span className="font-mono text-[11px] font-bold bg-amber-400 text-neutral-950 px-2 py-0.5 rounded shadow-xs">
                {property.code}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body with 3D Depth */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white"
        >
          <div>
            {/* Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex items-center justify-between text-xs text-neutral-500 font-medium mb-1.5">
              <span className="uppercase tracking-wider text-amber-700 font-bold text-[11px]">
                {property.type} · {property.builder || 'Exclusivo'}
              </span>
              {property.condoFee && (
                <span className="text-[11px] text-neutral-500">
                  Cond. R$ {property.condoFee}/mês
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg font-bold text-neutral-950 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
              {property.title}
            </h3>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-4 gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-50 border border-neutral-200/70 text-center text-xs">
            <div>
              <div className="text-neutral-500 text-[10px] uppercase font-semibold">Área</div>
              <div className="font-bold text-neutral-900 tabular-nums">{property.privateArea} m²</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[10px] uppercase font-semibold">Quartos</div>
              <div className="font-bold text-neutral-900 tabular-nums">{property.bedrooms}</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[10px] uppercase font-semibold">Suítes</div>
              <div className="font-bold text-neutral-900 tabular-nums">{property.suites}</div>
            </div>
            <div>
              <div className="text-neutral-500 text-[10px] uppercase font-semibold">Vagas</div>
              <div className="font-bold text-neutral-900 tabular-nums">{property.garageSpots}</div>
            </div>
          </div>

          {/* Live Financial Teaser */}
          <div className="px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900">
              <Calculator className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="text-[11px]">Parcela estim. a partir de:</span>
            </div>
            <span className="font-bold text-amber-950 font-serif tabular-nums text-xs">
              {formattedInstallment}/mês
            </span>
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Valor de Venda</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-neutral-950 tabular-nums">
                {formattedPrice}
              </span>
            </div>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onScheduleVisit(property)}
                title="Agendar visita"
                className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 transition-all cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Conversar no WhatsApp sobre este imóvel"
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-neutral-950" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
