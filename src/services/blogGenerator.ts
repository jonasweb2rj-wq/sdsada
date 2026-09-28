import { Property, BlogPost } from '../types/property';
import { INITIAL_BLOG_POSTS } from '../data/initialProperties';

/**
 * Automatically creates dynamic, persuasive, high-converting blog posts and buyer tips
 * for every single property registered in the system (synced with Firestore).
 */
export const generatePropertyBlogPost = (property: Property): BlogPost => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(property.price);

  const isRincao = property.city === 'Balneário Rincão';
  const isHighEnd = property.price >= 1500000;

  // Determine smart category
  let category = 'Dica de Compra';
  if (isRincao) {
    category = 'Balneário Rincão';
  } else if (property.isBankFinancing) {
    category = 'Financiamento Facilitado';
  } else if (isHighEnd) {
    category = 'Alto Padrão Criciúma';
  }

  // Generate persuasive title
  let title = `Por Que o ${property.title} é uma das Melhores Oportunidades em ${property.city}`;
  if (property.type === 'Cobertura') {
    title = `Exclusividade nas Alturas: Dicas & Análise da Cobertura ${property.title} no ${property.neighborhood}`;
  } else if (property.type === 'Casa em Condomínio' || property.type === 'Casa') {
    title = `Viver com Conforto & Segurança: Conheça os Diferenciais de ${property.title} no ${property.neighborhood}`;
  } else if (property.isUrgentOffer) {
    title = `Oportunidade Única: Condições Especiais no ${property.title} (${property.neighborhood}, ${property.city})`;
  } else if (isRincao) {
    title = `Viva o Verão o Ano Todo: Guia Completo do ${property.title} em Balneário Rincão`;
  }

  // Persuasive Excerpt
  const excerpt = `Com ${property.privateArea}m² privativos, ${property.bedrooms} dormitórios (${property.suites} suíte${property.suites > 1 ? 's' : ''}) e ${property.garageSpots} vaga(s), este imóvel no bairro ${property.neighborhood} destaca-se pela sofisticação, localização estratégica e excelente custo-benefício por metro quadrado.`;

  // Broker Golden Tip
  const brokerGoldenTip = `💡 Dica de Ouro da Corretora Maria Júlia (CRECI 77301-F): O bairro ${property.neighborhood} em ${property.city} apresenta uma das maiores taxas de valorização imobiliária do Sul Catarinense. ${
    property.isBankFinancing
      ? 'Este imóvel aceita financiamento bancário com aprovação célere pela Caixa Econômica, permitindo compor renda familiar e abater recursos do FGTS na entrada.'
      : 'As condições diretas com a construtora proporcionam flexibilidade na entrada e excelente margem de negociação para propostas à vista.'
  } Não hesite em solicitar uma visita presencial para sentir a atmosfera do imóvel antes de tomar sua decisão.`;

  // Urgency Hook
  const urgencyHook = `🔥 Alta Procura: Imóveis com ${property.privateArea}m² e acabamento de alto padrão no ${property.neighborhood} costumam ser negociados rapidamente. Agende uma visita com Maria Júlia e garanta prioridade na proposta.`;

  // Highlights
  const highlights = [
    `Área privativa generosa de ${property.privateArea}m² com planta inteligente`,
    `${property.bedrooms} quartos confortáveis, sendo ${property.suites} suíte(s) privativa(s)`,
    `${property.garageSpots} vaga(s) de garagem privativa(s) e coberta(s)`,
    `Localização privilegiada no ${property.neighborhood}, próximo aos principais pontos de ${property.city}`,
    property.isBankFinancing ? 'Aceita Financiamento Bancário com assessoria completa' : 'Facilidade de negociação direta'
  ];

  // Full Rich Article Body
  const content = `
### 1. Uma Oportunidade Selecionada a Dedo

Encontrar um imóvel que equilibre localização nobre, espaço generoso e valorização garantida é um privilégio. O **${property.title}** (Código **${property.code}**) reúne exatamente esses atributos em ${property.city}.

Com **${property.privateArea}m² de área privativa**, cada ambiente foi planejado para maximizar a iluminação natural e a ventilação cruzada. São **${property.bedrooms} dormitórios** (sendo **${property.suites} suíte${property.suites > 1 ? 's' : ''}**), perfeitos para proporcionar privacidade e descanso a toda a família.

### 2. Por Que o Bairro ${property.neighborhood} se Destaca

A localização é o primeiro fator de valorização de qualquer patrimônio imobiliário. O bairro **${property.neighborhood}** oferece infraestrutura completa, tranquilidade residencial e proximidade às melhores escolas, centros de saúde, restaurantes e vias de acesso rápido.

${
  isRincao
    ? 'Em Balneário Rincão, a proximidade com a praia e a orla revitalizada transforma esta propriedade no refúgio ideal para os fins de semana ou para residência fixa com qualidade de vida superior.'
    : `Em Criciúma, o ${property.neighborhood} é tradicionalmente sinônimo de status e liquidez garantida no mercado secundário.`
}

### 3. Diferenciais Construtivos & Lazer

Dentre os principais atrativos desta propriedade, destacam-se:
${property.features.map((f) => `• **${f}**`).join('\n')}

Além disso, conta com **${property.garageSpots} vaga(s) de garagem** privativas, garantindo praticidade absoluta no dia a dia.

### 4. Análise de Viabilidade Financeira

Com valor de venda de **${formattedPrice}**, o custo por metro quadrado está altamente competitivo frente aos lançamentos recentes da região.
${
  property.condoFee
    ? `O condomínio com taxa estimada em **R$ ${property.condoFee}/mês** oferece excelente relação custo-benefício pela infraestrutura entregue.`
    : ''
}

${
  property.isBankFinancing
    ? '✅ **Financiamento Bancário Descomplicado**: Este imóvel está 100% regularizado para financiamento bancário pela Caixa Econômica Federal e outros bancos. Com entrada a partir de 20%, as parcelas cabem confortavelmente no orçamento familiar.'
    : '✅ **Negociação Direta & Flexível**: Possibilidade de parcelamento direto ou análise de permuta sob consulta com a corretora.'
}

### 5. Como Dar o Próximo Passo para Fechar Este Negócio

O processo de compra com a **Corretora Maria Júlia (CRECI/SC 77301-F)** é transparente, ágil e sem dores de cabeça burocráticas:
1. **Agendamento de Visita**: Conheça o imóvel presencialmente ou solicite uma vídeochamada ao vivo guiada.
2. **Simulação Personalizada**: Receba um estudo de viabilidade financeira e cálculo de parcelas sob medida.
3. **Formalização da Proposta**: Elaboração de contrato seguro com assessoria jurídica integral até a entrega das chaves.

Entre em contato agora mesmo via WhatsApp ou agende sua visita abaixo para garantir esta unidade antes que outro comprador avance!
  `.trim();

  return {
    id: `post-prop-${property.id}`,
    title,
    slug: `dicas-imovel-${property.slug || property.id}`,
    excerpt,
    content,
    readTime: '3 min',
    publishedAt: property.createdAt ? property.createdAt.split('T')[0] : '2026-09-20',
    category,
    coverImage: property.images[0] || '/src/assets/images/hero_luxury_penthouse_1790516244337.jpg',
    propertyId: property.id,
    propertyCode: property.code,
    relatedProperty: property,
    brokerGoldenTip,
    urgencyHook,
    highlights
  };
};

/**
 * Returns the combined list of blog posts:
 * - Dynamic Property Buyer Guides (automatically aligned with EVERY registered property)
 * - Educational Market Pillars (General market intelligence)
 */
export const getAllBlogPosts = (properties: Property[]): BlogPost[] => {
  // Only include active properties (not soft-deleted)
  const activeProps = properties.filter((p) => !p.isDeleted);

  // Generate dynamic posts for every registered property
  const propertyPosts = activeProps.map(generatePropertyBlogPost);

  // Initial market pillars
  const pillarPosts: BlogPost[] = INITIAL_BLOG_POSTS.map((post) => {
    // Optionally link a relevant property to each pillar post
    let related: Property | undefined;
    if (post.id === 'post-1') {
      related = activeProps.find((p) => p.city === 'Balneário Rincão');
    } else if (post.id === 'post-2') {
      related = activeProps.find((p) => p.isBankFinancing);
    } else if (post.id === 'post-3') {
      related = activeProps.find((p) => p.city === 'Criciúma' && p.price >= 1500000);
    }

    return {
      ...post,
      relatedProperty: related,
      propertyId: related?.id,
      propertyCode: related?.code,
      brokerGoldenTip:
        '💡 Dica da Maria Júlia: Avalie sempre a solidez da construtora e a liquidez do bairro antes de assinar a promessa de compra e venda. Na dúvida, consulte sempre sua corretora de confiança credenciada pelo CRECI.'
    };
  });

  // Return dynamic property guides first, followed by market guides
  return [...propertyPosts, ...pillarPosts];
};
