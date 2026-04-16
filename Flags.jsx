import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { FLAGGED_CONTENT } from '../../data/adminData';
import { AdminShell, ACard, ABadge, ABtn, AInput, ASelect, ASectionTitle, AC } from '../../components/admin/AdminLayout';

const TYPE_META = {
  job:     { icon: '💼', label: 'Job Listing',   color: AC.blue   },
  rating:  { icon: '⭐', label: 'Rating/Review', color: AC.amber  },
  profile: { icon: '👤', label: 'User Profile',  color: AC.purple },
  message: { icon: '💬', label: 'Message',       color: AC.muted  },
};

function FlagCard({ item, onResolve, onRemove, onWarn }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus]     = useState(item.status);
  const meta = TYPE_META[item.type] || TYPE_META.job;

  if (status === 'resolved') return (
    <ACard style={{ opacity: 0.6, border: `1px solid ${AC.border}` }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <span style={{ fontSize: 13, color: AC.muted, fontFamily: FONTS.body }}>{item.title} — Resolved</span>
      </div>
    </ACard>
  );

  return (
    <ACard style={{ borderLeft: `3px solid ${item.severity === 'high' ? AC.red : item.severity === 'medium' ? AC.amber : AC.blue}` }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <div style={{ width: 40, height: 40, background: `${meta.color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            {meta.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4, alignItems: 'center' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text }}>{item.title}</span>
              <ABadge type={item.severity}>{item.severity} severity</ABadge>
              <ABadge type="default">{meta.label}</ABadge>
              {item.status === 'reviewing' && <ABadge type="reviewing">In Review</ABadge>}
            </div>
            <div style={{ fontSize: 12, color: AC.red, fontFamily: FONTS.body, marginBottom: 4 }}>
              🚩 {item.reportedBy} report{item.reportedBy > 1 ? 's' : ''} · "{item.reason}"
            </div>
            <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>
              {item.entity} · Flagged {item.createdAt}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          <ABtn small color="ghost" onClick={() => setExpanded(!expanded)}>{expanded ? '▲' : '🔍 Review'}</ABtn>
          <ABtn small color="green" onClick={() => { onResolve(item); setStatus('resolved'); }}>Dismiss</ABtn>
          <ABtn small color="ghost" onClick={() => onWarn(item)}>⚠️ Warn</ABtn>
          <ABtn small color="red" onClick={() => { onRemove(item); setStatus('resolved'); }}>🗑 Remove</ABtn>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, background: AC.surfaceHov, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: 10 }}>Review Options</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { action: 'Keep — No Violation', color: 'ghost',  icon: '✅', desc: 'Content is acceptable. Dismiss all flags.' },
              { action: 'Issue Warning',        color: 'ghost',  icon: '⚠️', desc: 'Warn account owner. First offence.' },
              { action: 'Remove Content',       color: 'danger', icon: '🗑', desc: 'Remove the job/rating/profile content.' },
              { action: 'Suspend Account',      color: 'danger', icon: '⛔', desc: 'Temporarily suspend the account owner.' },
              { action: 'Ban Account',          color: 'red',    icon: '🚫', desc: 'Permanently ban. Serious violation.' },
              { action: 'Escalate to Legal',    color: 'red',    icon: '⚖️', desc: 'Forward to legal team for action.' },
            ].map(opt => (
              <div key={opt.action} style={{ background: AC.surface, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}
                onClick={() => { onResolve(item); setStatus('resolved'); }}
                onMouseEnter={e => e.currentTarget.style.borderColor = AC.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = AC.border}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 14 }}>{opt.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{opt.action}</span>
                </div>
                <div style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>{opt.desc}</div>
              </div>
            ))}
          </div>
          <div>
            <textarea placeholder="Admin note (internal only)…" rows={2}
              style={{ width: '100%', background: AC.surface, border: `1px solid ${AC.border}`, borderRadius: 8, padding: 8, fontSize: 12, color: AC.text, fontFamily: FONTS.body, resize: 'none', outline: 'none' }} />
          </div>
        </div>
      )}
    </ACard>
  );
}

export default function AdminFlags() {
  const { isMobile } = useBreakpoint();
  const [items, setItems]     = useState(FLAGGED_CONTENT);
  const [filter, setFilter]   = useState('');
  const [toast, setToast]     = useState('');

  const pending   = items.filter(i => i.status === 'pending');
  const reviewing = items.filter(i => i.status === 'reviewing');
  const resolved  = items.filter(i => i.status === 'resolved');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const onResolve = (item) => showToast(`✅ Flag dismissed for "${item.title}"`);
  const onRemove  = (item) => showToast(`🗑 "${item.title}" removed from platform`);
  const onWarn    = (item) => showToast(`⚠️ Warning sent to ${item.entity}`);

  const filtered = [...items].filter(i => !filter || i.severity === filter || i.type === filter || i.status === filter);

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <ASectionTitle sub="Review and moderate flagged jobs, ratings, profiles and messages">
          🚩 Flagged Content
        </ASectionTitle>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: AC.redBg, border: `1px solid ${AC.red}20`, borderRadius: 20, padding: '5px 14px', fontSize: 12, color: AC.red, fontFamily: FONTS.body }}>
            🚩 {pending.length} pending action
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ background: AC.greenBg, border: `1px solid ${AC.green}`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: AC.green, fontFamily: FONTS.body }}>
          {toast}
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { v: pending.length,   l: 'Pending',    c: AC.red    },
          { v: reviewing.length, l: 'In Review',  c: AC.amber  },
          { v: resolved.length,  l: 'Resolved',   c: AC.green  },
          { v: items.filter(i => i.severity === 'high').length, l: 'High Severity', c: AC.red },
        ].map(s => (
          <ACard key={s.l} style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{s.l}</div>
          </ACard>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[['', 'All'], ['high', '🔴 High'], ['medium', '🟡 Medium'], ['low', '🔵 Low'], ['job', '💼 Jobs'], ['rating', '⭐ Ratings'], ['profile', '👤 Profiles']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ background: filter === val ? AC.gold : 'transparent', color: filter === val ? '#0D1B3E' : AC.textSoft, border: `1px solid ${filter === val ? AC.gold : AC.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body, fontWeight: filter === val ? 700 : 400 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Flagged items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* High priority first */}
        {filtered
          .sort((a, b) => { const o = { high: 0, medium: 1, low: 2 }; return (o[a.severity] || 3) - (o[b.severity] || 3); })
          .map(item => <FlagCard key={item.id} item={item} onResolve={onResolve} onRemove={onRemove} onWarn={onWarn} />)
        }
      </div>
    </AdminShell>
  );
}
