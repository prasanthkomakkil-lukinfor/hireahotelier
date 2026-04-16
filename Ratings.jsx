import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { C, FONTS } from '../tokens';
import { submitRating } from '../firebase';
import { Card, GoldBtn, OutlineBtn, SecLabel, Stars, Badge, Note, Alert, Spinner, ProgressBar } from '../components/ui/index';
import { DashboardShell } from '../components/layout/ProtectedRoute';

const SEEKER_CATS  = ['Work Environment', 'Salary Paid as Promised', 'Management & Communication', 'Work-Life Balance', 'Career Growth Opportunity'];
const EMPLOYER_CATS = ['Technical / Professional Skills', 'Punctuality & Reliability', 'Team Management', 'Communication', 'Overall Performance'];

function RatingCategory({ label, value, onChange, readOnly }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            onClick={() => !readOnly && onChange(s)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              cursor: readOnly ? 'default' : 'pointer',
              background: s <= value ? C.navy : '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, transition: 'all 0.15s',
            }}
          >
            <span style={{ color: s <= value ? C.gold : C.border }}>★</span>
          </div>
        ))}
        <span style={{ fontSize: 12, color: C.textSoft, alignSelf: 'center', marginLeft: 6, fontFamily: FONTS.body }}>
          {value > 0 ? ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value] : ''}
        </span>
      </div>
    </div>
  );
}

function RatingForm({ title, categories, entity, entitySub, entityEmoji, isHotel, onSubmit }) {
  const [ratings, setRatings] = useState(Object.fromEntries(categories.map(c => [c, 0])));
  const [review, setReview]   = useState('');
  const [anonymous, setAnon]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]       = useState(false);

  const avg = Object.values(ratings).reduce((a, b) => a + b, 0) / categories.length;

  const handleSubmit = async () => {
    if (Object.values(ratings).some(v => v === 0)) { alert('Please rate all categories.'); return; }
    setSubmitting(true);
    await onSubmit({ ratings, review, anonymous, avg });
    setDone(true);
    setSubmitting(false);
  };

  if (done) return (
    <Card>
      <div style={{ textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Rating Submitted!</div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>Thank you for helping build a trustworthy hospitality community.</div>
      </div>
    </Card>
  );

  return (
    <Card>
      {/* Entity info */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: isHotel ? 10 : '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: isHotel ? 'none' : `2px solid ${C.gold}` }}>
          {entityEmoji}
        </div>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: C.navy }}>{entity}</div>
          <div style={{ fontSize: 11, color: C.textSoft, fontFamily: FONTS.body }}>{entitySub}</div>
          {isHotel && <Badge type="green">✓ Verified Hotel</Badge>}
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: FONTS.body, marginBottom: 12 }}>{title}</div>

      {categories.map(cat => (
        <RatingCategory
          key={cat} label={cat}
          value={ratings[cat]}
          onChange={v => setRatings(r => ({ ...r, [cat]: v }))}
        />
      ))}

      {/* Overall average indicator */}
      {avg > 0 && (
        <div style={{ background: C.slate, borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontFamily: FONTS.body, color: C.text }}>Overall Rating</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stars value={Math.round(avg)} />
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>{avg.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Written review */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: C.textSoft, fontFamily: FONTS.body, display: 'block', marginBottom: 5 }}>Written Review (Optional)</label>
        <textarea
          value={review} onChange={e => setReview(e.target.value)}
          placeholder="Share your honest experience…"
          rows={3}
          style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 10, fontSize: 12, fontFamily: FONTS.body, resize: 'vertical', outline: 'none' }}
        />
      </div>

      {isHotel && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={anonymous} onChange={e => setAnon(e.target.checked)} style={{ accentColor: C.navy }} />
          <span style={{ fontSize: 12, color: C.text, fontFamily: FONTS.body }}>Submit anonymously (your name won't be shown)</span>
        </label>
      )}

      <GoldBtn full onClick={handleSubmit} disabled={submitting}>
        {submitting ? <span style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}><Spinner size={14} color={C.navy} />Submitting…</span> : '⭐ Submit Rating'}
      </GoldBtn>
    </Card>
  );
}

// ─── Public Hotel Rating Display ──────────────────────────────────────────────
function HotelPublicRating() {
  const { isMobile } = useBreakpoint();
  const BREAKDOWN = [
    ['Work Environment', 90], ['Salary Paid on Time', 95],
    ['Management', 82], ['Work-Life Balance', 70], ['Growth Opportunity', 85],
  ];
  return (
    <Card style={{ marginTop: 24 }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
        Public Hotel Rating — {/* Hotel name will come from Firestore */}Example Hotel
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 52, fontWeight: 700, color: C.navy, lineHeight: 1 }}>4.7</div>
          <Stars value={5} size={20} />
          <div style={{ fontSize: 11, color: C.textSoft, marginTop: 4, fontFamily: FONTS.body }}>Based on 128 reviews</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          {BREAKDOWN.map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.textSoft, width: isMobile ? 110 : 150, flexShrink: 0, fontFamily: FONTS.body }}>{label}</span>
              <div style={{ flex: 1, background: C.border, borderRadius: 8, height: 7 }}>
                <div style={{ background: `linear-gradient(90deg,${C.gold},${C.goldLight})`, width: `${val}%`, height: 7, borderRadius: 8 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.navy, width: 26, textAlign: 'right', fontFamily: FONTS.body }}>{val}%</span>
            </div>
          ))}
        </div>
      </div>
      <Note type="green">Hotel rating scores are displayed on every job listing. A 4.5+ rating results in 2× more applications.</Note>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Ratings() {
  const { isSeeker, isEmployer } = useAuth();
  const { isMobile, isTablet } = useBreakpoint();

  const handleSubmit = async (data) => {
    await submitRating({ ...data, role: isSeeker ? 'seeker' : 'employer' });
  };

  return (
    <DashboardShell role={isSeeker ? 'seeker' : 'employer'}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 4 }}>⭐ Ratings & Reviews</div>
        <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, marginBottom: 24 }}>
          Honest, mutual ratings build a trustworthy hiring community across all 7 markets.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: 20 }}>
          {isSeeker && (
            <div>
              <SecLabel>Rate Your Employer</SecLabel>
              <RatingForm
                title="How was your experience at this hotel?"
                categories={SEEKER_CATS}
                entity="Taj Hotels & Resorts"
                entitySub="Dubai, UAE · You worked here Jan 2023–Dec 2024"
                entityEmoji="🏨"
                isHotel
                onSubmit={handleSubmit}
              />
              <Note type="blue">Anonymous option ensures honest feedback without fear of retaliation — especially important in GCC and Asian markets.</Note>
            </div>
          )}

          {isEmployer && (
            <div>
              <SecLabel>Rate a Candidate</SecLabel>
              <RatingForm
                title="How did this candidate perform?"
                categories={EMPLOYER_CATS}
                entity="Rajan Mehta"
                entitySub="Executive Chef · Contract Jan 2023–Dec 2024"
                entityEmoji="👤"
                isHotel={false}
                onSubmit={handleSubmit}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['Would Rehire', 'Highly Recommended', 'Visa Compliant', 'Team Player'].map((tag, i) => (
                  <div key={tag} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', background: i < 2 ? C.navy : '#F1F5F9', color: i < 2 ? C.gold : C.textSoft, fontFamily: FONTS.body, fontWeight: 600 }}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show both sides for admin/debug view */}
          {!isSeeker && !isEmployer && (
            <>
              <div>
                <SecLabel>Employee Rates Employer</SecLabel>
                <RatingForm title="Rate this Hotel" categories={SEEKER_CATS} entity="Taj Hotels & Resorts" entitySub="Dubai, UAE" entityEmoji="🏨" isHotel onSubmit={handleSubmit} />
              </div>
              <div>
                <SecLabel>Employer Rates Candidate</SecLabel>
                <RatingForm title="Rate this Candidate" categories={EMPLOYER_CATS} entity="Rajan Mehta" entitySub="Executive Chef · 14 years" entityEmoji="👤" isHotel={false} onSubmit={handleSubmit} />
              </div>
            </>
          )}
        </div>

        <HotelPublicRating />
      </div>
    </DashboardShell>
  );
}
