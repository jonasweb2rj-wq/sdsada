export interface PropertyDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Property {
  id: string;
  code: string; // e.g. MJ-101
  title: string;
  slug: string;
  price: number;
  condoFee?: number;
  iptu?: number;
  type: 'Apartamento' | 'Casa em Condomínio' | 'Casa' | 'Cobertura' | 'Terreno' | 'Sala Comercial';
  transaction: 'Venda' | 'Investimento' | 'Aluguel Anual';
  status: 'Disponível' | 'Em Negociação' | 'Vendido' | 'Lançamento';
  city: 'Criciúma' | 'Balneário Rincão';
  neighborhood: string;
  address?: string;
  builder?: string; // Construtora (Fontana, Spillere, Criciúma Construções, etc.)
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garageSpots: number;
  privateArea: number; // m²
  totalArea?: number; // m²
  description: string;
  features: string[];
  tags: string[]; // e.g. 'Destaque', 'Financiamento Bancário', 'Construtora', 'Vista Mar', 'Permuta'
  images: string[];
  videoUrl?: string;
  documents?: PropertyDocument[];
  lat: number;
  lng: number;
  isBankFinancing: boolean;
  isDirectBuilder: boolean;
  isFeatured: boolean;
  isUrgentOffer?: boolean;
  offerExpiresAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId?: string;
  propertyTitle?: string;
  message?: string;
  preferredContact: 'whatsapp' | 'call' | 'email';
  scheduledDate?: string;
  scheduledTime?: string;
  type: 'visita' | 'financiamento' | 'duvida' | 'lead_magnet';
  status: 'novo' | 'em_atendimento' | 'visita_agendada' | 'concluido';
  createdAt: string;
}

export interface PortalContent {
  brokerName: string;
  creci: string;
  instagramHandle: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeCity: string;
  officeState: string;
  officeAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
  bioText: string;
  quoteText: string;
  experienceYears: number;
  soldVolumeMillions: number;
  satisfiedClientsCount: number;
  activePropertiesCount: number;
  introVideoUrl?: string;
}

export interface AiLandingPageResult {
  propertyId: string;
  propertyTitle: string;
  headline: string;
  subheadline: string;
  targetAudience: string;
  keyHighlights: string[];
  urgencyHook: string;
  instagramAdCopy: string;
  googleAdCopy: {
    headlines: string[];
    descriptions: string[];
  };
  reelsScript: {
    hook: string;
    body: string;
    callToAction: string;
  };
  whatsappPitch: string;
  generatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTime: string;
  publishedAt: string;
  category: string;
  coverImage: string;
  propertyId?: string;
  propertyCode?: string;
  relatedProperty?: Property;
  brokerGoldenTip?: string;
  urgencyHook?: string;
  investmentRoi?: string;
  highlights?: string[];
}
