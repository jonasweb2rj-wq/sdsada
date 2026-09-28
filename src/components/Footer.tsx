import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Instagram, Lock, ArrowUp, Sparkles } from 'lucide-react';
import { PortalContent } from '../types/property';

interface FooterProps {
  portal: PortalContent;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenCookies: () => void;
  onNavigate: (sectionId: string) => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  portal,
  onOpenAdmin,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies,
  onNavigate,
  onReplayIntro
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-600 text-xs pb-24 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="font-handwriting text-3xl sm:text-4xl text-neutral-950 tracking-wide leading-tight">
              {portal.brokerName}
            </div>
            <div className="text-amber-800 font-semibold text-[11px] tracking-[0.2em] uppercase">
              Corretora de Imóveis · <span className="font-mono text-neutral-600">{portal.creci}</span>
            </div>
            <p className="text-neutral-600 leading-relaxed font-normal">
              Especializada em imóveis selecionados e assessoria de investimentos em Criciúma e Balneário Rincão. Compra e venda com rigor documental e aprovação ágil.
            </p>
            <div className="pt-2">
              <a
                href="https://www.instagram.com/majudgamba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 font-semibold transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>{portal.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Navegação Rápida
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-amber-800 transition-colors cursor-pointer">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('imoveis')} className="hover:text-amber-800 transition-colors cursor-pointer">
                  Imóveis em Destaque
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sobre')} className="hover:text-amber-800 transition-colors cursor-pointer">
                  Sobre Maria Júlia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('financiamento')} className="hover:text-amber-800 transition-colors cursor-pointer">
                  Simulador de Financiamento
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-amber-800 transition-colors cursor-pointer">
                  Blog & Análises de Mercado
                </button>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Regiões de Atuação
            </div>
            <ul className="space-y-2 text-neutral-600">
              <li>
                <strong className="text-neutral-900 font-semibold">Criciúma / SC:</strong> Bairros Michel, Pio Corrêa, Centro, Cruzeiro do Sul, Comerciário.
              </li>
              <li>
                <strong className="text-neutral-900 font-semibold">Balneário Rincão / SC:</strong> Centro, Zona Sul (Beira-Mar), Lagoa dos Freitas, Condomínios Fechados Náuticos.
              </li>
              <li>
                <strong className="text-neutral-900 font-semibold">Tipologias:</strong> Coberturas lineares e duplex, apartamentos alto padrão, casas contemporâneas e terrenos.
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <div className="font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider">
              Atendimento Exclusivo
            </div>
            <div className="space-y-2.5 text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <a href={`tel:${portal.phone.replace(/\D/g, '')}`} className="hover:text-neutral-950 transition-colors">
                  {portal.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <a href={`mailto:${portal.email}`} className="hover:text-neutral-950 transition-colors truncate">
                  {portal.email}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-neutral-500">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <span>{portal.officeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Center Footer Trigger: DISCRETE "Área Restrita" BUTTON & "Ver Abertura" */}
        <div className="py-6 border-t border-neutral-200 flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-amber-50 text-neutral-700 hover:text-amber-800 border border-neutral-300 hover:border-amber-400 transition-all text-[11px] font-semibold cursor-pointer shadow-2xs"
                title="Reproduzir introdução cinematográfica de 6 segundos"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Ver Abertura Cinematográfica</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-amber-800 border border-neutral-300 transition-all text-[11px] font-semibold cursor-pointer shadow-2xs"
              title="Acesso restrito da corretora"
            >
              <Lock className="w-3 h-3 text-neutral-500 group-hover:text-amber-700 transition-colors" />
              <span>Área Restrita</span>
            </button>
          </div>
          <span className="text-[10px] text-neutral-500">
            Painel de Gestão Imobiliária & Anúncios IA
          </span>
        </div>

        {/* Bottom Bar with LGPD Links & Copyright */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Maria Júlia Gamba · {portal.creci} · Todos os direitos reservados.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-amber-800 transition-colors cursor-pointer">
              Política de Privacidade
            </button>
            <span>·</span>
            <button onClick={onOpenTerms} className="hover:text-amber-800 transition-colors cursor-pointer">
              Termos de Uso
            </button>
            <span>·</span>
            <button onClick={onOpenCookies} className="hover:text-amber-800 transition-colors cursor-pointer">
              Gestão de Cookies (LGPD)
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 border border-neutral-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
