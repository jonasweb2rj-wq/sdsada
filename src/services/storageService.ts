import { Property, PortalContent, Lead, AiLandingPageResult, PropertyDocument } from '../types/property';
import { INITIAL_PROPERTIES, INITIAL_PORTAL_CONTENT } from '../data/initialProperties';
import { FirebaseService } from './firebaseService';

const STORAGE_KEYS = {
  PROPERTIES: 'maju_imoveis_data_v1',
  PORTAL_CONTENT: 'maju_portal_content_v1',
  LEADS: 'maju_leads_data_v1',
  AI_PAGES: 'maju_ai_pages_v1',
  COOKIE_CONSENT: 'maju_cookie_consent_v1',
  FAVORITES: 'maju_favorites_v1'
};

export class StorageService {
  // --- PROPERTIES ---
  static getProperties(): Property[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
        return INITIAL_PROPERTIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_PROPERTIES;
    }
  }

  static getActiveProperties(): Property[] {
    return this.getProperties().filter(p => !p.isDeleted);
  }

  static getDeletedProperties(): Property[] {
    return this.getProperties().filter(p => p.isDeleted);
  }

  static getPropertyById(id: string): Property | undefined {
    return this.getProperties().find(p => p.id === id);
  }

  static setLocalProperties(properties: Property[]): void {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    window.dispatchEvent(new Event('maju_properties_updated'));
  }

  static async saveProperty(property: Property): Promise<void> {
    const list = this.getProperties();
    const index = list.findIndex(p => p.id === property.id);
    let targetProperty: Property;

    if (index >= 0) {
      targetProperty = { ...property, updatedAt: new Date().toISOString() };
      list[index] = targetProperty;
    } else {
      targetProperty = {
        ...property,
        id: property.id || `prop-${Date.now()}`,
        createdAt: property.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      list.unshift(targetProperty);
    }
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
    window.dispatchEvent(new Event('maju_properties_updated'));

    // Permanent Firestore Sync
    try {
      await FirebaseService.saveProperty(targetProperty);
    } catch (err) {
      console.warn('Firestore sync warning for saveProperty:', err);
    }
  }

  static async softDeleteProperty(id: string): Promise<void> {
    const list = this.getProperties();
    const index = list.findIndex(p => p.id === id);
    if (index >= 0) {
      list[index].isDeleted = true;
      list[index].deletedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
      window.dispatchEvent(new Event('maju_properties_updated'));
    }

    try {
      await FirebaseService.softDeleteProperty(id);
    } catch (err) {
      console.warn('Firestore sync warning for softDeleteProperty:', err);
    }
  }

  static async restoreProperty(id: string): Promise<void> {
    const list = this.getProperties();
    const index = list.findIndex(p => p.id === id);
    if (index >= 0) {
      list[index].isDeleted = false;
      delete list[index].deletedAt;
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
      window.dispatchEvent(new Event('maju_properties_updated'));
    }

    try {
      await FirebaseService.restoreProperty(id);
    } catch (err) {
      console.warn('Firestore sync warning for restoreProperty:', err);
    }
  }

  static async permanentDeleteProperty(id: string): Promise<void> {
    const list = this.getProperties().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
    window.dispatchEvent(new Event('maju_properties_updated'));

    // Permanent deletion from Firestore Database
    try {
      await FirebaseService.deletePropertyPermanently(id);
    } catch (err) {
      console.warn('Firestore sync warning for deletePropertyPermanently:', err);
    }
  }

  static incrementPropertyViews(id: string): void {
    const list = this.getProperties();
    const prop = list.find(p => p.id === id);
    if (prop) {
      prop.viewsCount = (prop.viewsCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(list));
      FirebaseService.incrementPropertyViews(id, prop.viewsCount);
    }
  }

  // --- PORTAL CONTENT ---
  static getPortalContent(): PortalContent {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PORTAL_CONTENT);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PORTAL_CONTENT, JSON.stringify(INITIAL_PORTAL_CONTENT));
        return INITIAL_PORTAL_CONTENT;
      }
      return { ...INITIAL_PORTAL_CONTENT, ...JSON.parse(stored) };
    } catch {
      return INITIAL_PORTAL_CONTENT;
    }
  }

  static setLocalPortalContent(content: PortalContent): void {
    localStorage.setItem(STORAGE_KEYS.PORTAL_CONTENT, JSON.stringify(content));
    window.dispatchEvent(new Event('maju_portal_updated'));
  }

  static async savePortalContent(content: PortalContent): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PORTAL_CONTENT, JSON.stringify(content));
    window.dispatchEvent(new Event('maju_portal_updated'));

    // Permanent Firestore Sync
    try {
      await FirebaseService.savePortalContent(content);
    } catch (err) {
      console.warn('Firestore sync warning for savePortalContent:', err);
    }
  }

  // --- LEADS ---
  static getLeads(): Lead[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static setLocalLeads(leads: Lead[]): void {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    window.dispatchEvent(new Event('maju_leads_updated'));
  }

  static async saveLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: 'lead-' + Date.now(),
      status: 'novo',
      createdAt: new Date().toISOString()
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    window.dispatchEvent(new Event('maju_leads_updated'));

    // Permanent Firestore Sync
    try {
      return await FirebaseService.saveLead(lead);
    } catch (err) {
      console.warn('Firestore sync warning for saveLead:', err);
      return newLead;
    }
  }

  static async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    const leads = this.getLeads();
    const item = leads.find(l => l.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      window.dispatchEvent(new Event('maju_leads_updated'));
    }

    try {
      await FirebaseService.updateLeadStatus(id, status);
    } catch (err) {
      console.warn('Firestore sync warning for updateLeadStatus:', err);
    }
  }

  static async deleteLeadPermanently(id: string): Promise<void> {
    const leads = this.getLeads().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    window.dispatchEvent(new Event('maju_leads_updated'));

    try {
      await FirebaseService.deleteLeadPermanently(id);
    } catch (err) {
      console.warn('Firestore sync warning for deleteLeadPermanently:', err);
    }
  }

  // --- AI LANDING PAGES ---
  static getAiPages(): AiLandingPageResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_PAGES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static async saveAiPage(page: AiLandingPageResult): Promise<void> {
    const pages = this.getAiPages().filter(p => p.propertyId !== page.propertyId);
    pages.unshift(page);
    localStorage.setItem(STORAGE_KEYS.AI_PAGES, JSON.stringify(pages));

    try {
      await FirebaseService.saveAiPage(page);
    } catch (err) {
      console.warn('Firestore sync warning for saveAiPage:', err);
    }
  }

  static getAiPageByPropertyId(propertyId: string): AiLandingPageResult | undefined {
    return this.getAiPages().find(p => p.propertyId === propertyId);
  }

  // --- FAVORITES ---
  static getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static toggleFavorite(propertyId: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(propertyId);
    let isFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(propertyId);
      isFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new Event('maju_favorites_updated'));
    return isFav;
  }

  // --- IMAGE COMPRESSION & UPLOAD HELPER ---
  static async compressAndUploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension 1920px for crystal-clear retina yet super fast loading
          const MAX_SIZE = 1920;
          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            resolve(dataUrl);
          } catch {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  // --- DOCUMENT UPLOADER SIMULATION ---
  static async uploadDocument(file: File): Promise<PropertyDocument> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const sizeFormatted = file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          : (file.size / 1024).toFixed(0) + ' KB';

        resolve({
          id: 'doc-' + Date.now(),
          name: file.name,
          size: sizeFormatted,
          type: file.type || 'application/pdf',
          url: reader.result as string
        });
      };
      reader.onerror = () => reject(new Error('Falha ao enviar documento'));
      reader.readAsDataURL(file);
    });
  }

  // --- INTRO VIDEO UPLOADER & CACHE ---
  static async uploadIntroVideo(file: File): Promise<string> {
    try {
      // 1. Send binary to Vite upload endpoint to write directly to public/videos/maria_julia_intro.mp4
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type || 'video/mp4'
        }
      });
      if (response.ok) {
        console.log('Video saved to public/videos/maria_julia_intro.mp4 successfully');
      }
    } catch (err) {
      console.warn('Server-side video write fallback:', err);
    }

    // 2. Also persist in IndexedDB for immediate zero-latency playback across browser reloads
    try {
      await this.saveVideoToIndexedDB(file);
    } catch (err) {
      console.warn('IndexedDB video cache error:', err);
    }

    // 3. Return local canonical path
    return '/videos/maria_julia_intro.mp4';
  }

  static async saveVideoToIndexedDB(file: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MajuPortalMediaDB', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos');
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        store.put(file, 'intro_video');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  static async getVideoFromIndexedDB(): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('MajuPortalMediaDB', 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('videos')) {
            db.createObjectStore('videos');
          }
        };
        request.onsuccess = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('videos')) {
            resolve(null);
            return;
          }
          const tx = db.transaction('videos', 'readonly');
          const store = tx.objectStore('videos');
          const getReq = store.get('intro_video');
          getReq.onsuccess = () => {
            if (getReq.result) {
              const url = URL.createObjectURL(getReq.result);
              resolve(url);
            } else {
              resolve(null);
            }
          };
          getReq.onerror = () => resolve(null);
        };
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
}

