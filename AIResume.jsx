import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { storage, ref, uploadBytes, getDownloadURL, updateUserProfile } from '../../firebase';
import {
  Card, GoldBtn, OutlineBtn, NavyBtn, SecLabel,
  Badge, Chip, Input, Select, Note, Toggle, Spinner, Alert,
} from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const TEMPLATES = [
  { id: 'luxury',   label: 'Luxury Modern',   icon: '✨', desc: 'Clean, premium layout for 5-star roles' },
  { id: 'classic',  label: 'Classic Formal',  icon: '📄', desc: 'Traditional CV format, globally accepted' },
  { id: 'creative', label: 'Creative Bold',   icon: '🎨', desc: 'Stand out with colour and personality' },
  { id: 'ats',      label: 'ATS-Optimised',   icon: '🤖', desc: 'Passes automated screening systems' },
];

const ENHANCEMENTS = [
  { id: 'rewrite',    icon: '✍️', label: 'Rewrite Summary',     desc: 'AI rewrites your bio in recruiter-friendly language' },
  { id: 'quantify',   icon: '📊', label: 'Quantify Achievements', desc: '"Managed team" → "Led 45-member kitchen brigade, cut food cost 22%"' },
  { id: 'keywords',   icon: '🏷',  label: 'Keyword Boost',       desc: 'Injects hospitality keywords that employers search for' },
  { id: 'translate',  icon: '🌐', label: 'Translate Resume',     desc: 'Export in English, Arabic, Hindi, Tagalog, Bahasa & more' },
];

const LANGUAGES = ['English', 'Arabic', 'Hindi', 'Tagalog', 'Bahasa Indonesia', 'Nepali', 'Bengali'];

// ─── Live Resume Preview ─────────────────────────────────────────────────────
function ResumePreview({ profile, template, enhancements }) {
  if (!profile) return null;
  const isSummaryEnhanced = enhancements.includes('rewrite');

  const summaryText = isSummaryEnhanced
    ? `Results-driven ${profile.headline?.split('|')[0]?.trim() || 'Hospitality Professional'} with ${profile.experienceYears || '10'}+ years of luxury hotel experience. Proven track record of leading high-performance teams, driving revenue growth, and maintaining world-class service standards across GCC and Asia-Pacific properties.`
    : profile.about || 'Your professional summary will appear here…';

  return (
    <div style={{ fontFamily: FONTS.body, fontSize: 12, lineHeight: 1.7, background: 'white', minHeight: 560 }}>
      {/* Header */}
      <div style={{
        background: template === 'luxury' ? `linear-gradient(135deg,${C.navy},${C.navyLight})` : template === 'creative' ? C.gold : C.navy,
        padding: '20px 22px', marginBottom: 14,
      }}>
        <div style={{ color: template === 'creative' ? C.navy : C.gold, fontFamily: FONTS.display, fontSize: 22, fontWeight: 700 }}>
          {(profile.displayName || 'YOUR NAME').toUpperCase()}
        </div>
        <div style={{ color: '#CBD5E1', fontSize: 13, marginTop: 2 }}>{profile.headline || 'Hospitality Professional'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          {['📧 email@example.com', '📱 +XX-XXXXXXXXXX', `📍 ${profile.currentLocation || 'Location'}`].map(c => (
            <span key={c} style={{ color: '#94A3B8', fontSize: 10 }}>{c}</span>
          ))}
          {profile.linkedinURL && <span style={{ color: '#94A3B8', fontSize: 10 }}>🔗 LinkedIn</span>}
        </div>
      </div>

      <div style={{ padding: '0 22px 22px' }}>
        {/* Summary */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>Professional Summary</div>
          <p style={{ fontSize: 11, color: C.text, lineHeight: 1.7, margin: 0 }}>{summaryText}</p>
        </div>

        {/* Work history */}
        {(profile.workHistory?.length > 0) && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginBottom: 14 }}>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Experience</div>
            {profile.workHistory.slice(0, 3).map((w, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: C.navy }}>{w.role} — {w.hotel}</div>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{w.period}</div>
                {enhancements.includes('quantify') && (
                  <div style={{ fontSize: 11, color: C.textSoft }}>• Led cross-functional team, achieving measurable improvements in operational efficiency</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {(profile.skills?.length > 0 || profile.certifications?.length > 0) && (
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Skills & Certifications</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[...(profile.skills || []), ...(profile.certifications || [])].map(s => (
                <span key={s} style={{ background: C.blueBg, color: C.blueText, borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{s}</span>
              ))}
              {enhancements.includes('keywords') && ['HACCP', 'Opera PMS', 'Micros', 'Revenue Management'].map(k => (
                <span key={k} style={{ background: C.amberBg, color: C.amberText, borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{k} ✨</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIResume() {
  const { userProfile, currentUser } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();

  const [template, setTemplate]       = useState('luxury');
  const [targetRole, setTargetRole]   = useState('');
  const [tone, setTone]               = useState('professional');
  const [language, setLanguage]       = useState('English');
  const [enhancements, setEnhancements] = useState(['rewrite', 'keywords']);
  const [generating, setGenerating]   = useState(false);
  const [generated, setGenerated]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState('');

  const toggleEnhancement = (id) =>
    setEnhancements(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

  // Simulate AI generation (in production: call OpenAI/Gemini API via Firebase Function)
  const generateResume = async () => {
    setGenerating(true);
    setError('');
    await new Promise(r => setTimeout(r, 2200)); // Simulate API call
    setGenerating(false);
    setGenerated(true);
  };

  // In production: use a library like jsPDF or call a Cloud Function to render PDF
  const downloadPDF = () => {
    alert('PDF download requires a Cloud Function in production. The resume data is ready to pass to any PDF renderer (jsPDF, Puppeteer, etc.).');
  };

  const sendToEmployer = () => {
    alert('This will share your resume URL directly to shortlisted employers from your Applications page.');
  };

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          🤖 AI Resume Builder
        </div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 24 }}>
          Build a hospitality-specific, job-ready resume in 30 seconds.
        </div>

        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: 24 }}>
          {/* ── Left: Controls ── */}
          <div>
            {/* Template picker */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>1. Choose Template</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {TEMPLATES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    style={{
                      border: `2px solid ${template === t.id ? C.gold : C.border}`,
                      background: template === t.id ? C.cream : 'white',
                      borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: C.textSoft, fontFamily: FONTS.body, marginTop: 2 }}>{t.desc}</div>
                    {template === t.id && <div style={{ marginTop: 6 }}><Badge type="gold">✓ Selected</Badge></div>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Customisation */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>2. Customise</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input
                  label="Target Job Role"
                  id="role"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Executive Chef, F&B Manager, Front Desk Supervisor"
                  icon="🎯"
                />
                <Select
                  label="Tone"
                  id="tone"
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  options={[
                    { value: 'professional', label: '🎩 Professional & Polished' },
                    { value: 'confident',    label: '💪 Confident & Direct' },
                    { value: 'creative',     label: '🎨 Creative & Distinctive' },
                  ]}
                />
                <Select
                  label="Language"
                  id="lang"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  options={LANGUAGES}
                />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" id="ats-opt" defaultChecked style={{ accentColor: C.navy }} />
                  <label htmlFor="ats-opt" style={{ fontSize: 12, color: C.text, fontFamily: FONTS.body }}>Optimise for ATS (Applicant Tracking Systems)</label>
                </div>
              </div>
            </Card>

            {/* AI Enhancements */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>3. AI Enhancements</SecLabel>
              {ENHANCEMENTS.map(e => (
                <div key={e.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: C.slate, borderRadius: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{e.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{e.label}</div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{e.desc}</div>
                  </div>
                  <Toggle checked={enhancements.includes(e.id)} onChange={() => toggleEnhancement(e.id)} />
                </div>
              ))}
            </Card>

            {/* Import from sources */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>4. Import Data From</SecLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { icon: '🔗', label: 'LinkedIn', active: !!userProfile?.linkedinURL },
                  { icon: '📄', label: 'Upload PDF', active: false },
                  { icon: '👤', label: 'My Profile', active: true },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 12, fontFamily: FONTS.body, cursor: 'pointer',
                    background: s.active ? C.navy : C.white,
                    color: s.active ? C.gold : C.textSoft,
                    border: `1.5px solid ${s.active ? C.navy : C.border}`,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {s.icon} {s.label}
                    {s.active && <span style={{ fontSize: 10 }}>✓</span>}
                  </div>
                ))}
              </div>
              <Note type="blue">LinkedIn import pulls your work history, skills, and headline directly. AI speech-to-text from your video profile is coming soon.</Note>
            </Card>

            <GoldBtn full onClick={generateResume} disabled={generating}>
              {generating
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <Spinner size={16} color={C.navy} /> Generating your resume…
                  </span>
                : '✨ Generate My Resume'}
            </GoldBtn>
          </div>

          {/* ── Right: Preview ── */}
          <div>
            <SecLabel>Live Preview</SecLabel>
            <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
              {!generated && !generating ? (
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 18, color: C.navy, marginBottom: 8 }}>Your Resume Preview</div>
                  <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Configure your options and click "Generate" to see a live preview.</div>
                </div>
              ) : generating ? (
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                  <Spinner size={40} />
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, color: C.navy, marginTop: 16 }}>AI is crafting your resume…</div>
                  <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginTop: 6 }}>Applying {enhancements.length} enhancement{enhancements.length !== 1 ? 's' : ''}…</div>
                </div>
              ) : (
                <ResumePreview
                  profile={userProfile || { displayName: 'Rajan Mehta', headline: 'Executive Chef | Luxury Hotels | 14 Years', about: 'Award-winning chef…', workHistory: [], skills: ['HACCP', 'Menu Engineering'], certifications: ['Food Safety Level 4'] }}
                  template={template}
                  enhancements={enhancements}
                />
              )}
            </Card>

            {generated && (
              <>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <GoldBtn onClick={downloadPDF} disabled={downloading}>
                    {downloading ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={14} color={C.navy} />Preparing…</span> : '⬇ Download PDF'}
                  </GoldBtn>
                  <OutlineBtn onClick={sendToEmployer}>📤 Send to Employer</OutlineBtn>
                  <OutlineBtn onClick={() => { navigator.clipboard.writeText(window.location.href); }}>🔗 Share Link</OutlineBtn>
                </div>
                <Note type="green" style={{ marginTop: 12 }}>
                  Your resume is automatically attached when you apply to jobs. Employers can also download it directly from your profile.
                </Note>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
