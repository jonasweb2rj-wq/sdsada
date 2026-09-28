import { Property, PortalContent, BlogPost } from '../types/property';

export const INITIAL_PORTAL_CONTENT: PortalContent = {
  brokerName: 'Maria Júlia',
  creci: 'CRECI/SC 77301-F',
  instagramHandle: '@majudgamba',
  phone: '(48) 99182-7701',
  whatsapp: '5548991827701',
  email: 'contato@mariajuliaimoveis.com.br',
  officeCity: 'Criciúma',
  officeState: 'SC',
  officeAddress: 'Rua Cel. Pedro Benedet, 330 - Centro Executivo - Criciúma/SC',
  heroHeadline: 'Imóveis Selecionados com Atendimento de Alto Padrão',
  heroSubheadline: 'Compra, venda e assessoria de investimentos em Criciúma e Balneário Rincão. Sua conquista com segurança jurídica e financiamento aprovado em até 24h.',
  bioText: 'Especialista em conectar famílias aos seus lares dos sonhos e investidores às melhores oportunidades de valorização patrimonial no Sul Catarinense. Com credenciamento CRECI/SC 77301-F, atuo com transparência absoluta, seleção criteriosa de imóveis e assessoria completa desde a primeira visita até a escritura.',
  quoteText: 'Imóvel não é apenas metro quadrado: é onde a vida acontece e onde seu patrimônio cresce com solidez.',
  experienceYears: 6,
  soldVolumeMillions: 48,
  satisfiedClientsCount: 140,
  activePropertiesCount: 24,
  introVideoUrl: '/videos/maria_julia_intro.mp4',
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'MJ-701',
    title: 'Penthouse Serena Beira-Mar com Piscina Privativa',
    slug: 'penthouse-serena-beira-mar-balneario-rincao',
    price: 2450000,
    condoFee: 1100,
    iptu: 2800,
    type: 'Cobertura',
    transaction: 'Venda',
    status: 'Disponível',
    city: 'Balneário Rincão',
    neighborhood: 'Zona Sul - Beira Mar',
    address: 'Av. Beira Mar, 1420 - Balneário Rincão, SC',
    builder: 'Construtora Fontana',
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    garageSpots: 3,
    privateArea: 286,
    totalArea: 375,
    description: 'Espetacular cobertura linear pé na areia em Balneário Rincão. Projeto de arquitetura contemporânea com terraço panorâmico envidraçado de 90m², piscina aquecida com borda infinita de frente para o mar, espaço gourmet climatizado com churrasqueira a carvão e adega embutida. Living com pé direito duplo e automação residencial completa. Acabamento primoroso em mármore travertino e esquadrias de alta performance com isolamento termoacústico.',
    features: [
      'Piscina Privativa com Borda Infinita',
      'Vista Panorâmica do Mar',
      'Sacada Gourmet com Churrasqueira',
      'Fechamento de Varanda Reiki',
      'Automação Residencial Iluminação/Ar',
      '3 Vagas de Garagem Cobertas',
      'Depósito Privativo no Subsolo',
      'Elevador com Biometria'
    ],
    tags: ['Destaque', 'Financiamento Bancário', 'Vista Mar', 'Alto Padrão'],
    images: [
      '/src/assets/images/hero_luxury_penthouse_1790516244337.jpg',
      '/src/assets/images/property_rincao_seafront_1790516281456.jpg',
      '/src/assets/images/property_highrise_living_1790516292666.jpg'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lat: -28.8354,
    lng: -49.2312,
    isBankFinancing: true,
    isDirectBuilder: false,
    isFeatured: true,
    isUrgentOffer: true,
    offerExpiresAt: '2026-10-15',
    viewsCount: 428,
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z'
  },
  {
    id: 'prop-2',
    code: 'MJ-504',
    title: 'Mansão Neoclássica no Bairro Michel com Quadra e Piscina',
    slug: 'mansao-neoclassica-bairro-michel-criciuma',
    price: 3600000,
    condoFee: 850,
    iptu: 4200,
    type: 'Casa em Condomínio',
    transaction: 'Venda',
    status: 'Disponível',
    city: 'Criciúma',
    neighborhood: 'Michel',
    address: 'Alameda das Figueiras - Bairro Michel, Criciúma, SC',
    builder: 'Incorporação Exclusiva Spillere',
    bedrooms: 5,
    suites: 4,
    bathrooms: 6,
    garageSpots: 4,
    privateArea: 480,
    totalArea: 720,
    description: 'Residência monumental em um dos bairros mais nobres e arborizados de Criciúma. Construída em terreno de 720m², esta propriedade reúne o ápice do conforto com living com lareira ecológica, home theater acústico, cozinha gourmet assinada com eletros embutidos, suíte master de 65m² com closet duplo e banheira de hidromassagem. Área externa de resort particular com piscina aquecida com prainha, quiosque de parrillero e solarium privativo.',
    features: [
      'Piscina Aquecida com Prainha',
      'Quiosque Gourmet com Parrilla',
      'Home Theater com Tratamento Acústico',
      'Suíte Master com Hidro e Closet Duplo',
      'Energia Solar Fotovoltaica Instalada',
      'Condomínio Fechado com Segurança 24h',
      'Poço Artesiano e Cisterna de Água da Chuva',
      '4 Vagas de Garagem Paralelas'
    ],
    tags: ['Destaque', 'Financiamento Bancário', 'Construtora', 'Permuta'],
    images: [
      '/src/assets/images/property_criciuma_mansion_1790516269255.jpg',
      '/src/assets/images/property_highrise_living_1790516292666.jpg',
      '/src/assets/images/hero_luxury_penthouse_1790516244337.jpg'
    ],
    lat: -28.6789,
    lng: -49.3734,
    isBankFinancing: true,
    isDirectBuilder: true,
    isFeatured: true,
    viewsCount: 382,
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'prop-3',
    code: 'MJ-302',
    title: 'Apartamento Alto Padrão no Pio Corrêa com Sacada Panorâmica',
    slug: 'apartamento-alto-padrao-pio-correa-criciuma',
    price: 1390000,
    condoFee: 780,
    iptu: 1950,
    type: 'Apartamento',
    transaction: 'Venda',
    status: 'Disponível',
    city: 'Criciúma',
    neighborhood: 'Pio Corrêa',
    address: 'Rua Almirante Barroso - Pio Corrêa, Criciúma, SC',
    builder: 'Criciúma Construções & Engenharia',
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    garageSpots: 2,
    privateArea: 172,
    totalArea: 240,
    description: 'Apartamento andar alto 100% mobiliado e decorado por arquiteto no charmoso bairro Pio Corrêa. Living amplo e integrado com a varanda gourmet envidraçada, churrasqueira a carvão, piso porcelanato Portobello 120x120cm, teto rebaixado em gesso com iluminação cênica em LED. 3 amplas suítes com persianas automatizadas e preparação para ar-condicionado split em todos os ambientes.',
    features: [
      'Totalmente Mobiliado e Decorado',
      'Sacada Gourmet Integrada com Churrasqueira',
      '3 Suítes Plenas',
      'Prédio com Salão de Festas e Academia',
      'Brinquedoteca e Espaço Pet',
      '2 Vagas Individuais de Garagem',
      'Condomínio Baixo com Portaria Remota',
      'Aceita Financiamento Caixa'
    ],
    tags: ['Financiamento Bancário', 'Destaque', 'Mobiliado'],
    images: [
      '/src/assets/images/property_highrise_living_1790516292666.jpg',
      '/src/assets/images/property_rincao_seafront_1790516281456.jpg'
    ],
    lat: -28.6712,
    lng: -49.3685,
    isBankFinancing: true,
    isDirectBuilder: false,
    isFeatured: true,
    isUrgentOffer: true,
    offerExpiresAt: '2026-10-05',
    viewsCount: 512,
    createdAt: '2026-08-20T14:00:00Z',
    updatedAt: '2026-09-25T11:40:00Z'
  },
  {
    id: 'prop-4',
    code: 'MJ-218',
    title: 'Residencial Vista Mar no Centro de Balneário Rincão',
    slug: 'residencial-vista-mar-balneario-rincao',
    price: 890000,
    condoFee: 520,
    iptu: 1200,
    type: 'Apartamento',
    transaction: 'Venda',
    status: 'Disponível',
    city: 'Balneário Rincão',
    neighborhood: 'Centro',
    address: 'Av. Leoberto Leal, 520 - Balneário Rincão, SC',
    builder: 'Construtora Fontana',
    bedrooms: 3,
    suites: 1,
    bathrooms: 2,
    garageSpots: 2,
    privateArea: 118,
    totalArea: 165,
    description: 'Localização ímpar a apenas 80 metros da praia, no coração de Balneário Rincão. Apartamento espaçoso com sacada gourmet voltada para o nascer do sol, vista aberta para o mar e acabamento contemporâneo. Ideal tanto para moradia com qualidade de vida quanto para rentabilidade recorde de locação por temporada no verão.',
    features: [
      '80 Metros do Mar',
      'Sacada Ampla com Churrasqueira',
      'Piso Porcelanato Polido',
      'Excelente Potencial de Renda com Airbnb',
      'Elevador e Hall Social Decorado',
      'Box de Praia Individual'
    ],
    tags: ['Financiamento Bancário', 'Investimento', 'Construtora'],
    images: [
      '/src/assets/images/property_rincao_seafront_1790516281456.jpg',
      '/src/assets/images/hero_luxury_penthouse_1790516244337.jpg'
    ],
    lat: -28.8312,
    lng: -49.2378,
    isBankFinancing: true,
    isDirectBuilder: true,
    isFeatured: false,
    viewsCount: 295,
    createdAt: '2026-08-25T16:00:00Z',
    updatedAt: '2026-09-24T18:20:00Z'
  },
  {
    id: 'prop-5',
    code: 'MJ-109',
    title: 'Lote Exclusivo no Condomínio Lagoa dos Freitas',
    slug: 'terreno-condominio-lagoa-dos-freitas-rincao',
    price: 490000,
    condoFee: 410,
    iptu: 650,
    type: 'Terreno',
    transaction: 'Investimento',
    status: 'Disponível',
    city: 'Balneário Rincão',
    neighborhood: 'Lagoa dos Freitas',
    address: 'Condomínio Fechado Lagoa Dourada - Balneário Rincão, SC',
    builder: 'Empreendimentos Litorâneos SC',
    bedrooms: 0,
    suites: 0,
    bathrooms: 0,
    garageSpots: 0,
    privateArea: 600,
    totalArea: 600,
    description: 'Terreno plano de 600m² (20x30m) em condomínio náutico de alto padrão à beira da Lagoa dos Freitas. Condomínio com marina exclusiva para jet-ski e lanchas, quadras de beach tennis, piscinas adulto e infantil, heliponto e segurança armada 24h. Financiamento direto em até 72x ou parcelamento facilitado.',
    features: [
      'Acesso Direto à Lagoa dos Freitas',
      'Marina Privativa com Trapiche',
      '4 Quadras de Beach Tennis Iluminadas',
      'Portaria Blindada com Controle Biométrico',
      'Rede Elétrica Subterrânea',
      'Condição Especial com Entrada de 20%'
    ],
    tags: ['Construtora', 'Investimento', 'Terreno'],
    images: [
      '/src/assets/images/property_rincao_seafront_1790516281456.jpg',
      '/src/assets/images/property_criciuma_mansion_1790516269255.jpg'
    ],
    lat: -28.8092,
    lng: -49.2561,
    isBankFinancing: false,
    isDirectBuilder: true,
    isFeatured: false,
    viewsCount: 198,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-22T15:00:00Z'
  },
  {
    id: 'prop-6',
    code: 'MJ-440',
    title: 'Apartamento Compacto de Luxo no Centro de Criciúma',
    slug: 'apartamento-studio-centro-criciuma',
    price: 485000,
    condoFee: 320,
    iptu: 750,
    type: 'Apartamento',
    transaction: 'Investimento',
    status: 'Disponível',
    city: 'Criciúma',
    neighborhood: 'Centro',
    address: 'Rua Henrique Lage, 210 - Centro, Criciúma, SC',
    builder: 'Construtora Fontana',
    bedrooms: 1,
    suites: 1,
    bathrooms: 1,
    garageSpots: 1,
    privateArea: 54,
    totalArea: 78,
    description: 'Conceito inteligente no ponto mais valorizado do centro de Criciúma, próximo ao Nações Shopping e principais polos médicos e educacionais. Ideal para médicos residentes, executivos ou investidores que buscam rentabilidade de aluguel acima da média. Condomínio com coworking integrado, lavanderia compartilhada OMO e rooftop lounge com vista panorâmica.',
    features: [
      'Rooftop Lounge com Vista 360°',
      'Espaço Coworking Climatizado',
      'Lavanderia Coletiva OMO',
      'Academia Equipada Life Fitness',
      'Fechadura Digital em Todas as Portas',
      'Aceita Financiamento Caixa com Entrada Mínima'
    ],
    tags: ['Financiamento Bancário', 'Investimento', 'Construtora'],
    images: [
      '/src/assets/images/property_highrise_living_1790516292666.jpg',
      '/src/assets/images/hero_luxury_penthouse_1790516244337.jpg'
    ],
    lat: -28.6755,
    lng: -49.3705,
    isBankFinancing: true,
    isDirectBuilder: true,
    isFeatured: false,
    viewsCount: 367,
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-23T12:00:00Z'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Por Que Balneário Rincão Tornou-se o Polo Imobiliário Mais Lucrativo do Sul de SC',
    slug: 'valorizacao-balneario-rincao-sc',
    excerpt: 'Com novas obras de infraestrutura, pavimentação da beira-mar e atração de condomínios de alto padrão, o metro quadrado em Balneário Rincão valorizou mais de 34% nos últimos 24 meses.',
    readTime: '4 min',
    publishedAt: '2026-09-15',
    category: 'Investimentos',
    coverImage: '/src/assets/images/property_rincao_seafront_1790516281456.jpg',
    content: `
      O litoral sul catarinense vive um ciclo histórico de transformação urbana e econômica. Balneário Rincão deixou de ser apenas um balneário sazonal de verão para se consolidar como polo de segunda residência nobre e residência permanente para famílias de Criciúma, Içara e região metropolitana.
      
      Entre os principais motores de valorização destacam-se:
      1. A modernização do calçadão beira-mar e orla sul;
      2. A proliferação de condomínios fechados com lagoas privativas e marinas náuticas;
      3. A proximidade de apenas 20 minutos de Criciúma via via rápida SC-445;
      4. A alta demanda por locações por temporada durante eventos e verão com rentabilidade líquida superando 9% ao ano.
      
      Para investidores que buscam segurança patrimonial e liquidez futura, unidades na planta de frente para o mar e lotes em condomínios fechados despontam como a recomendação número um de nossa consultoria.
    `
  },
  {
    id: 'post-2',
    title: 'Guia do Financiamento Imobiliário Caixa 2025/2026: Como Conseguir Aprovação em 24h',
    slug: 'guia-financiamento-caixa-sc',
    excerpt: 'Descubra os passos exatos para acelerar a liberação de crédito, documentos exigidos, diferença prática entre tabelas SAC e Price e como usar o FGTS para abater a entrada.',
    readTime: '5 min',
    publishedAt: '2026-09-02',
    category: 'Financiamento',
    coverImage: '/src/assets/images/property_highrise_living_1790516292666.jpg',
    content: `
      Financiar um imóvel não precisa ser burocrático ou desgastante quando você conta com assessoria credenciada e documentação redonda desde o primeiro dia.
      
      Pontos cruciais para aprovação imediata:
      - Comprovação de renda compatível: até 30% da renda bruta familiar pode ser comprometida na parcela;
      - Utilização estratégica do FGTS: você pode abater até 100% da entrada ou diminuir o saldo devedor;
      - Comparativo SAC vs. Price: na tabela SAC as parcelas são decrescentes, resultando em menor montante total de juros ao fim do contrato; na Price a parcela inicial é menor, aumentando a capacidade de compra imediata.
      
      Como corretora credenciada, cuido de todo o envio e esteira de aprovação bancária sem nenhum custo adicional para meus clientes compradores.
    `
  },
  {
    id: 'post-3',
    title: 'Bairros Nobres de Criciúma: Onde Morar com Segurança, Requinte e Valorização Contínua',
    slug: 'melhores-bairros-para-morar-em-criciuma',
    excerpt: 'Análise detalhada do Bairro Michel, Pio Corrêa, Cruzeiro do Sul e Centro: perfil das construções, escolas renomadas, opções gastronômicas e índice de valorização.',
    readTime: '6 min',
    publishedAt: '2026-08-28',
    category: 'Mercado Local',
    coverImage: '/src/assets/images/property_criciuma_mansion_1790516269255.jpg',
    content: `
      Criciúma é a capital econômica do Sul Catarinense e se destaca pela pujança industrial, polo médico de excelência e alta qualidade de vida.
      
      Os bairros mais desejados:
      - Bairro Michel: arborizado, residencial clássico, mansões majestosas e proximidade do Colégio Marista e centros clínicos;
      - Pio Corrêa: o endereço do requinte criciumense, com edifícios de um apartamento por andar e praças floridas;
      - Centro: dinamismo urbano com novos empreendimentos estilo studio e apartamentos inteligentes;
      - Cruzeiro do Sul: vista elevada da cidade, sossego e condomínios horizontais protegidos.
    `
  }
];
