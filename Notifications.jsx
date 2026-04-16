import { useState } from 'react';
import { C, FONTS } from '../../tokens';
import { useInAppNotifications, useToast } from '../../hooks/useNotifications';

// ─── TOAST CONTAINER ─────────────────────────────────────────────────────────

const TOAST_STYLES = {
  success: { bg: C.greenBg,  border: C.greenBorder, text: C.greenText, icon: '✅' },
  error:   { bg: C.redBg,    border: C.redBorder,   text: C.redText,   icon: '❌' },
  info:    { bg: C.blueBg,   border: C.blueBorder,  text: C.blueText,  icon: 'ℹ️' },
  warning: { bg: C.amberBg,  border: '#FDE68A',     text: '#92400E',   icon: '⚠️' },
};

export function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      maxWidth: 360, width: '100%',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const s = TOAST_STYLES[t.type] || TOAST_STYLES.info;
        return (
          <div key={t.id} style={{
            background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12,
            padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)', animation: 'slideIn 0.3s ease',
            pointerEvents: 'all',
          }}>
            <style>{`@keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
            <span style={{ flex: 1, fontSize: 13, color: s.text, fontFamily: FONTS.body, lineHeight: 1.5 }}>{t.message}</span>
            <button onClick={() => onDismiss(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text, fontSize: 16, padding: 0, opacity: 0.6, flexShrink: 0 }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

// ─── NOTIFICATIONS BELL + DROPDOWN ───────────────────────────────────────────

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, dismiss } = useInAppNotifications();
  const [open, setOpen] = useState(false);

  const TYPE_ICONS = { view: '👁', match: '🎯', status: '📋', shift: '⚡', message: '💬', offer: '✉️', rating: '⭐' };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative', background: open ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10,
          width: 38, height: 38, cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#EF4444', color: 'white', borderRadius: '50%',
            width: 18, height: 18, fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.body, border: `2px solid ${C.navy}`,
          }}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
          <div style={{
            position: 'absolute', right: 0, top: '110%',
            width: 340, maxHeight: 440, overflowY: 'auto',
            background: C.white, border: `1.5px solid ${C.border}`,
            borderRadius: 14, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            zIndex: 200,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: C.navy }}>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: C.gold, fontFamily: FONTS.body, fontWeight: 600 }}>
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔕</div>
                <div style={{ fontSize: 13, color: C.muted, fontFamily: FONTS.body }}>No notifications yet</div>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex', gap: 10, padding: '10px 16px',
                    background: n.read ? 'transparent' : C.blueBg,
                    borderBottom: `1px solid ${C.border}`,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.slate}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : C.blueBg}
                >
                  <div style={{ width: 32, height: 32, background: n.read ? '#F1F5F9' : C.amberBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {TYPE_ICONS[n.type] || '📢'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: C.text, fontFamily: FONTS.body, lineHeight: 1.4, fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                    <div style={{ fontSize: 10, color: C.muted, fontFamily: FONTS.body, marginTop: 2 }}>{n.time}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); dismiss(n.id); }} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14, padding: 0, opacity: 0, transition: 'opacity 0.15s', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                    ✕
                  </button>
                </div>
              ))
            )}

            <div style={{ padding: '10px 16px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
              <button style={{ background: 'none', border: 'none', color: C.gold, fontSize: 12, cursor: 'pointer', fontFamily: FONTS.body, fontWeight: 600 }}>
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
