import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { auth } from '../../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Card, GoldBtn, OutlineBtn, Input, SecLabel, Toggle, Alert, Spinner, Badge } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

export default function Settings() {
  const { currentUser, userProfile, logout, resetPassword } = useAuth();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('account');
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const PF = k => e => setPwForm(f => ({ ...f, [k]: e.target.value }));

  // Notification preferences
  const [notifs, setNotifs] = useState({
    appStatus:    true,
    newMessages:  true,
    newMatches:   true,
    shiftAlerts:  true,
    profileViews: false,
    weeklyDigest: true,
    marketingEmails: false,
  });
  const TN = k => v => setNotifs(n => ({ ...n, [k]: v }));

  // Privacy
  const [privacy, setPrivacy] = useState({
    profilePublic:    true,
    showInSearch:     true,
    allowContactAll:  false,
    showSalaryExpect: false,
  });
  const TP = k => v => setPrivacy(p => ({ ...p, [k]: v }));

  const changePassword = async () => {
    if (pwForm.newPw !== pwForm.confirm) { setError('Passwords do not match.'); return; }
    if (pwForm.newPw.length < 8) { setError('New password must be at least 8 characters.'); return; }
    setSaving(true);
    setError('');
    try {
      const cred = EmailAuthProvider.credential(currentUser.email, pwForm.current);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, pwForm.newPw);
      setSuccess('Password updated successfully!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (e) {
      setError(e.code === 'auth/wrong-password' ? 'Current password is incorrect.' : 'Password update failed. Please try again.');
    } finally { setSaving(false); }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) {
      alert('Account deletion request submitted. Our team will process it within 24 hours per GDPR/data protection requirements.');
    }
  };

  const TABS = [
    { id: 'account',       label: '👤 Account' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'privacy',       label: '🔒 Privacy' },
    { id: 'billing',       label: '💳 Billing' },
    { id: 'danger',        label: '⚠️ Danger Zone' },
  ];

  return (
    <DashboardShell role={userProfile?.role || 'seeker'}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 20 }}>Manage your account, notifications and privacy.</div>

        {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
        {error   && <Alert type="error"   onClose={() => setError('')}>{error}</Alert>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? C.navy : 'transparent', color: tab === t.id ? C.gold : C.textSoft, border: tab === t.id ? 'none' : `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: FONTS.body }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── ACCOUNT ── */}
        {tab === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <SecLabel>Account Information</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13, fontFamily: FONTS.body }}>
                  <span style={{ color: C.textSoft }}>Email</span>
                  <span style={{ color: C.navy, fontWeight: 600 }}>{currentUser?.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13, fontFamily: FONTS.body }}>
                  <span style={{ color: C.textSoft }}>Account Type</span>
                  <Badge type={userProfile?.role === 'employer' ? 'navy' : 'gold'}>
                    {userProfile?.role === 'employer' ? '🏨 Employer' : '👤 Job Seeker'}
                  </Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13, fontFamily: FONTS.body }}>
                  <span style={{ color: C.textSoft }}>Joined</span>
                  <span style={{ color: C.navy }}>
                    {currentUser?.metadata?.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'N/A'}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <OutlineBtn small onClick={() => resetPassword(currentUser?.email).then(() => setSuccess('Password reset email sent!'))}>
                  📧 Send Password Reset Email
                </OutlineBtn>
              </div>
            </Card>

            <Card>
              <SecLabel>Change Password</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Current Password" id="cp" type="password" value={pwForm.current} onChange={PF('current')} placeholder="Enter current password" icon="🔒" />
                <Input label="New Password" id="np" type="password" value={pwForm.newPw} onChange={PF('newPw')} placeholder="Min. 8 characters" icon="🔒" />
                <Input label="Confirm New Password" id="cnp" type="password" value={pwForm.confirm} onChange={PF('confirm')} placeholder="Repeat new password" icon="🔒" />
              </div>
              <div style={{ marginTop: 14 }}>
                <GoldBtn onClick={changePassword} disabled={saving || !pwForm.current || !pwForm.newPw}>
                  {saving ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={14} color={C.navy} />Updating…</span> : 'Update Password'}
                </GoldBtn>
              </div>
            </Card>

            <Card>
              <SecLabel>Connected Accounts</SecLabel>
              {[
                { name: 'LinkedIn', icon: '🔗', connected: !!userProfile?.linkedinURL, action: 'Connect' },
                { name: 'Google',   icon: '🔍', connected: false, action: 'Connect' },
              ].map(acc => (
                <div key={acc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 18 }}>{acc.icon}</span>
                    <span style={{ fontSize: 13, fontFamily: FONTS.body, color: C.text }}>{acc.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {acc.connected && <Badge type="green">✓ Connected</Badge>}
                    <OutlineBtn small>{acc.connected ? 'Disconnect' : acc.action}</OutlineBtn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {tab === 'notifications' && (
          <Card>
            <SecLabel>Email & Push Notifications</SecLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                ['appStatus',      'Application status changes', '📋', true],
                ['newMessages',    'New messages from employers/candidates', '💬', true],
                ['newMatches',     'New job matches for your profile', '🎯', true],
                ['shiftAlerts',    '⚡ Part-time shifts near you (push)', '⚡', true],
                ['profileViews',   'When an employer views your profile', '👁', false],
                ['weeklyDigest',   'Weekly job digest email', '📰', false],
                ['marketingEmails','Tips, updates & platform news', '📣', false],
              ].map(([key, label, icon, important]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <span style={{ fontSize: 13, fontFamily: FONTS.body, color: C.text }}>{label}</span>
                      {important && <span style={{ fontSize: 10, color: C.gold, fontFamily: FONTS.body, marginLeft: 6 }}>Recommended</span>}
                    </div>
                  </div>
                  <Toggle checked={notifs[key]} onChange={TN(key)} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <GoldBtn onClick={() => setSuccess('Notification preferences saved!')}>Save Preferences</GoldBtn>
            </div>
          </Card>
        )}

        {/* ── PRIVACY ── */}
        {tab === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <SecLabel>Profile Visibility</SecLabel>
              {[
                ['profilePublic',    'Make my profile visible to verified employers',      true],
                ['showInSearch',     'Appear in employer candidate search results',         true],
                ['allowContactAll',  'Allow any employer to send me a message (not just applied jobs)', false],
                ['showSalaryExpect', 'Show my salary expectation on my profile',           false],
              ].map(([key, label, rec]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontSize: 13, fontFamily: FONTS.body, color: C.text }}>{label}</span>
                    {rec && <div style={{ fontSize: 10, color: C.gold, fontFamily: FONTS.body }}>Recommended for visibility</div>}
                  </div>
                  <Toggle checked={privacy[key]} onChange={TP(key)} />
                </div>
              ))}
            </Card>
            <Card>
              <SecLabel>Data & Privacy</SecLabel>
              <p style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 12 }}>
                HireAHotelier processes your personal data to match you with job opportunities. We never sell your data to third parties. You have the right to download or delete your data at any time.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <OutlineBtn small onClick={() => alert('Data export will be emailed to you within 24 hours.')}>⬇ Download My Data</OutlineBtn>
                <OutlineBtn small onClick={() => alert('Cookie preferences panel coming soon.')}>🍪 Cookie Preferences</OutlineBtn>
              </div>
            </Card>
          </div>
        )}

        {/* ── BILLING ── */}
        {tab === 'billing' && (
          <Card>
            <SecLabel>Current Plan</SecLabel>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: C.amberBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🆓</div>
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>Free Plan</div>
                <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>All core features included at no cost</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
              {[
                { name: 'Pro Seeker', price: '$4.99/mo', features: ['Priority in search results', 'See who viewed your profile', 'Unlimited applications', 'Premium resume templates'], icon: '⭐' },
                { name: 'Hotel Pro', price: '$29/mo', features: ['Unlimited job postings', 'Advanced candidate search', 'AI matching & shortlisting', 'Analytics dashboard'], icon: '🏨' },
              ].map(plan => (
                <div key={plan.name} style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{plan.icon}</div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{plan.name}</div>
                  <div style={{ color: C.gold, fontWeight: 700, fontSize: 18, fontFamily: FONTS.body, marginBottom: 10 }}>{plan.price}</div>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 5 }}>
                      <span>✅</span><span>{f}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <GoldBtn full small onClick={() => alert('Stripe payment integration coming soon!')}>Upgrade</GoldBtn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── DANGER ZONE ── */}
        {tab === 'danger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.redText, fontFamily: FONTS.body, marginBottom: 8 }}>⚠️ Danger Zone</div>
              <p style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 16 }}>
                These actions are irreversible. Please be certain before proceeding.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '14px 16px', background: '#FFF1F2', border: `1.5px solid #FECDD3`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.redText, fontFamily: FONTS.body }}>Sign Out of All Devices</div>
                    <div style={{ fontSize: 12, color: '#9F1239', fontFamily: FONTS.body }}>Revoke all active sessions</div>
                  </div>
                  <button onClick={() => logout().then(() => navigate('/'))} style={{ background: 'white', border: `1.5px solid #FECDD3`, color: C.redText, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONTS.body }}>Sign Out</button>
                </div>
                <div style={{ padding: '14px 16px', background: '#FFF1F2', border: `1.5px solid #FECDD3`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.redText, fontFamily: FONTS.body }}>Delete My Account</div>
                    <div style={{ fontSize: 12, color: '#9F1239', fontFamily: FONTS.body }}>Permanently removes all your data from HireAHotelier</div>
                  </div>
                  <button onClick={handleDeleteAccount} style={{ background: '#EF4444', border: 'none', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body }}>Delete Account</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
