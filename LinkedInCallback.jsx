import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, doc, setDoc, getDoc, serverTimestamp, auth, createUserWithEmailAndPassword } from '../../firebase';
import { C, FONTS } from '../../tokens';
import { Spinner, Alert } from '../../components/ui/index';

/**
 * LinkedIn OAuth 2.0 Callback Handler
 *
 * Flow:
 * 1. LinkedIn redirects here with ?code=xxx&state=xxx
 * 2. We exchange the code for an access token via LinkedIn's token endpoint
 * 3. We call LinkedIn's /userinfo endpoint to get profile data
 * 4. We sign the user into Firebase (create account if new, sign in if existing)
 * 5. We store LinkedIn profile data in Firestore
 *
 * NOTE: LinkedIn's token exchange requires a client_secret which cannot be
 * in frontend code. For production, proxy this through a Firebase Cloud Function.
 * See: /functions/linkedin-auth/index.js (to be created separately)
 *
 * For development/testing, we simulate the LinkedIn data here.
 */
export default function LinkedInCallback() {
  const { loginWithEmail, registerWithEmail, currentUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing LinkedIn login…');
  const [error, setError]   = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code   = params.get('code');
      const state  = params.get('state');
      const savedState = sessionStorage.getItem('linkedin_state');
      const verifier   = sessionStorage.getItem('linkedin_cv');

      if (!code) {
        setError('LinkedIn login was cancelled or failed.');
        return;
      }

      if (state !== savedState) {
        setError('Security check failed. Please try again.');
        return;
      }

      try {
        setStatus('Verifying with LinkedIn…');

        /**
         * PRODUCTION: Replace this block with a call to your Firebase Cloud Function
         * that exchanges the code for an access token and returns the LinkedIn profile.
         *
         * Example Cloud Function call:
         * const resp = await fetch('https://your-region-your-project.cloudfunctions.net/linkedinAuth', {
         *   method: 'POST',
         *   headers: { 'Content-Type': 'application/json' },
         *   body: JSON.stringify({ code, codeVerifier: verifier, redirectUri: LINKEDIN_REDIRECT_URI }),
         * });
         * const { profile, firebaseToken } = await resp.json();
         * await signInWithCustomToken(auth, firebaseToken);
         */

        // ── DEVELOPMENT SIMULATION ──────────────────────────────────────────
        // In production, replace with actual LinkedIn profile data from above call.
        const mockLinkedInProfile = {
          sub:          'li_' + Math.random().toString(36).substring(7),
          name:         'LinkedIn User',
          given_name:   'LinkedIn',
          family_name:  'User',
          email:        `linkedin_${Date.now()}@hireahotelier.dev`,
          picture:      '',
          headline:     '',
          publicProfileUrl: '',
        };
        // ────────────────────────────────────────────────────────────────────

        setStatus('Creating your profile…');

        // Check if this LinkedIn account is already linked to a Firebase user
        const linkedinRef = doc(db, 'linkedinAccounts', mockLinkedInProfile.sub);
        const existing    = await getDoc(linkedinRef);

        if (existing.exists()) {
          // Link already exists → sign in
          const uid = existing.data().uid;
          setStatus('Signing you in…');
          // Normally you'd use signInWithCustomToken here
          // For now, redirect to dashboard
          navigate('/candidate/dashboard');
        } else {
          // New LinkedIn user → create account
          // Store the LinkedIn profile data for the registration form to use
          sessionStorage.setItem('linkedin_profile', JSON.stringify(mockLinkedInProfile));
          navigate('/register?from=linkedin');
        }

        // Clean up PKCE tokens
        sessionStorage.removeItem('linkedin_cv');
        sessionStorage.removeItem('linkedin_state');
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError('LinkedIn login failed. Please try again or use email.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg,${C.navy},${C.navyLight})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: C.white, borderRadius: 20, padding: '40px 44px', textAlign: 'center', maxWidth: 400, width: '100%', margin: 16 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{error ? '❌' : '🔄'}</div>
        {error ? (
          <>
            <Alert type="error">{error}</Alert>
            <button
              onClick={() => navigate('/login')}
              style={{ marginTop: 16, background: C.navy, color: 'white', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body }}
            >← Back to Login</button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Spinner size={36} color={C.gold} />
            </div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{status}</div>
            <div style={{ fontSize: 13, color: C.muted, fontFamily: FONTS.body }}>Please wait a moment…</div>
          </>
        )}
      </div>
    </div>
  );
}
