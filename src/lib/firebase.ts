/**
 * FocusBoost Firebase Client SDK
 *
 * Real Firebase Authentication + Firestore, with automatic
 * LocalStorage offline fallback if environment variables are not set.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

// Re-export the Firebase User type so the rest of the app can import it here
export type { User as FirebaseUser };

// ---------------------------------------------------------------------------
// 1. Detect if Real Firebase keys are actually configured for this deployment
// ---------------------------------------------------------------------------
const getMissingFirebaseConfig = () => {
  const requiredKeys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;

  return requiredKeys.filter((key) => {
    const value = process.env[key];
    return !value || value.trim() === "";
  });
};

export const firebaseConfigStatus = {
  configured: getMissingFirebaseConfig().length === 0,
  missing: getMissingFirebaseConfig(),
};

export const isCloudConnected = firebaseConfigStatus.configured;

const isLocalDevHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local"));

// ---------------------------------------------------------------------------
// 2. Real Firebase initialization (conditional)
// ---------------------------------------------------------------------------
let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let googleProvider: GoogleAuthProvider | null = null;

if (isCloudConnected) {
  try {
    const firebaseConfig = {
      apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (err) {
    console.error("Failed to initialize actual Firebase SDK. Defaulting to local storage mode.", err);
  }
}

// ---------------------------------------------------------------------------
// 3. Local Storage fallback helpers for Simulated/Offline Mode
// ---------------------------------------------------------------------------
const simulateDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const createMockUserId = (email?: string) => {
  const seed = email ? email.toLowerCase().replace(/[^a-z0-9]/g, "") : Math.random().toString(36).slice(2, 10);
  return `mock-user-${seed}-${Date.now()}`;
};

const getLocalCollection = (collection: string): Record<string, any> => {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(`flowzone_offline_${collection}`);
  return data ? JSON.parse(data) : {};
};

const saveLocalCollection = (collection: string, data: Record<string, any>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`flowzone_offline_${collection}`, JSON.stringify(data));
};

// Simulated Auth listeners & state
let mockAuthListeners: ((user: User | null) => void)[] = [];
let mockCurrentUser: User | null = null;

if (typeof window !== "undefined" && !isCloudConnected) {
  const storedUser = localStorage.getItem("flowzone_offline_active_user");
  if (storedUser) {
    mockCurrentUser = JSON.parse(storedUser) as User;
  }
}

const notifyMockAuthListeners = () => {
  mockAuthListeners.forEach((cb) => cb(mockCurrentUser));
};

// ---------------------------------------------------------------------------
// 4. Unified Convenience Auth Helpers
// ---------------------------------------------------------------------------

/** Open Google account picker (Real popup or Simulated login) */
export async function signInWithGoogle(): Promise<User> {
  if (isCloudConnected && auth && googleProvider) {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }

  if (!isLocalDevHost) {
    throw new Error(
      "Google sign-in is not configured for this deployment. Add the Firebase environment variables in Vercel and redeploy."
    );
  }

  // Simulated Google Login only for local development
  await simulateDelay(600);
  const mockEmail = `google.user.${Math.random().toString(36).slice(2, 8)}@example.com`;
  const mockUser = {
    uid: createMockUserId(mockEmail),
    email: mockEmail,
    displayName: "Google Explorer",
    photoURL: null,
  } as any as User;

  mockCurrentUser = mockUser;
  localStorage.setItem("flowzone_offline_active_user", JSON.stringify(mockUser));
  notifyMockAuthListeners();
  return mockUser;
}

/** Email + password sign-in (Real or Simulated) */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (isCloudConnected && auth) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  if (!isLocalDevHost) {
    throw new Error(
      "Email sign-in is not configured for this deployment. Add the Firebase environment variables in Vercel and redeploy."
    );
  }

  // Simulated Email Login
  await simulateDelay(600);
  const users = getLocalCollection("registered_users");
  const matched = Object.values(users).find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!matched) {
    throw new Error("auth/wrong-password-or-email: The email address or password provided is incorrect.");
  }

  const mockUser = {
    uid: matched.uid,
    email: matched.email,
    displayName: matched.displayName,
  } as any as User;

  mockCurrentUser = mockUser;
  localStorage.setItem("flowzone_offline_active_user", JSON.stringify(mockUser));
  notifyMockAuthListeners();
  return mockUser;
}

/** Email + password sign-up, with display name (Real or Simulated) */
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
  if (isCloudConnected && auth) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user;
  }

  if (!isLocalDevHost) {
    throw new Error(
      "Email sign-up is not configured for this deployment. Add the Firebase environment variables in Vercel and redeploy."
    );
  }

  // Simulated Email Sign-Up
  await simulateDelay(600);
  if (password.length < 6) {
    throw new Error("auth/weak-password: Password should be at least 6 characters.");
  }

  const users = getLocalCollection("registered_users");
  const emailExists = Object.values(users).some((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    throw new Error("auth/email-already-in-use: An account with this email address already exists.");
  }

  const uid = `usr-${Date.now()}`;
  const newUser = {
    uid,
    email,
    displayName,
    password,
    createdAt: new Date().toISOString()
  };

  users[uid] = newUser;
  saveLocalCollection("registered_users", users);

  const mockUser = {
    uid,
    email,
    displayName,
  } as any as User;

  mockCurrentUser = mockUser;
  localStorage.setItem("flowzone_offline_active_user", JSON.stringify(mockUser));
  notifyMockAuthListeners();
  return mockUser;
}

/** Sign out (Real or Simulated) */
export async function firebaseSignOut(): Promise<void> {
  if (isCloudConnected && auth) {
    await signOut(auth);
  } else {
    await simulateDelay(300);
    mockCurrentUser = null;
    localStorage.removeItem("flowzone_offline_active_user");
    notifyMockAuthListeners();
  }
}

/** Listen to auth state changes (Real or Simulated) */
export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  if (isCloudConnected && auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    mockAuthListeners.push(callback);
    // Initial call
    callback(mockCurrentUser);
    return () => {
      mockAuthListeners = mockAuthListeners.filter((cb) => cb !== callback);
    };
  }
}

// Timeout wrapper helper to prevent hanging on uninitialized/blocked Firestore instances
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
};

// ---------------------------------------------------------------------------
// 5. Unified Firestore Helpers (Real or Simulated)
// ---------------------------------------------------------------------------

/** Write or merge a user document under /users/{uid} */
export async function saveUserData(uid: string, data: Record<string, unknown>): Promise<void> {
  // Always cache locally under user specific key
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(`focusboost_user_data_${uid}`);
      const merged = existing ? { ...JSON.parse(existing), ...data } : data;
      localStorage.setItem(`focusboost_user_data_${uid}`, JSON.stringify(merged));
    } catch (e) {}
  }

  if (isCloudConnected && db) {
    try {
      const ref = doc(db, "users", uid);
      await withTimeout(setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true }), 1200, undefined);
    } catch (err) {
      console.warn("[Firebase] Firestore saveUserData timed out or failed:", err);
    }
  } else {
    await simulateDelay(200);
    const usersData = getLocalCollection("users");
    const existing = usersData[uid] || {};
    usersData[uid] = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveLocalCollection("users", usersData);
  }
}

/** Read a user document */
export async function getUserData(uid: string): Promise<any> {
  if (isCloudConnected && db) {
    try {
      const ref = doc(db, "users", uid);
      const snap = await withTimeout(getDoc(ref), 1200, null as any);
      if (snap && snap.exists()) {
        return snap.data();
      }
    } catch (err) {
      console.warn("[Firebase] Firestore getUserData timed out or failed:", err);
    }
  }

  // Fallback to local storage user cache if cloud reads fail/timeout or offline
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(`focusboost_user_data_${uid}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
  }

  return null;
}

/** Update specific fields in a user document */
export async function updateUserData(uid: string, data: Record<string, unknown>): Promise<void> {
  await saveUserData(uid, data);
}

