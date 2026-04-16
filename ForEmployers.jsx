import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { C, FONTS, SHADOWS, JOB_MARKETS } from '../tokens';
import { Card, Badge, GoldBtn, OutlineBtn, SecLabel } from '../components/ui/index';
import TopNav from '../components/layout/TopNav';

const STEPS = [
  { n: '01', icon: '🏨', title: 'Create Hotel Profile', desc: 'Register your hotel, upload your trade licence, and get the ✓ Verified badge. Takes 10 minutes.' },
  { n: '02', icon: '📢', title: 'Post Your Job', desc: 'Fill in the role, salary, and benefits. AI writes the description for you. Go live in 60 seconds.' },
  { n: '03', icon: '🎥', title: 'Review Video Profiles', desc: 'Candidates record a 90-second intro. You see the person before the interview. No surprises.' },
  { n: '04', icon: '⭐', title: 'Shortlist & Schedule', desc: 'Drag candidates through your hiring pipeline. One click to schedule a video interview.' },
  { n: '05', icon: '✉️', title: 'Send Offer Digitally', desc: 'Generate a legally formatted offer letter. Candidate signs from their phone. Done.' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI Candidate Matching',      desc: 'Our AI scores every applicant against your job requirements. Shortlist 30 candidates in 3 minutes.' },
  { icon: '🎥', title: 'Video Profiles',              desc: 'See candidates before you interview them. Body language, communication, personality — all visible.' },
  { icon: '🌍', title: '85,000+ Active Candidates',   desc: 'Talent pool from India, Philippines, Nepal, Bangladesh, Sri Lanka, Indonesia & Myanmar.' },
  { icon: '⚡', title: 'Part-Time Shift Posting',     desc: 'Post a banquet shift tonight and get applications within the hour. No agency needed.' },
  { icon: '✅', title: 'Verified Candidates',          desc: 'Certifications and work history verified. Ratings from previous employers visible.' },
  { icon: '📊', title: 'Hiring Analytics',            desc: 'See which job posts perform, where your best hires come from, and your time-to-hire.' },
  { icon: '🔒', title: 'No Agent Policy',             desc: 'You speak directly to candidates. No commission, no middleman, no inflated fees.' },
  { icon: '📱', title: 'Mobile-First Dashboard',      desc: 'Review applications, message candidates, and send offers from your phone on the go.' },
];

const PRICING = [
  {
    plan: 'Free',
    price: '$0',
    period: 'forever',
    highlight: false,
    features: ['3 active job posts', 'Unlimited candidate profiles', 'Basic applicant management', 'Standard listing visibility', 'Email support'],
    cta: 'Start for Free',
    ctaColor: 'outline',
  },
  {
    plan: 'Hotel Pro',
    price: '$29',
    period: '/month',
    highlight: true,
    badge: '⭐ Most Popular',
    features: ['Unlimited job posts', 'AI candidate shortlisting', 'Video profile access', 'Priority listing placement', 'Analytics dashboard', 'Digital offer letters', 'Shift posting (part-time)', 'WhatsApp notifications', 'Dedicated account manager'],
    cta: 'Start 14-Day Free Trial',
    ctaColor: 'gold',
  },
  {
    plan: 'Enterprise',
    price: 'Custom',
    period: '',
    highlight: false,
    features: ['Hotel chains & groups', 'Multi-property management', 'Bulk hiring tools', 'Custom branding', 'API access', 'Dedicated support team', 'SLA guarantee', 'Training & onboarding'],
    cta: 'Contact Sales',
    ctaColor: 'outline',
  },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'HR Director, Taj Hotels Mumbai', quote: 'We cut our time-to-hire from 45 days to 12 days. The video profiles are a game-changer — I can pre-screen 20 candidates in under an hour.', rating: 5, flag: '🇮🇳' },
  { name: 'Ahmed Al-Mansouri', role: 'Talent Acquisition, Burj Al Arab Dubai', quote: 'Finally a platform that understands GCC hospitality. The candidate quality from South Asia is excellent, and zero agents means zero inflated expectations.', rating: 5, flag: '🇦🇪' },
  { name: 'Jennifer Lim', role: 'General Manager, Marina Bay Sands', quote: 'The part-time shift feature is brilliant for our banquet operations. We can post a shift at 2pm and have it fully staffed by 4pm.', rating: 5, flag: '🇸🇬' },
];

export default function ForEmployers() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <div style={{ minHeight: '100vh', background: C.slate, fontFamily: FONTS.body }}>
      <TopNav />

      {/* ── Hero ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 55%, ${C.navy} 100%)`, padding: isMobile ? '44px 16px 40px' : '70px 48px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,160,82,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 100, width: 260, height: 260, background: 'radial-gradient(circle, rgba(201,160,82,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Badge type="gold">🏨 For Hotels, Resorts & Hospitality Groups</Badge>
          <h1 style={{ fontFamily: FONTS.display, fontSize: isMobile ? 30 : isTablet ? 40 : 52, color: 'white', lineHeight: 1.15, fontWeight: 700, margin: '16px 0 0' }}>
            Hire The Best Hospitality<br />
            <span style={{ color: C.gold }}>Talent Directly. No Agents.</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: isMobile ? 14 : 17, lineHeight: 1.75, margin: '18px auto 0', maxWidth: 560 }}>
            Post jobs to 85,000+ verified hospitality professionals across South & Southeast Asia. Video profiles, AI matching, digital offers — the complete hiring stack for hotels.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
            <GoldBtn onClick={() => navigate('/register?role=employer')}>🚀 Post Your First Job Free</GoldBtn>
            <OutlineBtn onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}>
              See How It Works ↓
            </OutlineBtn>
          </div>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 12 }}>No credit card required · Free forever plan available · Cancel anytime</p>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: C.gold, padding: isMobile ? '14px 16px' : '16px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10, maxWidth: 1000, margin: '0 auto' }}>
          {[['3,800+','Hotels on Platform'], ['85,000+','Active Candidates'], ['6,810','Confirmed Hires'], ['12 days','Avg Time to Hire'], ['98%','Direct Hires — No Agent']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 18 : 24, fontWeight: 700, color: C.navy }}>{v}</div>
              <div style={{ fontSize: 10, color: '#5C3B00' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div id="how-it-works" style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <SecLabel>Simple Process</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 24 : 32, fontWeight: 700, color: C.navy }}>Hire in 5 Steps</div>
            <div style={{ fontSize: 14, color: C.textSoft, marginTop: 8 }}>From posting to signed offer — as fast as 48 hours</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: isMobile ? 14 : 24, alignItems: 'flex-start', paddingBottom: i < STEPS.length - 1 ? 28 : 0, position: 'relative' }}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', left: isMobile ? 17 : 23, top: 52, width: 2, height: 'calc(100% - 20px)', background: `linear-gradient(${C.gold}40, ${C.gold}10)` }} />
                )}
                {/* Step number */}
                <div style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48, background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${C.gold}`, boxShadow: SHADOWS.gold }}>
                  <span style={{ fontFamily: FONTS.display, fontSize: isMobile ? 14 : 16, fontWeight: 700, color: C.gold }}>{step.n}</span>
                </div>
                <div style={{ paddingTop: 6, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{step.icon}</span>
                    <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 16 : 20, fontWeight: 700, color: C.navy }}>{step.title}</div>
                  </div>
                  <div style={{ fontSize: 14, color: C.textSoft, lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: C.slate }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <SecLabel>Platform Features</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 30, fontWeight: 700, color: C.navy }}>Everything You Need to Hire Well</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)', gap: 16 }}>
            {FEATURES.map(f => (
              <Card key={f.title}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.6 }}>{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Candidate pool map ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <SecLabel>Labour Markets</SecLabel>
              <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
                Tap Into 7 of the World's Largest Hospitality Labour Markets
              </div>
              <p style={{ fontSize: 14, color: C.textSoft, lineHeight: 1.75, marginBottom: 20 }}>
                Our candidate network spans India, Philippines, Bangladesh, Nepal, Sri Lanka, Indonesia and Myanmar — the primary hospitality talent sources for GCC, Asia and Australia.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['🇮🇳 India', '32,400 active seekers'], ['🇵🇭 Philippines', '18,900 active seekers'], ['🇧🇩 Bangladesh', '12,800 active seekers'], ['🇳🇵 Nepal', '8,200 active seekers']].map(([c, n]) => (
                  <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: C.slate, borderRadius: 8 }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{c}</span>
                    <span style={{ fontSize: 12, color: C.textSoft }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card style={{ padding: 24 }}>
              <SecLabel>Job Markets We Serve</SecLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {JOB_MARKETS.map(m => (
                  <div key={m.code} style={{ background: C.navy, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{m.flag}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{m.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '12px 14px', background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: C.greenText, fontWeight: 600 }}>✓ All candidates are directly contactable — no agent in the middle</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: C.slate }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SecLabel>What Hotels Say</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.navy }}>Trusted by Leading Hospitality Groups</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <Card key={t.name} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 4 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: C.gold, fontSize: 16 }}>★</span>)}</div>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.flag}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.textSoft }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <SecLabel>Transparent Pricing</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 30, fontWeight: 700, color: C.navy }}>Simple, No-Surprise Pricing</div>
            <div style={{ fontSize: 14, color: C.textSoft, marginTop: 8 }}>No per-hire fees. No hidden commissions. Ever.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
            {PRICING.map(p => (
              <Card key={p.plan} style={{ border: p.highlight ? `2px solid ${C.gold}` : `1.5px solid ${C.border}`, background: p.highlight ? C.cream : 'white', position: 'relative', overflow: 'visible' }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.navy, borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{p.badge}</div>
                )}
                <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{p.plan}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 16 }}>
                  <span style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 700, color: p.highlight ? C.gold : C.navy }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: C.textSoft }}>{p.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: C.text }}>
                      <span style={{ color: C.gold, flexShrink: 0 }}>✓</span><span>{f}</span>
                    </div>
                  ))}
                </div>
                {p.ctaColor === 'gold'
                  ? <GoldBtn full onClick={() => navigate('/register?role=employer')}>{p.cta}</GoldBtn>
                  : <OutlineBtn full onClick={() => navigate(p.plan === 'Enterprise' ? '/contact' : '/register?role=employer')}>{p.cta}</OutlineBtn>
                }
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: isMobile ? '40px 16px' : '60px 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 24 : 34, fontWeight: 700, color: 'white', marginBottom: 12 }}>
          Start Hiring Directly Today
        </div>
        <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Join 3,800+ hotels already using HireAHotelier. Post your first job in 60 seconds, free forever.
        </p>
        <GoldBtn onClick={() => navigate('/register?role=employer')}>🚀 Create Free Employer Account</GoldBtn>
        <div style={{ marginTop: 14 }}>
          <span style={{ color: '#475569', fontSize: 12 }}>Already have an account? </span>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: C.gold, fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body }}>Sign in →</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: C.navy, padding: '20px 48px', textAlign: 'center' }}>
        <div style={{ color: C.gold, fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>HireAHotelier.com</div>
        <div style={{ fontSize: 11, color: '#475569' }}>© {new Date().getFullYear()} · Direct Hospitality Hiring · GCC · Asia · Australia</div>
      </div>
    </div>
  );
}
