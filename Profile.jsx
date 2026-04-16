import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS, SHADOWS, DEPARTMENTS, EXPERIENCE_LEVELS, LABOUR_ORIGINS, JOB_MARKETS } from '../../tokens';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebase';
import {
  Card, Badge, Chip, GoldBtn, OutlineBtn, NavyBtn,
  Input, Select, Textarea, Checkbox, SecLabel,
  ProgressBar, Stars, Alert, Spinner, Note, Toggle,
} from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const LANGUAGES = ['English', 'Arabic', 'Hindi', 'Bengali', 'Tagalog', 'Bahasa Indonesia', 'Nepali', 'Sinhalese', 'Burmese', 'French', 'Mandarin', 'Malay'];

export default function CandidateProfile({ readOnly = false }) {
  const { userProfile, updateProfile, currentUser } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [error, setError]     = useState('');
  const photoRef = useRef();

  // Form state — initialised from Firestore profile
  const [form, setForm] = useState({
    displayName:    userProfile?.displayName || '',
    headline:       userProfile?.headline    || '',
    about:          userProfile?.about       || '',
    department:     userProfile?.department  || '',
    experience:     userProfile?.experience  || '',
    currentLocation:userProfile?.currentLocation || '',
    nationality:    userProfile?.nationality || '',
    linkedinURL:    userProfile?.linkedinURL || '',
    isOpenToWork:   userProfile?.isOpenToWork !== false,
    partTimeAvailable: userProfile?.partTimeAvailable || false,
    skills:         userProfile?.skills         || [],
    certifications: userProfile?.certifications || [],
    languages:      userProfile?.languages      || [],
    targetMarkets:  userProfile?.targetMarkets  || [],
  });
  const F = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : v.target.value }));

  // Work history
  const [workHistory, setWorkHistory] = useState(userProfile?.workHistory || []);
  const [newWork, setNewWork] = useState({ role: '', hotel: '', period: '', type: 'full-time', country: '' });
  const [addingWork, setAddingWork] = useState(false);

  // Skills / cert multi-entry
  const [skillInput, setSkillInput]   = useState('');
  const [certInput, setCertInput]     = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));
  const addCert = () => {
    if (certInput.trim() && !form.certifications.includes(certInput.trim())) {
      setForm(f => ({ ...f, certifications: [...f.certifications, certInput.trim()] }));
      setCertInput('');
    }
  };
  const removeCert = (c) => setForm(f => ({ ...f, certifications: f.certifications.filter(x => x !== c) }));

  const toggleLang = (l) => setForm(f => ({
    ...f, languages: f.languages.includes(l) ? f.languages.filter(x => x !== l) : [...f.languages, l],
  }));
  const toggleMarket = (m) => setForm(f => ({
    ...f, targetMarkets: f.targetMarkets.includes(m) ? f.targetMarkets.filter(x => x !== m) : [...f.targetMarkets, m],
  }));

  // Photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Photo must be under 5MB'); return; }
    setPhotoUploading(true);
    try {
      const storageRef = ref(storage, `photos/${currentUser.uid}/profile`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile({ photoURL: url });
    } catch (e) {
      setError('Photo upload failed. Please try again.');
    } finally {
      setPhotoUploading(false);
    }
  };

  // LinkedIn import simulation
  const importLinkedIn = () => {
    const stored = sessionStorage.getItem('linkedin_profile');
    if (stored) {
      const li = JSON.parse(stored);
      setForm(f => ({
        ...f,
        displayName: li.name || f.displayName,
        headline:    li.headline || f.headline,
        linkedinURL: li.publicProfileUrl || f.linkedinURL,
      }));
      sessionStorage.removeItem('linkedin_profile');
    } else {
      // In production, trigger LinkedIn OAuth then return data
      alert('LinkedIn import requires OAuth connection. Coming in production build.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const strength = calculateStrength();
      await updateProfile({ ...form, workHistory, profileStrength: strength });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateStrength = () => {
    let s = 20;
    if (form.displayName)                s += 10;
    if (form.headline)                   s += 5;
    if (form.about)                      s += 10;
    if (userProfile?.photoURL)           s += 10;
    if (userProfile?.videoProfileURL)    s += 15;
    if (form.skills.length > 0)          s += 5;
    if (form.certifications.length > 0)  s += 5;
    if (workHistory.length > 0)          s += 10;
    if (form.linkedinURL)                s += 5;
    if (userProfile?.resumeURL)          s += 5;
    return Math.min(s, 100);
  };

  const TABS = [
    { id: 'profile',      label: '👤 Personal Info' },
    { id: 'work',         label: '💼 Work History' },
    { id: 'skills',       label: '🏷 Skills & Certs' },
    { id: 'preferences',  label: '🎯 Job Preferences' },
    { id: 'linkedin',     label: '🔗 LinkedIn' },
  ];

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy }}>My Profile</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Visible to verified employers · Keep it up to date</div>
          </div>
          {!readOnly && (
            <div style={{ display: 'flex', gap: 10 }}>
              {saved && <span style={{ color: C.greenText, fontSize: 13, fontFamily: FONTS.body, alignSelf: 'center' }}>✓ Saved!</span>}
              <GoldBtn onClick={handleSave} disabled={saving}>
                {saving ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={14} color={C.navy} /> Saving…</span> : '💾 Save Profile'}
              </GoldBtn>
            </div>
          )}
        </div>

        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

        {/* ── Profile strength ── */}
        <Card style={{ marginBottom: 20 }}>
          <ProgressBar value={calculateStrength()} label="Profile Strength" />
          {calculateStrength() < 100 && (
            <div style={{ fontSize: 12, color: C.textSoft, marginTop: 6, fontFamily: FONTS.body }}>
              Complete all sections to maximise visibility to employers.
            </div>
          )}
        </Card>

        {/* ── Tab navigation ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? C.navy : 'transparent',
              color: tab === t.id ? C.gold : C.textSoft,
              border: tab === t.id ? 'none' : `1px solid ${C.border}`,
              borderRadius: 8, padding: '7px 14px', fontSize: 12,
              fontWeight: tab === t.id ? 700 : 500, cursor: 'pointer',
              whiteSpace: 'nowrap', fontFamily: FONTS.body,
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── TAB: Personal Info ── */}
        {tab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 20 }}>
            {/* Photo */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                <div style={{
                  width: 110, height: 110, borderRadius: '50%',
                  background: `linear-gradient(135deg,${C.navy},${C.navyLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 44, border: `3px solid ${C.gold}`, overflow: 'hidden',
                }}>
                  {userProfile?.photoURL
                    ? <img src={userProfile.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '👤'}
                </div>
                {photoUploading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size={24} />
                  </div>
                )}
              </div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              {!readOnly && (
                <OutlineBtn small onClick={() => photoRef.current.click()}>
                  {photoUploading ? 'Uploading…' : '📷 Change Photo'}
                </OutlineBtn>
              )}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>Open to Work</span>
                  {!readOnly && <Toggle checked={form.isOpenToWork} onChange={v => setForm(f => ({ ...f, isOpenToWork: v }))} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>Part-Time Available</span>
                  {!readOnly && <Toggle checked={form.partTimeAvailable} onChange={v => setForm(f => ({ ...f, partTimeAvailable: v }))} />}
                </div>
              </div>
            </div>
            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Full Name" id="name" value={form.displayName} onChange={F('displayName')} placeholder="Your full name" disabled={readOnly} />
              <Input label="Professional Headline" id="headline" value={form.headline} onChange={F('headline')} placeholder="e.g. Executive Chef | Luxury Hotels | 14 Years" disabled={readOnly} />
              <Textarea label="About / Bio" id="about" value={form.about} onChange={F('about')} placeholder="Tell employers about your background, specialisations and career goals…" rows={5} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Select label="Department" id="dept" value={form.department} onChange={F('department')} options={DEPARTMENTS} placeholder="Select department" />
                <Select label="Experience Level" id="exp" value={form.experience} onChange={F('experience')} options={EXPERIENCE_LEVELS} placeholder="Select level" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Select label="Nationality" id="nat" value={form.nationality} onChange={F('nationality')} options={LABOUR_ORIGINS.map(o => ({ value: o.code, label: `${o.flag} ${o.label}` }))} placeholder="Select nationality" />
                <Input label="Current Location" id="loc" value={form.currentLocation} onChange={F('currentLocation')} placeholder="e.g. Mumbai, India" />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Work History ── */}
        {tab === 'work' && (
          <div>
            {workHistory.map((w, i) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏨</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: FONTS.body }}>{w.role}</div>
                    <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{w.hotel} · {w.period}</div>
                    <div style={{ marginTop: 4 }}><Badge type={w.type === 'part-time' ? 'purple' : 'navy'}>{w.type === 'part-time' ? '⚡ Part-Time' : '💼 Full-Time'}</Badge></div>
                  </div>
                  {!readOnly && (
                    <button onClick={() => setWorkHistory(h => h.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16, padding: 4 }}>✕</button>
                  )}
                </div>
              </Card>
            ))}

            {!readOnly && (
              <>
                {!addingWork
                  ? <OutlineBtn onClick={() => setAddingWork(true)}>+ Add Work Experience</OutlineBtn>
                  : (
                    <Card style={{ background: C.slate }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body, marginBottom: 12 }}>Add Work Experience</div>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <Input label="Job Title" id="wr" value={newWork.role} onChange={e => setNewWork(w => ({ ...w, role: e.target.value }))} placeholder="e.g. Executive Chef" />
                        <Input label="Hotel / Company" id="wh" value={newWork.hotel} onChange={e => setNewWork(w => ({ ...w, hotel: e.target.value }))} placeholder="e.g. Marriott, Dubai" />
                        <Input label="Period" id="wp" value={newWork.period} onChange={e => setNewWork(w => ({ ...w, period: e.target.value }))} placeholder="e.g. 2020–Present" />
                        <Select label="Employment Type" id="wt" value={newWork.type} onChange={e => setNewWork(w => ({ ...w, type: e.target.value }))} options={[{ value: 'full-time', label: '💼 Full-Time' }, { value: 'part-time', label: '⚡ Part-Time' }, { value: 'contract', label: '📋 Contract' }]} />
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <GoldBtn small onClick={() => { setWorkHistory(h => [newWork, ...h]); setNewWork({ role: '', hotel: '', period: '', type: 'full-time' }); setAddingWork(false); }}>Add</GoldBtn>
                        <OutlineBtn small onClick={() => setAddingWork(false)}>Cancel</OutlineBtn>
                      </div>
                    </Card>
                  )}
              </>
            )}
          </div>
        )}

        {/* ── TAB: Skills & Certs ── */}
        {tab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
            <Card>
              <SecLabel>Skills</SecLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                {form.skills.map(s => (
                  <Chip key={s} active>
                    {s}
                    {!readOnly && <span onClick={() => removeSkill(s)} style={{ marginLeft: 6, cursor: 'pointer', opacity: 0.6 }}>✕</span>}
                  </Chip>
                ))}
              </div>
              {!readOnly && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Add a skill…" style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '7px 10px', fontSize: 12, fontFamily: FONTS.body, outline: 'none' }} />
                  <GoldBtn small onClick={addSkill}>Add</GoldBtn>
                </div>
              )}
            </Card>

            <Card>
              <SecLabel>Certifications</SecLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                {form.certifications.map(c => (
                  <Chip key={c} active>
                    {c}
                    {!readOnly && <span onClick={() => removeCert(c)} style={{ marginLeft: 6, cursor: 'pointer', opacity: 0.6 }}>✕</span>}
                  </Chip>
                ))}
              </div>
              {!readOnly && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={certInput} onChange={e => setCertInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCert()} placeholder="e.g. HACCP Level 3…" style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '7px 10px', fontSize: 12, fontFamily: FONTS.body, outline: 'none' }} />
                  <GoldBtn small onClick={addCert}>Add</GoldBtn>
                </div>
              )}
            </Card>

            <Card>
              <SecLabel>Languages</SecLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {LANGUAGES.map(l => (
                  <Chip key={l} active={form.languages.includes(l)} onClick={!readOnly ? () => toggleLang(l) : undefined}>{l}</Chip>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── TAB: Job Preferences ── */}
        {tab === 'preferences' && (
          <Card>
            <SecLabel>Target Job Markets</SecLabel>
            <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 10 }}>Select all countries where you're open to working.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {JOB_MARKETS.map(m => (
                <div key={m.code} onClick={!readOnly ? () => toggleMarket(m.code) : undefined} style={{
                  border: `1.5px solid ${form.targetMarkets.includes(m.code) ? C.gold : C.border}`,
                  background: form.targetMarkets.includes(m.code) ? C.cream : C.white,
                  borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center',
                  gap: 6, cursor: readOnly ? 'default' : 'pointer', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 18 }}>{m.flag}</span>
                  <span style={{ fontSize: 12, fontWeight: form.targetMarkets.includes(m.code) ? 700 : 400, color: C.text, fontFamily: FONTS.body }}>{m.label}</span>
                </div>
              ))}
            </div>
            <Note type="blue">Hotels in GCC, Malaysia, and Singapore are actively searching our database. Make sure at least one of these is selected.</Note>
          </Card>
        )}

        {/* ── TAB: LinkedIn ── */}
        {tab === 'linkedin' && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>LinkedIn Profile URL</SecLabel>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <Input id="li" value={form.linkedinURL} onChange={F('linkedinURL')} placeholder="https://linkedin.com/in/your-profile" icon="🔗" disabled={readOnly} />
                {!readOnly && <GoldBtn onClick={() => updateProfile({ linkedinURL: form.linkedinURL })}>Save</GoldBtn>}
              </div>
              {form.linkedinURL && (
                <a href={form.linkedinURL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#0A66C2', fontFamily: FONTS.body }}>🔗 View LinkedIn Profile →</a>
              )}
            </Card>

            <Card>
              <SecLabel>Import from LinkedIn</SecLabel>
              <p style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.7, marginBottom: 16 }}>
                Automatically import your work history, skills, headline, and profile photo from LinkedIn. Saves you from entering everything manually.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  ['✅', 'Work History & Job Titles'],
                  ['✅', 'Skills & Endorsements'],
                  ['✅', 'Profile Photo'],
                  ['✅', 'Professional Headline'],
                  ['✅', 'Education & Certifications'],
                  ['✅', 'LinkedIn Connections Count'],
                ].map(([ic, l], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.text, fontFamily: FONTS.body }}>
                    <span>{ic}</span><span>{l}</span>
                  </div>
                ))}
              </div>
              <button onClick={importLinkedIn} style={{
                background: '#0A66C2', color: 'white', border: 'none',
                borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 700,
                fontFamily: FONTS.body, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Import from LinkedIn
              </button>
              <Note type="blue">LinkedIn import uses OAuth — no password needed. We only read your public profile data and never post on your behalf.</Note>
            </Card>
          </div>
        )}

        {/* Save button (bottom) */}
        {!readOnly && tab !== 'linkedin' && (
          <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
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
