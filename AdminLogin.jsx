import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C, FONTS, SHADOWS } from '../../tokens';
import { AC } from '../../components/admin/AdminLayout';

export default function AdminLogin() {
  const { loginWithEmail, userProfile }  = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      // Auth state change will update userProfile; navigate after brief delay
      setTimeout(() => {
        if (userProfile?.role === 'admin') navigate('/admin');
        else { setError('Access denied. This account does not have admin privileges.'); }
      }, 800);
    } catch (err) {
      const MSG = {
        'auth/user-not-found':  'No admin account found with this email.',
        'auth/wrong-password':  'Incorrect password.',
        'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      };
      setError(MSG[err.code] || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: AC.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: `radial-gradient(circle,rgba(201,160,82,0.06) 0%,transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, background: `radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ background: AC.surface, border: `1px solid ${AC.border}`, borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 400, boxShadow: '0 20px 80px rgba(0,0,0,0.6)', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: `linear-gradient(135deg,${AC.gold},${AC.goldLight})`, borderRadius: 16, fontSize: 26, marginBottom: 14, boxShadow: `0 4px 20px rgba(201,160,82,0.3)` }}>👑</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: AC.gold }}>Admin Panel</div>
          <div style={{ fontSize: 12, color: AC.muted, fontFamily: FONTS.body, marginTop: 4 }}>HireAHotelier.com · Restricted Access</div>
        </div>

        {/* Security warning */}
        <div style={{ background: AC.redBg, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 8, padding: '8px 12px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 11, color: AC.red, fontFamily: FONTS.body }}>Authorised personnel only. All access is logged.</span>
        </div>

        {error && (
          <div style={{ background: AC.redBg, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 12, color: AC.red, fontFamily: FONTS.body }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: AC.muted, fontFamily: FONTS.body, marginBottom: 5, letterSpacing: 0.5, textTransform: 'uppercase' }}>Admin Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@hireahotelier.com" required
              style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: AC.text, fontFamily: FONTS.body, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = AC.gold}
              onBlur={e => e.target.style.borderColor = AC.border}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: AC.muted, fontFamily: FONTS.body, marginBottom: 5, letterSpacing: 0.5, textTransform: 'uppercase' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password" required
              style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: AC.text, fontFamily: FONTS.body, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = AC.gold}
              onBlur={e => e.target.style.borderColor = AC.border}
            />
          </div>
          <button
            type="submit" disabled={loading || !email || !password}
            style={{ width: '100%', background: loading ? 'rgba(201,160,82,0.5)' : `linear-gradient(135deg,${AC.gold},${AC.goldLight})`, color: loading ? 'rgba(0,0,0,0.4)' : AC.bg, border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONTS.body, boxShadow: '0 2px 12px rgba(201,160,82,0.3)', transition: 'all 0.15s' }}
          >
            {loading ? '🔐 Verifying…' : '🔐 Access Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: AC.muted, fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body }}>
            ← Back to Public Site
          </button>
        </div>

        {/* IP / session note */}
        <div style={{ marginTop: 16, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>🔒 Secured · Session expires in 8 hours · 2FA coming soon</span>
        </div>
      </div>
    </div>
  );
}
