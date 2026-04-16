import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { C, FONTS } from '../tokens';
import { Card, GoldBtn, OutlineBtn } from '../components/ui/index';
import TopNav from '../components/layout/TopNav';

function LegalShell({ title, subtitle, children }) {
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: C.slate }}>
      <TopNav />
      <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: isMobile ? '28px 16px' : '44px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: FONTS.body, marginBottom: 10, padding: 0 }}>← Back</button>
          <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 24 : 34, fontWeight: 700, color: 'white' }}>{title}</div>
          <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 6, fontFamily: FONTS.body }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 16px' : '36px 48px' }}>
        {children}
      </div>
      <div style={{ background: C.navy, padding: '18px 48px', textAlign: 'center' }}>
        <div style={{ color: C.gold, fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>HireAHotelier.com</div>
        <div style={{ fontSize: 11, color: '#475569', fontFamily: FONTS.body }}>© {new Date().getFullYear()} · Direct Hospitality Hiring</div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${C.gold}` }}>{title}</div>
    <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.8, fontFamily: FONTS.body }}>{children}</div>
  </div>
);

export function TermsOfService() {
  return (
    <LegalShell title="Terms of Service" subtitle={`Last updated: ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}`}>
      <Card style={{ marginBottom: 16, background: C.greenBg, border: `1px solid ${C.greenBorder}` }}>
        <p style={{ fontSize: 13, color: C.greenText, fontFamily: FONTS.body }}>
          ✅ <strong>Core principle:</strong> HireAHotelier is a direct hiring platform. We never charge candidates fees. We never facilitate agent-based hiring. All employers are verified.
        </p>
      </Card>
      <Section title="1. About HireAHotelier">HireAHotelier.com connects hospitality professionals ("Seekers") directly with verified hotels ("Employers") across GCC, Southeast Asia, and Australia. By using our platform, you agree to these Terms.</Section>
      <Section title="2. User Accounts">You must be 18 or older to register. You are responsible for maintaining the security of your credentials. Providing false information — including fake certifications or hotel details — results in immediate account termination.</Section>
      <Section title="3. Zero Agent Policy">Candidates will never be charged fees. Any employer found acting as a recruitment agent or requesting payments from candidates will be permanently banned and reported to relevant authorities.</Section>
      <Section title="4. Employer Verification">Employers must submit valid trade licences, hotel operating licences, and HR contact verification. HireAHotelier reserves the right to remove listings if fraudulent information is provided.</Section>
      <Section title="5. Content & Conduct">You agree not to post false, misleading, or discriminatory content. Job listings must accurately describe the role, salary, and working conditions. Ratings must be honest and based on actual experiences.</Section>
      <Section title="6. Video Profiles">By uploading a video profile, you grant HireAHotelier a non-exclusive licence to share it with verified employers on the platform. Videos are never shared publicly or used for advertising.</Section>
      <Section title="7. AI-Generated Content">AI tools are provided for convenience. All AI-generated content should be reviewed for accuracy. HireAHotelier is not responsible for inaccuracies in AI output.</Section>
      <Section title="8. Limitation of Liability">HireAHotelier facilitates connections but is not a party to any employment contract. We are not liable for disputes arising from employment relationships established through the platform.</Section>
      <p style={{ fontSize: 12, color: C.muted, fontFamily: FONTS.body, marginTop: 20 }}>Questions: legal@hireahotelier.com</p>
    </LegalShell>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalShell title="Privacy Policy" subtitle="We respect your privacy. Here's exactly what we collect and why.">
      <Section title="1. Data We Collect"><strong>Account data:</strong> Name, email, nationality, phone (optional). <strong>Profile data:</strong> Work history, skills, certifications, profile photo, video profile, LinkedIn URL. <strong>Activity data:</strong> Jobs viewed, applications, messages. <strong>Device data:</strong> Browser type, IP address (for security only).</Section>
      <Section title="2. How We Use Your Data">To match candidates with job opportunities. To allow employers to find candidates. To send application status notifications. To generate AI resumes (processed server-side). To improve the platform and detect fraud.</Section>
      <Section title="3. We Never Sell Your Data">HireAHotelier will never sell, rent, or trade your personal data to third parties. We run no advertising. The platform is funded solely by employer subscriptions and job boost fees.</Section>
      <Section title="4. Your Rights (GDPR)">Right to access · Right to correct · Right to delete · Right to data portability · Right to object. Exercise rights at Settings → Privacy or by emailing privacy@hireahotelier.com.</Section>
      <Section title="5. Data Retention">Active accounts: retained while active. Deleted accounts: all personal data removed within 30 days. Application records: anonymised after 2 years.</Section>
      <Section title="6. Cookies">Essential cookies only — for session management and security. No tracking or advertising cookies.</Section>
      <p style={{ fontSize: 12, color: C.muted, fontFamily: FONTS.body, marginTop: 20 }}>Privacy: privacy@hireahotelier.com · DPO: dpo@hireahotelier.com</p>
    </LegalShell>
  );
}

export function Contact() {
  const { isMobile } = useBreakpoint();
  const [form, setForm] = useState({ name: '', email: '', type: 'general', message: '' });
  const [sent, setSent]  = useState(false);
  const F = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <LegalShell title="Contact Us" subtitle="We read every message. Usually reply within 24 hours.">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        <Card>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 20, color: C.navy, marginBottom: 6 }}>Message Sent!</div>
              <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>We will reply within 24 hours.</div>
              <div style={{ marginTop: 16 }}><OutlineBtn onClick={() => setSent(false)}>Send Another</OutlineBtn></div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>Send Us a Message</div>
              {[['name','Your Name','text'],['email','Your Email','email']].map(([k,ph,t])=>(
                <div key={k}>
                  <label style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>{ph}</label>
                  <input type={t} value={form[k]} onChange={F(k)} placeholder={ph} style={{ width:'100%',border:`1.5px solid ${C.border}`,borderRadius:8,padding:'9px 12px',fontSize:13,fontFamily:FONTS.body,outline:'none' }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Topic</label>
                <select value={form.type} onChange={F('type')} style={{ width:'100%',border:`1.5px solid ${C.border}`,borderRadius:8,padding:'9px 12px',fontSize:13,fontFamily:FONTS.body,outline:'none',background:'white' }}>
                  <option value="general">General Enquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="verification">Hotel Verification</option>
                  <option value="report">Report a Scam / Fraud</option>
                  <option value="partner">Partnership</option>
                  <option value="press">Press / Media</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Message</label>
                <textarea value={form.message} onChange={F('message')} rows={5} placeholder="How can we help?" style={{ width:'100%',border:`1.5px solid ${C.border}`,borderRadius:8,padding:'9px 12px',fontSize:13,fontFamily:FONTS.body,resize:'vertical',outline:'none' }}/>
              </div>
              <GoldBtn full onClick={() => { if(form.name&&form.email&&form.message) setSent(true); }}>Send Message</GoldBtn>
            </div>
          )}
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {icon:'🎧',title:'Support',       detail:'support@hireahotelier.com',    sub:'Mon–Fri 9AM–6PM GST'},
            {icon:'✅',title:'Verification',  detail:'verify@hireahotelier.com',     sub:'24–48 hours turnaround'},
            {icon:'🚨',title:'Report Fraud',  detail:'fraud@hireahotelier.com',      sub:'We take this very seriously'},
            {icon:'🤝',title:'Partnerships',  detail:'partners@hireahotelier.com',   sub:'Hotels, schools, associations'},
            {icon:'📰',title:'Press & Media', detail:'press@hireahotelier.com',      sub:'Press kit on request'},
          ].map(c=>(
            <Card key={c.title}>
              <div style={{ display:'flex',gap:12,alignItems:'center' }}>
                <span style={{ fontSize:22,flexShrink:0 }}>{c.icon}</span>
                <div>
                  <div style={{ fontFamily:FONTS.display,fontSize:14,fontWeight:700,color:C.navy }}>{c.title}</div>
                  <a href={`mailto:${c.detail}`} style={{ fontSize:12,color:C.gold,textDecoration:'none',fontFamily:FONTS.body }}>{c.detail}</a>
                  <div style={{ fontSize:10,color:C.muted,fontFamily:FONTS.body,marginTop:2 }}>{c.sub}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </LegalShell>
  );
}
