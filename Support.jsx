import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { SUPPORT_TICKETS } from '../../data/adminData';
import { AdminShell, ACard, ABadge, ABtn, AInput, ASelect, ASectionTitle, AC } from '../../components/admin/AdminLayout';

/* ─── SUPPORT ──────────────────────────────────────────── */
export function AdminSupport() {
  const { isMobile } = useBreakpoint();
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [active, setActive]   = useState(tickets[0]);
  const [reply, setReply]     = useState('');
  const [showList, setShowList] = useState(true);

  const PRIORITY_COLOR = { high: AC.red, medium: AC.amber, low: AC.blue };
  const STATUS_COLOR   = { open: AC.red, in_progress: AC.amber, resolved: AC.green };

  const resolve = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
    setActive(prev => ({ ...prev, status: 'resolved' }));
  };

  return (
    <AdminShell>
      <ASectionTitle sub={`${tickets.filter(t => t.status !== 'resolved').length} open · ${tickets.filter(t => t.status === 'resolved').length} resolved`}>
        🎧 Support Tickets
      </ASectionTitle>

      <div style={{ display: 'flex', height: 'calc(100vh - 180px)', gap: 0, background: AC.surface, borderRadius: 14, border: `1px solid ${AC.border}`, overflow: 'hidden' }}>
        {/* Ticket list */}
        {(!isMobile || showList) && (
          <div style={{ width: isMobile ? '100%' : 300, borderRight: `1px solid ${AC.border}`, overflowY: 'auto', flexShrink: 0 }}>
            {tickets.map(t => (
              <div key={t.id} onClick={() => { setActive(t); if (isMobile) setShowList(false); }}
                style={{ padding: '12px 16px', borderBottom: `1px solid ${AC.border}`, cursor: 'pointer', background: active?.id === t.id ? 'rgba(201,160,82,0.08)' : 'transparent', borderLeft: active?.id === t.id ? `3px solid ${AC.gold}` : '3px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{t.from}</span>
                  <ABadge type={t.status === 'open' ? 'pending' : t.status === 'resolved' ? 'active' : 'reviewing'}>{t.status.replace('_', ' ')}</ABadge>
                </div>
                <div style={{ fontSize: 12, color: AC.textSoft, fontFamily: FONTS.body, marginBottom: 3 }}>{t.subject}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, background: PRIORITY_COLOR[t.priority], borderRadius: '50%' }} />
                  <span style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>{t.priority} · {t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ticket detail */}
        {(!isMobile || !showList) && active && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${AC.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                {isMobile && <button onClick={() => setShowList(true)} style={{ background: 'none', border: 'none', color: AC.gold, fontSize: 18, cursor: 'pointer', marginRight: 8 }}>←</button>}
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text }}>{active.subject}</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <ABadge type={active.priority === 'high' ? 'high' : active.priority === 'medium' ? 'pending' : 'low'}>{active.priority}</ABadge>
                  <span style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{active.from} ({active.type})</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {active.status !== 'resolved' && <ABtn small color="green" onClick={() => resolve(active.id)}>✅ Resolve</ABtn>}
                <ABtn small color="ghost">📧 View Account</ABtn>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
              <div style={{ background: AC.surfaceHov, borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, marginBottom: 6 }}>Original Request · {active.createdAt}</div>
                <div style={{ fontSize: 13, color: AC.text, fontFamily: FONTS.body, lineHeight: 1.6 }}>{active.subject} — The user has reported an issue and requires assistance. Review their account and respond accordingly.</div>
              </div>
              {/* Canned responses */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, marginBottom: 8 }}>Quick Replies</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {["We're looking into this", "Issue resolved, please retry", "Please clear cache & retry", "Escalated to technical team"].map(r => (
                    <button key={r} onClick={() => setReply(r)} style={{ background: AC.surfaceHov, border: `1px solid ${AC.border}`, color: AC.textSoft, borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: FONTS.body }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 18px', borderTop: `1px solid ${AC.border}`, display: 'flex', gap: 10 }}>
              <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your response…" rows={2}
                style={{ flex: 1, background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: 10, fontSize: 13, color: AC.text, fontFamily: FONTS.body, resize: 'none', outline: 'none' }} />
              <ABtn color="gold" onClick={() => { setReply(''); resolve(active.id); }} disabled={!reply.trim()}>Send</ABtn>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

/* ─── ANNOUNCEMENTS ─────────────────────────────────────── */
export function AdminAnnouncements() {
  const { isMobile } = useBreakpoint();
  const [form, setForm] = useState({ title: '', body: '', audience: 'all', type: 'info', schedule: '' });
  const F = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const [sent, setSent] = useState(false);
  const [history] = useState([
    { id: 1, title: 'New Markets Added',         audience: 'All Users',    date: '2025-04-10', type: 'feature', reach: 94180 },
    { id: 2, title: 'Platform Maintenance',      audience: 'All Users',    date: '2025-04-05', type: 'warning', reach: 94180 },
    { id: 3, title: 'Video Profile Feature Live',audience: 'Seekers Only', date: '2025-03-28', type: 'feature', reach: 85400 },
    { id: 4, title: 'New Verification Process',  audience: 'Employers',    date: '2025-03-15', type: 'info',    reach: 8780  },
  ]);

  const handleSend = () => {
    if (!form.title || !form.body) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ title: '', body: '', audience: 'all', type: 'info', schedule: '' });
  };

  return (
    <AdminShell>
      <ASectionTitle sub="Broadcast messages to seekers, employers, or all users">📣 Announcements</ASectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>New Announcement</div>
          {sent && <div style={{ background: AC.greenBg, border: `1px solid ${AC.green}`, borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: AC.green, fontFamily: FONTS.body }}>✅ Announcement sent to {form.audience === 'all' ? '94,180' : form.audience === 'seekers' ? '85,400' : '8,780'} users!</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Title</label>
              <input value={form.title} onChange={F('title')} placeholder="e.g. New Feature: Video Profiles" style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, color: AC.text, fontFamily: FONTS.body, outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Message</label>
              <textarea value={form.body} onChange={F('body')} rows={4} placeholder="Write your announcement…" style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, color: AC.text, fontFamily: FONTS.body, resize: 'vertical', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ASelect value={form.audience} onChange={F('audience')} options={[{ value: 'all', label: '👥 All Users' }, { value: 'seekers', label: '👤 Seekers Only' }, { value: 'employers', label: '🏨 Employers Only' }]} />
              <ASelect value={form.type} onChange={F('type')} options={[{ value: 'info', label: 'ℹ️ Info' }, { value: 'feature', label: '✨ New Feature' }, { value: 'warning', label: '⚠️ Warning' }, { value: 'maintenance', label: '🔧 Maintenance' }]} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Schedule (Optional)</label>
              <input type="datetime-local" value={form.schedule} onChange={F('schedule')} style={{ background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: AC.text, fontFamily: FONTS.body, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ABtn color="gold" full onClick={handleSend} disabled={!form.title || !form.body}>📤 Send Now</ABtn>
              <ABtn color="ghost" onClick={() => {}}>💾 Save Draft</ABtn>
            </div>
          </div>
        </ACard>

        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 700, color: AC.text, marginBottom: 16 }}>Recent Announcements</div>
          {history.map(h => (
            <div key={h.id} style={{ padding: '10px 12px', background: AC.surfaceHov, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{h.title}</span>
                <ABadge type={h.type === 'warning' ? 'high' : 'active'}>{h.type}</ABadge>
              </div>
              <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{h.audience} · {h.reach.toLocaleString()} reached · {h.date}</div>
            </div>
          ))}
        </ACard>
      </div>
    </AdminShell>
  );
}

/* ─── PLATFORM SETTINGS ─────────────────────────────────── */
export function AdminSettings() {
  const { isMobile } = useBreakpoint();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    autoVerifyTrustedChains: true,
    requirePhotoForSeeker: false,
    requireVideoForBoost: false,
    maxJobsPerFreeEmployer: '3',
    maxApplicationsPerSeeker: '50',
    jobBoost7d: '29',
    jobBoost14d: '49',
    jobBoost30d: '89',
    hotelProPrice: '29',
    seekerProPrice: '4.99',
    supportEmail: 'support@hireahotelier.com',
    notifyAdminOnFlag: true,
    autoSuspendAt: '10',
  });
  const S = k => v => setSettings(s => ({ ...s, [k]: typeof v === 'boolean' ? v : typeof v === 'string' ? v : v.target.value }));
  const [saved, setSaved] = useState(false);

  const Toggle = ({ k }) => (
    <div onClick={() => S(k)(!settings[k])} style={{ width: 40, height: 20, background: settings[k] ? AC.green : 'rgba(255,255,255,0.1)', borderRadius: 20, position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: `1px solid ${settings[k] ? AC.green : AC.border}` }}>
      <div style={{ width: 16, height: 16, background: settings[k] ? 'white' : AC.muted, borderRadius: '50%', position: 'absolute', top: 2, left: settings[k] ? 22 : 2, transition: 'left 0.2s' }} />
    </div>
  );
  const SettingRow = ({ label, desc, settingKey, type = 'toggle', inputWidth = 80 }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${AC.border}`, gap: 16 }}>
      <div>
        <div style={{ fontSize: 13, color: AC.text, fontFamily: FONTS.body, fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, marginTop: 2 }}>{desc}</div>}
      </div>
      {type === 'toggle'
        ? <Toggle k={settingKey} />
        : <input value={settings[settingKey]} onChange={S(settingKey)} style={{ background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '5px 10px', fontSize: 13, color: AC.gold, fontFamily: FONTS.body, outline: 'none', width: inputWidth, textAlign: 'center' }} />}
    </div>
  );

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <ASectionTitle sub="Global platform configuration — changes apply immediately">⚙️ Platform Settings</ASectionTitle>
        <ABtn color="gold" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? '✓ Saved!' : '💾 Save All Changes'}
        </ABtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontWeight: 700, color: AC.gold, marginBottom: 4 }}>🔧 Platform Status</div>
          <SettingRow label="Maintenance Mode" desc="Disables access for all users except admins" settingKey="maintenanceMode" />
          <SettingRow label="New Registrations" desc="Allow new users to sign up" settingKey="newRegistrations" />
          <SettingRow label="Auto-verify Trusted Hotel Chains" desc="Marriott, Hilton, IHG, etc." settingKey="autoVerifyTrustedChains" />
          <SettingRow label="Require Photo for Seekers" desc="Block applications without profile photo" settingKey="requirePhotoForSeeker" />
          <SettingRow label="Require Video for Job Boost" desc="Hotel must have video before boosting" settingKey="requireVideoForBoost" />
        </ACard>

        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontWeight: 700, color: AC.gold, marginBottom: 4 }}>📊 Limits</div>
          <SettingRow label="Max Jobs — Free Employer" settingKey="maxJobsPerFreeEmployer" type="input" inputWidth={50} />
          <SettingRow label="Max Applications — Free Seeker" settingKey="maxApplicationsPerSeeker" type="input" inputWidth={50} />
          <SettingRow label="Auto-suspend Account After N Flags" settingKey="autoSuspendAt" type="input" inputWidth={50} />
        </ACard>

        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontWeight: 700, color: AC.gold, marginBottom: 4 }}>💰 Pricing ($USD)</div>
          <SettingRow label="Job Boost — 7 Days"  settingKey="jobBoost7d"     type="input" inputWidth={60} />
          <SettingRow label="Job Boost — 14 Days" settingKey="jobBoost14d"    type="input" inputWidth={60} />
          <SettingRow label="Job Boost — 30 Days" settingKey="jobBoost30d"    type="input" inputWidth={60} />
          <SettingRow label="Hotel Pro / Month"   settingKey="hotelProPrice"  type="input" inputWidth={60} />
          <SettingRow label="Seeker Pro / Month"  settingKey="seekerProPrice" type="input" inputWidth={60} />
        </ACard>

        <ACard>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontWeight: 700, color: AC.gold, marginBottom: 4 }}>🔔 Notifications</div>
          <SettingRow label="Notify Admin on New Flag" settingKey="notifyAdminOnFlag" />
          <div style={{ paddingTop: 12 }}>
            <label style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Support Email</label>
            <input value={settings.supportEmail} onChange={S('supportEmail')} style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, color: AC.text, fontFamily: FONTS.body, outline: 'none' }} />
          </div>
        </ACard>
      </div>
    </AdminShell>
  );
}
