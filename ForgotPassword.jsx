import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C, FONTS, SHADOWS } from '../../tokens';
import { GoldBtn, Input, Alert } from '../../components/ui/index';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.code === 'auth/user-not-found' ? 'No account found with this email.' : 'Failed to send reset email. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: SHADOWS.lg, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{sent ? '📬' : '🔐'}</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
          {sent ? 'Check Your Email' : 'Reset Password'}
        </div>
        {sent ? (
          <>
            <p style={{ fontSize: 14, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 20 }}>
              We've sent a password reset link to <strong style={{ color: C.navy }}>{email}</strong>. Check your inbox (and spam folder).
            </p>
            <Link to="/login">
              <GoldBtn full>← Back to Login</GoldBtn>
            </Link>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 20 }}>
              Enter your registered email and we'll send you a reset link.
            </p>
            {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required icon="📧" />
              </div>
              <GoldBtn type="submit" full disabled={loading}>{loading ? 'Sending…' : 'Send Reset Link'}</GoldBtn>
            </form>
            <p style={{ marginTop: 16, fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>
              Remembered it? <Link to="/login" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
