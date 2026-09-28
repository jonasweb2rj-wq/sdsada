import React from 'react';
import { Award, Users, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';
import { PortalContent } from '../types/property';

interface MetricsSectionProps {
  portal: PortalContent;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ portal }) => {
  const stats = [
    {
      label: 'Volume Transacionado',
      value: `R$ ${portal.soldVolumeMillions}M+`,
      detail: 'Em imóveis de alto padrão no Sul Catarinense',
      icon: TrendingUp,
      highlight: 'Solidez Financeira'
    },
    {
      label: 'Famílias & Investidores',
      value: `${portal.satisfiedClientsCount}+`,
      detail: 'Clientes com assessoria jurídica e escritura entregue',
      icon: Users,
      highlight: 'Satisfação 100%'
    },
    {
      label: 'Pré-Aprovação de Crédito',
      value: '24 Horas',
      detail: 'Canal exclusivo com correspondente bancário Caixa',
      icon: CheckCircle,
      highlight: 'Agilidade Total'
    },
    {
      label: 'Registro Profissional',
      value: portal.creci,
      detail: 'Corretora credenciada no CRECI 11ª Região/SC',
      icon: ShieldCheck,
      highlight: 'Segurança Jurídica'
    }
  ];

  return (
    <section className="border-y border-neutral-200/80 bg-white/90 backdrop-blur-md py-14 shadow-2xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200/70">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col space-y-1.5 ${
                  idx > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''
                } group`}
              >
                <div className="flex items-center gap-2 text-amber-700 mb-1">
                  <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800">
                    {stat.highlight}
                  </span>
                </div>
                
                <div className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 tabular-nums tracking-tight group-hover:text-amber-800 transition-colors">
                  {stat.value}
                </div>
                
                <div className="text-sm font-semibold text-neutral-900">
                  {stat.label}
                </div>
                
                <div className="text-xs text-neutral-600 font-normal leading-relaxed">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
