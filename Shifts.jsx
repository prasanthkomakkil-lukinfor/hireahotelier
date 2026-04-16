import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint, useCountdown } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { Card, Badge, GoldBtn, OutlineBtn, SecLabel, Note, Input } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

const POSTED_SHIFTS = [
  { id: 's1', role: 'Banquet Waiter (×8)', date: new Date(Date.now() + 5 * 3600000).toISOString(), time: '6PM–11PM', pay: 25, applied: 12, filled: false, urgent: true },
  { id: 's2', role: 'Bartender (×2)',      date: new Date(Date.now() + 2 * 86400000).toISOString(), time: '7PM–1AM', pay: 32, applied: 5,  filled: false, urgent: false },
  { id: 's3', role: 'Event Server (×15)',  date: new Date(Date.now() - 1 * 86400000).toISOString(), time: '4PM–9PM', pay: 22, applied: 18, filled: true,  urgent: false },
];

const SHIFT_TEMPLATES = [
  { icon: '🥂', label: 'Gala Dinner',    roles: 'Banquet waiters, sommeliers, captains' },
  { icon: '💼', label: 'Conference',      roles: 'Event servers, baristas, AV support' },
  { icon: '🎊', label: 'Wedding Banquet', roles: 'Waiters, bartenders, setup crew' },
  { icon: '🍹', label: 'Pool Party',      roles: 'Bartenders, hosts, servers' },
  { icon: '🎭', label: 'Cocktail Event',  roles: 'Bartenders, roaming waiters' },
  { icon: '🍽', label: 'Buffet Service',  roles: 'Station attendants, runners' },
];

function ShiftCountdown({ date }) {
  const t = useCountdown(date);
  const isPast = new Date(date) < new Date();
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: isPast ? C.muted : C.gold, fontFamily: FONTS.body }}>
      {isPast ? '✅ Completed' : `⏱ Starts in ${t}`}
    </span>
  );
}

export default function EmployerShifts() {
  const { isMobile } = useBreakpoint();
  const navigate     = useNavigate();
  const [quickForm, setQuickForm] = useState({ role: '', count: '', date: '', time: '', pay: '' });
  const [shifts, setShifts]       = useState(POSTED_SHIFTS);
  const [posted, setPosted]       = useState(false);
  const [selectedTemplate, setTemplate] = useState(null);

  const postShift = () => {
    if (!quickForm.role || !quickForm.date) return;
    const newShift = {
      id: `s${Date.now()}`,
      role: `${quickForm.role}${quickForm.count ? ` (×${quickForm.count})` : ''}`,
      date: new Date(`${quickForm.date}T${quickForm.time || '18:00'}:00`).toISOString(),
      time: quickForm.time || '6PM',
      pay: Number(quickForm.pay) || 25,
      applied: 0, filled: false, urgent: true,
    };
    setShifts(p => [newShift, ...p]);
    setPosted(true);
    setQuickForm({ role: '', count: '', date: '', time: '', pay: '' });
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <DashboardShell role="employer">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy, marginBottom: 4 }}>⚡ Part-Time Shifts</div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 20 }}>
          Post banquet and event shifts. Candidates nearby are notified instantly.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
          {/* Quick post */}
          <div>
            <SecLabel>Post a Shift in 60 Seconds</SecLabel>
            <Card style={{ marginBottom: 14 }}>
              {posted && (
                <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '9px 12px', marginBottom: 12, fontSize: 12, color: C.greenText, fontFamily: FONTS.body }}>
                  ✅ Shift posted! Candidates nearby are being notified right now.
                </div>
              )}

              {/* Templates */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 8 }}>Quick Templates</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                  {SHIFT_TEMPLATES.map(t => (
                    <div key={t.label} onClick={() => { setTemplate(t); setQuickForm(p => ({ ...p, role: t.label })); }}
                      style={{ background: selectedTemplate?.label === t.label ? C.navy : C.slate, border: `1.5px solid ${selectedTemplate?.label === t.label ? C.navy : C.border}`, borderRadius: 9, padding: '8px 6px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 18, marginBottom: 3 }}>{t.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: selectedTemplate?.label === t.label ? C.gold : C.navy, fontFamily: FONTS.body }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 4 }}>Role / Title *</div>
                    <input value={quickForm.role} onChange={e => setQuickForm(p => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Banquet Waiter" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 11px', fontSize: 13, fontFamily: FONTS.body, outline: 'none' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 4 }}>Staff Needed</div>
                    <input value={quickForm.count} onChange={e => setQuickForm(p => ({ ...p, count: e.target.value }))}
                      placeholder="e.g. 8" type="number" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 11px', fontSize: 13, fontFamily: FONTS.body, outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 4 }}>Date *</div>
                    <input type="date" value={quickForm.date} onChange={e => setQuickForm(p => ({ ...p, date: e.target.value }))}
                      style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 11px', fontSize: 13, fontFamily: FONTS.body, outline: 'none', background: 'white' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 4 }}>Shift Time</div>
                    <input value={quickForm.time} onChange={e => setQuickForm(p => ({ ...p, time: e.target.value }))}
                      placeholder="e.g. 6PM–11PM" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 11px', fontSize: 13, fontFamily: FONTS.body, outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 4 }}>Pay per Shift ($USD)</div>
                  <input value={quickForm.pay} onChange={e => setQuickForm(p => ({ ...p, pay: e.target.value }))}
                    placeholder="e.g. 25" type="number" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 11px', fontSize: 13, fontFamily: FONTS.body, outline: 'none' }} />
                </div>
                <GoldBtn full onClick={postShift} disabled={!quickForm.role || !quickForm.date}>
                  ⚡ Post Shift Now
                </GoldBtn>
              </div>
            </Card>

            <Note type="blue">Shift posts appear in candidates' "Shifts Today" feed with a live countdown. Candidates with one-tap apply enabled respond in under 10 minutes on average.</Note>
            <Note type="green">Mark yourself as needing urgent staff — your shift moves to the top of the feed and candidates in your city are push-notified immediately.</Note>
          </div>

          {/* Posted shifts */}
          <div>
            <SecLabel>Your Posted Shifts</SecLabel>
            {shifts.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 16, color: C.navy }}>No shifts posted yet</div>
              </Card>
            ) : (
              shifts.map(s => (
                <Card key={s.id} style={{ marginBottom: 10, borderLeft: `3px solid ${s.filled ? C.greenBorder : s.urgent ? '#EF4444' : C.gold}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy }}>{s.role}</span>
                        {s.filled ? <Badge type="green">✅ Filled</Badge> : s.urgent ? <Badge type="red">🔥 Urgent</Badge> : null}
                      </div>
                      <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>
                        {s.time} · 💰 ${s.pay}/shift · {s.applied} applied
                      </div>
                      <div style={{ marginTop: 5 }}>
                        <ShiftCountdown date={s.date} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                      <GoldBtn small onClick={() => navigate('/employer/shortlist')}>
                        👥 {s.applied}
                      </GoldBtn>
                      {!s.filled && (
                        <OutlineBtn small onClick={() => setShifts(p => p.map(x => x.id === s.id ? { ...x, filled: true } : x))}>
                          ✅ Filled
                        </OutlineBtn>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
