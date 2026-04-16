import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { MOCK_CANDIDATES, MOCK_JOBS, KANBAN_STAGES } from '../../data/mockData';
import { updateApplicationStatus } from '../../firebase';
import { Card, Badge, Chip, GoldBtn, OutlineBtn, NavyBtn, SecLabel, Stars, Note, Modal } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

// Mock application pipeline data
const PIPELINE = {
  applied:     [{ id: 'a1', ...MOCK_CANDIDATES[0], matchScore: 97 }, { id: 'a2', ...MOCK_CANDIDATES[1], matchScore: 88 }, { id: 'a3', displayName: 'Aditya Kumar', headline: 'Sous Chef | 11 Years', nationality: 'in', nationalityFlag: '🇮🇳', matchScore: 82, rating: 4.2, videoProfile: false }],
  reviewed:    [{ id: 'a1', ...MOCK_CANDIDATES[0], matchScore: 97 }, { id: 'a2', ...MOCK_CANDIDATES[1], matchScore: 88 }],
  shortlisted: [{ id: 'a1', ...MOCK_CANDIDATES[0], matchScore: 97 }],
  interview:   [{ id: 'a1', ...MOCK_CANDIDATES[0], matchScore: 97 }],
  offer:       [],
};

const STAGE_LABELS = {
  applied:     { label: 'Applied',     color: 'navy',   bg: C.blueBg,    border: C.blueBorder },
  reviewed:    { label: 'Reviewed',    color: 'gold',   bg: C.cream,     border: '#FDE68A' },
  shortlisted: { label: 'Shortlisted', color: 'green',  bg: C.greenBg,   border: C.greenBorder },
  interview:   { label: 'Interview',   color: 'purple', bg: '#F5F3FF',   border: '#C4B5FD' },
  offer:       { label: 'Offer Sent',  color: 'red',    bg: '#FFF1F2',   border: '#FECDD3' },
};

function CandidateMini({ candidate, stage, onMove, onSelect }) {
  return (
    <div
      onClick={() => onSelect(candidate)}
      style={{ background: 'white', borderRadius: 9, padding: '9px 10px', marginBottom: 7, border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 5 }}>
        <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>👤</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, fontFamily: FONTS.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.displayName}</div>
          <div style={{ fontSize: 10, color: C.textSoft, fontFamily: FONTS.body }}>{candidate.nationalityFlag || '🌍'} {candidate.experienceYears || '?'}yr</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Badge type="green">🎯 {candidate.matchScore}%</Badge>
        {candidate.videoProfile && <Badge type="navy">🎥</Badge>}
        {candidate.rating && <span style={{ fontSize: 10, color: C.gold, fontFamily: FONTS.body }}>★{candidate.rating}</span>}
      </div>
    </div>
  );
}

function CandidateDrawer({ candidate, open, onClose, onSendOffer, onScheduleInterview }) {
  if (!open || !candidate) return null;
  return (
    <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: 420, background: 'white', boxShadow: '-4px 0 30px rgba(0,0,0,0.15)', zIndex: 300, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.navy }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.gold }}>Candidate Profile</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ padding: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, border: `2px solid ${C.gold}` }}>👤</div>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy }}>{candidate.displayName}</div>
            <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 6 }}>{candidate.headline || `${candidate.department} · ${candidate.experienceYears}yr experience`}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge type="green">🎯 {candidate.matchScore}% Match</Badge>
              {candidate.videoProfile && <Badge type="navy">🎥 Video Profile</Badge>}
              {candidate.rating && <Badge type="gold">⭐ {candidate.rating}</Badge>}
            </div>
          </div>
        </div>

        {/* Video profile */}
        {candidate.videoProfile && (
          <div style={{ background: C.navy, borderRadius: 12, padding: '14px', textAlign: 'center', marginBottom: 14, cursor: 'pointer' }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>▶️</div>
            <div style={{ color: C.gold, fontFamily: FONTS.display, fontSize: 13, fontWeight: 700 }}>Watch 90-sec Video Profile</div>
          </div>
        )}

        {/* Key facts */}
        <Card style={{ marginBottom: 14, background: C.slate }}>
          {[
            ['Experience', `${candidate.experienceYears || '?'} years`],
            ['Nationality', `${candidate.nationalityFlag || ''} ${candidate.nationalityLabel || 'N/A'}`],
            ['Location', candidate.currentLocation || 'N/A'],
            ['Department', candidate.department || 'N/A'],
            ['LinkedIn', candidate.linkedinURL ? '🔗 Profile available' : 'Not linked'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${C.border}`, fontSize: 12, fontFamily: FONTS.body }}>
              <span style={{ color: C.textSoft }}>{k}</span>
              <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </Card>

        {/* Skills */}
        {candidate.skills?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <SecLabel>Skills & Certifications</SecLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[...(candidate.skills || []), ...(candidate.certifications || [])].map(s => <Chip key={s}>{s}</Chip>)}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <GoldBtn full onClick={() => onSendOffer(candidate)}>✉️ Send Offer Letter</GoldBtn>
          <NavyBtn full onClick={() => onScheduleInterview(candidate)}>📅 Schedule Interview</NavyBtn>
          <OutlineBtn full>💬 Send Message</OutlineBtn>
          <OutlineBtn full onClick={() => window.open(`/candidate/profile/${candidate.id}`, '_blank')}>👤 Full Profile →</OutlineBtn>
        </div>
      </div>
    </div>
  );
}

export default function Shortlist() {
  const { isMobile } = useBreakpoint();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [pipeline, setPipeline] = useState(PIPELINE);
  const [selectedJob, setSelectedJob] = useState(MOCK_JOBS[0]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compareModal, setCompareModal] = useState(false);

  const moveCandidate = (candidate, fromStage, toStage) => {
    setPipeline(p => ({
      ...p,
      [fromStage]: p[fromStage].filter(c => c.id !== candidate.id),
      [toStage]:   [...p[toStage], { ...candidate }],
    }));
    updateApplicationStatus(candidate.id, toStage).catch(() => {});
  };

  const openCandidate = (c) => { setSelectedCandidate(c); setDrawerOpen(true); };

  return (
    <DashboardShell role="employer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 18 : 24, fontWeight: 700, color: C.navy }}>
            Shortlist & Hire Pipeline
          </div>
          <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>
            {selectedJob?.title} — {selectedJob?.hotelName} {selectedJob?.countryFlag}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <OutlineBtn small onClick={() => setCompareModal(true)}>🔍 Compare Top 3</OutlineBtn>
          <GoldBtn small onClick={() => navigate('/employer/post-job')}>+ Post New Job</GoldBtn>
        </div>
      </div>

      {/* ── Kanban board — scrollable on mobile ── */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'flex', gap: 12, minWidth: 720 }}>
          {KANBAN_STAGES.map(stage => {
            const meta = STAGE_LABELS[stage];
            const candidates = pipeline[stage] || [];
            return (
              <div key={stage} style={{ flex: '0 0 180px', background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, fontFamily: FONTS.body }}>{meta.label}</span>
                  <span style={{ background: C.navy, color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.body }}>{candidates.length}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {candidates.map(c => (
                    <div key={c.id}>
                      <CandidateMini candidate={c} stage={stage} onMove={moveCandidate} onSelect={openCandidate} />
                    </div>
                  ))}
                  {candidates.length === 0 && (
                    <div style={{ fontSize: 11, color: C.muted, textAlign: 'center', padding: '16px 8px', fontFamily: FONTS.body }}>No candidates here yet</div>
                  )}
                </div>
                {/* Quick move buttons */}
                {stage !== 'offer' && candidates.length > 0 && (
                  <button
                    onClick={() => candidates.forEach(c => moveCandidate(c, stage, KANBAN_STAGES[KANBAN_STAGES.indexOf(stage) + 1]))}
                    style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 8px', fontSize: 11, cursor: 'pointer', marginTop: 6, fontFamily: FONTS.body, color: C.textSoft }}
                  >Move all →</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Note type="blue" style={{ marginTop: 16 }}>Candidates are auto-notified by email when you move them to a new stage. This builds trust and keeps them engaged.</Note>

      {/* ── Selected candidate detail strip ── */}
      {selectedCandidate && !drawerOpen && (
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👤</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>{selectedCandidate.displayName}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                <Badge type="green">🎯 {selectedCandidate.matchScore}% Match</Badge>
                {selectedCandidate.videoProfile && <Badge type="navy">🎥 Video</Badge>}
                {selectedCandidate.rating && <Badge type="gold">⭐ {selectedCandidate.rating}</Badge>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <GoldBtn small onClick={() => setDrawerOpen(true)}>View Full Profile</GoldBtn>
              <NavyBtn small onClick={() => navigate(`/employer/offer/${selectedCandidate.id}`)}>✉️ Send Offer</NavyBtn>
            </div>
          </div>
        </Card>
      )}

      {/* ── Candidate Drawer ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 299 }} />
      )}
      <CandidateDrawer
        candidate={selectedCandidate}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSendOffer={(c) => navigate(`/employer/offer/${c.id}`)}
        onScheduleInterview={() => alert('Interview scheduling integration coming soon!')}
      />

      {/* ── Compare Modal ── */}
      <Modal open={compareModal} onClose={() => setCompareModal(false)} title="🔍 Compare Top Candidates" width={700}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pipeline.shortlisted.length || 1, 3)},1fr)`, gap: 14 }}>
          {(pipeline.shortlisted.length > 0 ? pipeline.shortlisted : pipeline.applied).slice(0, 3).map((c, i) => (
            <div key={c.id} style={{ background: C.slate, borderRadius: 12, padding: 14 }}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 8px' }}>👤</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: C.navy }}>{c.displayName}</div>
                <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{c.nationalityFlag || '🌍'} {c.currentLocation || 'N/A'}</div>
                <Badge type="green">🎯 {c.matchScore}%</Badge>
              </div>
              {[['Experience', `${c.experienceYears || '?'} yrs`], ['Rating', c.rating ? `⭐ ${c.rating}` : 'New'], ['Video', c.videoProfile ? '✅ Yes' : '❌ No'], ['LinkedIn', c.linkedinURL ? '✅ Linked' : '—']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${C.border}`, fontSize: 12, fontFamily: FONTS.body }}>
                  <span style={{ color: C.textSoft }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <GoldBtn full small onClick={() => { setCompareModal(false); openCandidate(c); }}>Select →</GoldBtn>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </DashboardShell>
  );
}
