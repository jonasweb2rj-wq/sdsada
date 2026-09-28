import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Property, PortalContent, Lead, AiLandingPageResult } from '../types/property';
import { INITIAL_PROPERTIES, INITIAL_PORTAL_CONTENT } from '../data/initialProperties';

export class FirebaseService {
  private static propertiesInitialized = false;
  private static portalInitialized = false;

  // ==========================================
  // PROPERTIES (REAL-TIME CRUD)
  // ==========================================

  /**
   * Subscribes to real-time property changes in Firestore.
   * Automatically seeds initial properties if Firestore collection is empty.
   */
  static subscribeToProperties(callback: (properties: Property[]) => void): Unsubscribe {
    const colRef = collection(db, 'properties');

    return onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty && !this.propertiesInitialized) {
          this.propertiesInitialized = true;
          // Seed initial properties to Firestore permanently
          await this.seedInitialProperties();
          return;
        }

        const props: Property[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Property;
          props.push({ ...data, id: docSnap.id });
        });

        // Sort: newest first or code
        props.sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        callback(props);
      },
      (error) => {
        console.warn('Firestore real-time properties error, using cached fallback:', error);
      }
    );
  }

  /**
   * Seeds initial properties into Firestore on first run
   */
  private static async seedInitialProperties(): Promise<void> {
    try {
      for (const prop of INITIAL_PROPERTIES) {
        const docRef = doc(db, 'properties', prop.id);
        await setDoc(docRef, prop, { merge: true });
      }
    } catch (err) {
      console.error('Error seeding initial properties to Firestore:', err);
    }
  }

  /**
   * Adds or updates a property permanently in Firestore
   */
  static async saveProperty(property: Property): Promise<void> {
    const propertyId = property.id || `prop-${Date.now()}`;
    const cleanProp: Property = {
      ...property,
      id: propertyId,
      updatedAt: new Date().toISOString(),
      createdAt: property.createdAt || new Date().toISOString()
    };

    const docRef = doc(db, 'properties', propertyId);
    await setDoc(docRef, cleanProp, { merge: true });
  }

  /**
   * Permanently deletes a property from Firestore database
   */
  static async deletePropertyPermanently(id: string): Promise<void> {
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
  }

  /**
   * Soft deletes a property (moves to trash) in Firestore
   */
  static async softDeleteProperty(id: string): Promise<void> {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      isDeleted: true,
      deletedAt: new Date().toISOString()
    });
  }

  /**
   * Restores a soft-deleted property in Firestore
   */
  static async restoreProperty(id: string): Promise<void> {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      isDeleted: false,
      deletedAt: null
    });
  }

  /**
   * Increments view count in Firestore
   */
  static async incrementPropertyViews(id: string, currentCount: number): Promise<void> {
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        viewsCount: (currentCount || 0) + 1
      });
    } catch {
      // Non-blocking
    }
  }

  // ==========================================
  // PORTAL CONTENT (REAL-TIME SYNC)
  // ==========================================

  /**
   * Subscribes to real-time portal content changes (bio, phones, texts) in Firestore
   */
  static subscribeToPortalContent(callback: (content: PortalContent) => void): Unsubscribe {
    const docRef = doc(db, 'portal_content', 'main');

    return onSnapshot(
      docRef,
      async (docSnap) => {
        if (!docSnap.exists() && !this.portalInitialized) {
          this.portalInitialized = true;
          await setDoc(docRef, INITIAL_PORTAL_CONTENT);
          callback(INITIAL_PORTAL_CONTENT);
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data() as PortalContent;
          callback({ ...INITIAL_PORTAL_CONTENT, ...data });
        }
      },
      (error) => {
        console.warn('Firestore real-time portal content error:', error);
      }
    );
  }

  /**
   * Saves portal content permanently to Firestore
   */
  static async savePortalContent(content: PortalContent): Promise<void> {
    const docRef = doc(db, 'portal_content', 'main');
    await setDoc(docRef, content, { merge: true });
  }

  // ==========================================
  // LEADS & VISITS (REAL-TIME SYNC)
  // ==========================================

  /**
   * Subscribes to real-time leads received on the portal
   */
  static subscribeToLeads(callback: (leads: Lead[]) => void): Unsubscribe {
    const colRef = collection(db, 'leads');

    return onSnapshot(
      colRef,
      (snapshot) => {
        const leads: Lead[] = [];
        snapshot.forEach((docSnap) => {
          leads.push({ ...(docSnap.data() as Lead), id: docSnap.id });
        });

        // Sort by newest first
        leads.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(leads);
      },
      (error) => {
        console.warn('Firestore leads real-time error:', error);
      }
    );
  }

  /**
   * Saves a new lead permanently into Firestore
   */
  static async saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
    const leadId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      id: leadId,
      status: 'novo',
      createdAt: new Date().toISOString()
    };

    const docRef = doc(db, 'leads', leadId);
    await setDoc(docRef, newLead);
    return newLead;
  }

  /**
   * Updates lead status in Firestore
   */
  static async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    const docRef = doc(db, 'leads', id);
    await updateDoc(docRef, { status });
  }

  /**
   * Permanently deletes a lead from Firestore
   */
  static async deleteLeadPermanently(id: string): Promise<void> {
    const docRef = doc(db, 'leads', id);
    await deleteDoc(docRef);
  }

  // ==========================================
  // AI LANDING PAGES (PERMANENT STORAGE)
  // ==========================================

  static async saveAiPage(page: AiLandingPageResult): Promise<void> {
    const docRef = doc(db, 'ai_landing_pages', page.propertyId);
    await setDoc(docRef, page, { merge: true });
  }

  static async getAiPageByPropertyId(propertyId: string): Promise<AiLandingPageResult | null> {
    try {
      const docRef = doc(db, 'ai_landing_pages', propertyId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as AiLandingPageResult;
      }
      return null;
    } catch {
      return null;
    }
  }
}
