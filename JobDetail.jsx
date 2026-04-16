import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS, SHADOWS, JOB_MARKETS } from '../../tokens';
import { MOCK_JOBS } from '../../data/mockData';
import { incrementJobViews, applyToJob } from '../../firebase';
import {
  Card, Badge, Chip, GoldBtn, OutlineBtn, NavyBtn,
  Modal, Textarea, Alert, Spinner, SecLabel, Note,
} from '../../components/ui/index';
import TopNav from '../../components/layout/TopNav';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSeeker } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();

  const [job, setJob]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying]   = useState(false);
  const [applied, setApplied]     = useState(false);
  const [applyError, setApplyError] = useState('');
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    // In production: fetch from Firestore. Using mock data here.
    const found = MOCK_JOBS.find(j => j.id === id);
    setJob(found || null);
    setLoading(false);
    if (found) incrementJobViews(id).catch(() => {});
  }, [id]);

  const handleApply = async () => {
    if (!currentUser) { navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } }); return; }
    setApplying(true);
    setApplyError('');
    try {
      await applyToJob(id, currentUser.uid, coverNote);
      setApplied(true);
      setApplyOpen(false);
    } catch (e) {
      setApplyError('Something went wrong. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={40} /></div>
    </div>
  );

  if (!job) return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, color: C.navy }}>Job not found</div>
        <div style={{ marginTop: 16 }}><GoldBtn onClick={() => navigate('/jobs')}>← Back to Jobs</GoldBtn></div>
      </div>
    </div>
  );

  const salaryStr = job.salary?.amount
    ? `$${job.salary.amount} / ${job.salary.period}`
    : job.salary
    ? `$${job.salary.min?.toLocaleString()} – $${job.salary.max?.toLocaleString()} / ${job.salary.period}`
    : 'Competitive';

  return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />

      {/* ── Hero banner ── */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: isMobile ? '24px 16px' : '36px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link to="/jobs" style={{ color: C.muted, fontSize: 13, textDecoration: 'none', fontFamily: FONTS.body }}>← Back to Jobs</Link>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginTop: 14, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <div style={{ width: 70, height: 70, background: 'rgba(255,255,255,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, border: `2px solid rgba(201,160,82,0.4)` }}>🏨</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                {job.verified && <Badge type="green">✓ Verified Hotel</Badge>}
                {job.urgent   && <Badge type="red">🔥 Urgent Hire</Badge>}
                {job.type === 'part-time' && <Badge type="purple">⚡ Part-Time Shift</Badge>}
              </div>
              <h1 style={{ fontFamily: FONTS.display, fontSize: isMobile ? 24 : 32, fontWeight: 700, color: 'white', margin: '0 0 6px', lineHeight: 1.2 }}>{job.title}</h1>
              <div style={{ color: '#CBD5E1', fontSize: 14, fontFamily: FONTS.body }}>{job.hotelName} · {job.countryFlag} {job.city}, {job.countryLabel}</div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                {applied
                  ? <div style={{ background: C.greenBg, color: C.greenText, borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, fontFamily: FONTS.body }}>✓ Applied!</div>
                  : <GoldBtn onClick={() => setApplyOpen(true)}>Apply Now</GoldBtn>
                }
                <OutlineBtn onClick={() => setSaved(!saved)} style={{ color: 'white', borderColor: 'white' }}>
                  {saved ? '❤️ Saved' : '🤍 Save Job'}
                </OutlineBtn>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '16px 14px' : '28px 48px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24 }}>
        {/* Left: Job details */}
        <div>
          {/* Key chips */}
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Chip>💼 {job.type === 'part-time' ? 'Part-Time / Shift' : 'Full-Time'}</Chip>
              <Chip>💰 {salaryStr}</Chip>
              <Chip>📂 {job.department}</Chip>
              <Chip>🎯 {job.experience} level</Chip>
              <Chip>🏨 {job.hotel_category}</Chip>
              {job.visaSponsorship && <Chip>✈️ Visa Sponsored</Chip>}
              {job.accommodationProvided && <Chip>🏠 Accommodation Provided</Chip>}
              {job.shiftTime && <Chip>⏰ {job.shiftTime}</Chip>}
            </div>
          </Card>

          {/* Description */}
          <Card style={{ marginBottom: 16 }}>
            <SecLabel>About the Role</SecLabel>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, fontFamily: FONTS.body, margin: 0 }}>{job.description}</p>
          </Card>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Requirements</SecLabel>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ fontSize: 13, color: C.text, lineHeight: 1.8, fontFamily: FONTS.body }}>{r}</li>
                ))}
              </ul>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits?.length > 0 && (
            <Card style={{ marginBottom: 16 }}>
              <SecLabel>Benefits & Package</SecLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {job.benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, color: C.greenText, fontFamily: FONTS.body }}>
                    ✅ {b}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Note type="green">This is a direct hire — no recruitment agency involved. HireAHotelier.com has verified this hotel's registration and license. You will not be charged any fees.</Note>

          {/* Mobile apply button */}
          {isMobile && (
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {applied
                ? <div style={{ background: C.greenBg, color: C.greenText, borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, fontFamily: FONTS.body, flex: 1, textAlign: 'center' }}>✓ Applied!</div>
                : <GoldBtn full onClick={() => setApplyOpen(true)}>Apply Now</GoldBtn>
              }
              <OutlineBtn onClick={() => setSaved(!saved)}>{saved ? '❤️' : '🤍'}</OutlineBtn>
            </div>
          )}
        </div>

        {/* Right: Sidebar info */}
        <div>
          {/* Hotel card */}
          <Card style={{ marginBottom: 16 }}>
            <SecLabel>About the Hotel</SecLabel>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏨</div>
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: C.navy }}>{job.hotelName}</div>
                <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{job.countryFlag} {job.city}, {job.countryLabel}</div>
              </div>
            </div>
            {/* Hotel rating mockup */}
            <div style={{ background: C.slate, borderRadius: 8, padding: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: FONTS.body, marginBottom: 4 }}>
                <span style={{ color: C.textSoft }}>Employee Rating</span>
                <span style={{ fontWeight: 700, color: C.navy }}>4.7 / 5</span>
              </div>
              <div style={{ background: C.border, borderRadius: 10, height: 6 }}>
                <div style={{ background: `linear-gradient(90deg,${C.gold},${C.goldLight})`, width: '94%', height: 6, borderRadius: 10 }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontFamily: FONTS.body }}>Based on 128 former employee reviews</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Badge type="green">✓ Verified</Badge>
              <Badge type="navy">{job.hotel_category}</Badge>
            </div>
          </Card>

          {/* Job summary */}
          <Card style={{ marginBottom: 16 }}>
            <SecLabel>Job Summary</SecLabel>
            {[
              ['Posted', new Date(job.postedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
              ['Applicants', `${job.applicants} applied`],
              ['Views', `${job.views + 1} views`],
              ['Department', job.department],
              ['Job Type', job.type === 'part-time' ? 'Part-Time / Shift' : 'Full-Time'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.border}`, fontSize: 12, fontFamily: FONTS.body }}>
                <span style={{ color: C.textSoft }}>{k}</span>
                <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Share */}
          <Card>
            <SecLabel>Share This Job</SecLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['WhatsApp', 'LinkedIn', 'Copy Link'].map(s => (
                <OutlineBtn key={s} small onClick={() => {
                  if (s === 'Copy Link') { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
                }}>{s === 'WhatsApp' ? '💬' : s === 'LinkedIn' ? '🔗' : '📋'} {s}</OutlineBtn>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Apply Modal ── */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title={`Apply — ${job.title}`} width={500}>
        {!currentUser ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 18, color: C.navy, marginBottom: 8 }}>Sign in to Apply</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 20 }}>Create a free account to apply for this job directly.</div>
            <GoldBtn full onClick={() => navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } })}>Sign In / Register Free</GoldBtn>
          </div>
        ) : (
          <div>
            {applyError && <Alert type="error">{applyError}</Alert>}

            {/* Job summary in modal */}
            <div style={{ display: 'flex', gap: 12, padding: '12px 14px', background: C.slate, borderRadius: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏨</div>
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: C.navy }}>{job.title}</div>
                <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{job.hotelName} · {job.countryFlag} {job.city}</div>
              </div>
            </div>

            <Textarea
              label="Cover Note (Optional)"
              id="cover"
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              placeholder={`Tell ${job.hotelName} why you're the best fit for this role…`}
              rows={5}
            />

            <Note type="blue">Your AI Resume and Video Profile (if uploaded) will be automatically attached to this application.</Note>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <GoldBtn full onClick={handleApply} disabled={applying}>
                {applying
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner size={16} color={C.navy} /> Submitting…</span>
                  : '🚀 Submit Application'}
              </GoldBtn>
              <OutlineBtn onClick={() => setApplyOpen(false)}>Cancel</OutlineBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
