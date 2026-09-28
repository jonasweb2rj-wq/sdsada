import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  initialTab?: 'privacy' | 'terms' | 'cookies';
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialTab = 'privacy',
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif font-bold text-neutral-950 text-lg">
              Conformidade Legal & LGPD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200 bg-neutral-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Política de Privacidade
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Termos de Uso
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`py-2 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'cookies'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Política de Cookies
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 overflow-y-auto text-xs text-neutral-700 leading-relaxed space-y-4">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-neutral-950 text-base">
                Política de Privacidade Imobiliária · LGPD (Lei 13.709/2018)
              </h4>
              <p>
                A corretora de imóveis <strong>Maria Júlia Gamba (CRECI/SC 77301-F)</strong> preza pela transparência, privacidade e segurança dos dados pessoais de seus clientes, compradores, proprietários e investidores em Criciúma e Balneário Rincão.
              </p>
              
              <h5 className="font-semibold text-neutral-950 text-sm">1. Dados Coletados e Finalidade</h5>
              <p>
                Os dados fornecidos em formulários de agendamento de visita, simulador de crédito e contato via WhatsApp (nome, telefone, e-mail, faixa de renda declarada para simulação bancária) têm a finalidade exclusiva de:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Prestar consultoria imobiliária personalizada;</li>
                <li>Agendar e realizar vistorias presenciais ou virtuais;</li>
                <li>Simular e encaminhar propostas de financiamento bancário para bancos autorizados (Caixa Econômica Federal, Itaú, Santander, etc.), sempre com expressa anuência do titular;</li>
                <li>Formalização de propostas de compra e venda e análise de certidões cartorárias.</li>
              </ul>

              <h5 className="font-semibold text-neutral-950 text-sm">2. Sigilo Profissional e Segurança</h5>
              <p>
                Em conformidade com as normas deontológicas do Conselho Federal de Corretores de Imóveis (COFECI) e do CRECI/SC, todas as informações de negociação, valores e propostas são tratadas com estrito sigilo. Nunca comercializamos seus dados com terceiros ou listas de telemarketing.
              </p>

              <h5 className="font-semibold text-neutral-950 text-sm">3. Seus Direitos</h5>
              <p>
                Você pode a qualquer momento solicitar a confirmação da existência de tratamento, correção de dados incompletos ou exclusão de seus contatos através do e-mail <strong>majudgamba@gmail.com</strong>.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-neutral-950 text-base">
                Termos de Uso do Portal Imobiliário
              </h4>
              <p>
                Ao navegar neste portal, o usuário concorda com os seguintes termos:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Valores e Disponibilidade:</strong> Os valores de venda, taxas de condomínio e IPTU dos imóveis estão sujeitos a confirmação junto aos proprietários e construtoras parceiras, podendo ser alterados sem aviso prévio.
                </li>
                <li>
                  <strong>Propriedade Intelectual:</strong> As imagens, plantas humanizadas, textos descritivos e a marca Maria Júlia Gamba são protegidos por direitos autorais, sendo vedada a reprodução comercial sem autorização expressa.
                </li>
                <li>
                  <strong>Simulações Financeiras:</strong> Os cálculos apresentados no Simulador de Crédito possuem caráter meramente estimativo e não configuram proposta vinculante ou compromisso bancário imediato, dependendo de análise cadastral e aprovação de crédito pelas instituições financeiras.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-neutral-950 text-base">
                Diretrizes de Cookies e Tecnologias de Rastreamento
              </h4>
              <p>
                Utilizamos cookies técnicos essenciais e analíticos anônimos para garantir que você possa navegar com velocidade e salvar seus imóveis favoritos.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-semibold text-neutral-900">Cookies de Sessão & Preferências:</div>
                  <p className="text-neutral-600 text-[11px]">Guardam os filtros aplicados e a preferência de tema para que sua navegação não seja interrompida.</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="font-semibold text-neutral-900">Cookies de Análise e Métricas:</div>
                  <p className="text-neutral-600 text-[11px]">Auxiliam a identificar quais bairros de Criciúma e Balneário Rincão despertam maior procura.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 flex justify-between items-center bg-neutral-50 text-[11px] text-neutral-500">
          <span>Última atualização: Setembro de 2026 · Criciúma/SC</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
