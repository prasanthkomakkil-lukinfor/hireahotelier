// ─── FIREBASE CONFIGURATION ──────────────────────────────────────────────────
// Copy .env.example → .env and fill in your Firebase project values.
// Firebase Console: https://console.firebase.google.com

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit,
  getDocs, addDoc, onSnapshot, serverTimestamp,
  increment,
} from 'firebase/firestore';
import {
  getStorage,
  ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// ─── RE-EXPORT FIREBASE FUNCTIONS ────────────────────────────────────────────
// Auth
export {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile,
  sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup,
};
// Firestore
export {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit,
  getDocs, addDoc, onSnapshot, serverTimestamp, increment,
};
// Storage
export { ref, uploadBytes, getDownloadURL, deleteObject };

// ─── LINKEDIN OAUTH HELPER ───────────────────────────────────────────────────
// LinkedIn does NOT have a Firebase built-in provider.
// Flow: Browser → LinkedIn OAuth → callback page → get profile → save to Firestore.
// We use PKCE (no backend secret required for token exchange in LinkedIn API v2).

export const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
export const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;

/** Generates a random code verifier for PKCE */
export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Generates code challenge from verifier */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Redirects to LinkedIn authorization URL */
export async function loginWithLinkedIn() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  // Store verifier for callback use
  sessionStorage.setItem('linkedin_cv', verifier);
  const state = Math.random().toString(36).substring(7);
  sessionStorage.setItem('linkedin_state', state);

  const params = new URLSearchParams({
    response_type:         'code',
    client_id:             LINKEDIN_CLIENT_ID,
    redirect_uri:          LINKEDIN_REDIRECT_URI,
    state,
    scope:                 'openid profile email',
    code_challenge:        challenge,
    code_challenge_method: 'S256',
  });
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
}

// ─── FIRESTORE HELPERS ───────────────────────────────────────────────────────

/** Get or create a user profile document */
export async function getUserProfile(uid) {
  const ref_ = doc(db, 'users', uid);
  const snap = await getDoc(ref_);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Create a new user profile after registration */
export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    profileViews: 0,
    profileComplete: 20,
  });
}

/** Update user profile fields */
export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Submit a job application */
export async function applyToJob(jobId, candidateId, coverNote = '') {
  return addDoc(collection(db, 'applications'), {
    jobId, candidateId, coverNote,
    status: 'applied',
    appliedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    statusHistory: [{ status: 'applied', at: new Date().toISOString() }],
  });
}

/** Update application status (employer action) */
export async function updateApplicationStatus(appId, status) {
  await updateDoc(doc(db, 'applications', appId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Post a new job listing */
export async function postJob(employerId, jobData) {
  return addDoc(collection(db, 'jobs'), {
    ...jobData,
    employerId,
    status: 'active',
    applicants: 0,
    views: 0,
    postedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Increment job views */
export async function incrementJobViews(jobId) {
  await updateDoc(doc(db, 'jobs', jobId), { views: increment(1) });
}

/** Submit a rating */
export async function submitRating(data) {
  return addDoc(collection(db, 'ratings'), {
    ...data,
    submittedAt: serverTimestamp(),
  });
}

/** Create an offer letter */
export async function createOfferLetter(data) {
  return addDoc(collection(db, 'offerLetters'), {
    ...data,
    status: 'sent',
    createdAt: serverTimestamp(),
  });
}
