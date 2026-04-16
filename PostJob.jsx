import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS, JOB_MARKETS, DEPARTMENTS, EXPERIENCE_LEVELS, HOTEL_CATEGORIES } from '../../tokens';
import { postJob } from '../../firebase';
import { Card, GoldBtn, OutlineBtn, NavyBtn, Input, Select, Textarea, Checkbox, SecLabel, Note, Alert, Spinner, Badge, Toggle } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const EMPTY = {
  title: '', department: '', type: 'full-time', experience: '',
  country: '', city: '', hotelCategory: '',
  salaryMin: '', salaryMax: '', salaryCurrency: 'USD', salaryPeriod: 'month',
  shiftPay: '', shiftDate: '', shiftTime: '',
  description: '', requirements: '', benefits: '',
  visaSponsorship: false, accommodationProvided: false,
  mealsProvided: false, flightTickets: false, urgent: false, boost: false,
};

export default function PostJob() {
  const { currentUser, userProfile } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY);
  const [isShiftMode, setShiftMode] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const F = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : typeof v === 'boolean' ? v : v.target?.value ?? v }));
  const toggle = (k) => setForm(f => ({ ...f, [k]: !f[k] }));

  // Simulate AI job description generation
  const generateDescription = async () => {
    if (!form.title || !form.department) {
      setError('Please fill in Job Title and Department first.');
      return;
    }
    setGenerating(true);
    setError('');
    await new Promise(r => setTimeout(r, 1800));
    setForm(f => ({
      ...f,
      description: `We are seeking an exceptional ${f.title} to join our award-winning team at ${userProfile?.hotelName || 'our hotel'}. This is an exciting opportunity to work in a dynamic, fast-paced luxury environment where you will play a key role in delivering world-class ${f.department.toLowerCase()} experiences.\n\nYou will work alongside passionate hospitality professionals, contributing to our mission of creating unforgettable guest experiences.`,
      requirements: `• Minimum ${EXPERIENCE_LEVELS.find(e => e.value === f.experience)?.label || '3+ years'} of relevant experience in a luxury hotel\n• Strong knowledge of ${f.department} standards and best practices\n• Excellent communication skills in English\n• Ability to work flexible shifts including weekends and holidays\n• Valid passport and ability to obtain the necessary work visa`,
      benefits: `• Competitive salary (${f.salaryMin && f.salaryMax ? `$${f.salaryMin}–$${f.salaryMax}/${f.salaryPeriod}` : 'as per experience'})\n${f.accommodationProvided ? '• Accommodation provided by the hotel\n' : ''}${f.visaSponsorship ? '• Visa and work permit sponsorship\n' : ''}• Medical and dental insurance\n• Annual leave as per local labour law\n• Staff meals on duty`,
    }));
    setGenerating(false);
  };

  const handlePublish = async (draft = false) => {
    setError('');
    if (!form.title || !form.country || !form.department) {
      setError('Please fill in Job Title, Department, and Country.');
      return;
    }
    setSaving(true);
    try {
      const jobData = {
        ...form,
        isShiftMode,
        hotelName: userProfile?.hotelName || '',
        status: draft ? 'draft' : 'active',
        salary: isShiftMode
          ? { amount: Number(form.shiftPay), currency: form.salaryCurrency, period: 'shift' }
          : { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: form.salaryCurrency, period: form.salaryPeriod },
      };
      const ref = await postJob(currentUser.uid, jobData);
      setSaved(true);
      setTimeout(() => navigate('/employer/dashboard'), 1500);
    } catch (e) {
      setError('Failed to publish job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const estApplications = () => {
    let base = 15;
    if (form.visaSponsorship)      base += 12;
    if (form.accommodationProvided) base += 8;
    if (form.salaryMin && form.salaryMax) base += 10;
    if (form.type === 'part-time') base += 5;
    return `${base}–${base + 18}`;
  };

  return (
    <DashboardShell role="employer">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy }}>Post a New Job</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Reach 85,000+ hospitality professionals directly</div>
          </div>
          {/* Shift mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: isShiftMode ? C.cream : C.slate, border: `1.5px solid ${isShiftMode ? C.gold : C.border}`, borderRadius: 12, padding: '10px 16px' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>⚡ Part-Time Shift Mode</div>
              <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>Tonight's banquet or event</div>
            </div>
            <Toggle checked={isShiftMode} onChange={setShiftMode} />
          </div>
        </div>

        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
        {saved && <Alert type="success">Job published! Redirecting to dashboard…</Alert>}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 300px', gap: 24 }}>
          {/* ── Main Form ── */}
          <div>
            {/* Section 1: Job Details */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>1. Job Details</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Job Title *" id="title" value={form.title} onChange={F('title')} placeholder="e.g. Executive Chef, Front Desk Supervisor, Banquet Manager" required />
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <Select label="Department *" id="dept" value={form.department} onChange={F('department')} options={DEPARTMENTS} placeholder="Select department" required />
                  <Select label="Employment Type" id="type" value={form.type} onChange={F('type')} options={[{ value: 'full-time', label: '💼 Full-Time' }, { value: 'part-time', label: '⚡ Part-Time / Shift' }, { value: 'contract', label: '📋 Contract' }]} />
                </div>
                <Select label="Experience Required" id="exp" value={form.experience} onChange={F('experience')} options={EXPERIENCE_LEVELS} placeholder="Select level" />
              </div>
            </Card>

            {/* Section 2: Location */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>2. Location</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Select label="Country *" id="country" value={form.country} onChange={F('country')} options={JOB_MARKETS.map(m => ({ value: m.code, label: `${m.flag} ${m.label}` }))} placeholder="Select country" required />
                <Input label="City / Property" id="city" value={form.city} onChange={F('city')} placeholder="e.g. Dubai — Burj Al Arab" />
                <Select label="Hotel Category" id="hcat" value={form.hotelCategory} onChange={F('hotelCategory')} options={HOTEL_CATEGORIES} placeholder="Select category" />
              </div>
            </Card>

            {/* Section 3: Compensation */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>3. Compensation</SecLabel>
              {isShiftMode ? (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 12 }}>
                  <Input label="Pay per Shift ($)" id="shiftpay" value={form.shiftPay} onChange={F('shiftPay')} placeholder="e.g. 30" />
                  <Input label="Shift Date" id="shiftdate" value={form.shiftDate} onChange={F('shiftDate')} type="date" />
                  <Input label="Shift Time" id="shifttime" value={form.shiftTime} onChange={F('shiftTime')} placeholder="e.g. 6PM–11PM" />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 12 }}>
                  <Input label="Min Salary" id="salmin" value={form.salaryMin} onChange={F('salaryMin')} placeholder="e.g. 1800" />
                  <Input label="Max Salary" id="salmax" value={form.salaryMax} onChange={F('salaryMax')} placeholder="e.g. 2400" />
                  <Select label="Currency" id="curr" value={form.salaryCurrency} onChange={F('salaryCurrency')} options={['USD', 'AED', 'SAR', 'QAR', 'SGD', 'AUD', 'MYR'].map(c => ({ value: c, label: c }))} />
                  <Select label="Period" id="period" value={form.salaryPeriod} onChange={F('salaryPeriod')} options={[{ value: 'month', label: '/Month' }, { value: 'year', label: '/Year' }]} />
                </div>
              )}
              <Note type="green">Jobs with a salary range get 42% more applications. Be transparent!</Note>
            </Card>

            {/* Section 4: Benefits */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>4. Benefits & Perks</SecLabel>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
                {[
                  ['visaSponsorship',      '✈️', 'Visa Sponsored'],
                  ['accommodationProvided','🏠', 'Accommodation'],
                  ['mealsProvided',        '🍽', 'Meals on Duty'],
                  ['flightTickets',        '✈', 'Flight Tickets'],
                  ['urgent',              '🔥', 'Mark as Urgent'],
                ].map(([k, ic, label]) => (
                  <div
                    key={k}
                    onClick={() => toggle(k)}
                    style={{
                      border: `1.5px solid ${form[k] ? C.gold : C.border}`,
                      background: form[k] ? C.cream : 'white',
                      borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{ic}</span>
                    <span style={{ fontSize: 12, fontFamily: FONTS.body, color: C.text, fontWeight: form[k] ? 700 : 400 }}>{label}</span>
                    {form[k] && <span style={{ marginLeft: 'auto', color: C.gold, fontSize: 14 }}>✓</span>}
                  </div>
                ))}
              </div>
              <Note type="blue">Ticking "Visa Sponsored" doubles applications from Nepal, Bangladesh & Philippines candidates.</Note>
            </Card>

            {/* Section 5: Description */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>5. Job Description</SecLabel>
              <div style={{ marginBottom: 10 }}>
                <Textarea label="Description *" id="desc" value={form.description} onChange={F('description')} placeholder="Describe the role, team, and what makes this a great opportunity…" rows={5} required />
              </div>
              <div style={{ marginBottom: 10 }}>
                <Textarea label="Requirements" id="reqs" value={form.requirements} onChange={F('requirements')} placeholder="List required experience, skills, and qualifications…" rows={4} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <Textarea label="Benefits Details" id="bens" value={form.benefits} onChange={F('benefits')} placeholder="Describe the full benefits package…" rows={3} />
              </div>
              <GoldBtn small onClick={generateDescription} disabled={generating}>
                {generating ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={14} color={C.navy} />Generating…</span> : '🤖 Auto-generate with AI'}
              </GoldBtn>
            </Card>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <GoldBtn onClick={() => handlePublish(false)} disabled={saving}>
                {saving ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={16} color={C.navy} />Publishing…</span> : `🚀 Publish ${isShiftMode ? 'Shift' : 'Job'}`}
              </GoldBtn>
              <OutlineBtn onClick={() => handlePublish(true)} disabled={saving}>💾 Save Draft</OutlineBtn>
              <OutlineBtn onClick={() => {}}>👁 Preview</OutlineBtn>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div>
            <Card style={{ marginBottom: 14, background: C.cream, border: `1.5px solid ${C.gold}` }}>
              <SecLabel>Performance Prediction</SecLabel>
              <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: C.navy }}>{estApplications()}</div>
              <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>estimated applications in first 7 days</div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  [form.salaryMin && form.salaryMax,  '+42% apps', 'Salary range added'],
                  [form.visaSponsorship,              '+80% apps', 'Visa sponsored'],
                  [form.accommodationProvided,        '+35% apps', 'Accommodation included'],
                  [form.urgent,                       '🔥 Urgent', 'Marked urgent — priority placement'],
                ].map(([active, boost, label], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, fontFamily: FONTS.body, opacity: active ? 1 : 0.4 }}>
                    <span>{active ? '✅' : '⬜'}</span>
                    <span style={{ color: active ? C.greenText : C.muted }}><strong>{boost}</strong> — {label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <SecLabel>🚀 Boost This Job</SecLabel>
              <p style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, lineHeight: 1.6, margin: '0 0 12px' }}>
                Pin your job to the top of search results for 7 days. Get 3× more applications guaranteed.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {[['7 days', '$29'], ['14 days', '$49'], ['30 days', '$89']].map(([d, p]) => (
                  <div key={d} style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{p}</div>
                    <div style={{ fontSize: 10, color: C.textSoft, fontFamily: FONTS.body }}>{d}</div>
                  </div>
                ))}
              </div>
              <OutlineBtn full>Add Boost</OutlineBtn>
            </Card>

            <Card>
              <SecLabel>Checklist</SecLabel>
              {[
                [!!form.title, 'Job title'],
                [!!form.department, 'Department'],
                [!!form.country, 'Country'],
                [!!(form.salaryMin || form.shiftPay), 'Salary / Pay'],
                [!!form.description, 'Description'],
                [form.visaSponsorship, 'Visa info (optional)'],
              ].map(([done, label], i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{done ? '✅' : '⬜'}</span>
                  <span style={{ fontSize: 12, color: done ? C.textSoft : C.text, textDecoration: done ? 'line-through' : 'none', fontFamily: FONTS.body }}>{label}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
