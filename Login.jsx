import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C, FONTS, SHADOWS } from '../../tokens';
import { GoldBtn, LinkedInBtn, Input, Alert, Divider, Spinner } from '../../components/ui/index';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function Login() {
  const { loginWithEmail, startLinkedInLogin, authError, setAuthError } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setAuthError('');
    try {
      const user = await loginWithEmail(form.email, form.password);
      // Redirect based on role (profile loaded async, navigate to dashboard)
      navigate(from || '/candidate/dashboard');
    } catch (err) {
      const MSG = {
        'auth/user-not-found':  'No account found with this email.',
        'auth/wrong-password':  'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      setAuthError(MSG[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLight} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 400, height: 400, background: `radial-gradient(circle,rgba(201,160,82,.08) 0%,transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{
        background: C.white, borderRadius: 20, padding: isMobile ? '28px 20px' : '40px 44px',
        width: '100%', maxWidth: 440, boxShadow: SHADOWS.lg, position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
            borderRadius: 14, fontSize: 24, marginBottom: 12,
          }}>🏨</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: C.navy }}>Welcome Back</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontFamily: FONTS.body }}>Sign in to HireAHotelier.com</div>
        </div>

        {authError && <Alert type="error" onClose={() => setAuthError('')}>{authError}</Alert>}

        {/* LinkedIn Sign In */}
        <div style={{ marginBottom: 16 }}>
          <LinkedInBtn onClick={startLinkedInLogin}>Continue with LinkedIn</LinkedInBtn>
        </div>

        <Divider text="or sign in with email" />

        {/* Email form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Email Address" id="email" type="email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" required error={errors.email}
              icon="📧"
            />
            <div>
              <Input
                label="Password" id="password" type={showPw ? 'text' : 'password'}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Your password" required error={errors.password}
                icon="🔒"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>
                  <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} style={{ accentColor: C.navy }} />
                  Show password
                </label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: C.gold, textDecoration: 'none', fontFamily: FONTS.body }}>Forgot password?</Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <GoldBtn type="submit" full disabled={loading}>
              {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner size={16} color={C.navy} /> Signing in…</span> : 'Sign In'}
            </GoldBtn>
          </div>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.textSoft, marginTop: 20, fontFamily: FONTS.body }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Create one free →</Link>
        </p>

        {/* Trust badge */}
        <div style={{
          marginTop: 24, padding: '10px 14px',
          background: C.greenBg, border: `1px solid ${C.greenBorder}`,
          borderRadius: 10, textAlign: 'center',
        }}>
          <span style={{ fontSize: 12, color: C.greenText, fontFamily: FONTS.body }}>
            🔒 No agents · No fees · 100% direct hiring
          </span>
        </div>
      </div>
    </div>
  );
}
