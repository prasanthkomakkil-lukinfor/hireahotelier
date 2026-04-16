import { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { FONTS } from '../../tokens';
import { PENDING_VERIFICATIONS } from '../../data/adminData';
import { AdminShell, ACard, ABadge, ABtn, AInput, ASectionTitle, AC } from '../../components/admin/AdminLayout';

function VerificationCard({ hotel, onApprove, onReject }) {
  const [open, setOpen]         = useState(false);
  const [rejectReason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [status, setStatus]     = useState('pending'); // pending | approved | rejected

  const approve = () => { onApprove(hotel); setStatus('approved'); };
  const reject  = () => {
    if (!rejectReason.trim()) { alert('Please provide a rejection reason.'); return; }
    onReject(hotel, rejectReason); setStatus('rejected');
  };

  const URGENCY_COLOR = { high: AC.red, normal: AC.amber, low: AC.blue };

  if (status === 'approved') return (
    <ACard style={{ border: `1px solid ${AC.green}`, background: AC.greenBg }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 24 }}>✅</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: AC.green, fontFamily: FONTS.body }}>{hotel.hotelName} — Approved</div>
          <div style={{ fontSize: 12, color: AC.green, fontFamily: FONTS.body, opacity: 0.8 }}>Hotel is now verified. Badge applied to all listings.</div>
        </div>
      </div>
    </ACard>
  );

  if (status === 'rejected') return (
    <ACard style={{ border: `1px solid ${AC.red}`, background: AC.redBg }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 24 }}>❌</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: AC.red, fontFamily: FONTS.body }}>{hotel.hotelName} — Rejected</div>
          <div style={{ fontSize: 12, color: AC.red, fontFamily: FONTS.body, opacity: 0.8 }}>Rejection email sent with reason: "{rejectReason}"</div>
        </div>
      </div>
    </ACard>
  );

  return (
    <ACard style={{ borderLeft: `3px solid ${URGENCY_COLOR[hotel.urgency] || AC.amber}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 48, height: 48, background: `rgba(201,160,82,0.12)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏨</div>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 700, color: AC.text }}>{hotel.hotelName}</span>
              <ABadge type={hotel.urgency === 'high' ? 'high' : hotel.urgency === 'low' ? 'low' : 'pending'}>{hotel.urgency} priority</ABadge>
              <ABadge type="default">{hotel.category}</ABadge>
            </div>
            <div style={{ fontSize: 12, color: AC.muted, fontFamily: FONTS.body }}>{hotel.country} · {hotel.city}</div>
            <div style={{ fontSize: 12, color: AC.textSoft, fontFamily: FONTS.body, marginTop: 3 }}>
              HR: {hotel.hrName} · <a href={`mailto:${hotel.hrEmail}`} style={{ color: AC.blue }}>{hotel.hrEmail}</a>
            </div>
            <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body, marginTop: 2 }}>Submitted: {hotel.submittedAt}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ABtn small color="ghost" onClick={() => setOpen(!open)}>{open ? '▲ Hide Docs' : '📄 View Docs'}</ABtn>
          <ABtn small color="green" onClick={approve}>✅ Approve</ABtn>
          <ABtn small color="danger" onClick={() => setShowReject(!showReject)}>❌ Reject</ABtn>
        </div>
      </div>

      {/* Documents list */}
      {open && (
        <div style={{ marginTop: 14, background: AC.surfaceHov, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: 10 }}>Submitted Documents</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hotel.docs.map(doc => (
              <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: 8, background: AC.surface, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>📄</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: AC.text, fontFamily: FONTS.body }}>{doc}</div>
                  <div style={{ fontSize: 10, color: AC.green, fontFamily: FONTS.body }}>✓ Uploaded</div>
                </div>
                <ABtn small color="ghost">View</ABtn>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: AC.amber, fontFamily: FONTS.body }}>
            ⚠️ Always verify that the Trade Licence matches the hotel name exactly and is not expired.
          </div>
        </div>
      )}

      {/* Rejection reason form */}
      {showReject && (
        <div style={{ marginTop: 14, background: AC.redBg, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AC.red, fontFamily: FONTS.body, marginBottom: 8 }}>Rejection Reason (sent to hotel)</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {['Documents incomplete', 'Licence expired', 'Cannot verify hotel', 'Suspicious registration'].map(r => (
              <button key={r} onClick={() => setReason(r)} style={{ background: rejectReason === r ? AC.red : 'transparent', color: AC.red, border: `1px solid ${AC.red}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: FONTS.body }}>
                {r}
              </button>
            ))}
          </div>
          <textarea value={rejectReason} onChange={e => setReason(e.target.value)} placeholder="Or write a custom reason…" rows={2}
            style={{ width: '100%', background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: 8, fontSize: 12, color: AC.text, fontFamily: FONTS.body, resize: 'none', outline: 'none', marginBottom: 8 }} />
          <ABtn small color="red" onClick={reject}>Send Rejection</ABtn>
        </div>
      )}
    </ACard>
  );
}

export default function AdminVerifications() {
  const { isMobile } = useBreakpoint();
  const [hotels, setHotels] = useState(PENDING_VERIFICATIONS);
  const [toast, setToast]   = useState('');

  const onApprove = (hotel) => {
    setToast(`✅ ${hotel.hotelName} verified! Badge applied to all their listings.`);
    setTimeout(() => setToast(''), 4000);
  };
  const onReject = (hotel, reason) => {
    setToast(`❌ ${hotel.hotelName} rejected. Notification sent: "${reason}"`);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <ASectionTitle sub="Review hotel documents and approve or reject verification requests">
          ✅ Hotel Verifications
        </ASectionTitle>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: AC.amberBg, border: `1px solid ${AC.amber}`, borderRadius: 20, padding: '5px 14px', fontSize: 12, color: AC.amber, fontFamily: FONTS.body }}>
            ⏳ {hotels.length} pending
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ background: toast.startsWith('✅') ? AC.greenBg : AC.redBg, border: `1px solid ${toast.startsWith('✅') ? AC.green : AC.red}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: toast.startsWith('✅') ? AC.green : AC.red, fontFamily: FONTS.body }}>
          {toast}
        </div>
      )}

      {/* Verification criteria */}
      <ACard style={{ marginBottom: 20, background: 'rgba(59,130,246,0.05)', border: `1px solid ${AC.blueBg}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: AC.blue, fontFamily: FONTS.body, marginBottom: 8 }}>📋 Verification Checklist</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 10 }}>
          {[
            ['✓ Trade Licence', 'Must be valid and match hotel name exactly'],
            ['✓ Hotel Operating Licence', 'Issued by local tourism authority'],
            ['✓ HR Contact Verified', 'Email matches hotel domain'],
          ].map(([title, desc]) => (
            <div key={title} style={{ fontSize: 11, color: AC.textSoft, fontFamily: FONTS.body }}>
              <div style={{ color: AC.green, fontWeight: 700, marginBottom: 2 }}>{title}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>
      </ACard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* High priority first */}
        {[...hotels].sort((a, b) => { const order = { high: 0, normal: 1, low: 2 }; return order[a.urgency] - order[b.urgency]; })
          .map(h => <VerificationCard key={h.id} hotel={h} onApprove={onApprove} onReject={onReject} />)
        }
      </div>
    </AdminShell>
  );
}
