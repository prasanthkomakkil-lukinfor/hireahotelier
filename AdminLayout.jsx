import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C, FONTS, SHADOWS } from '../../tokens';
import { Navigate } from 'react-router-dom';
import { Spinner } from '../ui/index';

// ─── DESIGN TOKENS (Admin dark theme) ────────────────────────────────────────
export const AC = {
  bg:         '#0A0F1E',   // deep navy background
  surface:    '#0F1829',   // card surface
  surfaceHov: '#141F35',   // hovered surface
  border:     '#1E2D4A',   // subtle border
  gold:       '#C9A052',
  goldLight:  '#E8C47A',
  text:       '#E2E8F0',
  textSoft:   '#8B9CC8',
  muted:      '#4A5880',
  green:      '#10B981',
  greenBg:    'rgba(16,185,129,0.12)',
  red:        '#EF4444',
  redBg:      'rgba(239,68,68,0.12)',
  amber:      '#F59E0B',
  amberBg:    'rgba(245,158,11,0.12)',
  blue:       '#3B82F6',
  blueBg:     'rgba(59,130,246,0.12)',
  purple:     '#8B5CF6',
  purpleBg:   'rgba(139,92,246,0.12)',
};

const ADMIN_NAV = [
  { section: 'Overview' },
  { to: '/admin',              icon: '⚡', label: 'Command Centre',  badge: null },
  { to: '/admin/analytics',    icon: '📊', label: 'Analytics',       badge: null },
  { to: '/admin/revenue',      icon: '💰', label: 'Revenue',         badge: null },

  { section: 'Platform' },
  { to: '/admin/jobs',         icon: '💼', label: 'Job Listings',    badge: null },
  { to: '/admin/users',        icon: '👥', label: 'Users',           badge: null },
  { to: '/admin/verifications',icon: '✅', label: 'Verifications',   badge: 47   },
  { to: '/admin/ratings',      icon: '⭐', label: 'Ratings',         badge: null },

  { section: 'Trust & Safety' },
  { to: '/admin/flags',        icon: '🚩', label: 'Flagged Content', badge: 18   },
  { to: '/admin/support',      icon: '🎧', label: 'Support',         badge: 5    },

  { section: 'System' },
  { to: '/admin/announcements',icon: '📣', label: 'Announcements',   badge: null },
  { to: '/admin/settings',     icon: '⚙️', label: 'Platform Settings',badge: null },
];

// ─── ADMIN PROTECTED ROUTE ────────────────────────────────────────────────────
export function AdminRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', background: AC.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size={40} color={AC.gold} />
    </div>
  );
  if (!currentUser || userProfile?.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

// ─── ADMIN TOP BAR ────────────────────────────────────────────────────────────
function AdminTopBar({ onToggleSidebar }) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div style={{
      background: AC.surface, borderBottom: `1px solid ${AC.border}`,
      padding: '0 20px', height: 56, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isMobile && (
          <button onClick={onToggleSidebar} style={{ background: 'none', border: 'none', color: AC.text, fontSize: 20, cursor: 'pointer' }}>☰</button>
        )}
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, background: AC.green, borderRadius: '50%', boxShadow: `0 0 8px ${AC.green}`, animation: 'pulse 2s infinite' }} />
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          <span style={{ fontSize: 11, color: AC.green, fontFamily: FONTS.body, fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
        </div>
        {!isMobile && (
          <span style={{ fontSize: 13, color: AC.textSoft, fontFamily: FONTS.body }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Quick stats pills */}
        {!isMobile && [
          { label: '94,180 users', icon: '👥', color: AC.blue },
          { label: '12,440 jobs',  icon: '💼', color: AC.green },
          { label: '18 flags',     icon: '🚩', color: AC.red },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: `1px solid ${AC.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, color: s.color, fontFamily: FONTS.body }}>
            {s.icon} {s.label}
          </div>
        ))}

        {/* Admin profile */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)} style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${AC.border}`, borderRadius: 30, padding: '4px 12px 4px 4px',
            cursor: 'pointer',
          }}>
            <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${AC.gold},${AC.goldLight})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👑</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: AC.gold, fontFamily: FONTS.body }}>Admin</span>
            <span style={{ fontSize: 10, color: AC.muted }}>▼</span>
          </button>
          {profileOpen && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: AC.surface, border: `1px solid ${AC.border}`, borderRadius: 12, minWidth: 180, boxShadow: '0 8px 40px rgba(0,0,0,0.5)', zIndex: 200 }}>
              <div style={{ padding: '10px 14px', borderBottom: `1px solid ${AC.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: AC.gold, fontFamily: FONTS.body }}>Super Admin</div>
                <div style={{ fontSize: 11, color: AC.muted, fontFamily: FONTS.body }}>{userProfile?.email || 'admin@hireahotelier.com'}</div>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} style={{ display: 'block', width: '100%', padding: '10px 14px', fontSize: 12, color: AC.red, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONTS.body }}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN SIDEBAR ────────────────────────────────────────────────────────────
function AdminSidebar({ open, onClose }) {
  const location = useLocation();
  const { isMobile } = useBreakpoint();

  const content = (
    <div style={{
      width: 220, background: AC.bg, borderRight: `1px solid ${AC.border}`,
      height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 18px 12px', borderBottom: `1px solid ${AC.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${AC.gold},${AC.goldLight})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏨</div>
          <div>
            <div style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: AC.gold, lineHeight: 1 }}>HireAHotelier</div>
            <div style={{ fontSize: 9, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '8px 0' }}>
        {ADMIN_NAV.map((item, i) => {
          if (item.section) return (
            <div key={i} style={{ padding: '14px 16px 4px', fontSize: 9, fontWeight: 700, color: AC.muted, letterSpacing: 2, textTransform: 'uppercase', fontFamily: FONTS.body }}>
              {item.section}
            </div>
          );
          const active = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
          return (
            <Link key={item.to} to={item.to} onClick={isMobile ? onClose : undefined} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
              textDecoration: 'none', transition: 'all 0.15s',
              background: active ? 'rgba(201,160,82,0.1)' : 'transparent',
              borderLeft: active ? `3px solid ${AC.gold}` : '3px solid transparent',
            }}>
              <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 12.5, flex: 1, color: active ? AC.gold : AC.textSoft, fontWeight: active ? 700 : 400, fontFamily: FONTS.body }}>{item.label}</span>
              {item.badge && (
                <span style={{ background: item.badge > 10 ? AC.red : AC.amber, color: 'white', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', fontFamily: FONTS.body }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Version */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${AC.border}` }}>
        <div style={{ fontSize: 10, color: AC.muted, fontFamily: FONTS.body }}>v1.0.0 · Platform Admin</div>
      </div>
    </div>
  );

  if (isMobile) {
    if (!open) return null;
    return (
      <>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300 }} />
        <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 301 }}>{content}</div>
      </>
    );
  }
  return content;
}

// ─── ADMIN SHELL ──────────────────────────────────────────────────────────────
export function AdminShell({ children }) {
  const { isMobile } = useBreakpoint();
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: AC.bg, display: 'flex', flexDirection: 'column' }}>
      <AdminTopBar onToggleSidebar={() => setSideOpen(true)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar open={!isMobile || sideOpen} onClose={() => setSideOpen(false)} />
        <main style={{
          flex: 1, overflowY: 'auto', minWidth: 0,
          padding: isMobile ? '16px 14px' : '24px 28px',
          background: AC.bg,
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── SHARED ADMIN UI ATOMS ────────────────────────────────────────────────────

export const ACard = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: AC.surface, border: `1px solid ${AC.border}`, borderRadius: 14, padding: 18, transition: 'border-color 0.15s', cursor: onClick ? 'pointer' : 'default', ...style }}
    onMouseEnter={e => onClick && (e.currentTarget.style.borderColor = AC.gold)}
    onMouseLeave={e => onClick && (e.currentTarget.style.borderColor = AC.border)}
  >{children}</div>
);

export const AStatCard = ({ icon, value, label, change, up, color = AC.blue, bg }) => (
  <ACard style={{ background: bg || AC.surface }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      {change && (
        <span style={{ fontSize: 11, fontWeight: 700, color: up ? AC.green : AC.red, background: up ? AC.greenBg : AC.redBg, borderRadius: 20, padding: '2px 8px', fontFamily: FONTS.body }}>
          {up ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
    <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: AC.textSoft, fontFamily: FONTS.body }}>{label}</div>
  </ACard>
);

export const ABadge = ({ children, type = 'default' }) => {
  const MAP = {
    active:    [AC.greenBg,  AC.green  ],
    pending:   [AC.amberBg,  AC.amber  ],
    suspended: [AC.redBg,    AC.red    ],
    banned:    [AC.redBg,    AC.red    ],
    verified:  [AC.greenBg,  AC.green  ],
    high:      [AC.redBg,    AC.red    ],
    medium:    [AC.amberBg,  AC.amber  ],
    low:       [AC.blueBg,   AC.blue   ],
    resolved:  [AC.greenBg,  AC.green  ],
    reviewing: [AC.blueBg,   AC.blue   ],
    open:      [AC.amberBg,  AC.amber  ],
    pro:       ['rgba(201,160,82,0.15)', AC.gold],
    free:      ['rgba(255,255,255,0.06)', AC.muted],
    default:   ['rgba(255,255,255,0.06)', AC.textSoft],
  };
  const [bg, tc] = MAP[type] || MAP.default;
  return <span style={{ background: bg, color: tc, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: FONTS.body }}>{children}</span>;
};

export const ABtn = ({ children, onClick, color = 'gold', small, full, disabled }) => {
  const styles = {
    gold:   { bg: `linear-gradient(135deg,${AC.gold},${AC.goldLight})`, text: '#0D1B3E', shadow: `0 2px 12px rgba(201,160,82,0.3)` },
    red:    { bg: 'linear-gradient(135deg,#EF4444,#F87171)',            text: 'white',   shadow: `0 2px 12px rgba(239,68,68,0.3)` },
    green:  { bg: 'linear-gradient(135deg,#10B981,#34D399)',            text: 'white',   shadow: `0 2px 12px rgba(16,185,129,0.3)` },
    ghost:  { bg: 'rgba(255,255,255,0.06)',                             text: AC.text,   shadow: 'none' },
    danger: { bg: AC.redBg,                                             text: AC.red,    shadow: 'none' },
  };
  const s = styles[color] || styles.gold;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? 'rgba(255,255,255,0.05)' : s.bg,
      color: disabled ? AC.muted : s.text,
      border: color === 'ghost' ? `1px solid ${AC.border}` : 'none',
      borderRadius: 8, padding: small ? '5px 12px' : '8px 18px',
      fontSize: small ? 11 : 13, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
      fontFamily: FONTS.body, boxShadow: s.shadow, transition: 'all 0.15s',
    }}>{children}</button>
  );
};

export const AInput = ({ value, onChange, placeholder, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8, padding: '8px 12px', flex: 1 }}>
    {icon && <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>}
    <input value={value} onChange={onChange} placeholder={placeholder} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: AC.text, fontFamily: FONTS.body, flex: 1, minWidth: 0 }} />
  </div>
);

export const ASelect = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={onChange} style={{
    background: AC.surfaceHov, border: `1px solid ${AC.border}`, borderRadius: 8,
    padding: '8px 30px 8px 12px', fontSize: 12, color: value ? AC.text : AC.muted,
    fontFamily: FONTS.body, outline: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%234A5880' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', appearance: 'none',
  }}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? o : o.label}</option>)}
  </select>
);

export const ASectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: AC.text }}>{children}</div>
    {sub && <div style={{ fontSize: 13, color: AC.textSoft, fontFamily: FONTS.body, marginTop: 3 }}>{sub}</div>}
  </div>
);
