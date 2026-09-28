import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  MessageCircle,
  Instagram,
  Home,
  Calculator,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Property, PortalContent } from '../types/property';
import assistantAvatar from '../assets/images/assistente_corretora_avatar_1790520813664.jpg';

interface AssistantWidgetProps {
  portal: PortalContent;
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
  onScheduleVisit?: (property?: Property) => void;
  onNavigate?: (sectionId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  ctaType?: 'whatsapp' | 'instagram' | 'properties' | 'schedule' | 'all';
  suggestedProperty?: Property;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({
  portal,
  properties,
  onSelectProperty,
  onScheduleVisit,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const whatsappUrl = `https://wa.me/${portal.whatsapp}?text=${encodeURIComponent(
    'Olá Maria Júlia, conversei com sua Assistente no site e gostaria de atendimento exclusivo para comprar/investir em imóveis.'
  )}`;
  const instagramUrl = 'https://www.instagram.com/majudgamba';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Olá! Sou a **Assistente Virtual da Corretora Maria Júlia Gamba** (CRECI 77301-F). 

Estou aqui para te orientar sobre os melhores imóveis em **Criciúma e Balneário Rincão**, explicar regras de **financiamento bancário** e conectar você diretamente com a Maria Júlia. Como posso te ajudar hoje?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ctaType: 'all'
    }
  ]);

  const quickPrompts = [
    { label: '🏠 Imóveis Disponíveis', query: 'Quais imóveis estão disponíveis no catálogo?' },
    { label: '🏖️ Balneário Rincão', query: 'Quais são as opções de imóveis em Balneário Rincão?' },
    { label: '💰 Financiamento Caixa', query: 'Como funciona o financiamento bancário Caixa?' },
    { label: '📍 Melhores Bairros', query: 'Quais os melhores bairros para morar em Criciúma?' },
    { label: '💬 Falar com Maria Júlia', query: 'Quero falar diretamente com a Maria Júlia no WhatsApp' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateAssistantAnswer = (userQuery: string): { text: string; ctaType: 'whatsapp' | 'instagram' | 'properties' | 'schedule' | 'all'; property?: Property } => {
    const q = userQuery.toLowerCase();
    const activeProps = properties.filter((p) => !p.isDeleted);

    // 1. WhatsApp / Contact direct intent
    if (q.includes('whatsapp') || q.includes('falar') || q.includes('contato') || q.includes('telefone') || q.includes('celular') || q.includes('maria júlia')) {
      return {
        text: `Com certeza! A corretora **Maria Júlia Gamba** atende prontamente no WhatsApp oficial **(48) 99182-7701** para tirar dúvidas, fazer simulações personalizadas e agendar visitas aos imóveis. Clique no botão abaixo para iniciar a conversa!`,
        ctaType: 'whatsapp'
      };
    }

    // 2. Instagram intent
    if (q.includes('instagram') || q.includes('rede social') || q.includes('feed') || q.includes('foto') || q.includes('vídeo') || q.includes('stories')) {
      return {
        text: `Você pode acompanhar os bastidores, novidades e vídeos exclusivos de cada imóvel no Instagram oficial da corretora: **@majudgamba**! Lá tem tours em vídeo e dicas semanais do mercado.`,
        ctaType: 'instagram'
      };
    }

    // 3. Balneário Rincão intent
    if (q.includes('rincão') || q.includes('praia') || q.includes('mar') || q.includes('litoral')) {
      const rincaoProp = activeProps.find((p) => p.city === 'Balneário Rincão');
      return {
        text: `Balneário Rincão está passando por uma valorização fantástica com a nova beira-mar e alta procura por lazer e temporada! ${
          rincaoProp
            ? `Temos por exemplo o **${rincaoProp.title}** por ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(rincaoProp.price)}.`
            : 'Temos opções exclusivas na orla e condomínios fechados.'
        } A Maria Júlia pode te enviar o dossiê completo pelo WhatsApp!`,
        ctaType: 'whatsapp',
        property: rincaoProp
      };
    }

    // 4. Financing Caixa intent
    if (q.includes('financiamento') || q.includes('caixa') || q.includes('banco') || q.includes('entrada') || q.includes('fgts') || q.includes('parcela')) {
      return {
        text: `A Maria Júlia é credenciada e cuida de toda a esteira de financiamento bancário pela Caixa Econômica sem nenhum custo adicional! Você pode financiar até 80% do valor com parcelas decrescentes ou fixas, utilizar saldo do FGTS para a entrada e compor renda familiar. Aprovação ágil em até 24 horas!`,
        ctaType: 'whatsapp'
      };
    }

    // 5. Criciúma / Bairros intent
    if (q.includes('criciúma') || q.includes('michel') || q.includes('pio corrêa') || q.includes('centro') || q.includes('bairro')) {
      const criciumaProp = activeProps.find((p) => p.city === 'Criciúma');
      return {
        text: `Em Criciúma, os bairros mais nobres e valorizados são o **Bairro Michel**, **Pio Corrêa** e **Cruzeiro do Sul**. São regiões arborizadas, com segurança 24h, colégios renomados e clínicas de alto padrão. ${
          criciumaProp ? `Destaque para o imóvel **${criciumaProp.title}** (${criciumaProp.neighborhood}).` : ''
        } Fale com a Maria Júlia para agendar uma visita guiada aos imóveis disponíveis!`,
        ctaType: 'whatsapp',
        property: criciumaProp
      };
    }

    // 6. Imóveis / Catálogo intent
    if (q.includes('imóve') || q.includes('apartamento') || q.includes('casa') || q.includes('cobertura') || q.includes('terreno') || q.includes('catálogo') || q.includes('preço')) {
      const featured = activeProps[0];
      return {
        text: `Temos atualmente **${activeProps.length} imóveis exclusivos** cadastrados no catálogo, entre apartamentos de alto padrão, coberturas panorâmicas e casas com área de lazer privativa em Criciúma e Balneário Rincão. Todos com documentação 100% checada! Você pode navegar pelo portal ou pedir uma seleção personalizada sob medida para o seu orçamento no WhatsApp.`,
        ctaType: 'all',
        property: featured
      };
    }

    // 7. Visita intent
    if (q.includes('visita') || q.includes('agendar') || q.includes('horário') || q.includes('conhecer')) {
      return {
        text: `As visitas presenciais são agendadas com exclusividade e acompanhadas pessoalmente pela Corretora Maria Júlia Gamba (CRECI 77301-F). Podemos agendar durante a semana ou no fim de semana conforme a sua conveniência!`,
        ctaType: 'schedule'
      };
    }

    // Default polite response
    return {
      text: `Excelente pergunta! Todos os nossos imóveis contam com assessoria jurídica e documentação regularizada. Para que possamos te passar valores exatos, fotos em alta resolução e condições de pagamento, chame a **Maria Júlia diretamente no WhatsApp** ou nos siga no **Instagram @majudgamba**!`,
      ctaType: 'all'
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setHasInteracted(true);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAssistantAnswer(query);
      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        ctaType: response.ctaType,
        suggestedProperty: response.property
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom-Left) - Sleek, non-intrusive, luxury avatar */}
      <div className="fixed bottom-[74px] sm:bottom-6 left-3.5 sm:left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 p-1.5 sm:pr-4 rounded-full bg-white/95 hover:bg-white text-neutral-900 shadow-xl border border-amber-300 hover:border-amber-400 transition-all duration-300 hover:scale-[1.03] cursor-pointer backdrop-blur-md"
          title="Assistente Corretora - Tire dúvidas 24h"
          aria-label="Assistente Corretora"
        >
          {/* Realistic Avatar with Glowing Status */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 border-amber-400 shadow-xs">
            <img
              src={assistantAvatar}
              alt="Assistente Corretora"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            {/* Green online pulse indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          {/* Label (Visible on sm screens and up, compact on small mobile) */}
          <div className="hidden sm:flex flex-col text-left pr-1">
            <div className="flex items-center gap-1">
              <span className="font-serif text-xs font-bold text-neutral-950 group-hover:text-amber-800 transition-colors">
                Assistente Corretora
              </span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <span className="text-[10px] text-neutral-500 font-medium -mt-0.5">
              Online · Dúvidas & Imóveis
            </span>
          </div>

          {/* Notification dot if hasn't interacted */}
          {!hasInteracted && !isOpen && (
            <span className="flex h-2.5 w-2.5 relative -ml-1 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          )}
        </button>
      </div>

      {/* CHAT WINDOW DRAWER (Non-intrusive, perfectly sized) */}
      {isOpen && (
        <div className="fixed bottom-[74px] sm:bottom-20 left-3 sm:left-6 z-50 w-[calc(100vw-24px)] sm:w-[390px] max-h-[calc(100dvh-95px)] sm:max-h-[560px] flex flex-col bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-fade-in font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950 px-4 py-3.5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400/80 shadow-xs shrink-0">
                <img
                  src={assistantAvatar}
                  alt="Assistente Corretora"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm text-amber-100">
                    Assistente Corretora
                  </h4>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                    IA Maria Júlia
                  </span>
                </div>
                <div className="text-[10px] text-neutral-300 flex items-center gap-1">
                  <span>Atendimento oficial</span>
                  <span>·</span>
                  <span className="font-mono text-amber-400">CRECI 77301-F</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fechar assistente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fbfaf8] max-h-[360px] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-br-2xs'
                      : 'bg-white text-neutral-800 border border-neutral-200 shadow-2xs rounded-bl-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Property Card Recommendation Snippet inside response if applicable */}
                  {msg.suggestedProperty && (
                    <div
                      onClick={() => {
                        if (onSelectProperty && msg.suggestedProperty) {
                          onSelectProperty(msg.suggestedProperty);
                          setIsOpen(false);
                        }
                      }}
                      className="mt-2.5 p-2 rounded-xl bg-amber-50/80 border border-amber-300/80 flex items-center gap-2 hover:bg-amber-100/80 transition-colors cursor-pointer"
                    >
                      <img
                        src={msg.suggestedProperty.images[0]}
                        alt={msg.suggestedProperty.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-serif font-bold text-[11px] text-neutral-950 truncate">
                          {msg.suggestedProperty.title}
                        </div>
                        <div className="text-[10px] text-neutral-600">
                          {msg.suggestedProperty.neighborhood} · {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(msg.suggestedProperty.price)}
                        </div>
                        <span className="text-[9px] font-bold text-amber-800">
                          Ver Detalhes do Imóvel →
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Immediate Closing CTAs: WhatsApp & Instagram & Scheduling */}
                  {msg.sender === 'assistant' && msg.ctaType && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-col gap-1.5">
                      {(msg.ctaType === 'whatsapp' || msg.ctaType === 'all') && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Falar no WhatsApp com Maria Júlia</span>
                        </a>
                      )}

                      {(msg.ctaType === 'instagram' || msg.ctaType === 'all') && (
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-semibold text-[11px] transition-opacity shadow-2xs cursor-pointer"
                        >
                          <Instagram className="w-3.5 h-3.5 text-white" />
                          <span>Seguir @majudgamba no Instagram</span>
                        </a>
                      )}

                      {msg.ctaType === 'schedule' && onScheduleVisit && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onScheduleVisit();
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Agendar Visita com a Corretora</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-neutral-200 text-neutral-500 text-xs w-28 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1 text-neutral-400">Digitando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips */}
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer border border-neutral-200 shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida sobre os imóveis..."
              className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-400 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-30 text-white transition-colors cursor-pointer shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
