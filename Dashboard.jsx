import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import {
  PLATFORM_STATS, RECENT_ACTIVITY, MONTHLY_SIGNUPS,
  MONTHLY_REVENUE, FLAGGED_CONTENT, PENDING_VERIFICATIONS,
} from '../../data/adminData';
import {
  AdminShell, ACard, AStatCard, ABadge, ABtn, ASectionTitle, AC,
} from '../../components/admin/AdminLayout';

// Mini sparkline bar chart
function MiniBar({ data, valueKey, color, height = 48 }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, background: color, borderRadius: '3px 3px 0 0', height: `${(d[valueKey] / max) * 100}%`, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5, minHeight: 3 }} />
      ))}
    </div>
  );
}

// Live activity feed item
function ActivityItem({ item }) {
  const TYPE_COLOR = {
    job: AC.blue, signup: AC.green, verify: AC.green, flag: AC.red,
    offer: AC.gold, rating: AC.gold, revenue: AC.green, hire: AC.green, ban: AC.red,
  };
  return (
    <div style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: `1px solid ${AC.border}` }}>
      <div style={{ width: 32, height: 32, background: `${TYPE_COLOR[item.type] || AC.blue}20`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
        {item.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: AC.text, fontFamily: FONTS.body, lineHeight: 1.4 }}>{item.text}</div>
        <div style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body, marginTop: 2 }}>{item.time}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');
  const [sending, setSending] = useState(false);

  const cols4 = isMobile ? 2 : 4;
  const cols2 = isMobile ? 1 : isTablet ? 1 : 2;

  const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n.toString();
  const fmtUSD = (n) => `$${(n/1000).toFixed(1)}k`;

  return (
    <AdminShell>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 22 : 30, fontWeight: 700, color: AC.gold }}>
            👑 Command Centre
          </div>
          <div style={{ fontSize: 13, color: AC.textSoft, fontFamily: FONTS.body, marginTop: 3 }}>
            Real-time view of HireAHotelier.com · All 7 markets
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ABtn color="ghost" small onClick={() => navigate('/admin/flags')}>🚩 {PLATFORM_STATS.flaggedContent} Flags</ABtn>
          <ABtn color="gold" small onClick={() => navigate('/admin/verifications')}>✅ {PLATFORM_STATS.pendingVerification} Pending</ABtn>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols4},1fr)`, gap: 12, marginBottom: 20 }}>
        <AStatCard icon="👥" value={fmt(PLATFORM_STATS.totalUsers)}        label="Total Users"       change="18%" up />
        <AStatCard icon="💼" value={fmt(PLATFORM_STATS.activeJobs)}        label="Active Jobs"       change="12%" up  color={AC.green} />
        <AStatCard icon="📋" value={fmt(PLATFORM_STATS.totalApplications)} label="Applications"      change="24%" up  color={AC.purple} />
        <AStatCard icon="💰" value={fmtUSD(PLATFORM_STATS.monthlyRevenue)} label="MRR (USD)"         change="22%" up  color={AC.gold} />
        <AStatCard icon="🏨" value={fmt(PLATFORM_STATS.verifiedHotels)}    label="Verified Hotels"   change="9%"  up  color={AC.blue} />
        <AStatCard icon="🤝" value={fmt(PLATFORM_STATS.totalHires)}        label="Confirmed Hires"   change="31%" up  color={AC.green} />
        <AStatCard icon="🚩" value={PLATFORM_STATS.flaggedContent}          label="Flags — Action Needed" change="" up={false} color={AC.red} />
        <AStatCard icon="⭐" value={fmt(PLATFORM_STATS.totalRatings)}       label="Ratings Submitted" change="15%" up  color={AC.amber} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols2 === 1 ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Signups trend */}
        <ACard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: 4 }}>New Registrations</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: AC.text }}>Seekers & Employers</div>
            </div>
            <ABadge type="active">↑ 18% MoM</ABadge>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
            {MONTHLY_SIGNUPS.map((d, i) => {
              const maxS = Math.max(...MONTHLY_SIGNUPS.map(x => x.seekers));
              const maxE = Math.max(...MONTHLY_SIGNUPS.map(x => x.employers));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                  <div style={{ flex: 3, background: AC.blue, borderRadius: '3px 3px 0 0', height: `${(d.seekers / maxS) * 100}%`, opacity: 0.7, minHeight: 3 }} />
                  <div style={{ flex: 1, background: AC.gold, borderRadius: '3px 3px 0 0', height: `${(d.employers / maxE) * 100}%`, opacity: 0.9, minHeight: 3 }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, background: AC.blue, borderRadius: 2, opacity: 0.7 }} />
              <span style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>Seekers</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, background: AC.gold, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>Employers</span>
            </div>
          </div>
        </ACard>

        {/* Revenue trend */}
        <ACard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: 4 }}>Revenue</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: AC.text }}>Monthly Recurring</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: AC.gold }}>${(PLATFORM_STATS.mrr / 1000).toFixed(1)}k</div>
              <div style={{ fontSize: 10, color: AC.green, fontFamily: FONTS.body }}>ARR: ${(PLATFORM_STATS.arr / 1000).toFixed(0)}k</div>
            </div>
          </div>
          <MiniBar data={MONTHLY_REVENUE} valueKey="revenue" color={AC.gold} height={80} />
          <div style={{ display: 'flex', gap: 6, marginTop: 2, justifyContent: 'space-between' }}>
            {MONTHLY_REVENUE.map(d => (
              <span key={d.month} style={{ fontSize: 9, color: AC.muted, fontFamily: FONTS.body, flex: 1, textAlign: 'center' }}>{d.month}</span>
            ))}
          </div>
        </ACard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols2 === 1 ? '1fr' : '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Live activity feed */}
        <ACard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: AC.text }}>⚡ Live Activity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, background: AC.green, borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 10, color: AC.green, fontFamily: FONTS.body }}>Real-time</span>
            </div>
          </div>
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {RECENT_ACTIVITY.map((a, i) => <ActivityItem key={i} item={a} />)}
          </div>
        </ACard>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Flags alert */}
          <ACard style={{ border: `1px solid ${AC.redBg}`, background: 'rgba(239,68,68,0.05)' }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: AC.red, marginBottom: 10 }}>
              🚩 Needs Attention
            </div>
            {FLAGGED_CONTENT.filter(f => f.status === 'pending').slice(0, 3).map(f => (
              <div key={f.id} style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{f.title}</span>
                  <ABadge type={f.severity}>{f.severity}</ABadge>
                </div>
                <div style={{ fontSize: 11, color: AC.textSoft, fontFamily: FONTS.body }}>{f.reason}</div>
              </div>
            ))}
            <ABtn full color="ghost" small onClick={() => navigate('/admin/flags')}>View All {FLAGGED_CONTENT.length} Flags →</ABtn>
          </ACard>

          {/* Pending verifications */}
          <ACard>
            <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: AC.text, marginBottom: 10 }}>
              ✅ Pending Verifications
            </div>
            {PENDING_VERIFICATIONS.slice(0, 3).map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${AC.border}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{v.hotelName}</div>
                  <div style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>{v.country} · {v.docs.length} docs</div>
                </div>
                <ABadge type={v.urgency === 'high' ? 'high' : 'pending'}>{v.urgency}</ABadge>
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <ABtn full color="gold" small onClick={() => navigate('/admin/verifications')}>Review {PENDING_VERIFICATIONS.length} Pending →</ABtn>
            </div>
          </ACard>

          {/* Quick announce */}
          <ACard>
            <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: AC.text, marginBottom: 10 }}>📣 Quick Announcement</div>
            <textarea
              value={announcement} onChange={e => setAnnouncement(e.target.value)}
              placeholder="Send a message to all users or a specific group…"
              rows={3}
              style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: 10, fontSize: 12, color: AC.text, fontFamily: FONTS.body, resize: 'none', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <ABtn small color="gold" onClick={() => { setSending(true); setTimeout(() => { setSending(false); setAnnouncement(''); }, 1500); }} disabled={!announcement.trim() || sending}>
                {sending ? '✓ Sent!' : '📤 Send All'}
              </ABtn>
              <ABtn small color="ghost">Seekers Only</ABtn>
              <ABtn small color="ghost">Employers Only</ABtn>
            </div>
          </ACard>
        </div>
      </div>

      {/* Market overview */}
      <ACard>
        <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>🌍 Jobs by Market</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10 }}>
          {[
            { market: 'UAE 🇦🇪',         jobs: 3840, growth: '+14%', color: AC.blue   },
            { market: 'Saudi Arabia 🇸🇦', jobs: 2210, growth: '+22%', color: AC.green  },
            { market: 'Singapore 🇸🇬',    jobs: 1340, growth: '+9%',  color: AC.purple },
            { market: 'Australia 🇦🇺',    jobs:  980, growth: '+18%', color: AC.amber  },
            { market: 'Qatar 🇶🇦',        jobs: 1480, growth: '+31%', color: AC.gold   },
            { market: 'Malaysia 🇲🇾',     jobs: 1120, growth: '+7%',  color: AC.blue   },
            { market: 'Maldives 🇲🇻',     jobs:  740, growth: '+42%', color: AC.green  },
            { market: 'Others',           jobs:  730, growth: '+11%', color: AC.muted  },
          ].map(m => (
            <div key={m.market} style={{ background: AC.surfaceHov, borderRadius: 10, padding: '12px 14px', border: `1px solid ${AC.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AC.text, fontFamily: FONTS.body, marginBottom: 4 }}>{m.market}</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: m.color }}>{m.jobs.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: AC.green, fontFamily: FONTS.body }}>{m.growth} this month</div>
            </div>
          ))}
        </div>
      </ACard>
    </AdminShell>
  );
}
