/**
 * FlowZone Simulated Firebase Client SDK
 * 
 * Provides a high-fidelity client-side replica of Firebase Authentication
 * and Firestore. This allows the application to function immediately with Zero dependencies,
 * zero-config setup, while simulating realistic cloud database delays, sync queues,
 * and console database auditing, as if it were connected to a live Firestore backend.
 */

// Simulated network latency helper
const simulateDelay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Audits database queries to the developer console
const logDBAction = (action: string, collection: string, id?: string, data?: any) => {
  if (typeof window !== "undefined") {
    console.log(
      `%c🔥 [Firebase Firestore] ${action.toUpperCase()} | Collection: ${collection} ${
        id ? `| Doc ID: ${id}` : ""
      }`,
      "color: #ff9100; font-weight: bold; background: #1a0f00; padding: 2px 6px; border-radius: 4px;",
      data || ""
    );
  }
};

// ----------------------------------------------------------------------------
// 1. Simulated Firebase Firestore Database (Client-Side replica)
// ----------------------------------------------------------------------------
class SimulatedFirestore {
  private getStorageData(collectionName: string): Record<string, any> {
    if (typeof window === "undefined") return {};
    const key = `flowzone_cloud_${collectionName}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  }

  private setStorageData(collectionName: string, data: Record<string, any>) {
    if (typeof window === "undefined") return;
    const key = `flowzone_cloud_${collectionName}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Write or merge data into a document
   */
  async setDoc(collectionName: string, docId: string, data: any, options: { merge?: boolean } = {}) {
    await simulateDelay(500);
    const existing = this.getStorageData(collectionName);
    const docData = existing[docId] || {};
    
    existing[docId] = options.merge 
      ? { ...docData, ...data, updatedAt: new Date().toISOString() }
      : { ...data, updatedAt: new Date().toISOString() };
      
    this.setStorageData(collectionName, existing);
    logDBAction("Set Doc", collectionName, docId, existing[docId]);
    
    // Dispatch system-wide simulated real-time listener update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(`firestore_update_${collectionName}_${docId}`, { detail: existing[docId] }));
      window.dispatchEvent(new CustomEvent(`firestore_update_${collectionName}`, { detail: existing }));
    }
    return { id: docId, ...existing[docId] };
  }

  /**
   * Retrieve a single document
   */
  async getDoc(collectionName: string, docId: string) {
    await simulateDelay(400);
    const data = this.getStorageData(collectionName);
    const doc = data[docId];
    logDBAction("Get Doc", collectionName, docId, doc || "NOT FOUND");
    return doc ? { exists: true, data: () => doc, id: docId } : { exists: false, data: () => null, id: docId };
  }

  /**
   * Retrieve all documents in a collection
   */
  async getDocs(collectionName: string) {
    await simulateDelay(600);
    const data = this.getStorageData(collectionName);
    const docs = Object.entries(data).map(([id, val]: [string, any]) => ({
      id,
      data: () => val
    }));
    logDBAction("Get Collection Docs", collectionName, undefined, { count: docs.length });
    return {
      docs,
      empty: docs.length === 0,
      size: docs.length
    };
  }

  /**
   * Real-time subscription to a single document
   */
  onSnapshotDoc(collectionName: string, docId: string, callback: (doc: any) => void) {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback({
        exists: customEvent.detail !== null,
        data: () => customEvent.detail,
        id: docId
      });
    };
    
    if (typeof window !== "undefined") {
      window.addEventListener(`firestore_update_${collectionName}_${docId}`, handler);
    }
    
    // Trigger initial load
    this.getDoc(collectionName, docId).then((res) => {
      callback(res);
    });

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(`firestore_update_${collectionName}_${docId}`, handler);
      }
    };
  }
}

export const db = new SimulatedFirestore();

// ----------------------------------------------------------------------------
// 2. Simulated Firebase Authentication
// ----------------------------------------------------------------------------
export interface SimulatedUser {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

class SimulatedAuth {
  private listeners: ((user: SimulatedUser | null) => void)[] = [];
  private currentUser: SimulatedUser | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const activeUser = localStorage.getItem("flowzone_active_user");
      if (activeUser) {
        this.currentUser = JSON.parse(activeUser);
      }
    }
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentUser));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: SimulatedUser | null) => void) {
    this.listeners.push(callback);
    // Initial call
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  async createUserWithEmailAndPassword(email: string, password: string, displayName = "Productive Nomad") {
    await simulateDelay(800);
    
    if (password.length < 6) {
      throw new Error("auth/weak-password: Password should be at least 6 characters.");
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("flowzone_registered_users") || "[]");
    if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("auth/email-already-in-use: An account with this email address already exists.");
    }

    const newUser: SimulatedUser = {
      uid: `usr-${Date.now()}`,
      email,
      displayName,
      createdAt: new Date().toISOString()
    };

    users.push({ ...newUser, password });
    localStorage.setItem("flowzone_registered_users", JSON.stringify(users));
    
    // Log in automatically
    this.currentUser = newUser;
    localStorage.setItem("flowzone_active_user", JSON.stringify(newUser));
    
    logDBAction("Sign Up Auth", "auth", newUser.uid, newUser);
    this.notify();
    return { user: newUser };
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await simulateDelay(800);
    const users = JSON.parse(localStorage.getItem("flowzone_registered_users") || "[]");
    const matched = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matched) {
      throw new Error("auth/wrong-password-or-email: The email address or password provided is incorrect.");
    }

    const loggedUser: SimulatedUser = {
      uid: matched.uid,
      email: matched.email,
      displayName: matched.displayName,
      createdAt: matched.createdAt
    };

    this.currentUser = loggedUser;
    localStorage.setItem("flowzone_active_user", JSON.stringify(loggedUser));
    
    logDBAction("Login Auth", "auth", loggedUser.uid, loggedUser);
    this.notify();
    return { user: loggedUser };
  }

  async signInWithGoogle(email: string = "google.user@flowzone.app", displayName: string = "Google Explorer") {
    await simulateDelay(1000);
    const users = JSON.parse(localStorage.getItem("flowzone_registered_users") || "[]");
    let matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matched) {
      matched = {
        uid: `usr-google-${Date.now()}`,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        isOAuth: true
      };
      users.push(matched);
      localStorage.setItem("flowzone_registered_users", JSON.stringify(users));
    }
    
    const loggedUser: SimulatedUser = {
      uid: matched.uid,
      email: matched.email,
      displayName: matched.displayName,
      createdAt: matched.createdAt
    };
    
    this.currentUser = loggedUser;
    localStorage.setItem("flowzone_active_user", JSON.stringify(loggedUser));
    
    logDBAction("Google Sign In Auth", "auth", loggedUser.uid, loggedUser);
    this.notify();
    return { user: loggedUser };
  }

  async signInWithGithub(email: string = "github.user@flowzone.app", displayName: string = "GitHub Octocat") {
    await simulateDelay(1000);
    const users = JSON.parse(localStorage.getItem("flowzone_registered_users") || "[]");
    let matched = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matched) {
      matched = {
        uid: `usr-github-${Date.now()}`,
        email,
        displayName,
        createdAt: new Date().toISOString(),
        isOAuth: true
      };
      users.push(matched);
      localStorage.setItem("flowzone_registered_users", JSON.stringify(users));
    }
    
    const loggedUser: SimulatedUser = {
      uid: matched.uid,
      email: matched.email,
      displayName: matched.displayName,
      createdAt: matched.createdAt
    };
    
    this.currentUser = loggedUser;
    localStorage.setItem("flowzone_active_user", JSON.stringify(loggedUser));
    
    logDBAction("GitHub Sign In Auth", "auth", loggedUser.uid, loggedUser);
    this.notify();
    return { user: loggedUser };
  }

  async signOut() {
    await simulateDelay(400);
    logDBAction("Sign Out Auth", "auth", this.currentUser?.uid);
    this.currentUser = null;
    localStorage.removeItem("flowzone_active_user");
    this.notify();
  }
}

export const auth = new SimulatedAuth();
