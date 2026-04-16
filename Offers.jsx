import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS } from '../../tokens';
import { Card, Badge, GoldBtn, OutlineBtn, SecLabel, Note, Modal } from '../../components/ui/index';
import { DashboardShell } from '../../components/layout/ProtectedRoute';
import { fmtDate } from '../../utils/helpers';

const MOCK_OFFERS = [
  {
    id: 'o1',
    jobTitle: 'Executive Chef',
    hotelName: 'Burj Al Arab Jumeirah',
    country: '🇦🇪 Dubai, UAE',
    salary: 'USD 3,500/month',
    startDate: '2025-05-01',
    department: 'Kitchen & Culinary',
    reportingTo: 'F&B Director',
    probation: '3 Months',
    accommodation: 'Hotel-provided staff accommodation',
    meals: '3 meals per day on duty',
    annualLeave: '30 days/year',
    medical: 'Full group medical and dental',
    flightTickets: 'Annual return flight to home country',
    status: 'pending',
    sentAt: '2025-04-12',
    expiresAt: '2025-04-20',
    hrName: 'Ms. Aisha Al-Mansouri',
    hotelLogo: '🏨',
  },
  {
    id: 'o2',
    jobTitle: 'F&B Manager',
    hotelName: 'Shangri-La Singapore',
    country: '🇸🇬 Singapore',
    salary: 'SGD 5,200/month',
    startDate: '2025-06-01',
    department: 'F&B Service',
    reportingTo: 'Hotel General Manager',
    probation: '6 Months',
    accommodation: 'Housing allowance SGD 1,200/month',
    meals: 'Duty meals provided',
    annualLeave: '21 days/year',
    medical: 'Outpatient & hospitalisation insurance',
    status: 'signed',
    sentAt: '2025-04-01',
    signedAt: '2025-04-03',
    hrName: 'Mr. Chen Wei Liang',
    hotelLogo: '🏨',
  },
];

function OfferCard({ offer, onView }) {
  const isPending = offer.status === 'pending';
  const isSigned  = offer.status === 'signed';
  const isExpired = offer.status === 'expired';

  const daysLeft = Math.max(0, Math.round(
    (new Date(offer.expiresAt) - new Date()) / 86400000
  ));

  return (
    <Card style={{ marginBottom: 14, borderLeft: `3px solid ${isPending ? C.gold : isSigned ? C.greenBorder : C.border}` }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 52, height: 52, background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, border: `2px solid ${isPending ? C.gold : isSigned ? C.greenBorder : C.border}` }}>
          {offer.hotelLogo}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>{offer.jobTitle}</span>
            <Badge type={isPending ? 'gold' : isSigned ? 'green' : 'gray'}>
              {isPending ? '📋 Awaiting Signature' : isSigned ? '✅ Signed' : '⏰ Expired'}
            </Badge>
          </div>
          <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>{offer.hotelName} · {offer.country}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, fontFamily: FONTS.body }}><span style={{ color: C.muted }}>Salary: </span><span style={{ color: C.navy, fontWeight: 700 }}>{offer.salary}</span></div>
            <div style={{ fontSize: 12, fontFamily: FONTS.body }}><span style={{ color: C.muted }}>Start: </span><span style={{ color: C.navy, fontWeight: 700 }}>{fmtDate(offer.startDate)}</span></div>
          </div>
          {isPending && offer.expiresAt && (
            <div style={{ marginTop: 8, background: daysLeft <= 3 ? C.redBg : C.amberBg, borderRadius: 8, padding: '5px 10px', display: 'inline-block' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: daysLeft <= 3 ? C.redText : '#92400E', fontFamily: FONTS.body }}>
                ⏰ Offer expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''} — {fmtDate(offer.expiresAt)}
              </span>
            </div>
          )}
          {isSigned && offer.signedAt && (
            <div style={{ marginTop: 6 }}>
              <span style={{ fontSize: 11, color: C.greenText, fontFamily: FONTS.body }}>✅ Signed on {fmtDate(offer.signedAt)}</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <GoldBtn small onClick={() => onView(offer)}>
            {isPending ? '✍️ Review & Sign' : '📄 View Letter'}
          </GoldBtn>
          {isSigned && <OutlineBtn small onClick={() => window.print()}>⬇ Download</OutlineBtn>}
        </div>
      </div>
    </Card>
  );
}

function OfferModal({ offer, open, onClose, onSign }) {
  const [signed, setSigned] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!offer) return null;

  const handleSign = () => {
    setSigned(true);
    setTimeout(() => { onSign(offer.id); onClose(); }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="Offer Letter" width={600}>
      {/* Letter */}
      <div style={{ fontFamily: FONTS.body, fontSize: 12, lineHeight: 1.75 }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: '10px 10px 0 0', padding: '20px 24px', margin: '-20px -20px 18px' }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.gold }}>{offer.hotelName.toUpperCase()}</div>
          <div style={{ color: '#CBD5E1', fontSize: 12 }}>{offer.country} · Direct hire via HireAHotelier.com</div>
        </div>

        <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>
          {fmtDate(offer.sentAt)} · Ref: {offer.id.toUpperCase()}
        </div>
        <div style={{ fontWeight: 700, color: C.navy, marginBottom: 10, fontSize: 14 }}>LETTER OF APPOINTMENT</div>
        <p style={{ color: C.text, marginBottom: 10 }}>
          We are pleased to offer you the position of <strong>{offer.jobTitle}</strong> at <strong>{offer.hotelName}</strong>, subject to the following terms:
        </p>

        {/* Terms table */}
        <div style={{ background: C.slate, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          {[
            ['Position',       offer.jobTitle],
            ['Department',     offer.department],
            ['Reporting To',   offer.reportingTo],
            ['Start Date',     fmtDate(offer.startDate)],
            ['Gross Salary',   offer.salary],
            ['Probation',      offer.probation],
            ['Accommodation',  offer.accommodation],
            ['Meals',          offer.meals],
            ['Annual Leave',   offer.annualLeave],
            ['Medical',        offer.medical],
            offer.flightTickets && ['Flights', offer.flightTickets],
          ].filter(Boolean).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${C.border}`, fontSize: 12 }}>
              <span style={{ color: C.textSoft, width: 130, flexShrink: 0 }}>{k}</span>
              <span style={{ color: C.text, fontWeight: 600, flex: 1, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: C.textSoft, lineHeight: 1.6, marginBottom: 16 }}>
          This offer is subject to successful completion of background verification and receipt of all required documents. All terms are confidential and in accordance with local labour law.
        </p>

        {/* Signatures */}
        <div style={{ borderTop: `1.5px solid ${C.border}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>Authorised Signatory</div>
            <div style={{ fontWeight: 700, color: C.navy, fontSize: 13 }}>{offer.hrName}</div>
            <div style={{ fontSize: 11, color: C.textSoft }}>{offer.hotelName}</div>
            <div style={{ fontSize: 10, color: C.greenText, marginTop: 3 }}>✅ Digitally signed via HireAHotelier.com</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Your Signature</div>
            {offer.status === 'signed' || signed ? (
              <div style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '8px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.greenText }}>✅ Digitally Signed</div>
                <div style={{ fontSize: 10, color: C.greenText }}>{fmtDate(offer.signedAt || new Date().toISOString())}</div>
              </div>
            ) : confirming ? (
              <div>
                <div style={{ background: C.amberBg, border: `1px solid #FDE68A`, borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', fontFamily: FONTS.body, marginBottom: 4 }}>Confirm acceptance?</div>
                  <div style={{ fontSize: 11, color: '#78350F', fontFamily: FONTS.body }}>By signing, you accept all terms.</div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <GoldBtn small onClick={handleSign}>✍️ Yes, Sign Now</GoldBtn>
                  <OutlineBtn small onClick={() => setConfirming(false)}>Cancel</OutlineBtn>
                </div>
              </div>
            ) : (
              <GoldBtn onClick={() => setConfirming(true)}>✍️ Accept & Sign Offer</GoldBtn>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function CandidateOffers() {
  const { isMobile } = useBreakpoint();
  const [offers, setOffers]   = useState(MOCK_OFFERS);
  const [viewOffer, setViewOffer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pending = offers.filter(o => o.status === 'pending');
  const signed  = offers.filter(o => o.status === 'signed');

  const handleSign = (id) => {
    setOffers(prev => prev.map(o => o.id === id
      ? { ...o, status: 'signed', signedAt: new Date().toISOString() }
      : o
    ));
  };

  return (
    <DashboardShell role="seeker">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.navy }}>✉️ Offer Letters</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body }}>
              {pending.length > 0 ? `🎉 You have ${pending.length} offer${pending.length > 1 ? 's' : ''} waiting!` : `${signed.length} offer${signed.length !== 1 ? 's' : ''} signed`}
            </div>
          </div>
        </div>

        {/* Alert if offers pending */}
        {pending.length > 0 && (
          <div style={{ background: C.greenBg, border: `1.5px solid ${C.greenBorder}`, borderRadius: 12, padding: '14px 18px', marginBottom: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 24 }}>🎉</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.greenText, fontFamily: FONTS.body }}>Congratulations! You have {pending.length === 1 ? 'a job offer' : `${pending.length} job offers`}!</div>
              <div style={{ fontSize: 12, color: C.greenText, fontFamily: FONTS.body, marginTop: 2 }}>Review the terms carefully before signing. Once signed, it creates a binding employment commitment.</div>
            </div>
          </div>
        )}

        {/* Pending offers */}
        {pending.length > 0 && (
          <>
            <SecLabel>Awaiting Your Signature</SecLabel>
            {pending.map(o => (
              <OfferCard key={o.id} offer={o} onView={offer => { setViewOffer(offer); setModalOpen(true); }} />
            ))}
          </>
        )}

        {/* Signed offers */}
        {signed.length > 0 && (
          <>
            <SecLabel style={{ marginTop: 20 }}>Signed Offers</SecLabel>
            {signed.map(o => (
              <OfferCard key={o.id} offer={o} onView={offer => { setViewOffer(offer); setModalOpen(true); }} />
            ))}
          </>
        )}

        {offers.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, color: C.navy, marginBottom: 8 }}>No Offer Letters Yet</div>
            <div style={{ fontSize: 13, color: C.textSoft, fontFamily: FONTS.body, maxWidth: 360, margin: '0 auto' }}>
              When a hotel sends you an offer, it will appear here. Keep applying!
            </div>
          </Card>
        )}

        <Note type="blue">
          Offer letters on HireAHotelier are digitally signed and legally structured. Your digital signature carries the same weight as a physical signature under e-signature laws in GCC, Singapore, Malaysia and Australia. Keep a copy for your records.
        </Note>

        <OfferModal
          offer={viewOffer}
          open={modalOpen}
          onClose={() => { setModalOpen(false); setViewOffer(null); }}
          onSign={handleSign}
        />
      </div>
    </DashboardShell>
  );
}
