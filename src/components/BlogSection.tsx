import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  X,
  Lightbulb,
  Building,
  Flame,
  MessageCircle,
  Calendar,
  Share2,
  Check,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Property, BlogPost } from '../types/property';
import { getAllBlogPosts } from '../services/blogGenerator';

interface BlogSectionProps {
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
  onScheduleVisit?: (property: Property) => void;
}

type BlogFilter = 'all' | 'properties' | 'criciuma' | 'rincao' | 'financing';

export const BlogSection: React.FC<BlogSectionProps> = ({
  properties,
  onSelectProperty,
  onScheduleVisit
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeFilter, setActiveFilter] = useState<BlogFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Automatically generate dynamic blog posts from registered properties in real time
  const allPosts = useMemo(() => {
    return getAllBlogPosts(properties);
  }, [properties]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: allPosts.length,
      properties: allPosts.filter((p) => Boolean(p.relatedProperty)).length,
      criciuma: allPosts.filter(
        (p) => p.relatedProperty?.city === 'Criciúma' || p.category.includes('Criciúma')
      ).length,
      rincao: allPosts.filter(
        (p) => p.relatedProperty?.city === 'Balneário Rincão' || p.category.includes('Rincão')
      ).length,
      financing: allPosts.filter(
        (p) => p.relatedProperty?.isBankFinancing || p.category.includes('Financiamento')
      ).length
    };
  }, [allPosts]);

  // Filtered posts based on active filter & search query
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      // Filter logic
      if (activeFilter === 'properties' && !post.relatedProperty) return false;
      if (
        activeFilter === 'criciuma' &&
        post.relatedProperty?.city !== 'Criciúma' &&
        !post.category.includes('Criciúma')
      )
        return false;
      if (
        activeFilter === 'rincao' &&
        post.relatedProperty?.city !== 'Balneário Rincão' &&
        !post.category.includes('Rincão')
      )
        return false;
      if (
        activeFilter === 'financing' &&
        !post.relatedProperty?.isBankFinancing &&
        !post.category.includes('Financiamento')
      )
        return false;

      // Search logic
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchExcerpt = post.excerpt.toLowerCase().includes(q);
        const matchCategory = post.category.toLowerCase().includes(q);
        const matchCode = post.propertyCode?.toLowerCase().includes(q) || false;
        const matchNeighborhood =
          post.relatedProperty?.neighborhood.toLowerCase().includes(q) || false;
        return matchTitle || matchExcerpt || matchCategory || matchCode || matchNeighborhood;
      }

      return true;
    });
  }, [allPosts, activeFilter, searchQuery]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleOpenPropertyWhatsApp = (post: BlogPost) => {
    const prop = post.relatedProperty;
    const msg = prop
      ? `Olá Maria Júlia, li a dica no seu blog sobre o imóvel ${prop.code} - ${prop.title} (${prop.neighborhood}, ${prop.city}) e tenho muito interesse em fazer uma proposta/receber detalhes!`
      : `Olá Maria Júlia, li o artigo "${post.title}" no seu portal e gostaria de tirar dúvidas sobre as oportunidades em SC.`;
    window.open(`https://wa.me/5548991827701?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="blog" className="py-20 bg-[#f8f7f4] border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Dicas de Ouro & Análises por Imóvel</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950">
              Blog & Guia dos <span className="gold-gradient-text">Imóveis Selecionados</span>
            </h2>
            <p className="text-neutral-600 text-sm max-w-xl mt-2 leading-relaxed">
              Dicas exclusivas da Corretora Maria Júlia para cada imóvel do catálogo, análises de rentabilidade, valorização de bairros e facilidades de financiamento.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar dica, código ou bairro..."
              className="w-full bg-white border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Dynamic Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeFilter === 'all'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span>Todos os Artigos & Dicas</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-neutral-800 text-amber-300 text-[10px] font-mono">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('properties')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeFilter === 'properties'
                ? 'bg-amber-400 text-neutral-950 border border-amber-500'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-amber-800" />
            <span>Dicas por Imóvel</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
              {counts.properties}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('criciuma')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeFilter === 'criciuma'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span>Criciúma ({counts.criciuma})</span>
          </button>

          <button
            onClick={() => setActiveFilter('rincao')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeFilter === 'rincao'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span>Balneário Rincão ({counts.rincao})</span>
          </button>

          <button
            onClick={() => setActiveFilter('financing')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeFilter === 'financing'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span>Financiamento & Crédito ({counts.financing})</span>
          </button>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto" />
            <div className="font-serif text-lg font-bold text-neutral-950">
              Nenhuma dica encontrada com os filtros atuais
            </div>
            <p className="text-xs text-neutral-600">
              Tente redefinir a busca ou selecione "Todos os Artigos & Dicas".
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-amber-400 text-neutral-950 text-xs font-bold shadow-2xs cursor-pointer hover:bg-amber-500"
            >
              Ver Todas as Dicas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const prop = post.relatedProperty;
              const formattedPrice = prop
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    maximumFractionDigits: 0
                  }).format(prop.price)
                : null;

              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-lg relative"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-sm">
                      {prop && <Building className="w-3 h-3 text-amber-400" />}
                      <span>{post.category}</span>
                    </div>

                    {/* Property Code Badge if linked */}
                    {post.propertyCode && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-xs">
                        {post.propertyCode}
                      </div>
                    )}

                    {/* Highlight pill */}
                    {prop && (
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-neutral-900 border border-neutral-200/90 shadow-2xs">
                        {formattedPrice} · {prop.neighborhood}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{post.readTime} de leitura</span>
                        <span>·</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-neutral-950 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Golden tip teaser pill */}
                    {post.brokerGoldenTip && (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-amber-950 font-medium line-clamp-2">
                          {post.brokerGoldenTip.replace('💡 Dica de Ouro da Corretora Maria Júlia (CRECI 77301-F):', '').trim()}
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
                      <span>Ver Análise & Dicas de Fechamento</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* Blog Article Reader Modal with Closing Machine Tools */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-neutral-900">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {selectedPost.category} · {selectedPost.readTime}
                </span>
                {selectedPost.propertyCode && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-900 font-bold">
                    {selectedPost.propertyCode}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Compartilhar dica"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
                </button>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 flex-1">
              
              {/* Title & Author Info */}
              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span>Por <strong>Maria Júlia Gamba</strong> (CRECI/SC 77301-F)</span>
                  <span>·</span>
                  <span>{new Date(selectedPost.publishedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden aspect-video bg-neutral-100 border border-neutral-200 shadow-2xs">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Urgency Hook */}
              {selectedPost.urgencyHook && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                  <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{selectedPost.urgencyHook}</span>
                </div>
              )}

              {/* Golden Tip from Broker Maria Júlia */}
              {selectedPost.brokerGoldenTip && (
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    <span>Dica de Ouro de Maria Júlia</span>
                  </div>
                  <p className="text-xs text-neutral-800 leading-relaxed font-normal">
                    {selectedPost.brokerGoldenTip}
                  </p>
                </div>
              )}

              {/* Highlights List if available */}
              {selectedPost.highlights && selectedPost.highlights.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#faf9f6] border border-neutral-200 space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-950 block">
                    Por Que Vale a Pena Este Negócio:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                    {selectedPost.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="text-sm text-neutral-800 space-y-4 leading-relaxed whitespace-pre-line border-t border-b border-neutral-100 py-4 font-normal">
                {selectedPost.content}
              </div>

              {/* IN-ARTICLE PROPERTY SHOWCASE & DIRECT CLOSING MACHINE */}
              {selectedPost.relatedProperty && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-neutral-50 border-2 border-amber-300 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800 block">
                        Imóvel Recomendado Nesta Análise
                      </span>
                      <h4 className="font-serif text-lg font-bold text-neutral-950">
                        {selectedPost.relatedProperty.title}
                      </h4>
                      <div className="text-xs text-neutral-600">
                        {selectedPost.relatedProperty.neighborhood}, {selectedPost.relatedProperty.city} · Código: <strong className="font-mono text-neutral-900">{selectedPost.relatedProperty.code}</strong>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[11px] text-neutral-500 uppercase block font-medium">Valor de Oportunidade</span>
                      <div className="font-serif text-2xl font-bold text-neutral-950 tabular-nums">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0
                        }).format(selectedPost.relatedProperty.price)}
                      </div>
                    </div>
                  </div>

                  {/* Property Quick Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-1">
                    <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center">
                      <span className="text-neutral-500 block text-[10px]">Área Privativa</span>
                      <strong className="text-neutral-900 font-serif text-sm">{selectedPost.relatedProperty.privateArea} m²</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center">
                      <span className="text-neutral-500 block text-[10px]">Dormitórios</span>
                      <strong className="text-neutral-900 font-serif text-sm">{selectedPost.relatedProperty.bedrooms} ({selectedPost.relatedProperty.suites} suítes)</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center">
                      <span className="text-neutral-500 block text-[10px]">Garagem</span>
                      <strong className="text-neutral-900 font-serif text-sm">{selectedPost.relatedProperty.garageSpots} vagas</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-neutral-200 text-center">
                      <span className="text-neutral-500 block text-[10px]">Condição</span>
                      <strong className="text-emerald-700 font-serif text-sm">
                        {selectedPost.relatedProperty.isBankFinancing ? 'Aceita Financiamento' : 'Direto Construtora'}
                      </strong>
                    </div>
                  </div>

                  {/* Triple Closing CTA Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={() => handleOpenPropertyWhatsApp(selectedPost)}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Fazer Proposta no WhatsApp</span>
                    </button>

                    {onScheduleVisit && (
                      <button
                        onClick={() => {
                          const prop = selectedPost.relatedProperty;
                          if (prop) {
                            setSelectedPost(null);
                            onScheduleVisit(prop);
                          }
                        }}
                        className="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Agendar Visita</span>
                      </button>
                    )}

                    {onSelectProperty && (
                      <button
                        onClick={() => {
                          const prop = selectedPost.relatedProperty;
                          if (prop) {
                            setSelectedPost(null);
                            onSelectProperty(prop);
                          }
                        }}
                        className="py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors border border-neutral-300"
                      >
                        <span>Ver Ficha Completa</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Modal Footer */}
            <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                Atendimento Oficial: <strong>Maria Júlia Gamba · CRECI/SC 77301-F</strong>
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-lg bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 cursor-pointer"
              >
                Fechar Artigo
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
