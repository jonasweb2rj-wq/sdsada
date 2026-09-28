import React from 'react';
import { Quote, CheckCircle, ShieldCheck, Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Leonardo e Fernanda Silveira',
      role: 'Compradores de Cobertura Beira-Mar',
      location: 'Balneário Rincão, SC',
      outcome: 'Negociação fechada em 18 dias com total segurança na escritura',
      text: 'Buscávamos uma cobertura no Rincão há mais de um ano. A Maria Júlia encontrou uma oportunidade antes mesmo de ser anunciada ao público geral. O suporte na análise do contrato e na transferência foi impecável. Hoje nossa família desfruta do melhor verão da vida.',
    },
    {
      name: 'Marcelo Zanatta',
      role: 'Investidor Imobiliário',
      location: 'Criciúma, SC',
      outcome: 'Portfólio com 3 imóveis e valorização média comprovada',
      text: 'Como investidor, preciso de números reais, liquidez e segurança jurídica. A consultoria da Maju vai muito além de mostrar imóveis; ela entende as tendências viárias e o plano diretor de Criciúma e do Rincão. Confiança total em cada indicação.',
    },
    {
      name: 'Carla e Tiago Meneghel',
      role: 'Primeiro Imóvel Próprio',
      location: 'Bairro Pio Corrêa, Criciúma',
      outcome: 'Financiamento Caixa aprovado em menos de 24 horas',
      text: 'O medo do processo de financiamento era enorme, mas a Maria Júlia cuidou de cada certidão. Quando vimos, as chaves estavam na nossa mão sem nenhuma dor de cabeça. O atendimento dela é realmente acolhedor e ágil.',
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-800">
            Histórias Reais de Sucesso
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 mt-2 mb-3">
            O que dizem os clientes que já <span className="gold-gradient-text">conquistaram seus lares</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base">
            Transparência, dedicação e resultados comprovados em Criciúma e Balneário Rincão.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#faf9f6] rounded-2xl p-7 sm:p-8 border border-neutral-200/90 shadow-xs flex flex-col justify-between space-y-5 hover:border-amber-400 hover:shadow-xl hover:shadow-neutral-900/5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Quote className="w-8 h-8 text-amber-600/40 stroke-1 group-hover:text-amber-600 transition-colors" />
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/80">
                <div className="font-serif font-bold text-neutral-950 text-base">
                  {item.name}
                </div>
                <div className="text-xs text-amber-800 font-semibold mt-0.5">
                  {item.role} · {item.location}
                </div>
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md px-2.5 py-1 inline-flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{item.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
