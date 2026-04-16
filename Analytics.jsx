import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { MONTHLY_SIGNUPS, MONTHLY_REVENUE, JOBS_BY_MARKET, SEEKERS_BY_NATIONALITY, PLATFORM_STATS } from '../../data/adminData';
import { AdminShell, ACard, ABtn, ASelect, ASectionTitle, AC } from '../../components/admin/AdminLayout';

function BarChart({ data, valueKey, color, height = 140, labelKey = 'label' }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>{d[valueKey] >= 1000 ? `${(d[valueKey]/1000).toFixed(0)}k` : d[valueKey]}</span>
          <div style={{ width: '100%', height: `${Math.max((d[valueKey] / max) * 100, 3)}%`, background: color, borderRadius: '4px 4px 0 0', opacity: 0.8 + (i === data.length - 1 ? 0.2 : 0), transition: 'height 0.4s', minHeight: 4 }} />
          <span style={{ fontSize: 9, color: AC.muted, fontFamily: FONTS.body, textAlign: 'center', lineHeight: 1.2, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function HorizBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: AC.textSoft, fontFamily: FONTS.body, width: 150, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 22, overflow: 'hidden' }}>
        <div style={{ background: color, width: `${pct}%`, height: '100%', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, minWidth: 30, transition: 'width 0.6s ease' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0D1B3E', fontFamily: FONTS.body }}>{value.toLocaleString()}</span>
        </div>
      </div>
      <span style={{ fontSize: 11, color: AC.muted, width: 34, textAlign: 'right', fontFamily: FONTS.body }}>{pct}%</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const { isMobile, isTablet } = useBreakpoint();
  const [period, setPeriod] = useState('7m');

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <ASectionTitle sub="Platform-wide growth, engagement and market intelligence">
          📊 Platform Analytics
        </ASectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          {['7m', '3m', '1m'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ background: period === p ? AC.gold : 'transparent', color: period === p ? '#0D1B3E' : AC.textSoft, border: `1px solid ${period === p ? AC.gold : AC.border}`, borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: period === p ? 700 : 400, cursor: 'pointer', fontFamily: FONTS.body }}>
              {p === '7m' ? 'Last 7 Months' : p === '3m' ? '3 Months' : 'This Month'}
            </button>
          ))}
          <ABtn small color="ghost">⬇ Export PDF</ABtn>
        </div>
      </div>

      {/* Platform health */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '👥', label: 'Total Users',         value: '94,180',    growth: '+18%', detail: '85.4k seekers · 8.8k hotels', color: AC.blue   },
          { icon: '💼', label: 'Active Job Listings', value: '12,440',    growth: '+12%', detail: 'Across 8 markets',              color: AC.green  },
          { icon: '🤝', label: 'Successful Hires',    value: '6,810',     growth: '+31%', detail: 'Directly confirmed',            color: AC.gold   },
          { icon: '💰', label: 'MRR',                 value: '$48,200',   growth: '+22%', detail: 'ARR: $578,400',                 color: AC.gold   },
          { icon: '⭐', label: 'Avg Hotel Rating',    value: '4.6 / 5',   growth: '+0.2', detail: 'Based on 28,900 reviews',       color: AC.amber  },
          { icon: '📈', label: 'Conversion Rate',     value: '2.4%',      growth: '+0.6%',detail: 'Apply → Hire',                  color: AC.purple },
        ].map(s => (
          <ACard key={s.label} style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontSize: 11, color: AC.green, background: AC.greenBg, borderRadius: 20, padding: '2px 8px', fontFamily: FONTS.body, fontWeight: 700 }}>↑ {s.growth}</span>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: AC.muted, fontFamily: FONTS.body }}>{s.label}</div>
            <div style={{ fontSize: 10, color: AC.muted, marginTop: 3, fontFamily: FONTS.body }}>{s.detail}</div>
          </ACard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* User growth */}
        <ACard>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: 4 }}>User Growth</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 700, color: AC.text }}>Seekers & Employers by Month</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {MONTHLY_SIGNUPS.map((d, i) => {
              const maxS = Math.max(...MONTHLY_SIGNUPS.map(x => x.seekers));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: '90%' }}>
                    <div style={{ flex: 3, background: AC.blue, borderRadius: '3px 3px 0 0', height: `${(d.seekers / maxS) * 100}%`, opacity: 0.8, minHeight: 3 }} />
                    <div style={{ flex: 1, background: AC.gold, borderRadius: '3px 3px 0 0', height: `${(d.employers / Math.max(...MONTHLY_SIGNUPS.map(x => x.employers))) * 100}%`, opacity: 0.9, minHeight: 3 }} />
                  </div>
                  <span style={{ fontSize: 9, color: AC.muted, fontFamily: FONTS.body, textAlign: 'center', width: '100%' }}>{d.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[{ c: AC.blue, l: 'Seekers' }, { c: AC.gold, l: 'Employers' }].map(x => (
              <div key={x.l} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, background: x.c, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{x.l}</span>
              </div>
            ))}
          </div>
        </ACard>

        {/* Revenue */}
        <ACard>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: 4 }}>Revenue</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 700, color: AC.text }}>Monthly Recurring ($USD)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: AC.gold }}>${(PLATFORM_STATS.mrr/1000).toFixed(1)}k</div>
              <div style={{ fontSize: 10, color: AC.green, fontFamily: FONTS.body }}>ARR ${(PLATFORM_STATS.arr/1000).toFixed(0)}k</div>
            </div>
          </div>
          <BarChart data={MONTHLY_REVENUE} valueKey="revenue" labelKey="month" color={AC.gold} height={120} />
        </ACard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Jobs by market */}
        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>🌍 Jobs by Market</div>
          {JOBS_BY_MARKET.map(m => (
            <HorizBar key={m.market} label={m.market} value={m.count} max={4000} color={`linear-gradient(90deg,${AC.blue},${AC.purple})`} />
          ))}
        </ACard>

        {/* Seekers by nationality */}
        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>🌐 Seekers by Nationality</div>
          {SEEKERS_BY_NATIONALITY.map(n => (
            <HorizBar key={n.country} label={n.country} value={n.count} max={40000} color={`linear-gradient(90deg,${AC.gold},${AC.amber})`} />
          ))}
        </ACard>
      </div>

      {/* Key funnel */}
      <ACard>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 700, color: AC.text, marginBottom: 20 }}>🔽 Platform-Wide Hiring Funnel</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)', gap: 12 }}>
          {[
            { stage: 'Job Views',     value: '2.4M',  icon: '👁',  color: AC.blue   },
            { stage: 'Applied',       value: '340k',  icon: '📋',  color: AC.purple },
            { stage: 'Shortlisted',   value: '42k',   icon: '⭐',  color: AC.gold   },
            { stage: 'Interviewed',   value: '12k',   icon: '📅',  color: AC.amber  },
            { stage: 'Hired',         value: '6,810', icon: '🤝',  color: AC.green  },
          ].map((s, i) => (
            <div key={s.stage} style={{ background: AC.surfaceHov, borderRadius: 10, padding: 14, textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{s.stage}</div>
              {i < 4 && !isMobile && (
                <div style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', color: AC.muted, fontSize: 16, zIndex: 1 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 12, background: 'rgba(201,160,82,0.08)', borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: AC.gold, fontFamily: FONTS.body }}>
            📊 Overall hire rate: <strong>2.4%</strong> of applicants hired · Industry benchmark: 1.8% · Platform is <strong>33% above industry average</strong>
          </span>
        </div>
      </ACard>
    </AdminShell>
  );
}
