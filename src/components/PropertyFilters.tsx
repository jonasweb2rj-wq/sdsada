import React from 'react';
import { Building, Home, MapPin, Sparkles, Landmark } from 'lucide-react';

export type FilterCategory = 'all' | 'criciuma' | 'rincao' | 'financing' | 'builder' | 'featured';

interface PropertyFiltersProps {
  currentCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  counts: {
    all: number;
    criciuma: number;
    rincao: number;
    financing: number;
    builder: number;
    featured: number;
  };
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  currentCategory,
  onSelectCategory,
  counts
}) => {
  const tabs = [
    { id: 'all' as FilterCategory, label: 'Todos os Imóveis', count: counts.all, icon: Home },
    { id: 'criciuma' as FilterCategory, label: 'Criciúma', count: counts.criciuma, icon: Building },
    { id: 'rincao' as FilterCategory, label: 'Balneário Rincão', count: counts.rincao, icon: MapPin },
    { id: 'financing' as FilterCategory, label: 'Fin. Bancário', count: counts.financing, icon: Landmark },
    { id: 'builder' as FilterCategory, label: 'Construtora', count: counts.builder, icon: Building },
    { id: 'featured' as FilterCategory, label: 'Destaques & Exclusivos', count: counts.featured, icon: Sparkles }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentCategory === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-amber-400 text-neutral-950 border border-amber-500 shadow-sm'
                : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-300 shadow-2xs'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950 stroke-[2.2]' : 'text-neutral-500'}`} />
            <span>{tab.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                isActive ? 'bg-black/15 text-neutral-950 font-bold' : 'bg-neutral-100 text-neutral-600 font-semibold'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
