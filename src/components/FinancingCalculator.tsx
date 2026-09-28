import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Building, Landmark, ChevronRight, MessageCircle } from 'lucide-react';
import { PortalContent } from '../types/property';

interface FinancingCalculatorProps {
  portal: PortalContent;
  defaultPropertyValue?: number;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  portal,
  defaultPropertyValue = 850000
}) => {
  const [propertyValue, setPropertyValue] = useState<number>(defaultPropertyValue);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30); // 360 months
  const [system, setSystem] = useState<'SAC' | 'PRICE'>('SAC');
  const [annualRate, setAnnualRate] = useState<number>(10.2); // 10.2% a.a.

  const calculation = useMemo(() => {
    const downPayment = (propertyValue * downPaymentPercent) / 100;
    const loanAmount = propertyValue - downPayment;
    const totalMonths = termYears * 12;
    const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;

    let firstPayment = 0;
    let lastPayment = 0;

    if (system === 'SAC') {
      const principalAmortization = loanAmount / totalMonths;
      const firstInterest = loanAmount * monthlyRate;
      firstPayment = principalAmortization + firstInterest;
      const lastInterest = principalAmortization * monthlyRate;
      lastPayment = principalAmortization + lastInterest;
    } else {
      // PRICE table
      firstPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      lastPayment = firstPayment;
    }

    // Required gross monthly income (installments consume at most 30% of gross income)
    const requiredIncome = firstPayment / 0.3;

    return {
      downPayment,
      loanAmount,
      totalMonths,
      firstPayment,
      lastPayment,
      requiredIncome
    };
  }, [propertyValue, downPaymentPercent, termYears, system, annualRate]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const presets = [
    { label: 'R$ 450 mil', val: 450000 },
    { label: 'R$ 750 mil', val: 750000 },
    { label: 'R$ 1.2 milhão', val: 1200000 },
    { label: 'R$ 2.5 milhões', val: 2500000 }
  ];

  const handleWhatsappLead = () => {
    const msg = encodeURIComponent(
      `Olá Maria Júlia, fiz uma simulação no seu simulador oficial:\n\n` +
      `🏠 *Valor do Imóvel*: ${formatCurrency(propertyValue)}\n` +
      `💵 *Entrada sugerida*: ${formatCurrency(calculation.downPayment)} (${downPaymentPercent}%)\n` +
      `🏦 *Valor Financiado*: ${formatCurrency(calculation.loanAmount)}\n` +
      `📅 *Prazo*: ${termYears} anos (${calculation.totalMonths} meses)\n` +
      `📊 *Sistema*: Tabela ${system}\n` +
      `💰 *1ª Parcela Estimada*: ${formatCurrency(calculation.firstPayment)}\n\n` +
      `Gostaria de solicitar a análise do meu crédito bancário com aprovação em 24h!`
    );
    window.open(`https://wa.me/${portal.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <section id="financiamento" className="py-24 bg-[#f8f7f4] border-t border-neutral-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 mb-3 shadow-2xs">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>Simulador de Crédito Imobiliário Caixa & Bancos</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950">
            Descubra o valor ideal para sua <span className="gold-gradient-text">conquista</span>
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto">
            Simule parcelas e planeje a compra do seu imóvel com as taxas atualizadas do mercado e suporte completo para aprovação em 24 horas.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-xl space-y-6">
            
            {/* Value Presets */}
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Valores Frequentes:
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setPropertyValue(p.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      propertyValue === p.val
                        ? 'bg-amber-400 text-neutral-950 shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Value Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-neutral-900">
                  Valor do Imóvel
                </label>
                <span className="font-serif text-xl font-bold text-neutral-950 tabular-nums">
                  {formatCurrency(propertyValue)}
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={5000000}
                step={25000}
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>R$ 200 mil</span>
                <span>R$ 5 milhões</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-neutral-900">
                  Entrada ({downPaymentPercent}%)
                </label>
                <span className="font-serif text-lg font-bold text-amber-900 tabular-nums">
                  {formatCurrency(calculation.downPayment)}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>10% (mínimo)</span>
                <span>60%</span>
              </div>
            </div>

            {/* Term in Years */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-neutral-900">
                  Prazo de Financiamento
                </label>
                <span className="font-bold text-neutral-900 text-sm tabular-nums">
                  {termYears} anos ({calculation.totalMonths} meses)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 25, 30, 35].slice(0, 4).map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setTermYears(y)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      termYears === y
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    {y} anos
                  </button>
                ))}
              </div>
            </div>

            {/* System Selection: SAC vs PRICE */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-900 block">
                Sistema de Amortização
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSystem('SAC')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    system === 'SAC'
                      ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-bold text-xs text-neutral-950">Tabela SAC (Recomendado)</div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">Parcelas decrescentes mês a mês</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSystem('PRICE')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    system === 'PRICE'
                      ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-bold text-xs text-neutral-950">Tabela PRICE</div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">Parcelas fixas durante todo o contrato</div>
                </button>
              </div>
            </div>

          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 rounded-2xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-2xl space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Resultado da Simulação
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Estimativa de Parcelas
              </h3>
            </div>

            {/* Primary Payment Card */}
            <div className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">
              <span className="text-xs text-neutral-300 block">
                {system === 'SAC' ? '1ª Parcela Estimada (SAC)' : 'Parcela Mensal Fixa (PRICE)'}
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-amber-300 tabular-nums mt-1">
                {formatCurrency(calculation.firstPayment)}
              </div>
              {system === 'SAC' && (
                <div className="text-xs text-neutral-400 mt-1">
                  Última parcela estimada: <span className="text-white font-medium">{formatCurrency(calculation.lastPayment)}</span>
                </div>
              )}
            </div>

            {/* Breakdown Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-neutral-400">Valor Financiado:</span>
                <span className="font-bold text-white tabular-nums">{formatCurrency(calculation.loanAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-neutral-400">Entrada sugerida ({downPaymentPercent}%):</span>
                <span className="font-bold text-amber-300 tabular-nums">{formatCurrency(calculation.downPayment)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-neutral-400">Renda Familiar Bruta Recomendada:</span>
                <span className="font-bold text-white tabular-nums">{formatCurrency(calculation.requiredIncome)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-400">Taxa de Juros Estimada:</span>
                <span className="font-bold text-white tabular-nums">{annualRate}% a.a.</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleWhatsappLead}
              className="w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg hover:shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-neutral-950" />
              <span>Enviar Simulação para Aprovação</span>
            </button>

            <div className="text-[11px] text-neutral-400 text-center leading-relaxed">
              * Valores simulados para referência. A análise de crédito oficial é realizada gratuitamente com o correspondente bancário Caixa.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
