import React from 'react';
import { ShieldCheck, Award, Instagram, CheckCircle2, MessageCircle, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { PortalContent } from '../types/property';
import brokerPortrait from '../assets/images/corretora_maria_julia_1790521948750.jpg';

interface AboutMariaJuliaProps {
  portal: PortalContent;
  onOpenSchedule: () => void;
}

export const AboutMariaJulia: React.FC<AboutMariaJuliaProps> = ({
  portal,
  onOpenSchedule
}) => {
  const whatsappUrl = `https://wa.me/${portal.whatsapp}?text=${encodeURIComponent(
    'Olá Maria Júlia, gostaria de uma consultoria imobiliária personalizada para compra/investimento em Criciúma ou Balneário Rincão.'
  )}`;

  return (
    <section id="sobre" className="py-24 bg-[#faf9f6] border-t border-neutral-200/80 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Luxury Ambient Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-400/25 via-amber-200/20 to-transparent blur-xl" />
              
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xl bg-neutral-900 aspect-[3/4] group">
                <img
                  src="https://i.postimg.cc/Tw2Kb8XG/maria.jpg"
                  alt="Maria Júlia - Corretora de Imóveis CRECI/SC 77301-F"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = brokerPortrait;
                  }}
                />
                
                {/* Floating Credential Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-3.5 rounded-xl border border-neutral-200/90 shadow-lg flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-neutral-950 text-base">
                      {portal.brokerName}
                    </div>
                    <div className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>{portal.creci}</span>
                    </div>
                  </div>
                  <a
                    href="https://www.instagram.com/majudgamba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 text-xs font-semibold transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>@majudgamba</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Differentials Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Autoridade & Consultoria Imobiliária</span>
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 leading-tight">
                Atendimento exclusivo com <span className="gold-gradient-text">segurança e transparência</span>.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
                {portal.bioText}
              </p>
            </div>

            {/* Quote Box */}
            <div className="p-5 rounded-2xl bg-white border-l-4 border-amber-500 border-y border-r border-neutral-200/80 shadow-2xs">
              <p className="font-serif italic text-neutral-800 text-base leading-relaxed">
                "{portal.quoteText}"
              </p>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
                — Maria Júlia Gamba · CRECI/SC 77301-F
              </div>
            </div>

            {/* Differentials 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-serif font-bold text-sm mb-2 border border-amber-200">
                  01
                </div>
                <h4 className="font-semibold text-neutral-950 text-sm mb-1">Seleção Criteriosa</h4>
                <p className="text-xs text-neutral-600">Apenas imóveis regulares, com vistoria prévia e potencial real de valorização.</p>
              </div>

              <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-serif font-bold text-sm mb-2 border border-amber-200">
                  02
                </div>
                <h4 className="font-semibold text-neutral-950 text-sm mb-1">Blindagem Jurídica</h4>
                <p className="text-xs text-neutral-600">Auditoria de certidões, matrículas e contratos do início ao registro em cartório.</p>
              </div>

              <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-serif font-bold text-sm mb-2 border border-amber-200">
                  03
                </div>
                <h4 className="font-semibold text-neutral-950 text-sm mb-1">Aprovação em 24h</h4>
                <p className="text-xs text-neutral-600">Canal direto com correspondente Caixa para aprovação ágil de crédito imobiliário.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onOpenSchedule}
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md hover:shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Consultoria Exclusiva</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-800 hover:text-neutral-950 bg-white hover:bg-neutral-100 border border-neutral-300 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
