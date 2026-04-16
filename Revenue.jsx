import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { BOOST_ORDERS, MONTHLY_REVENUE } from '../../data/adminData';
import { AdminShell, ACard, ABadge, ABtn, ASectionTitle, AC } from '../../components/admin/AdminLayout';

export default function AdminRevenue() {
  const { isMobile, isTablet } = useBreakpoint();
  const maxRev = Math.max(...MONTHLY_REVENUE.map(d => d.revenue));

  return (
    <AdminShell>
      <ASectionTitle sub="Subscriptions, job boosts, and platform revenue breakdown">
        💰 Revenue Dashboard
      </ASectionTitle>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '💰', v: '$48,200', l: 'MRR',         c: AC.gold,   sub: '↑ 22% vs last month' },
          { icon: '📈', v: '$578,400', l: 'ARR',         c: AC.green,  sub: 'Annualised' },
          { icon: '⭐', v: '143',      l: 'Pro Accounts', c: AC.blue,   sub: '12 hotels · 131 seekers' },
          { icon: '🚀', v: '31',       l: 'Active Boosts', c: AC.amber, sub: '$1,490 active revenue' },
        ].map(s => (
          <ACard key={s.l} style={{ padding: 16 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700, color: s.c, marginTop: 8, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: AC.muted, fontFamily: FONTS.body, marginTop: 3 }}>{s.l}</div>
            <div style={{ fontSize: 10, color: AC.green, fontFamily: FONTS.body, marginTop: 2 }}>{s.sub}</div>
          </ACard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Revenue bar chart */}
        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>Revenue Trend (7 Months)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
            {MONTHLY_REVENUE.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>${(d.revenue/1000).toFixed(0)}k</span>
                <div style={{ width: '100%', height: `${(d.revenue / maxRev) * 90}%`, background: `linear-gradient(180deg,${AC.gold},${AC.goldLight}40)`, borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                <span style={{ fontSize: 9, color: AC.muted, fontFamily: FONTS.body }}>{d.month}</span>
              </div>
            ))}
          </div>
        </ACard>

        {/* Revenue breakdown */}
        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>Revenue Sources</div>
          {[
            { source: '🚀 Job Boosts',         amount: 22400, pct: 46, color: AC.gold   },
            { source: '🏨 Hotel Pro Plans',     amount: 18600, pct: 39, color: AC.blue   },
            { source: '👤 Seeker Pro Plans',    amount: 4800,  pct: 10, color: AC.purple },
            { source: '📊 Featured Listings',   amount: 2400,  pct: 5,  color: AC.amber  },
          ].map(r => (
            <div key={r.source} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontFamily: FONTS.body, color: AC.textSoft }}>{r.source}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color, fontFamily: FONTS.body }}>${r.amount.toLocaleString()}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 6 }}>
                <div style={{ background: r.color, width: `${r.pct}%`, height: 6, borderRadius: 6, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 10, color: AC.muted, textAlign: 'right', fontFamily: FONTS.body, marginTop: 1 }}>{r.pct}%</div>
            </div>
          ))}
        </ACard>
      </div>

      {/* Boost orders table */}
      <ACard style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${AC.border}` }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text }}>🚀 Boost Orders</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${AC.border}`, background: AC.surfaceHov }}>
                {['Hotel', 'Job', 'Plan', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: AC.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOST_ORDERS.map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${AC.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = AC.surfaceHov}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: AC.text, fontWeight: 600 }}>{o.hotel}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: AC.textSoft }}>{o.job}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: AC.textSoft }}>{o.plan}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: AC.gold }}>${o.amount}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: AC.muted }}>{o.date}</td>
                  <td style={{ padding: '10px 14px' }}><ABadge type={o.status === 'active' ? 'active' : 'suspended'}>{o.status}</ABadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ACard>

      {/* Pricing control */}
      <ACard>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>⚙️ Pricing Control</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 12 }}>
          {[
            { plan: '🚀 Job Boost – 7 days',  current: '$29', editable: true  },
            { plan: '🚀 Job Boost – 14 days', current: '$49', editable: true  },
            { plan: '🚀 Job Boost – 30 days', current: '$89', editable: true  },
            { plan: '⭐ Hotel Pro',            current: '$29/mo', editable: true },
            { plan: '👤 Seeker Pro',           current: '$4.99/mo', editable: true },
            { plan: '📌 Featured Listing',     current: '$19/wk', editable: true },
          ].map(p => (
            <div key={p.plan} style={{ background: AC.surfaceHov, borderRadius: 10, padding: '12px 14px', border: `1px solid ${AC.border}` }}>
              <div style={{ fontSize: 12, color: AC.textSoft, fontFamily: FONTS.body, marginBottom: 6 }}>{p.plan}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 700, color: AC.gold, flex: 1 }}>{p.current}</div>
                <ABtn small color="ghost">Edit</ABtn>
              </div>
            </div>
          ))}
        </div>
      </ACard>
    </AdminShell>
  );
}
