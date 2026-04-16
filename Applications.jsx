import { C, FONTS } from '../../tokens';
import { MOCK_APPLICATIONS, STATUS_STEPS } from '../../data/mockData';
import { Card, Badge, GoldBtn, OutlineBtn, SecLabel, EmptyState } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Link } from 'react-router-dom';

export default function Applications() {
  const { isMobile } = useBreakpoint();
  const steps = ['Applied', 'Reviewed', 'Interview', 'Offer'];

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy }}>My Applications</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Track every application in real time.</div>
          </div>
          <Link to="/jobs"><GoldBtn small>Browse More Jobs →</GoldBtn></Link>
        </div>

        {MOCK_APPLICATIONS.length === 0
          ? <EmptyState icon="📋" title="No applications yet" message="Start applying to jobs across GCC, Asia and Australia." action={<Link to="/jobs"><GoldBtn>Browse Jobs</GoldBtn></Link>} />
          : MOCK_APPLICATIONS.map((app) => {
              const current = STATUS_STEPS[app.status] || STATUS_STEPS.applied;
              return (
                <Card key={app.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏨</div>
                      <div>
                        <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{app.jobTitle}</div>
                        <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{app.hotelName} · {app.country}</div>
                        <div style={{ fontSize: 11, color: C.muted, fontFamily: FONTS.body, marginTop: 2 }}>Applied: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <Badge type={current.color}>{current.label}</Badge>
                  </div>

                  {/* Progress steps */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, marginBottom: 12 }}>
                    {steps.map((s, si) => {
                      const done   = si < current.step;
                      const active = si === current.step - 1;
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flex: si < 3 ? 1 : 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? C.navy : active ? C.gold : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: done ? 'white' : active ? C.navy : C.muted, fontWeight: 700, fontFamily: FONTS.body }}>
                              {done ? '✓' : si + 1}
                            </div>
                            {!isMobile && <span style={{ fontSize: 11, color: done ? C.navy : C.muted, fontFamily: FONTS.body, whiteSpace: 'nowrap' }}>{s}</span>}
                          </div>
                          {si < 3 && <div style={{ flex: 1, height: 2, background: done ? C.navy : C.border, borderRadius: 2 }} />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status-specific info */}
                  {app.interviewDate && (
                    <div style={{ background: C.purpleBg, border: `1px solid ${C.purpleBorder}`, borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: C.purpleText, fontFamily: FONTS.body, fontWeight: 600 }}>
                        📅 Interview scheduled: {new Date(app.interviewDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {app.status === 'offer' && (
                    <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: C.greenText, fontFamily: FONTS.body, fontWeight: 600 }}>
                        🎉 Congratulations! You have an offer. Expires: {app.offerExpiry ? new Date(app.offerExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'See offer letter'}
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <OutlineBtn small>View Job</OutlineBtn>
                    {app.status === 'offer' && <GoldBtn small>✍️ View & Sign Offer</GoldBtn>}
                    {app.status === 'interview' && <GoldBtn small>📅 Confirm Attendance</GoldBtn>}
                  </div>
                </Card>
              );
            })}
      </div>
    </DashboardShell>
  );
}
