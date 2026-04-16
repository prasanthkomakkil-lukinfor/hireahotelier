import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { C, FONTS, SHADOWS } from '../tokens';
import { Card, Badge, GoldBtn, OutlineBtn, SecLabel } from '../components/ui/index';
import TopNav from '../components/layout/TopNav';

const VALUES = [
  { icon: '🔒', title: 'Zero Agents',       desc: 'Every employer is verified by our team. We enforce a strict no-agent policy — candidates never pay fees.' },
  { icon: '🤝', title: 'Direct Connection',  desc: 'Candidates and hotels speak directly. No middlemen inflating salaries, hiding conditions, or taking cuts.' },
  { icon: '⭐', title: 'Mutual Accountability', desc: 'Both sides rate each other. Scam hotels get flagged fast. Star candidates get noticed quickly.' },
  { icon: '🌍', title: 'Labour Market Focus', desc: 'We built this specifically for South & SE Asian hospitality workers targeting GCC, Asia & Australia.' },
  { icon: '📱', title: 'Mobile-First',         desc: 'Designed for the millions of hospitality professionals who use smartphones as their primary device.' },
  { icon: '🎥', title: 'Human First',          desc: 'A 90-second video beats any resume. We built technology that lets your personality come first.' },
];

const TIMELINE = [
  { year: '2023', title: 'The Idea',            desc: 'Founded after witnessing first-hand the suffering caused by unscrupulous recruitment agents in the hospitality sector.' },
  { year: '2024', title: 'Beta Launch',          desc: 'Launched in India and UAE with 200 hotel partners. Verified 500+ hotels in the first 6 months.' },
  { year: '2024', title: '85,000 Members',       desc: 'Expanded to 7 labour markets. First confirmed hire via the platform. Zero agent fees paid by any candidate.' },
  { year: '2025', title: 'AI Features',          desc: 'Introduced AI resume builder, video profiles with teleprompter guidance, and smart job matching.' },
  { year: '2025', title: 'GCC & Asia Expansion', desc: 'Now live across GCC, Malaysia, Singapore, Australia, Maldives and Hong Kong.' },
];

const TRUST_BADGES = [
  { icon: '✅', title: 'Hotel Verification',      desc: 'Every employer submits trade licence, hotel operating licence, and HR contact. Our team reviews within 48 hours.' },
  { icon: '📋', title: 'No-Agent Policy',          desc: 'Any account found operating as an agent is immediately banned and reported.' },
  { icon: '🚩', title: 'Community Reporting',      desc: 'Users flag suspicious jobs or profiles. Our moderation team reviews every report within 24 hours.' },
  { icon: '💰', title: 'Zero Candidate Fees',       desc: 'Candidates never pay. Any employer requesting fees from candidates is permanently banned.' },
  { icon: '⭐', title: 'Mutual Rating System',      desc: 'Both sides rate each other after each placement. Ratings are visible to all parties.' },
  { icon: '🔐', title: 'Data Privacy',              desc: 'GDPR-compliant. Candidate data is never sold or shared with third parties.' },
];

export default function About() {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <div style={{ minHeight: '100vh', background: C.slate, fontFamily: FONTS.body }}>
      <TopNav />

      {/* ── Hero ── */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: isMobile ? '44px 16px 40px' : '70px 48px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'radial-gradient(circle,rgba(201,160,82,0.1) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Badge type="gold">Our Story</Badge>
          <h1 style={{ fontFamily: FONTS.display, fontSize: isMobile ? 28 : 44, fontWeight: 700, color: 'white', lineHeight: 1.2, margin: '14px 0 0' }}>
            Built to End Hospitality<br /><span style={{ color: C.gold }}>Recruitment Scams</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: isMobile ? 14 : 16, lineHeight: 1.8, marginTop: 16, maxWidth: 560, margin: '16px auto 0' }}>
            Every year, thousands of hospitality workers from South and Southeast Asia pay agents thousands of dollars — only to be deceived, underpaid, or never placed. We built HireAHotelier to fix that, permanently.
          </p>
        </div>
      </div>

      {/* ── Mission statement ── */}
      <div style={{ background: C.gold, padding: isMobile ? '28px 16px' : '40px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 30, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>
            "Our mission is simple: every hospitality professional deserves a direct line to their next great role — no agents, no fees, no exploitation."
          </div>
        </div>
      </div>

      {/* ── The problem we solve ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <SecLabel>The Problem We Solve</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
              Hospitality Recruitment Was Broken
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['💸', 'Candidates pay $500–$3,000 to agents for jobs that may not even exist'],
                ['🤥', 'Agents inflate salary offers to attract candidates, then underpay on arrival'],
                ['🔁', 'Hotels pay agency commissions of 1–3 months salary per hire'],
                ['⏱', 'Average hotel time-to-hire through agencies: 45+ days'],
                ['📄', 'Paper CVs hide personality — hotels hire the wrong person constantly'],
              ].map(([ic, text]) => (
                <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{ic}</span>
                  <span style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <Card style={{ background: C.greenBg, border: `1.5px solid ${C.greenBorder}` }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.greenText, marginBottom: 14 }}>✅ Our Solution</div>
            {[
              ['🔒', 'Zero agent fees, ever. Candidates apply free.'],
              ['✅', 'Every hotel verified before posting'],
              ['🎥', 'Video profiles show the real person'],
              ['🤖', 'AI matching finds the right fit in minutes'],
              ['📊', 'Direct communication throughout'],
              ['⭐', 'Mutual ratings keep everyone accountable'],
            ].map(([ic, text]) => (
              <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{ic}</span>
                <span style={{ fontSize: 13, color: C.greenText, lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ── Values ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: C.slate }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SecLabel>Our Values</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.navy }}>What We Stand For</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {VALUES.map(v => (
              <Card key={v.title}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.65 }}>{v.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: 'white' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <SecLabel>Our Journey</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.navy }}>How We Got Here</div>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: isMobile ? 22 : 50, top: 8, bottom: 8, width: 2, background: `linear-gradient(${C.gold}, ${C.gold}20)` }} />
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: isMobile ? 20 : 30, marginBottom: 28, alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ width: isMobile ? 44 : 100, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${C.gold}`, boxShadow: SHADOWS.gold, zIndex: 1 }}>
                    <span style={{ fontFamily: FONTS.display, fontSize: 11, fontWeight: 700, color: C.gold }}>{t.year}</span>
                  </div>
                </div>
                <div style={{ flex: 1, paddingTop: 8 }}>
                  <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.65 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust & Safety ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: C.slate }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SecLabel>Trust & Safety</SecLabel>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 28, fontWeight: 700, color: C.navy }}>How We Keep Everyone Safe</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {TRUST_BADGES.map(b => (
              <Card key={b.title}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{b.icon}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.65 }}>{b.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ── Press / Contact ── */}
      <div style={{ padding: isMobile ? '36px 16px' : '60px 48px', background: 'white' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
          <Card>
            <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 10 }}>📰 Press & Media</div>
            <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.7, marginBottom: 14 }}>For media enquiries, interview requests, or press kit downloads, please contact our communications team.</p>
            <OutlineBtn onClick={() => window.location.href = 'mailto:press@hireahotelier.com'}>📧 press@hireahotelier.com</OutlineBtn>
          </Card>
          <Card>
            <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 10 }}>🤝 Partnerships</div>
            <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.7, marginBottom: 14 }}>Interested in partnering with us? Hotel chains, hospitality schools, and industry associations — let's talk.</p>
            <OutlineBtn onClick={() => window.location.href = 'mailto:partners@hireahotelier.com'}>📧 partners@hireahotelier.com</OutlineBtn>
          </Card>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: isMobile ? '40px 16px' : '60px 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 32, fontWeight: 700, color: 'white', marginBottom: 12 }}>Join the Movement</div>
        <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Be part of the community making hospitality recruitment fair, transparent, and human.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <GoldBtn onClick={() => navigate('/register')}>Create Free Account</GoldBtn>
          <OutlineBtn onClick={() => navigate('/for-employers')} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}>For Hotels →</OutlineBtn>
        </div>
      </div>

      <div style={{ background: C.navy, padding: '20px 48px', textAlign: 'center' }}>
        <div style={{ color: C.gold, fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>HireAHotelier.com</div>
        <div style={{ fontSize: 11, color: '#475569' }}>© {new Date().getFullYear()} · Direct Hospitality Hiring · No agents. No scams.</div>
      </div>
    </div>
  );
}
