import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Search,
  Plus,
  Sparkles,
  RotateCcw,
  FileText,
  Sliders,
  Trash2,
  Edit,
  Eye,
  Check,
  Upload,
  Image as ImageIcon,
  Building,
  DollarSign,
  MapPin,
  Flame,
  Download,
  Copy,
  Users,
  AlertTriangle,
  LogOut,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Property, PortalContent, Lead, AiLandingPageResult, PropertyDocument } from '../types/property';
import { StorageService } from '../services/storageService';
import { FirebaseService } from '../services/firebaseService';
import { generatePropertyAiLandingPage } from '../services/geminiService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  portal: PortalContent;
  onUpdatePortal: (newContent: PortalContent) => void;
  onSelectPropertyForPreview: (prop: Property) => void;
}

type AdminTab = 'manage' | 'ai_landing' | 'portal_texts' | 'restore' | 'leads';
type AdminFilter = 'all' | 'financing' | 'builder' | 'featured';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  portal,
  onUpdatePortal,
  onSelectPropertyForPreview
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('maju_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin views
  const [activeTab, setActiveTab] = useState<AdminTab>('manage');
  const [activeFilter, setActiveFilter] = useState<AdminFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [properties, setProperties] = useState<Property[]>([]);
  const [deletedProperties, setDeletedProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Sub-modal states
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [currentEditingProp, setCurrentEditingProp] = useState<Partial<Property> | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // AI Landing Page generation state
  const [selectedPropForAi, setSelectedPropForAi] = useState<Property | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AiLandingPageResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Portal texts form state
  const [portalForm, setPortalForm] = useState<PortalContent>(portal);
  const [portalSavedNotice, setPortalSavedNotice] = useState(false);

  // Load data & real-time sync with Firebase Firestore
  const refreshData = () => {
    setProperties(StorageService.getActiveProperties());
    setDeletedProperties(StorageService.getDeletedProperties());
    setLeads(StorageService.getLeads());
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshData();

      // Real-time synchronization for properties from Firestore
      const unsubProps = FirebaseService.subscribeToProperties((firebaseProps) => {
        setProperties(firebaseProps.filter((p) => !p.isDeleted));
        setDeletedProperties(firebaseProps.filter((p) => p.isDeleted));
      });

      // Real-time synchronization for leads from Firestore
      const unsubLeads = FirebaseService.subscribeToLeads((firebaseLeads) => {
        setLeads(firebaseLeads);
      });

      return () => {
        unsubProps();
        unsubLeads();
      };
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    setPortalForm(portal);
  }, [portal]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'maju@x.com' && loginPassword === 'maju4321') {
      setIsAuthenticated(true);
      sessionStorage.setItem('maju_admin_auth', 'true');
      setLoginError('');
      refreshData();
    } else {
      setLoginError('Credenciais inválidas. Utilize email: maju@x.com e senha: maju4321');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('maju_admin_auth');
  };

  // Counts for filter pills
  const counts = {
    all: properties.length,
    financing: properties.filter((p) => p.isBankFinancing).length,
    builder: properties.filter((p) => p.isDirectBuilder).length,
    featured: properties.filter((p) => p.isFeatured).length,
    deleted: deletedProperties.length
  };

  // Filtered properties
  const filteredProperties = properties.filter((prop) => {
    // Category Filter
    if (activeFilter === 'financing' && !prop.isBankFinancing) return false;
    if (activeFilter === 'builder' && !prop.isDirectBuilder) return false;
    if (activeFilter === 'featured' && !prop.isFeatured) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchCode = prop.code.toLowerCase().includes(q);
      const matchNeighborhood = prop.neighborhood.toLowerCase().includes(q);
      const matchBuilder = prop.builder?.toLowerCase().includes(q);
      const matchCity = prop.city.toLowerCase().includes(q);
      return matchTitle || matchCode || matchNeighborhood || matchBuilder || matchCity;
    }

    return true;
  });

  // Actions (Aligned with Firebase Firestore in Real Time)
  const handleSoftDelete = async (id: string) => {
    if (confirm('Deseja mover este imóvel para a lixeira temporária?')) {
      await StorageService.softDeleteProperty(id);
      refreshData();
    }
  };

  const handleRestore = async (id: string) => {
    await StorageService.restoreProperty(id);
    refreshData();
  };

  const handlePermanentDelete = async (id: string, title?: string) => {
    const message = title
      ? `Atenção: Deseja EXCLUIR PERMANENTEMENTE o imóvel "${title}" do banco de dados e do portal? Esta ação é definitiva e removerá o registro para sempre.`
      : 'Atenção: Esta ação é definitiva e removerá o imóvel permanentemente do banco de dados e do portal. Continuar?';

    if (confirm(message)) {
      await StorageService.permanentDeleteProperty(id);
      refreshData();
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (confirm(`Excluir permanentemente o lead de "${name}" do banco de dados?`)) {
      await StorageService.deleteLeadPermanently(id);
      refreshData();
    }
  };

  const handleNewProperty = () => {
    const nextCode = `MJ-${Math.floor(100 + Math.random() * 900)}`;
    setCurrentEditingProp({
      id: '',
      code: nextCode,
      title: '',
      slug: '',
      price: 650000,
      condoFee: 450,
      iptu: 1200,
      type: 'Apartamento',
      transaction: 'Venda',
      status: 'Disponível',
      city: 'Criciúma',
      neighborhood: 'Pio Corrêa',
      address: '',
      builder: '',
      bedrooms: 3,
      suites: 1,
      bathrooms: 2,
      garageSpots: 2,
      privateArea: 110,
      totalArea: 155,
      description: '',
      features: ['Piscina', 'Churrasqueira a Carvão', 'Salão de Festas', 'Portaria 24h'],
      tags: ['Financiamento Fácil', 'Pronto para Morar'],
      images: ['/src/assets/images/property_highrise_living_1790516292666.jpg'],
      videoUrl: '',
      documents: [],
      lat: -28.6773,
      lng: -49.3698,
      isBankFinancing: true,
      isDirectBuilder: false,
      isFeatured: false,
      isUrgentOffer: false,
      viewsCount: 0
    });
    setIsEditingProperty(true);
  };

  const handleEditProperty = (prop: Property) => {
    setCurrentEditingProp({ ...prop });
    setIsEditingProperty(true);
  };

  // Image Upload via Drag & Drop + WebP compression
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentEditingProp) return;
    setUploadProgress(10);
    const newImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressed = await StorageService.compressAndUploadImage(file);
        newImageUrls.push(compressed);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err) {
        console.error('Error compressing image', err);
      }
    }

    setCurrentEditingProp((prev) => prev ? {
      ...prev,
      images: [...(prev.images || []), ...newImageUrls]
    } : null);

    setUploadProgress(null);
  };

  // Document Upload
  const handleDocumentFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentEditingProp) return;
    const newDocs: PropertyDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const doc = await StorageService.uploadDocument(files[i]);
        newDocs.push(doc);
      } catch (err) {
        console.error('Error uploading doc', err);
      }
    }

    setCurrentEditingProp((prev) => prev ? {
      ...prev,
      documents: [...(prev.documents || []), ...newDocs]
    } : null);
  };

  // Save Property
  const handleSaveCurrentProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditingProp || !currentEditingProp.title || !currentEditingProp.code) {
      alert('Preencha ao menos o título e código do imóvel.');
      return;
    }

    const propToSave: Property = {
      id: currentEditingProp.id || 'prop-' + Date.now(),
      code: currentEditingProp.code,
      title: currentEditingProp.title,
      slug: currentEditingProp.slug || currentEditingProp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(currentEditingProp.price) || 0,
      condoFee: Number(currentEditingProp.condoFee) || 0,
      iptu: Number(currentEditingProp.iptu) || 0,
      type: currentEditingProp.type as any || 'Apartamento',
      transaction: currentEditingProp.transaction as any || 'Venda',
      status: currentEditingProp.status as any || 'Disponível',
      city: currentEditingProp.city as any || 'Criciúma',
      neighborhood: currentEditingProp.neighborhood || 'Centro',
      address: currentEditingProp.address || '',
      builder: currentEditingProp.builder || '',
      bedrooms: Number(currentEditingProp.bedrooms) || 0,
      suites: Number(currentEditingProp.suites) || 0,
      bathrooms: Number(currentEditingProp.bathrooms) || 0,
      garageSpots: Number(currentEditingProp.garageSpots) || 0,
      privateArea: Number(currentEditingProp.privateArea) || 0,
      totalArea: Number(currentEditingProp.totalArea) || 0,
      description: currentEditingProp.description || '',
      features: currentEditingProp.features || [],
      tags: currentEditingProp.tags || [],
      images: currentEditingProp.images && currentEditingProp.images.length > 0
        ? currentEditingProp.images
        : ['/src/assets/images/property_highrise_living_1790516292666.jpg'],
      videoUrl: currentEditingProp.videoUrl || '',
      documents: currentEditingProp.documents || [],
      lat: currentEditingProp.lat || -28.67,
      lng: currentEditingProp.lng || -49.37,
      isBankFinancing: Boolean(currentEditingProp.isBankFinancing),
      isDirectBuilder: Boolean(currentEditingProp.isDirectBuilder),
      isFeatured: Boolean(currentEditingProp.isFeatured),
      isUrgentOffer: Boolean(currentEditingProp.isUrgentOffer),
      viewsCount: currentEditingProp.viewsCount || 0,
      createdAt: currentEditingProp.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await StorageService.saveProperty(propToSave);
    setIsEditingProperty(false);
    setCurrentEditingProp(null);
    refreshData();
  };

  // AI Landing Page Trigger
  const handleTriggerAiForProperty = async (prop: Property) => {
    setSelectedPropForAi(prop);
    setActiveTab('ai_landing');
    setAiGenerating(true);
    setAiResult(null);

    const result = await generatePropertyAiLandingPage(prop);
    setAiResult(result);
    await StorageService.saveAiPage(result);
    setAiGenerating(false);
  };

  const handleCopy = (text: string, sectionKey: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2500);
    }
  };

  // Save Portal texts
  const handleSavePortalTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    await StorageService.savePortalContent(portalForm);
    onUpdatePortal(portalForm);
    setPortalSavedNotice(true);
    setTimeout(() => setPortalSavedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-900/60 backdrop-blur-sm overflow-hidden animate-fade-in">
      <div className="relative bg-white border border-neutral-200 rounded-2xl max-w-6xl w-full h-[94vh] shadow-2xl flex flex-col overflow-hidden text-neutral-900">
        
        {/* Top Header of Admin Panel */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-neutral-950 text-lg sm:text-xl">
                  Painel Administrativo Maria Júlia Imóveis
                </h2>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sincronizado Firestore</span>
                </div>
              </div>
              <div className="text-xs text-neutral-500 font-medium">
                Acesso Restrito · CRECI/SC 77301-F · Balneário Rincão & Criciúma
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-rose-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
                title="Sair do painel"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex items-center justify-center flex-1 bg-stone-50">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-md space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-950">Login da Corretora</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Digite as credenciais de acesso restrito da Maria Júlia
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">E-mail</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="maju@x.com"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Senha</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2.5 text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-neutral-950 bg-amber-400 hover:bg-amber-500 transition-all cursor-pointer shadow-sm"
                >
                  Entrar no Painel
                </button>
              </form>

              <div className="text-center text-[11px] text-neutral-500">
                Credenciais de teste: <code className="text-amber-800 font-bold">maju@x.com</code> / <code className="text-amber-800 font-bold">maju4321</code>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Body */
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            
            {/* Upper Action Bar strictly matching user requirements */}
            <div className="px-6 py-3 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Botão preto "Gerenciar Imóveis (X)" */}
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'manage'
                      ? 'bg-neutral-950 text-white shadow-sm'
                      : 'bg-neutral-900 text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <span>Gerenciar Imóveis</span>
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-neutral-800 text-amber-300 font-mono text-[11px] font-bold">
                    {counts.all}
                  </span>
                </button>

                {/* Botão "CRIAR LANDING PAGE (IA & Anúncios)" com estrela */}
                <button
                  onClick={() => {
                    setActiveTab('ai_landing');
                    if (!selectedPropForAi && properties.length > 0) {
                      handleTriggerAiForProperty(properties[0]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'ai_landing'
                      ? 'bg-amber-400 text-neutral-950 border border-amber-500 shadow-2xs'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>CRIAR LANDING PAGE (IA & Anúncios)</span>
                </button>

                {/* Botão "Contatos & Textos do Portal" */}
                <button
                  onClick={() => setActiveTab('portal_texts')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'portal_texts'
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <span>Contatos & Textos do Portal</span>
                </button>

                {/* Botão "Restaurar X Imóveis" */}
                <button
                  onClick={() => setActiveTab('restore')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'restore'
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar ({counts.deleted}) Imóveis</span>
                </button>

                {/* Tab Leads */}
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leads & Visitas ({leads.length})</span>
                </button>
              </div>

              {/* Botão dourado "+ Cadastrar Novo Imóvel" */}
              <button
                onClick={handleNewProperty}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Cadastrar Novo Imóvel</span>
              </button>
            </div>

            {/* TAB CONTENT: MANAGE PROPERTIES */}
            {activeTab === 'manage' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="px-6 py-3 border-b border-neutral-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* Search field */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por título, código, bairro, construtora..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* Filter tabs with dynamic counters */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeFilter === 'all'
                          ? 'bg-amber-400 text-neutral-950 shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                      }`}
                    >
                      Todos ({counts.all})
                    </button>
                    <button
                      onClick={() => setActiveFilter('financing')}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeFilter === 'financing'
                          ? 'bg-amber-400 text-neutral-950 shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                      }`}
                    >
                      Fin. Bancário ({counts.financing})
                    </button>
                    <button
                      onClick={() => setActiveFilter('builder')}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeFilter === 'builder'
                          ? 'bg-amber-400 text-neutral-950 shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                      }`}
                    >
                      Construtora ({counts.builder})
                    </button>
                    <button
                      onClick={() => setActiveFilter('featured')}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                        activeFilter === 'featured'
                          ? 'bg-amber-400 text-neutral-950 shadow-2xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                      }`}
                    >
                      Destaques ({counts.featured})
                    </button>
                  </div>
                </div>

                {/* Property List Table */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
                  {filteredProperties.length === 0 ? (
                    <div className="text-center py-16 text-neutral-500 space-y-2">
                      <Building className="w-10 h-10 mx-auto text-neutral-400" />
                      <div className="text-sm font-semibold">Nenhum imóvel encontrado com os filtros atuais.</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredProperties.map((prop) => (
                        <div
                          key={prop.id}
                          className="bg-white border border-neutral-200 hover:border-amber-400 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-2xs"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                              <img
                                src={prop.images[0]}
                                alt={prop.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/75 text-[9px] font-mono text-center text-amber-300 py-0.2">
                                {prop.code}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-neutral-950 hover:text-amber-800 transition-colors">
                                  {prop.title}
                                </span>
                                {prop.isUrgentOffer && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                                    Ofertão
                                  </span>
                                )}
                                {prop.isFeatured && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                                    Destaque
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                                <span>{prop.neighborhood}, {prop.city}</span>
                                <span>·</span>
                                <span>{prop.privateArea}m²</span>
                                <span>·</span>
                                <span>{prop.bedrooms} quartos ({prop.suites} suítes)</span>
                                <span>·</span>
                                <span className="font-bold text-neutral-950">
                                  R$ {prop.price.toLocaleString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Trigger AI Landing Page */}
                            <button
                              onClick={() => handleTriggerAiForProperty(prop)}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-400 hover:text-neutral-950 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                              title="Gerar Landing Page e Anúncios com IA"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Landing Page IA</span>
                            </button>

                            {/* Preview */}
                            <button
                              onClick={() => onSelectPropertyForPreview(prop)}
                              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer border border-neutral-300"
                              title="Ver ficha no portal"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEditProperty(prop)}
                              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer border border-neutral-300"
                              title="Editar imóvel"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Permanent Delete from Firestore & Portal */}
                            <button
                              onClick={() => handlePermanentDelete(prop.id, prop.title)}
                              className="p-2 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-600 transition-colors cursor-pointer border border-neutral-300"
                              title="Excluir permanentemente do banco de dados e do portal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI LANDING PAGE GENERATOR */}
            {activeTab === 'ai_landing' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 bg-white p-4 rounded-xl shadow-2xs">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-neutral-950 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-700" />
                      <span>Gerador de Landing Page IA & Anúncios de Alta Conversão</span>
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Cria automaticamente headline, Instagram Ads, roteiro de Reels e Google Ads otimizados para o público de Criciúma e Balneário Rincão.
                    </p>
                  </div>

                  {/* Property Selector for AI */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedPropForAi?.id || ''}
                      onChange={(e) => {
                        const found = properties.find((p) => p.id === e.target.value);
                        if (found) handleTriggerAiForProperty(found);
                      }}
                      className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    >
                      <option value="">Selecione outro imóvel...</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.title}
                        </option>
                      ))}
                    </select>

                    {selectedPropForAi && (
                      <button
                        onClick={() => handleTriggerAiForProperty(selectedPropForAi)}
                        disabled={aiGenerating}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
                        <span>Regerar IA</span>
                      </button>
                    )}
                  </div>
                </div>

                {aiGenerating ? (
                  <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-neutral-200">
                    <Sparkles className="w-10 h-10 text-amber-600 animate-pulse mx-auto" />
                    <div className="font-serif text-lg font-bold text-neutral-950">
                      A Inteligência Artificial está formulando a estratégia de vendas...
                    </div>
                    <div className="text-xs text-neutral-600">
                      Analisando diferenciais, perfil de investidores em SC e ganchos psicológicos.
                    </div>
                  </div>
                ) : aiResult ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Column 1: Landing Page Copy & Value Props */}
                    <div className="space-y-4">
                      {/* Top Headline Box */}
                      <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-800">
                            Headline da Landing Page
                          </span>
                          <button
                            onClick={() => handleCopy(aiResult.headline, 'headline')}
                            className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium"
                          >
                            {copiedSection === 'headline' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSection === 'headline' ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                        <h4 className="font-serif text-2xl font-bold text-neutral-950">
                          {aiResult.headline}
                        </h4>
                        <p className="text-neutral-700 text-xs sm:text-sm">
                          {aiResult.subheadline}
                        </p>
                      </div>

                      {/* Target Audience & Urgency */}
                      <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-2xs">
                        <span className="text-xs uppercase font-bold text-neutral-600">
                          Público-Alvo Identificado
                        </span>
                        <p className="text-xs text-neutral-800">{aiResult.targetAudience}</p>
                        <div className="pt-2 border-t border-neutral-200 text-xs text-amber-800">
                          <strong>Gatilho de Urgência:</strong> {aiResult.urgencyHook}
                        </div>
                      </div>

                      {/* Instagram Ad Copy */}
                      <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-800">
                            Texto para Feed / Carrossel Instagram (@majudgamba)
                          </span>
                          <button
                            onClick={() => handleCopy(aiResult.instagramAdCopy, 'insta')}
                            className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium"
                          >
                            {copiedSection === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSection === 'insta' ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                        <pre className="text-xs text-neutral-800 whitespace-pre-wrap font-sans bg-neutral-50 p-4 rounded-xl border border-neutral-200 max-h-60 overflow-y-auto leading-relaxed">
                          {aiResult.instagramAdCopy}
                        </pre>
                      </div>
                    </div>

                    {/* Column 2: Google Ads & Reels Script */}
                    <div className="space-y-4">
                      {/* Reels Video Script */}
                      <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-800">
                            Roteiro de Vídeo Reels / TikTok
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                `GANCHO (3s): ${aiResult.reelsScript.hook}\n\nCORPO: ${aiResult.reelsScript.body}\n\nCTA: ${aiResult.reelsScript.callToAction}`,
                                'reels'
                              )
                            }
                            className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium"
                          >
                            {copiedSection === 'reels' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSection === 'reels' ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <span className="text-amber-800 font-bold block mb-1">Gancho Inicial (0-3s):</span>
                            <span className="text-neutral-800">{aiResult.reelsScript.hook}</span>
                          </div>
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <span className="text-amber-800 font-bold block mb-1">Apresentação do Imóvel (30s):</span>
                            <span className="text-neutral-800">{aiResult.reelsScript.body}</span>
                          </div>
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <span className="text-amber-800 font-bold block mb-1">Chamada para Ação (CTA):</span>
                            <span className="text-neutral-800">{aiResult.reelsScript.callToAction}</span>
                          </div>
                        </div>
                      </div>

                      {/* Google Ads Headlines & Descriptions */}
                      <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-800">
                            Google Search Ads (Títulos & Descrições)
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(
                                `Títulos:\n${aiResult.googleAdCopy.headlines.join('\n')}\n\nDescrições:\n${aiResult.googleAdCopy.descriptions.join('\n')}`,
                                'google'
                              )
                            }
                            className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium"
                          >
                            {copiedSection === 'google' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSection === 'google' ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-neutral-600 block mb-1 font-medium">Títulos Sugeridos:</span>
                            {aiResult.googleAdCopy.headlines.map((h, i) => (
                              <div key={i} className="px-2.5 py-1.5 bg-neutral-50 rounded border border-neutral-200 text-neutral-800 mb-1 font-mono text-[11px]">
                                {h}
                              </div>
                            ))}
                          </div>
                          <div>
                            <span className="text-neutral-600 block mb-1 font-medium">Descrições Sugeridas:</span>
                            {aiResult.googleAdCopy.descriptions.map((d, i) => (
                              <div key={i} className="px-2.5 py-1.5 bg-neutral-50 rounded border border-neutral-200 text-neutral-800 mb-1 text-[11px]">
                                {d}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Pitch */}
                      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-emerald-900">
                            Pitch de Conversão para WhatsApp
                          </span>
                          <button
                            onClick={() => handleCopy(aiResult.whatsappPitch, 'pitch')}
                            className="text-xs text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium"
                          >
                            {copiedSection === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSection === 'pitch' ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-emerald-950 italic">
                          "{aiResult.whatsappPitch}"
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-neutral-500 bg-white rounded-2xl border border-neutral-200">
                    Selecione um imóvel acima para gerar a landing page com IA.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: EDIT PORTAL TEXTS & CONTACTS */}
            {activeTab === 'portal_texts' && (
              <div className="flex-1 overflow-y-auto p-6 bg-stone-50/40">
                <form onSubmit={handleSavePortalTexts} className="max-w-3xl space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-neutral-950">Textos do Portal & Contatos</h3>
                      <p className="text-xs text-neutral-500">Altere contatos, biografia e estatísticas públicas</p>
                    </div>
                    {portalSavedNotice && (
                      <span className="text-xs text-emerald-700 flex items-center gap-1 font-bold">
                        <Check className="w-4 h-4" />
                        <span>Salvo com sucesso!</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 mb-1 block">Nome da Corretora</label>
                      <input
                        type="text"
                        value={portalForm.brokerName}
                        onChange={(e) => setPortalForm({ ...portalForm, brokerName: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 mb-1 block">CRECI Oficial</label>
                      <input
                        type="text"
                        value={portalForm.creci}
                        onChange={(e) => setPortalForm({ ...portalForm, creci: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 mb-1 block">WhatsApp (Somente números)</label>
                      <input
                        type="text"
                        value={portalForm.whatsapp}
                        onChange={(e) => setPortalForm({ ...portalForm, whatsapp: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 mb-1 block">Telefone Comercial</label>
                      <input
                        type="text"
                        value={portalForm.phone}
                        onChange={(e) => setPortalForm({ ...portalForm, phone: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 mb-1 block">Instagram Oficial</label>
                      <input
                        type="text"
                        value={portalForm.instagramHandle}
                        onChange={(e) => setPortalForm({ ...portalForm, instagramHandle: e.target.value })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Endereço do Escritório</label>
                    <input
                      type="text"
                      value={portalForm.officeAddress}
                      onChange={(e) => setPortalForm({ ...portalForm, officeAddress: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Texto de Apresentação / Bio</label>
                    <textarea
                      rows={3}
                      value={portalForm.bioText}
                      onChange={(e) => setPortalForm({ ...portalForm, bioText: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 resize-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Frase de Destaque / Citação</label>
                    <input
                      type="text"
                      value={portalForm.quoteText}
                      onChange={(e) => setPortalForm({ ...portalForm, quoteText: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 mb-1 block">Vídeo de Entrada (Intro do Site)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="/videos/maria_julia_intro.mp4 ou link direto"
                        value={portalForm.introVideoUrl || ''}
                        onChange={(e) => setPortalForm({ ...portalForm, introVideoUrl: e.target.value })}
                        className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                      />
                      <label className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-all">
                        <Upload className="w-3.5 h-3.5 text-amber-700" />
                        <span>Subir MP4</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const path = await StorageService.uploadIntroVideo(file);
                                setPortalForm({ ...portalForm, introVideoUrl: path });
                                alert('Vídeo de abertura carregado com sucesso!');
                              } catch (err) {
                                alert('Erro ao carregar vídeo: ' + err);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                    <span className="text-[11px] text-neutral-500 mt-1 block">
                      Vídeo exibido na entrada do site com fundo #f6f6f6. Salvo na pasta public/videos e cache local.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Salvar Alterações do Portal
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: RESTORE DELETED PROPERTIES */}
            {activeTab === 'restore' && (
              <div className="flex-1 overflow-y-auto p-6 bg-stone-50/40">
                <div className="pb-3 border-b border-neutral-200 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-950">Lixeira de Imóveis (Soft Delete)</h3>
                    <p className="text-xs text-neutral-500">
                      Imóveis excluídos permanecem aqui e podem ser restaurados para o portal instantaneamente.
                    </p>
                  </div>
                  <span className="text-xs text-neutral-600 font-semibold">
                    {deletedProperties.length} item(ns) na lixeira
                  </span>
                </div>

                {deletedProperties.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 bg-white rounded-2xl border border-neutral-200">
                    A lixeira está vazia. Nenhum imóvel foi excluído recentemente.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deletedProperties.map((prop) => (
                      <div
                        key={prop.id}
                        className="p-4 bg-white rounded-xl border border-neutral-200 flex items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded bg-neutral-100 overflow-hidden shrink-0">
                            <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-950 block">{prop.title}</span>
                            <span className="text-[11px] text-neutral-500">
                              {prop.code} · Excluído em: {prop.deletedAt ? new Date(prop.deletedAt).toLocaleDateString('pt-BR') : 'Data não registrada'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore(prop.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restaurar ao Portal</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(prop.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-medium cursor-pointer"
                          >
                            Excluir Definitivamente
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: LEADS & VISITS */}
            {activeTab === 'leads' && (
              <div className="flex-1 overflow-y-auto p-6 bg-stone-50/40">
                <div className="pb-3 border-b border-neutral-200 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-950">Leads e Agendamentos Capturados</h3>
                    <p className="text-xs text-neutral-500">
                      Contatos de clientes interessados recebidos através dos formulários do portal
                    </p>
                  </div>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {leads.length} leads registrados
                  </span>
                </div>

                {leads.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 bg-white rounded-2xl border border-neutral-200">
                    Nenhum lead recebido ainda. Formulários e simuladores estão prontos para captura.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-950">{lead.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 uppercase font-bold border border-amber-200">
                              {lead.type}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-3">
                            <span>WhatsApp: <strong className="text-neutral-900">{lead.phone}</strong></span>
                            {lead.email && <span>E-mail: {lead.email}</span>}
                            {lead.scheduledDate && (
                              <span className="text-emerald-700 font-medium">
                                Visita: {lead.scheduledDate} às {lead.scheduledTime}
                              </span>
                            )}
                          </div>
                          {lead.message && (
                            <p className="text-xs text-neutral-600 italic">"{lead.message}"</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Olá ${lead.name}, aqui é Maria Júlia Corretora. Vi sua solicitação no meu portal sobre ${lead.propertyTitle || 'imóveis em SC'}. Como posso ajudar?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <span>Abrir WhatsApp</span>
                          </a>

                          <select
                            value={lead.status}
                            onChange={(e) => {
                              StorageService.updateLeadStatus(lead.id, e.target.value as any);
                              refreshData();
                            }}
                            className="bg-neutral-50 border border-neutral-300 rounded-lg px-2 py-1 text-xs text-neutral-800"
                          >
                            <option value="novo">Novo</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="visita_agendada">Visita Agendada</option>
                            <option value="concluido">Concluído</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer border border-neutral-300"
                            title="Excluir lead permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* FULL CREATE / EDIT PROPERTY SUB-MODAL */}
      {isEditingProperty && currentEditingProp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl text-neutral-900">
            <button
              onClick={() => { setIsEditingProperty(false); setCurrentEditingProp(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
              {currentEditingProp.id && properties.some((p) => p.id === currentEditingProp.id)
                ? 'Editar Imóvel'
                : 'Cadastrar Novo Imóvel'}
            </h3>

            <form onSubmit={handleSaveCurrentProperty} className="space-y-6">
              
              {/* Row 1: Code, Title, Type, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Código (Ex: MJ-805) *</label>
                  <input
                    type="text"
                    required
                    value={currentEditingProp.code || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, code: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Título do Imóvel *</label>
                  <input
                    type="text"
                    required
                    value={currentEditingProp.title || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, title: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Tipo</label>
                  <select
                    value={currentEditingProp.type || 'Apartamento'}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, type: e.target.value as any })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 cursor-pointer focus:bg-white"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Casa em Condomínio">Casa em Condomínio</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Sala Comercial">Sala Comercial</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Location & Builder */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Cidade *</label>
                  <select
                    value={currentEditingProp.city || 'Criciúma'}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, city: e.target.value as any })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 cursor-pointer focus:bg-white"
                  >
                    <option value="Criciúma">Criciúma</option>
                    <option value="Balneário Rincão">Balneário Rincão</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={currentEditingProp.neighborhood || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, neighborhood: e.target.value })}
                    placeholder="Ex: Pio Corrêa, Michel, Zona Sul Beira Mar"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Construtora</label>
                  <input
                    type="text"
                    value={currentEditingProp.builder || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, builder: e.target.value })}
                    placeholder="Ex: Construtora Fontana"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 3: Financials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    required
                    value={currentEditingProp.price || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, price: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Taxa de Condomínio (R$/mês)</label>
                  <input
                    type="number"
                    value={currentEditingProp.condoFee || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, condoFee: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">IPTU Anual (R$)</label>
                  <input
                    type="number"
                    value={currentEditingProp.iptu || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, iptu: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 4: Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Área Priv. (m²)</label>
                  <input
                    type="number"
                    value={currentEditingProp.privateArea || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, privateArea: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Dormitórios</label>
                  <input
                    type="number"
                    value={currentEditingProp.bedrooms || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, bedrooms: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Suítes</label>
                  <input
                    type="number"
                    value={currentEditingProp.suites || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, suites: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Banheiros</label>
                  <input
                    type="number"
                    value={currentEditingProp.bathrooms || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, bathrooms: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Vagas Garagem</label>
                  <input
                    type="number"
                    value={currentEditingProp.garageSpots || ''}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, garageSpots: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-mono focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 5: Flags (Financiamento, Construtora, Destaque, Oportunidade) */}
              <div className="flex flex-wrap items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(currentEditingProp.isBankFinancing)}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, isBankFinancing: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Aceita Financiamento Bancário</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(currentEditingProp.isDirectBuilder)}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, isDirectBuilder: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Condição Direta com Construtora</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(currentEditingProp.isFeatured)}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, isFeatured: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Imóvel Destaque na Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(currentEditingProp.isUrgentOffer)}
                    onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, isUrgentOffer: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Badge de Oportunidade Urgente</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">Descrição Completa</label>
                <textarea
                  rows={4}
                  value={currentEditingProp.description || ''}
                  onChange={(e) => setCurrentEditingProp({ ...currentEditingProp, description: e.target.value })}
                  placeholder="Descreva a iluminação solar, acabamentos, localização e sensação do imóvel..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 resize-none focus:bg-white"
                />
              </div>

              {/* DRAG-AND-DROP IMAGE UPLOAD (WebP Compression & Preview) */}
              <div className="space-y-3">
                <label className="text-xs text-neutral-800 font-semibold flex items-center justify-between">
                  <span>Upload de Fotos (Drag & Drop com Compressão WebP Automática)</span>
                  {uploadProgress !== null && (
                    <span className="text-amber-700 text-xs font-bold">Comprimindo e enviando: {uploadProgress}%</span>
                  )}
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-neutral-300 hover:border-amber-500 rounded-xl p-6 text-center bg-stone-50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('prop-image-input')?.click()}
                >
                  <input
                    id="prop-image-input"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFiles(e.target.files)}
                  />
                  <ImageIcon className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                  <div className="text-xs font-bold text-neutral-950">
                    Arraste imagens aqui ou clique para selecionar
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Compressão inteligente para carregamento instantâneo no Vercel Edge
                  </div>
                </div>

                {/* Uploaded Images Previews */}
                {currentEditingProp.images && currentEditingProp.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {currentEditingProp.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-neutral-300 group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentEditingProp.images?.filter((_, i) => i !== idx);
                            setCurrentEditingProp({ ...currentEditingProp, images: updated });
                          }}
                          className="absolute top-1 right-1 p-1 rounded bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DOCUMENT UPLOAD (Plantas, PDFs) */}
              <div className="space-y-3 pt-3 border-t border-neutral-200">
                <label className="text-xs text-neutral-800 font-semibold block">
                  Documentos & Plantas (PDF, DOCX)
                </label>
                <div
                  className="border border-neutral-300 hover:border-neutral-400 rounded-lg p-3 text-center bg-stone-50 cursor-pointer"
                  onClick={() => document.getElementById('prop-doc-input')?.click()}
                >
                  <input
                    id="prop-doc-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png"
                    className="hidden"
                    onChange={(e) => handleDocumentFiles(e.target.files)}
                  />
                  <span className="text-xs text-amber-800 font-bold">+ Adicionar Documento / Planta Baixa</span>
                </div>

                {currentEditingProp.documents && currentEditingProp.documents.length > 0 && (
                  <div className="space-y-1">
                    {currentEditingProp.documents.map((doc, idx) => (
                      <div key={doc.id || idx} className="flex items-center justify-between p-2 rounded bg-neutral-100 text-xs text-neutral-800">
                        <span className="truncate">{doc.name} ({doc.size})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentEditingProp.documents?.filter((_, i) => i !== idx);
                            setCurrentEditingProp({ ...currentEditingProp, documents: updated });
                          }}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => { setIsEditingProperty(false); setCurrentEditingProp(null); }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-950"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Salvar Imóvel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
