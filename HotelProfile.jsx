import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS, JOB_MARKETS, HOTEL_CATEGORIES } from '../../tokens';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebase';
import { Card, GoldBtn, OutlineBtn, Input, Select, Textarea, SecLabel, Badge, Note, Alert, Spinner, Toggle, Stars } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

export default function HotelProfile() {
  const { userProfile, updateProfile, currentUser } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();
  const [tab, setTab]         = useState('info');
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');
  const logoRef = useRef();

  const [form, setForm] = useState({
    hotelName:     userProfile?.hotelName     || '',
    hotelCategory: userProfile?.hotelCategory || '',
    country:       userProfile?.country       || '',
    city:          userProfile?.city          || '',
    website:       userProfile?.website       || '',
    about:         userProfile?.about         || '',
    employeeCount: userProfile?.employeeCount || '',
    foundedYear:   userProfile?.foundedYear   || '',
    chain:         userProfile?.chain         || '',
    // Working conditions
    contractType:  userProfile?.contractType  || '',
    workingHours:  userProfile?.workingHours  || '',
    accommodation: userProfile?.accommodation || '',
    meals:         userProfile?.meals         || '',
    transport:     userProfile?.transport     || '',
    insurance:     userProfile?.insurance     || '',
    flightTickets: userProfile?.flightTickets || false,
    annualLeave:   userProfile?.annualLeave   || '',
    // Contact
    hrName:        userProfile?.hrName        || '',
    hrEmail:       userProfile?.hrEmail       || '',
    hrPhone:       userProfile?.hrPhone       || '',
  });
  const F = k => v => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : typeof v === 'boolean' ? v : v.target.value }));

  const handleLogoUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const r = ref(storage, `logos/${currentUser.uid}/hotel-logo`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await updateProfile({ photoURL: url });
    } catch { setError('Logo upload failed.'); }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError('Save failed. Please try again.'); }
    finally { setSaving(false); }
  };

  const TABS = [
    { id: 'info',       label: '🏨 Hotel Info' },
    { id: 'conditions', label: '📋 Working Conditions' },
    { id: 'contact',    label: '📞 HR Contact' },
    { id: 'verify',     label: '✓ Verification' },
  ];

  return (
    <DashboardShell role="employer">
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy }}>Hotel Profile</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Visible to all candidates · Keep it honest and detailed</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {saved && <span style={{ color: C.greenText, fontSize: 13, fontFamily: FONTS.body }}>✓ Saved!</span>}
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={14} color={C.navy} />Saving…</span> : '💾 Save Profile'}
            </GoldBtn>
          </div>
        </div>

        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

        {/* Logo + verified badge */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 80, height: 80, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, border: `3px solid ${C.gold}`, overflow: 'hidden' }}>
                {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🏨'}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
                {form.hotelName || 'Your Hotel Name'}
              </div>
              <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 8 }}>
                {form.city && form.country ? `${form.city} · ${JOB_MARKETS.find(m => m.code === form.country)?.flag} ${JOB_MARKETS.find(m => m.code === form.country)?.label}` : 'Add your city and country'}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge type={userProfile?.isVerified ? 'green' : 'gray'}>{userProfile?.isVerified ? '✓ Verified Hotel' : '⏳ Pending Verification'}</Badge>
                {form.hotelCategory && <Badge type="navy">{form.hotelCategory}</Badge>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Stars value={4} size={14} />
                  <span style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>4.7 (128 reviews)</span>
                </div>
              </div>
            </div>
            <div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              <OutlineBtn small onClick={() => logoRef.current.click()}>📷 Upload Logo</OutlineBtn>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? C.navy : 'transparent', color: tab === t.id ? C.gold : C.textSoft, border: tab === t.id ? 'none' : `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: FONTS.body }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Hotel Info ── */}
        {tab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <SecLabel>Basic Details</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Input label="Hotel / Company Name *" id="hn" value={form.hotelName} onChange={F('hotelName')} placeholder="e.g. Burj Al Arab Jumeirah" />
                <Select label="Hotel Category *" id="hcat" value={form.hotelCategory} onChange={F('hotelCategory')} options={HOTEL_CATEGORIES} placeholder="Select category" />
                <Select label="Country *" id="country" value={form.country} onChange={F('country')} options={JOB_MARKETS.map(m => ({ value: m.code, label: `${m.flag} ${m.label}` }))} placeholder="Select country" />
                <Input label="City" id="city" value={form.city} onChange={F('city')} placeholder="e.g. Dubai" />
                <Input label="Hotel Chain / Group" id="chain" value={form.chain} onChange={F('chain')} placeholder="e.g. Jumeirah Group, Marriott" />
                <Input label="Website" id="web" value={form.website} onChange={F('website')} placeholder="https://www.yourhotel.com" />
                <Input label="Number of Employees" id="emp" value={form.employeeCount} onChange={F('employeeCount')} placeholder="e.g. 500–1000" />
                <Input label="Founded Year" id="year" value={form.foundedYear} onChange={F('foundedYear')} placeholder="e.g. 1999" />
              </div>
            </Card>
            <Card>
              <Textarea label="About the Hotel" id="about" value={form.about} onChange={F('about')} placeholder="Describe your hotel, its history, ambiance, awards, and what makes it a great place to work…" rows={6} />
            </Card>
          </div>
        )}

        {/* ── TAB: Working Conditions ── */}
        {tab === 'conditions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <SecLabel>Employment Terms</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Input label="Contract Type" id="ct" value={form.contractType} onChange={F('contractType')} placeholder="e.g. 2-year renewable, Permanent" />
                <Input label="Working Hours" id="wh" value={form.workingHours} onChange={F('workingHours')} placeholder="e.g. 48 hrs/week, 6 days" />
                <Input label="Annual Leave" id="al" value={form.annualLeave} onChange={F('annualLeave')} placeholder="e.g. 30 days/year" />
              </div>
            </Card>
            <Card>
              <SecLabel>Benefits & Perks</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <Input label="Accommodation" id="accom" value={form.accommodation} onChange={F('accommodation')} placeholder="e.g. Free staff accommodation" />
                <Input label="Meals" id="meals" value={form.meals} onChange={F('meals')} placeholder="e.g. 3 meals per day on shift" />
                <Input label="Transport" id="trans" value={form.transport} onChange={F('transport')} placeholder="e.g. Hotel shuttle provided" />
                <Input label="Medical Insurance" id="ins" value={form.insurance} onChange={F('insurance')} placeholder="e.g. Full group medical policy" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle checked={form.flightTickets} onChange={v => F('flightTickets')(v)} />
                <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.body }}>Annual flight ticket to home country provided</span>
              </div>
            </Card>
            <Note type="blue">Hotels that clearly list working conditions and benefits receive 2.5× more applications. Transparency builds trust.</Note>
          </div>
        )}

        {/* ── TAB: HR Contact ── */}
        {tab === 'contact' && (
          <Card>
            <SecLabel>HR Contact (Internal — not public)</SecLabel>
            <p style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 16 }}>
              This contact information is used internally by HireAHotelier to verify your hotel and for platform notifications. It is not displayed publicly to candidates.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="HR Manager Name" id="hrn" value={form.hrName} onChange={F('hrName')} placeholder="Full name of HR contact" icon="👤" />
              <Input label="HR Email" id="hre" type="email" value={form.hrEmail} onChange={F('hrEmail')} placeholder="hr@yourhotel.com" icon="📧" />
              <Input label="HR Phone / WhatsApp" id="hrp" value={form.hrPhone} onChange={F('hrPhone')} placeholder="+971 XX XXX XXXX" icon="📱" />
            </div>
            <Note type="green">We recommend using WhatsApp number — platform can notify HR on WhatsApp for new applications.</Note>
          </Card>
        )}

        {/* ── TAB: Verification ── */}
        {tab === 'verify' && (
          <div>
            <Card style={{ marginBottom: 14 }}>
              <SecLabel>Hotel Verification Status</SecLabel>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0', marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, background: userProfile?.isVerified ? C.greenBg : C.amberBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {userProfile?.isVerified ? '✅' : '⏳'}
                </div>
                <div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>
                    {userProfile?.isVerified ? 'Verified Hotel' : 'Verification Pending'}
                  </div>
                  <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>
                    {userProfile?.isVerified
                      ? 'Your hotel is verified. Candidates see the ✓ Verified badge on all your job listings.'
                      : 'Submit your documents below to get verified. Usually takes 24–48 hours.'}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body, marginBottom: 12 }}>Required Documents</div>
                {[
                  { doc: 'Trade Licence / Business Registration', status: userProfile?.isVerified ? 'uploaded' : 'pending' },
                  { doc: 'Hotel Operating Licence', status: userProfile?.isVerified ? 'uploaded' : 'pending' },
                  { doc: 'HR Manager ID / Company Letterhead', status: 'pending' },
                ].map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: C.slate, borderRadius: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 18 }}>{d.status === 'uploaded' ? '✅' : '📄'}</span>
                      <span style={{ fontSize: 13, fontFamily: FONTS.body, color: C.text }}>{d.doc}</span>
                    </div>
                    {d.status !== 'uploaded' && (
                      <OutlineBtn small onClick={() => alert('Document upload will open file picker in production.')}>Upload</OutlineBtn>
                    )}
                    {d.status === 'uploaded' && <Badge type="green">Uploaded</Badge>}
                  </div>
                ))}
              </div>

              {!userProfile?.isVerified && (
                <GoldBtn full onClick={() => alert('Verification request submitted! Our team will review within 24–48 hours.')}>
                  Submit for Verification
                </GoldBtn>
              )}
            </Card>

            <Card>
              <SecLabel>Why Verification Matters</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['✅', 'Verified badge displayed on all your job listings'],
                  ['📈', '2× more applications from candidates'],
                  ['🔒', 'Builds trust — especially critical for workers from South Asia'],
                  ['🚫', 'Prevents impersonation of your brand by scam accounts'],
                  ['⭐', 'Access to premium features: Boost jobs, AI recommendations'],
                ].map(([ic, text], i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: C.text, fontFamily: FONTS.body }}>
                    <span style={{ flexShrink: 0 }}>{ic}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab !== 'verify' && (
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={14} color={C.navy} />Saving…</span> : '💾 Save Changes'}
            </GoldBtn>
            {saved && <span style={{ color: C.greenText, fontSize: 13, fontFamily: FONTS.body, alignSelf: 'center' }}>✓ Profile saved!</span>}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
