import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { C, FONTS, SHADOWS, LABOUR_ORIGINS } from '../../tokens';
import { GoldBtn, LinkedInBtn, NavyBtn, Input, Select, Alert, Divider, Spinner } from '../../components/ui/index';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function Register() {
  const { registerWithEmail, startLinkedInLogin, authError, setAuthError } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  const [role, setRole]       = useState('');   // 'seeker' | 'employer'
  const [step, setStep]       = useState(1);    // 1: role, 2: details
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    displayName: '', nationality: '', hotelName: '',
  });
  const F = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : v.target.value }));

  const validateStep2 = () => {
    const e = {};
    if (!form.displayName.trim()) e.displayName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (role === 'seeker' && !form.nationality) e.nationality = 'Please select your nationality';
    if (role === 'employer' && !form.hotelName.trim()) e.hotelName = 'Hotel / company name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setAuthError('');
    try {
      await registerWithEmail({ ...form, role });
      navigate(role === 'seeker' ? '/candidate/dashboard' : '/employer/dashboard');
    } catch (err) {
      const MSG = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password should be at least 6 characters.',
      };
      setAuthError(MSG[err.code] || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLight} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: C.white, borderRadius: 20,
        padding: isMobile ? '24px 18px' : '36px 44px',
        width: '100%', maxWidth: 460, boxShadow: SHADOWS.lg,
      }}>
        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 42, height: 42, background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏨</div>
            <span style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy }}>HireAHotelier</span>
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: C.navy }}>Create Your Free Account</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontFamily: FONTS.body }}>Join 85,000+ hospitality professionals</div>
        </div>

        {authError && <Alert type="error" onClose={() => setAuthError('')}>{authError}</Alert>}

        {/* ── STEP 1: Role Selection ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: FONTS.body, marginBottom: 16, textAlign: 'center' }}>I am joining as a…</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[
                { r: 'seeker', icon: '👤', title: 'Job Seeker', desc: 'Find hospitality jobs in GCC, Asia & Australia' },
                { r: 'employer', icon: '🏨', title: 'Employer / Hotel', desc: 'Post jobs and hire directly, no agents' },
              ].map(({ r, icon, title, desc }) => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    border: `2px solid ${role === r ? C.gold : C.border}`,
                    background: role === r ? C.cream : C.white,
                    borderRadius: 14, padding: '16px 14px', cursor: 'pointer',
                    textAlign: 'center', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 11, color: C.textSoft, lineHeight: 1.5, fontFamily: FONTS.body }}>{desc}</div>
                  {role === r && <div style={{ marginTop: 8, background: C.gold, color: C.navy, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '2px 12px', display: 'inline-block', fontFamily: FONTS.body }}>✓ Selected</div>}
                </div>
              ))}
            </div>

            <GoldBtn full disabled={!role} onClick={() => role && setStep(2)}>
              Continue as {role === 'seeker' ? 'Job Seeker' : role === 'employer' ? 'Employer' : '…'} →
            </GoldBtn>

            <div style={{ marginTop: 14 }}>
              <LinkedInBtn onClick={startLinkedInLogin}>Sign up with LinkedIn</LinkedInBtn>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: C.textSoft, marginTop: 16, fontFamily: FONTS.body }}>
              Already have an account? <Link to="/login" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>
        )}

        {/* ── STEP 2: Details Form ── */}
        {step === 2 && (
          <form onSubmit={handleRegister}>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: C.textSoft, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0, fontFamily: FONTS.body }}>← Back</button>

            <div style={{ background: C.amberBg, borderRadius: 10, padding: '8px 12px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{role === 'seeker' ? '👤' : '🏨'}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.amberText, fontFamily: FONTS.body }}>
                Registering as: {role === 'seeker' ? 'Job Seeker' : 'Employer / Hotel'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label={role === 'employer' ? 'Your Full Name' : 'Full Name'} id="name" value={form.displayName} onChange={F('displayName')} placeholder="e.g. Rajan Mehta" required error={errors.displayName} icon="👤" />

              {role === 'employer' && (
                <Input label="Hotel / Company Name" id="hotelName" value={form.hotelName} onChange={F('hotelName')} placeholder="e.g. Burj Al Arab, Shangri-La Group" required error={errors.hotelName} icon="🏨" />
              )}

              {role === 'seeker' && (
                <Select
                  label="Nationality" id="nationality"
                  value={form.nationality} onChange={F('nationality')}
                  placeholder="Select your nationality"
                  required error={errors.nationality}
                  options={LABOUR_ORIGINS.map(o => ({ value: o.code, label: `${o.flag} ${o.label}` }))}
                />
              )}

              <Input label="Email Address" id="email" type="email" value={form.email} onChange={F('email')} placeholder="you@example.com" required error={errors.email} icon="📧" />
              <Input label="Password" id="password" type="password" value={form.password} onChange={F('password')} placeholder="Min. 8 characters" required error={errors.password} icon="🔒" />
              <Input label="Confirm Password" id="confirm" type="password" value={form.confirmPassword} onChange={F('confirmPassword')} placeholder="Repeat password" required error={errors.confirmPassword} icon="🔒" />
            </div>

            <p style={{ fontSize: 11, color: C.muted, marginTop: 12, lineHeight: 1.5, fontFamily: FONTS.body }}>
              By registering you agree to our <Link to="/terms" style={{ color: C.gold }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: C.gold }}>Privacy Policy</Link>.
            </p>

            <div style={{ marginTop: 18 }}>
              <GoldBtn type="submit" full disabled={loading}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner size={16} color={C.navy} />Creating Account…</span> : 'Create My Free Account 🚀'}
              </GoldBtn>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
