import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  auth, db,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile,
  sendPasswordResetEmail,
  doc, getDoc, setDoc, serverTimestamp,
  createUserProfile, getUserProfile, updateUserProfile,
  loginWithLinkedIn,
} from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);  // Firebase user
  const [userProfile, setUserProfile]   = useState(null);  // Firestore profile
  const [loading, setLoading]           = useState(true);
  const [authError, setAuthError]       = useState('');

  // ─── Load Firestore profile when auth changes ────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ─── AUTH ACTIONS ────────────────────────────────────────────────────────

  /** Register with email + password. role: 'seeker' | 'employer' */
  const registerWithEmail = useCallback(async ({
    email, password, displayName, role, nationality, hotelName,
  }) => {
    setAuthError('');
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    const profileData = {
      uid: user.uid,
      email,
      displayName,
      role,        // 'seeker' | 'employer'
      photoURL: '',
      ...(role === 'seeker' ? {
        nationality: nationality || '',
        headline: '',
        department: '',
        experience: '',
        currentLocation: '',
        targetMarkets: [],
        skills: [],
        certifications: [],
        videoProfileURL: '',
        linkedinURL: '',
        linkedinData: null,
        resumeURL: '',
        profileStrength: 20,
        isOpenToWork: true,
        partTimeAvailable: false,
      } : {
        hotelName: hotelName || '',
        hotelCategory: '',
        country: '',
        city: '',
        website: '',
        isVerified: false,
        activeJobs: 0,
        totalHires: 0,
      }),
    };
    await createUserProfile(user.uid, profileData);
    setUserProfile(profileData);
    return user;
  }, []);

  /** Sign in with email + password */
  const loginWithEmail = useCallback(async (email, password) => {
    setAuthError('');
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }, []);

  /** Sign in via LinkedIn (redirects — see LinkedInCallback page) */
  const startLinkedInLogin = useCallback(() => {
    loginWithLinkedIn();
  }, []);

  /** Sign out */
  const logout = useCallback(async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  }, []);

  /** Update current user's Firestore profile */
  const updateProfile_ = useCallback(async (data) => {
    if (!currentUser) return;
    await updateUserProfile(currentUser.uid, data);
    setUserProfile(prev => ({ ...prev, ...data }));
  }, [currentUser]);

  /** Reset password */
  const resetPassword = useCallback((email) => {
    return sendPasswordResetEmail(auth, email);
  }, []);

  /** Refresh profile from Firestore */
  const refreshProfile = useCallback(async () => {
    if (!currentUser) return;
    const profile = await getUserProfile(currentUser.uid);
    setUserProfile(profile);
  }, [currentUser]);

  const value = {
    currentUser,
    userProfile,
    isSeeker:   userProfile?.role === 'seeker',
    isAdmin:    userProfile?.role === 'admin',
    isEmployer: userProfile?.role === 'employer',
    loading,
    authError,
    setAuthError,
    registerWithEmail,
    loginWithEmail,
    startLinkedInLogin,
    logout,
    updateProfile: updateProfile_,
    resetPassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
