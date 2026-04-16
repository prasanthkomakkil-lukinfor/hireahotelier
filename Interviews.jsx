import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { Card, GoldBtn, OutlineBtn, NavyBtn, SecLabel, Badge, Note } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';
import { fmtDate } from '../../utils/helpers';

const MOCK_INTERVIEWS = [
  { id: 'i1', candidate: 'Rajan Mehta',  role: 'Executive Chef',     date: '2025-04-15', time: '10:00 AM', type: 'video', status: 'upcoming', flag: '🇮🇳', rating: 4.8, matchScore: 97 },
  { id: 'i2', candidate: 'Maria Santos', role: 'F&B Manager',        date: '2025-04-15', time: '2:00 PM',  type: 'video', status: 'upcoming', flag: '🇵🇭', rating: 4.5, matchScore: 88 },
  { id: 'i3', candidate: 'Aditya Kumar', role: 'Sous Chef',          date: '2025-04-16', time: '11:00 AM', type: 'in-person', status: 'upcoming', flag: '🇮🇳', rating: 4.2, matchScore: 82 },
  { id: 'i4', candidate: 'Priya Sharma', role: 'Front Desk Supervisor', date: '2025-04-17', time: '9:00 AM', type: 'phone', status: 'upcoming', flag: '🇮🇳', rating: 0, matchScore: 74 },
  { id: 'i5', candidate: 'James Tan',   role: 'Bar Manager',         date: '2025-04-10', time: '3:00 PM',  type: 'video', status: 'completed', flag: '🇵🇭', rating: 4.1, matchScore: 79 },
];

const TYPE_ICONS = { video: '📹', 'in-person': '🏨', phone: '📞' };

export default function Interviews() {
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [scheduling, setScheduling] = useState(false);
  const [newInterview, setNewInterview] = useState({ candidate: '', role: '', date: '', time: '', type: 'video' });

  const upcoming  = interviews.filter(i => i.status === 'upcoming');
  const completed = interviews.filter(i => i.status === 'completed');

  const markComplete = (id) => setInterviews(prev => prev.map(i => i.id === id ? { ...i, status: 'completed' } : i));
  const cancel       = (id) => setInterviews(prev => prev.filter(i => i.id !== id));

  const addInterview = () => {
    if (!newInterview.candidate || !newInterview.date) return;
    setInterviews(prev => [...prev, { id: `i${Date.now()}`, ...newInterview, status: 'upcoming', flag: '🌍', rating: 0, matchScore: 0 }]);
    setScheduling(false);
    setNewInterview({ candidate: '', role: '', date: '', time: '', type: 'video' });
  };

  const InterviewCard = ({ interview }) => (
    <Card style={{ marginBottom: 12, borderLeft: `3px solid ${interview.status === 'completed' ? C.greenBorder : C.gold}` }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 46, height: 46, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: `2px solid ${interview.status === 'completed' ? C.greenBorder : C.gold}` }}>
          {interview.flag}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{interview.candidate}</span>
            {interview.rating > 0 && <Badge type="gold">⭐ {interview.rating}</Badge>}
            {interview.matchScore > 0 && <Badge type="green">🎯 {interview.matchScore}%</Badge>}
            <Badge type={interview.status === 'completed' ? 'green' : 'gold'}>{interview.status === 'completed' ? '✓ Done' : '📅 Upcoming'}</Badge>
          </div>
          <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>{interview.role}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: C.navy, fontFamily: FONTS.body, fontWeight: 600 }}>📅 {fmtDate(interview.date)} at {interview.time}</span>
            <span style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{TYPE_ICONS[interview.type]} {interview.type === 'in-person' ? 'In-Person' : interview.type === 'video' ? 'Video Call' : 'Phone'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {interview.type === 'video' && interview.status === 'upcoming' && (
            <GoldBtn small onClick={() => window.open('https://meet.google.com', '_blank')}>📹 Join Call</GoldBtn>
          )}
          {interview.status === 'upcoming' && (
            <>
              <NavyBtn small onClick={() => navigate(`/employer/offer/${interview.id}`)}>✉️ Send Offer</NavyBtn>
              <OutlineBtn small onClick={() => markComplete(interview.id)}>✓ Done</OutlineBtn>
              <OutlineBtn small onClick={() => cancel(interview.id)}>Cancel</OutlineBtn>
            </>
          )}
          {interview.status === 'completed' && (
            <OutlineBtn small onClick={() => navigate(`/employer/offer/${interview.id}`)}>Send Offer →</OutlineBtn>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardShell role="employer">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy }}>📅 Interview Schedule</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>{upcoming.length} upcoming · {completed.length} completed</div>
          </div>
          <GoldBtn onClick={() => setScheduling(true)}>+ Schedule Interview</GoldBtn>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', v: upcoming.length, l: 'Upcoming', c: C.amberBg },
            { icon: '✅', v: completed.length, l: 'Completed', c: C.greenBg },
            { icon: '📹', v: upcoming.filter(i => i.type === 'video').length, l: 'Video Calls', c: C.blueBg },
            { icon: '✉️', v: '3', l: 'Offers Sent', c: '#FFF1F2' },
          ].map(s => (
            <Card key={s.l} style={{ background: s.c, textAlign: 'center', padding: 14 }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: C.navy }}>{s.v}</div>
              <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Schedule new interview form */}
        {scheduling && (
          <Card style={{ marginBottom: 20, background: C.cream, border: `1.5px solid ${C.gold}` }}>
            <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 14 }}>Schedule New Interview</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[['Candidate Name', 'candidate', 'text', 'e.g. Rajan Mehta'], ['Role Applied For', 'role', 'text', 'e.g. Executive Chef'], ['Date', 'date', 'date', ''], ['Time', 'time', 'time', '']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>{label}</label>
                  <input type={type} value={newInterview[key]} onChange={e => setNewInterview(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                    style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: FONTS.body, outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 4 }}>Interview Type</label>
                <select value={newInterview.type} onChange={e => setNewInterview(p => ({ ...p, type: e.target.value }))}
                  style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: FONTS.body, outline: 'none', background: 'white' }}>
                  <option value="video">📹 Video Call</option>
                  <option value="in-person">🏨 In-Person</option>
                  <option value="phone">📞 Phone</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <GoldBtn onClick={addInterview}>Schedule & Notify Candidate</GoldBtn>
              <OutlineBtn onClick={() => setScheduling(false)}>Cancel</OutlineBtn>
            </div>
          </Card>
        )}

        {/* Upcoming */}
        <SecLabel>Upcoming Interviews</SecLabel>
        {upcoming.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '28px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 16, color: C.navy }}>No upcoming interviews</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginTop: 4 }}>Schedule your first interview above.</div>
          </Card>
        ) : upcoming.map(i => <InterviewCard key={i.id} interview={i} />)}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <SecLabel style={{ marginTop: 20 }}>Completed Interviews</SecLabel>
            {completed.map(i => <InterviewCard key={i.id} interview={i} />)}
          </>
        )}

        <Note type="blue">
          Video interviews use Google Meet, Zoom, or Microsoft Teams — paste a meeting link when scheduling. Candidates receive the link automatically via email.
        </Note>
      </div>
    </DashboardShell>
  );
}
