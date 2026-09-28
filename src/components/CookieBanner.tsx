import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('maju_cookie_consent_v1');
    if (!saved) {
      // Delay opening banner by 2s so user can view page first
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('maju_cookie_consent_v1', JSON.stringify(all));
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const minimal = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('maju_cookie_consent_v1', JSON.stringify(minimal));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('maju_cookie_consent_v1', JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[74px] sm:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xl z-50 animate-slide-up">
      <div className="bg-white/95 backdrop-blur-md border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-2xl text-neutral-800">
        
        {!showPreferences ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="w-5 h-5 text-amber-700" />
              <h4 className="font-serif font-bold text-neutral-950 text-base">
                Privacidade & Gestão de Cookies (LGPD)
              </h4>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              Este portal utiliza cookies essenciais para navegação segura, além de ferramentas de análise para aprimorar sua experiência na busca por imóveis em Criciúma e Balneário Rincão, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-lg bg-neutral-950 text-white font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Aceitar Todos
              </button>

              <button
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer border border-neutral-300"
              >
                Apenas Essenciais
              </button>

              <button
                onClick={() => setShowPreferences(true)}
                className="px-3 py-2 rounded-lg bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Preferências</span>
              </button>

              <button
                onClick={onOpenPrivacyPolicy}
                className="ml-auto text-[11px] text-amber-800 underline hover:text-amber-900 cursor-pointer"
              >
                Ler Política
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <h4 className="font-serif font-bold text-neutral-950 text-sm">
                Configurações Granulares de Privacidade
              </h4>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <div>
                  <div className="font-semibold text-neutral-900">Cookies Estritamente Necessários</div>
                  <div className="text-neutral-500 text-[11px]">Indispensáveis para a segurança do portal e preferências do usuário.</div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Obrigatório
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <div>
                  <div className="font-semibold text-neutral-900">Cookies de Desempenho & Analytics</div>
                  <div className="text-neutral-500 text-[11px]">Métricas anônimas para entender imóveis mais visitados em Criciúma e Rincão.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <div>
                  <div className="font-semibold text-neutral-900">Comunicação Personalizada & WhatsApp</div>
                  <div className="text-neutral-500 text-[11px]">Permite preenchimento dinâmico de propostas imobiliárias.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 rounded-lg bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Salvar Escolhas
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
