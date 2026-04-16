import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useGeolocation } from '../hooks/useBreakpoint';
import { C, FONTS, SHADOWS, JOB_MARKETS } from '../tokens';
import { MOCK_JOBS } from '../data/mockData';
import { Card, Badge, Chip, GoldBtn, OutlineBtn, SecLabel } from '../components/ui/index';
import TopNav from '../components/layout/TopNav';

const FEATURES = [
  { icon: '🎥', title: 'Video Profiles',      desc: 'Record a 90-sec intro. Hotels hire 3× faster when they see you first.' },
  { icon: '🤖', title: 'AI Resume Builder',   desc: 'Generate a hospitality-specific CV in 30 seconds. ATS-optimised.' },
  { icon: '⚡', title: 'Part-Time Shifts',    desc: 'Banquet & event shifts posted by hotels. Accept and earn same day.' },
  { icon: '⭐', title: 'Mutual Ratings',      desc: 'Candidates rate hotels. Hotels rate candidates. Full transparency.' },
  { icon: '📬', title: 'Live Status Updates', desc: 'Real-time notifications at every stage of your application.' },
  { icon: '✉️', title: 'Digital Offer Letters', desc: 'Signed online in seconds. No printing, no couriers.' },
  { icon: '🔒', title: 'Zero Agent Policy',   desc: 'All hotels verified. No middlemen, no commission, no fraud.' },
  { icon: '🌐', title: 'Multi-Language',       desc: 'Platform in English, Arabic, Hindi, Tagalog, Bahasa & more.' },
];

const TESTIMONIALS = [
  { name: 'Rajan Mehta', role: 'Executive Chef, Burj Al Arab', flag: '🇮🇳', text: 'Got my dream job in Dubai without paying a single rupee to any agent. Applied directly, video interview, offer in 10 days.' },
  { name: 'Maria Santos', role: 'F&B Manager, Shangri-La Singapore', flag: '🇵🇭', text: 'The AI resume builder made my CV look so professional. Three hotels reached out to me within a week of posting.' },
  { name: 'Aditya Kumar', role: 'Sous Chef, Crown Melbourne', flag: '🇮🇳', text: 'Visa sponsorship filter saved me hours of searching. Found an Australian hotel offering full sponsorship directly.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  const { getLocation } = useGeolocation();
  const [search, setSearch]   = useState('');
  const [country, setCountry] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search)  params.set('q', search);
    if (country) params.set('country', country);
    if (jobType) params.set('type', jobType);
    navigate(`/jobs?${params}`);
  };

  const cols = isMobile ? 2 : isTablet ? 4 : 4;

  return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLight} 60%,${C.navy} 100%)`,
        padding: isMobile ? '40px 16px 36px' : '64px 48px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, background: 'radial-gradient(circle,rgba(201,160,82,.1) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, background: 'radial-gradient(circle,rgba(201,160,82,.06) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 14 }}>
            <Badge type="gold">✨ No Agents · No Fees · No Scams · 100% Direct Hire</Badge>
          </div>

          <h1 style={{ fontFamily: FONTS.display, fontSize: isMobile ? 28 : isTablet ? 38 : 48, color: 'white', lineHeight: 1.2, fontWeight: 700, margin: '0 0 16px' }}>
            The Direct Hiring Platform<br />
            <span style={{ color: C.gold }}>for Hospitality Professionals</span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: isMobile ? 14 : 16, lineHeight: 1.75, margin: '0 0 28px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Connect with top hotels across GCC, Malaysia, Singapore & Australia. Video profiles, AI resumes, and direct hires — always.
          </p>

          {/* Search box */}
          <div style={{ background: 'white', borderRadius: 16, padding: isMobile ? '14px' : '16px', boxShadow: SHADOWS.lg, marginBottom: 16 }}>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Job title, skill or hotel name…" style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: FONTS.body, outline: 'none', width: '100%' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <select value={country} onChange={e => setCountry(e.target.value)} style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '9px 10px', fontSize: 12, fontFamily: FONTS.body, outline: 'none', background: 'white', color: country ? C.text : C.muted }}>
                    <option value="">📍 Any Country</option>
                    {JOB_MARKETS.map(m => <option key={m.code} value={m.code}>{m.flag} {m.label}</option>)}
                  </select>
                  <select value={jobType} onChange={e => setJobType(e.target.value)} style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '9px 10px', fontSize: 12, fontFamily: FONTS.body, outline: 'none', background: 'white', color: jobType ? C.text : C.muted }}>
                    <option value="">⏱ Any Type</option>
                    <option value="full-time">💼 Full-Time</option>
                    <option value="part-time">⚡ Part-Time Shift</option>
                  </select>
                </div>
                <GoldBtn full onClick={handleSearch}>Search Jobs</GoldBtn>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="🔍  Job title, skill or hotel name…" style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: FONTS.body, outline: 'none', minWidth: 0 }} />
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 12, fontFamily: FONTS.body, outline: 'none', background: 'white', minWidth: 160, color: country ? C.text : C.muted }}>
                  <option value="">📍 Any Country</option>
                  {JOB_MARKETS.map(m => <option key={m.code} value={m.code}>{m.flag} {m.label}</option>)}
                </select>
                {!isTablet && (
                  <select value={jobType} onChange={e => setJobType(e.target.value)} style={{ border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 12, fontFamily: FONTS.body, outline: 'none', background: 'white', minWidth: 160, color: jobType ? C.text : C.muted }}>
                    <option value="">⏱ Any Type</option>
                    <option value="full-time">💼 Full-Time</option>
                    <option value="part-time">⚡ Part-Time Shift</option>
                  </select>
                )}
                <GoldBtn onClick={handleSearch}>Search Jobs</GoldBtn>
              </div>
            )}
          </div>

          {/* Popular roles */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Executive Chef', 'F&B Manager', 'Front Desk', 'Banquet Staff', 'Housekeeping', 'Concierge'].map(r => (
              <Chip key={r} onClick={() => { setSearch(r); navigate(`/jobs?q=${encodeURIComponent(r)}`); }}>{r}</Chip>
            ))}
          </div>

          {/* Geolocation */}
          <button onClick={getLocation} style={{ marginTop: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#CBD5E1', borderRadius: 20, padding: '5px 14px', fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body }}>
            📍 Find jobs near me
          </button>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: C.gold, padding: isMobile ? '12px 16px' : '16px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8, maxWidth: 900, margin: '0 auto' }}>
          {[['12,400+','Active Jobs'],['3,800+','Hotels'],['85,000+','Professionals'],['7','Markets'],['98%','Direct Hire']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 18 : 24, fontWeight: 700, color: C.navy }}>{v}</div>
              <div style={{ fontSize: 10, color: '#5C3B00', fontFamily: FONTS.body }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Job markets ── */}
      <div style={{ padding: isMobile ? '24px 16px' : '32px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SecLabel>Job Markets</SecLabel>
          <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Jobs in GCC, Asia & Australia</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {JOB_MARKETS.map(m => (
              <div key={m.code} onClick={() => navigate(`/jobs?country=${m.code}`)} style={{ background: C.slate, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: isMobile ? '8px 12px' : '10px 16px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.cream; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.slate; }}>
                <span style={{ fontSize: 20 }}>{m.flag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body }}>{m.region}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ padding: isMobile ? '24px 16px' : '32px 48px', background: C.slate }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SecLabel>Platform Features</SecLabel>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 14 }}>
            {FEATURES.map(f => (
              <Card key={f.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: C.textSoft, lineHeight: 1.6, fontFamily: FONTS.body }}>{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured jobs ── */}
      <div style={{ padding: isMobile ? '24px 16px' : '32px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <SecLabel>Featured Jobs</SecLabel>
              <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 18 : 22, fontWeight: 700, color: C.navy }}>Latest Opportunities</div>
            </div>
            <Link to="/jobs" style={{ color: C.gold, fontSize: 13, textDecoration: 'none', fontFamily: FONTS.body, fontWeight: 700 }}>View all 12,400+ →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 14 }}>
            {MOCK_JOBS.slice(0, 3).map(job => (
              <Card key={job.id} hover onClick={() => navigate(`/jobs/${job.id}`)}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏨</div>
                  <div>
                    <div style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: C.navy }}>{job.title}</div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{job.hotelName}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 8 }}>{job.countryFlag} {job.city}, {job.countryLabel}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {job.verified && <Badge type="green">✓ Direct Hire</Badge>}
                  {job.urgent && <Badge type="red">🔥 Urgent</Badge>}
                  {job.visaSponsorship && <Badge type="navy">✈️ Visa</Badge>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ padding: isMobile ? '24px 16px' : '32px 48px', background: C.slate }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <SecLabel>Success Stories</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy }}>Hired Without a Single Agent</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <Card key={t.name}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontFamily: FONTS.body, margin: '0 0 14px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{t.flag}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: isMobile ? '40px 16px' : '60px 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 24 : 32, fontWeight: 700, color: 'white', marginBottom: 12 }}>
          Ready to Find Your Next Role?
        </div>
        <div style={{ color: '#94A3B8', fontSize: 14, fontFamily: FONTS.body, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
          Join 85,000+ hospitality professionals. Create your free profile, upload a video, and get discovered by top hotels directly.
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldBtn onClick={() => navigate('/register')}>🚀 Create Free Profile</GoldBtn>
          <OutlineBtn onClick={() => navigate('/jobs')} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>Browse Jobs →</OutlineBtn>
        </div>
        <div style={{ marginTop: 20 }}>
          <Link to="/register?role=employer" style={{ color: C.gold, fontSize: 13, fontFamily: FONTS.body, textDecoration: 'none' }}>
            Are you a hotel? Post jobs free → 
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: C.navy, padding: isMobile ? '24px 16px' : '28px 48px', textAlign: 'center' }}>
        <div style={{ color: C.gold, fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>HireAHotelier.com</div>
        <div style={{ fontSize: 11, color: '#475569', fontFamily: FONTS.body }}>
          © {new Date().getFullYear()} HireAHotelier · Direct Hospitality Hiring · GCC · Malaysia · Singapore · Australia
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          {['About', 'For Employers', 'Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 11, color: '#475569', textDecoration: 'none', fontFamily: FONTS.body }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
