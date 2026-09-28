import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface ExitIntentPopupProps {
  onDownloadLeadMagnet?: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasDismissed && !sessionStorage.getItem('maju_exit_shown')) {
        setIsOpen(true);
        sessionStorage.setItem('maju_exit_shown', 'true');
      }
    };

    // Only activate after user has dwelled 7 seconds
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 7000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasDismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    StorageService.saveLead({
      name,
      phone,
      email: '',
      preferredContact: 'whatsapp',
      type: 'lead_magnet',
      message: 'Download do Guia de Financiamento e Oportunidades 2025/2026'
    });

    setDownloaded(true);

    const msg = encodeURIComponent(
      `Olá Maria Júlia, solicitei o download do "Guia Exclusivo de Financiamento e Oportunidades em SC" pelo portal. Meu nome é ${name}. Poderia me enviar o PDF?`
    );
    setTimeout(() => {
      window.open(`https://wa.me/5548991827701?text=${msg}`, '_blank');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white border border-neutral-200 rounded-2xl max-w-md w-full shadow-2xl p-6 sm:p-8 text-neutral-900">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {downloaded ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-neutral-950">
              Guia a caminho!
            </h3>
            <p className="text-xs text-neutral-600">
              Estamos redirecionando para seu WhatsApp para enviar o PDF completo gratuitamente.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-5 py-2 rounded-lg bg-neutral-950 text-white text-xs font-semibold cursor-pointer"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-300 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800 block">
                Antes de você ir embora...
              </span>
              <h3 className="font-serif text-2xl font-bold text-neutral-950 leading-tight">
                Baixe Grátis o Guia Definitivo do Imóvel em SC
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Descubra os 5 erros fatais ao comprar imóvel na planta e como aprovar seu financiamento Caixa com as menores taxas do mercado.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu primeiro nome"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Seu WhatsApp (Ex: 48 99999-9999)"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-neutral-950 bg-amber-400 hover:bg-amber-500 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Receber Guia em PDF no WhatsApp</span>
              </button>
            </form>

            <div className="text-center text-[10px] text-neutral-500">
              Sem spam. Respeitamos 100% a sua privacidade segundo a LGPD.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
