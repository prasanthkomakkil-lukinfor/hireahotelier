import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { MOCK_CANDIDATES } from '../../data/mockData';
import { createOfferLetter } from '../../firebase';
import { Card, GoldBtn, OutlineBtn, NavyBtn, Input, Select, Textarea, SecLabel, Note, Alert, Spinner, Badge } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const CURRENCIES = ['USD', 'AED', 'SAR', 'QAR', 'SGD', 'AUD', 'MYR'].map(c => ({ value: c, label: c }));

export default function OfferLetter() {
  const { candidateId } = useParams();
  const { userProfile, currentUser } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();

  const candidate = MOCK_CANDIDATES.find(c => c.id === candidateId) || MOCK_CANDIDATES[0];

  const [form, setForm] = useState({
    jobTitle:    '',
    department:  '',
    reportingTo: '',
    startDate:   '',
    probation:   '3 Months',
    salary:      '',
    currency:    'USD',
    serviceCharge: '',
    accommodation: '',
    meals:         '',
    annualLeave:   '21 days',
    medical:       'Group Policy covered',
    otherBenefits: '',
    language:      'English',
  });
  const F = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : v.target.value }));

  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState('');
  const [showPreview, setShowPreview] = useState(true);

  const handleSend = async () => {
    if (!form.jobTitle || !form.salary || !form.startDate) {
      setError('Please fill in Job Title, Start Date, and Salary.'); return;
    }
    setSending(true);
    setError('');
    try {
      await createOfferLetter({
        candidateId: candidate.id,
        candidateName: candidate.displayName,
        employerId: currentUser.uid,
        hotelName: userProfile?.hotelName || '',
        ...form,
      });
      setSent(true);
    } catch (e) {
      setError('Failed to send offer. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardShell role="employer">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Digital Offer Letter</div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 20 }}>
          Send a professionally formatted, legally structured offer directly to the candidate.
        </div>

        {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
        {sent && (
          <Alert type="success">
            ✅ Offer letter sent to {candidate.displayName}! They will receive a notification to review and sign.
          </Alert>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: 24 }}>
          {/* ── Form ── */}
          <div>
            {/* Candidate info */}
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Candidate</SecLabel>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: `2px solid ${C.gold}` }}>👤</div>
                <div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{candidate.displayName}</div>
                  <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{candidate.headline?.split('|')[0]?.trim()}</div>
                  <div style={{ marginTop: 4 }}><Badge type="green">✓ Verified Candidate</Badge></div>
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Position Details</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Job Title *" id="jt" value={form.jobTitle} onChange={F('jobTitle')} placeholder="e.g. Executive Chef" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Department" id="dept" value={form.department} onChange={F('department')} placeholder="Kitchen & Culinary" />
                  <Input label="Reporting To" id="rt" value={form.reportingTo} onChange={F('reportingTo')} placeholder="F&B Director" />
                  <Input label="Start Date *" id="sd" type="date" value={form.startDate} onChange={F('startDate')} required />
                  <Select label="Probation Period" id="prob" value={form.probation} onChange={F('probation')} options={['1 Month','2 Months','3 Months','6 Months'].map(v => ({ value: v, label: v }))} />
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Compensation</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Gross Monthly Salary *" id="sal" value={form.salary} onChange={F('salary')} placeholder="e.g. 2000" required />
                  <Select label="Currency" id="cur" value={form.currency} onChange={F('currency')} options={CURRENCIES} />
                </div>
                <Input label="Service Charge (if applicable)" id="sc" value={form.serviceCharge} onChange={F('serviceCharge')} placeholder="e.g. $200/month est." />
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Benefits</SecLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Accommodation" id="accom" value={form.accommodation} onChange={F('accommodation')} placeholder="e.g. Provided by hotel" />
                <Input label="Meals" id="meals" value={form.meals} onChange={F('meals')} placeholder="e.g. 3 meals on duty" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Annual Leave" id="al" value={form.annualLeave} onChange={F('annualLeave')} placeholder="21 days/year" />
                  <Input label="Medical Insurance" id="med" value={form.medical} onChange={F('medical')} placeholder="Group Policy" />
                </div>
                <Textarea label="Other Benefits" id="ob" value={form.otherBenefits} onChange={F('otherBenefits')} placeholder="Flight tickets, transport allowance, etc." rows={2} />
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Offer Language</SecLabel>
              <Select id="lang" value={form.language} onChange={F('language')} options={['English', 'Arabic', 'Hindi', 'Bengali', 'Tagalog', 'Bahasa Indonesia', 'Nepali'].map(l => ({ value: l, label: l }))} />
              <Note type="green">Sending the offer in the candidate's language significantly increases acceptance rates and builds trust.</Note>
            </Card>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <GoldBtn onClick={handleSend} disabled={sending || sent}>
                {sending ? <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Spinner size={16} color={C.navy} />Sending…</span> : sent ? '✓ Offer Sent!' : '📤 Send Offer Letter'}
              </GoldBtn>
              <OutlineBtn onClick={() => window.print()}>⬇ Download PDF</OutlineBtn>
            </div>
          </div>

          {/* ── Preview ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <SecLabel>Live Preview</SecLabel>
              <button onClick={() => setShowPreview(!showPreview)} style={{ background: 'none', border: 'none', fontSize: 12, color: C.gold, cursor: 'pointer', fontFamily: FONTS.body }}>
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
            {showPreview && (
              <Card style={{ fontSize: 12, lineHeight: 1.75, fontFamily: FONTS.body }}>
                {/* Letter header */}
                <div style={{ borderBottom: `2px solid ${C.gold}`, paddingBottom: 12, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>{(userProfile?.hotelName || 'YOUR HOTEL NAME').toUpperCase()}</div>
                    <div style={{ fontSize: 10, color: C.textSoft }}>{userProfile?.city || 'City'}, {userProfile?.country?.toUpperCase() || 'Country'}</div>
                    <div style={{ fontSize: 10, color: C.textSoft }}>hireahotelier.com — Direct Hire Platform</div>
                  </div>
                  <div style={{ fontSize: 28 }}>🏨</div>
                </div>

                <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Ref: {(userProfile?.hotelName || 'HTL').slice(0,3).toUpperCase()}/OFFER/{new Date().getFullYear()}/{Math.random().toString(36).slice(2,6).toUpperCase()}
                </div>

                <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8, fontSize: 13 }}>LETTER OF APPOINTMENT</div>
                <p style={{ color: C.text, margin: '0 0 8px' }}>Dear <strong>{candidate.displayName}</strong>,</p>
                <p style={{ color: C.text, margin: '0 0 10px' }}>
                  We are pleased to offer you the position of <strong>{form.jobTitle || '[Job Title]'}</strong> at {userProfile?.hotelName || '[Hotel Name]'}, subject to the following terms and conditions:
                </p>

                <div style={{ background: C.slate, borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                  {[
                    ['Start Date',   form.startDate ? new Date(form.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                    ['Department',   form.department || '—'],
                    ['Reporting To', form.reportingTo || '—'],
                    ['Gross Salary', form.salary ? `${form.currency} ${form.salary}/month` : '—'],
                    ['Accommodation',form.accommodation || '—'],
                    ['Annual Leave', form.annualLeave],
                    ['Medical',      form.medical],
                    ['Probation',    form.probation],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                      <span style={{ color: C.textSoft }}>{k}</span>
                      <span style={{ fontWeight: 700, color: C.navy }}>{v}</span>
                    </div>
                  ))}
                </div>

                <p style={{ color: C.text, fontSize: 11, margin: '0 0 14px' }}>
                  This offer is contingent upon successful completion of background verification and receipt of all required documents. Please sign below to indicate your acceptance of these terms.
                </p>

                <div style={{ borderTop: `1.5px solid ${C.border}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 16 }}>Authorised Signatory</div>
                    <div style={{ fontWeight: 700, color: C.navy, fontSize: 12 }}>HR Director</div>
                    <div style={{ fontSize: 10, color: C.textSoft }}>{userProfile?.hotelName || 'Hotel Name'}</div>
                    <div style={{ fontSize: 10, color: C.greenText, marginTop: 4 }}>✓ Digitally Signed via HireAHotelier</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 14 }}>Candidate Acceptance</div>
                    <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: '8px 18px', fontSize: 10, color: C.muted, marginBottom: 8, minWidth: 160 }}>[ Signature ]</div>
                    <div style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.navy, border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FONTS.body, display: 'inline-block' }}>
                      ✍️ Accept & Sign
                    </div>
                  </div>
                </div>
              </Card>
            )}
            <Note type="blue">The candidate receives an email with a secure link to view and digitally sign this offer. No printing required.</Note>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
