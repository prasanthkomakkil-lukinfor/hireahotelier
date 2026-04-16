import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { MOCK_JOBS } from '../../data/mockData';
import { localGet, localSet, fmtSalary, timeAgo } from '../../utils/helpers';
import { Card, Badge, Chip, GoldBtn, OutlineBtn, SecLabel, EmptyState } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';

export default function SavedJobs() {
  const { isMobile } = useBreakpoint();
  const navigate     = useNavigate();
  const [savedIds, setSavedIds] = useState(() => localGet('savedJobs', []));

  const savedJobs = MOCK_JOBS.filter(j => savedIds.includes(j.id));

  const removeSaved = (id) => {
    const updated = savedIds.filter(x => x !== id);
    setSavedIds(updated);
    localSet('savedJobs', updated);
  };

  const clearAll = () => { setSavedIds([]); localSet('savedJobs', []); };

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy }}>❤️ Saved Jobs</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>{savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {savedJobs.length > 0 && <OutlineBtn small onClick={clearAll}>Clear All</OutlineBtn>}
            <Link to="/jobs"><GoldBtn small>Browse More Jobs →</GoldBtn></Link>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No saved jobs yet"
            message="Tap the heart icon on any job to save it here for later. Your saved jobs are stored locally on this device."
            action={<Link to="/jobs"><GoldBtn>Browse Jobs</GoldBtn></Link>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {savedJobs.map(job => (
              <Card key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job.id}`)}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏨</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{job.title}</span>
                      {job.verified && <Badge type="green">✓ Verified</Badge>}
                      {job.urgent  && <Badge type="red">🔥 Urgent</Badge>}
                    </div>
                    <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 6 }}>
                      {job.hotelName} · {job.countryFlag} {job.city}, {job.countryLabel}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Chip>{job.type === 'part-time' ? '⚡ Part-Time' : '💼 Full-Time'}</Chip>
                      <Chip>💰 {fmtSalary(job.salary)}</Chip>
                      {job.visaSponsorship && <Chip>✈️ Visa</Chip>}
                      {job.accommodationProvided && <Chip>🏠 Accommodation</Chip>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
                    <GoldBtn small onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}>Apply Now</GoldBtn>
                    <button onClick={e => { e.stopPropagation(); removeSaved(job.id); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.redText, cursor: 'pointer', fontFamily: FONTS.body }}>🗑 Remove</button>
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body }}>{timeAgo(job.postedAt)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div style={{ marginTop: 20, padding: '12px 16px', background: C.blueBg, border: `1px solid ${C.blueBorder}`, borderRadius: 10, fontSize: 12, color: C.blueText, fontFamily: FONTS.body }}>
          💡 Saved jobs are stored locally on this device. Sign in on another device? Your saves won't carry over — apply to your favourites before they expire.
        </div>
      </div>
    </DashboardShell>
  );
}
