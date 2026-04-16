// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
// All primitive components used across the app.
import { useState } from 'react';
import { C, FONTS, SHADOWS, RADII } from '../../tokens';

// ─── BUTTONS ─────────────────────────────────────────────────────────────────

export const GoldBtn = ({ children, onClick, full, small, disabled, type = 'button' }) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    style={{
      background: disabled ? '#E2E8F0' : `linear-gradient(135deg,${C.gold},${C.goldLight})`,
      color: disabled ? C.muted : C.navy,
      border: 'none', borderRadius: RADII.md,
      padding: small ? '6px 14px' : '10px 22px',
      fontSize: small ? 12 : 14, fontWeight: 700,
      fontFamily: FONTS.body, cursor: disabled ? 'not-allowed' : 'pointer',
      width: full ? '100%' : 'auto',
      boxShadow: disabled ? 'none' : SHADOWS.gold,
      whiteSpace: 'nowrap', transition: 'all 0.15s',
    }}
  >{children}</button>
);

export const NavyBtn = ({ children, onClick, full, small, disabled, type = 'button' }) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    style={{
      background: disabled ? '#E2E8F0' : C.navy,
      color: disabled ? C.muted : 'white',
      border: 'none', borderRadius: RADII.md,
      padding: small ? '6px 14px' : '10px 22px',
      fontSize: small ? 12 : 14, fontWeight: 700,
      fontFamily: FONTS.body, cursor: disabled ? 'not-allowed' : 'pointer',
      width: full ? '100%' : 'auto', whiteSpace: 'nowrap', transition: 'all 0.15s',
    }}
  >{children}</button>
);

export const OutlineBtn = ({ children, onClick, full, small, disabled, type = 'button' }) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    style={{
      background: 'transparent', color: disabled ? C.muted : C.navy,
      border: `1.5px solid ${disabled ? C.border : C.navy}`,
      borderRadius: RADII.md,
      padding: small ? '5px 13px' : '9px 21px',
      fontSize: small ? 12 : 14, fontWeight: 600,
      fontFamily: FONTS.body, cursor: disabled ? 'not-allowed' : 'pointer',
      width: full ? '100%' : 'auto', whiteSpace: 'nowrap', transition: 'all 0.15s',
    }}
  >{children}</button>
);

export const GhostBtn = ({ children, onClick, small }) => (
  <button
    type="button" onClick={onClick}
    style={{
      background: 'transparent', color: C.textSoft,
      border: 'none', borderRadius: RADII.md,
      padding: small ? '5px 10px' : '8px 16px',
      fontSize: small ? 12 : 13, fontWeight: 500,
      fontFamily: FONTS.body, cursor: 'pointer', transition: 'all 0.15s',
    }}
  >{children}</button>
);

export const LinkedInBtn = ({ children, onClick }) => (
  <button
    type="button" onClick={onClick}
    style={{
      background: '#0A66C2', color: 'white', border: 'none',
      borderRadius: RADII.md, padding: '10px 22px',
      fontSize: 14, fontWeight: 700, fontFamily: FONTS.body,
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, width: '100%',
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
    {children}
  </button>
);

// ─── CARD ─────────────────────────────────────────────────────────────────────

export const Card = ({ children, style = {}, onClick, hover = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: C.white,
        border: `1.5px solid ${hovered ? C.gold : C.border}`,
        borderRadius: RADII.lg, padding: 16,
        boxShadow: hovered ? SHADOWS.md : SHADOWS.sm,
        transition: 'all 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >{children}</div>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────

export const Badge = ({ children, type = 'gold' }) => {
  const MAP = {
    gold:   [C.amberBg, C.amberText],
    navy:   [C.blueBg, C.blueText],
    green:  ['#DCFCE7', C.greenText],
    red:    ['#FFE4E6', '#9F1239'],
    purple: [C.purpleBg, C.purpleText],
    gray:   ['#F1F5F9', '#475569'],
  };
  const [bg, tc] = MAP[type] || MAP.gold;
  return (
    <span style={{ background: bg, color: tc, borderRadius: RADII.full, padding: '2px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: FONTS.body }}>
      {children}
    </span>
  );
};

// ─── CHIP ─────────────────────────────────────────────────────────────────────

export const Chip = ({ children, active, onClick }) => (
  <span
    onClick={onClick}
    style={{
      background: active ? C.navy : '#F1F5F9',
      color: active ? C.gold : '#334155',
      border: `1px solid ${active ? C.navy : C.border}`,
      borderRadius: RADII.full, padding: '3px 12px',
      fontSize: 11, display: 'inline-block',
      margin: '2px 3px', cursor: onClick ? 'pointer' : 'default',
      fontFamily: FONTS.body, transition: 'all 0.15s',
    }}
  >{children}</span>
);

// ─── INPUT COMPONENTS ────────────────────────────────────────────────────────

export const Input = ({ label, id, value, onChange, placeholder, type = 'text', required, error, icon, disabled }) => (
  <div style={{ width: '100%' }}>
    {label && (
      <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textSoft, marginBottom: 5, fontFamily: FONTS.body }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
    )}
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>{icon}</span>
      )}
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required} disabled={disabled}
        style={{
          width: '100%', padding: icon ? '9px 12px 9px 36px' : '9px 12px',
          border: `1.5px solid ${error ? '#EF4444' : C.border}`,
          borderRadius: RADII.md, fontSize: 13, fontFamily: FONTS.body,
          color: C.text, background: disabled ? C.slate : C.white,
          outline: 'none', transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = C.gold}
        onBlur={e => e.target.style.borderColor = error ? '#EF4444' : C.border}
      />
    </div>
    {error && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3, fontFamily: FONTS.body }}>{error}</p>}
  </div>
);

export const Select = ({ label, id, value, onChange, options = [], placeholder = 'Select…', required, disabled }) => (
  <div style={{ width: '100%' }}>
    {label && (
      <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textSoft, marginBottom: 5, fontFamily: FONTS.body }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
    )}
    <select
      id={id} value={value} onChange={onChange} required={required} disabled={disabled}
      style={{
        width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`,
        borderRadius: RADII.md, fontSize: 13, fontFamily: FONTS.body,
        color: value ? C.text : C.muted, background: disabled ? C.slate : C.white,
        outline: 'none', appearance: 'none', cursor: 'pointer',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394A3B8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
        paddingRight: 32,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  </div>
);

export const Textarea = ({ label, id, value, onChange, placeholder, rows = 4, required }) => (
  <div style={{ width: '100%' }}>
    {label && (
      <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.textSoft, marginBottom: 5, fontFamily: FONTS.body }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
    )}
    <textarea
      id={id} value={value} onChange={onChange}
      placeholder={placeholder} required={required} rows={rows}
      style={{
        width: '100%', padding: '9px 12px',
        border: `1.5px solid ${C.border}`, borderRadius: RADII.md,
        fontSize: 13, fontFamily: FONTS.body, color: C.text,
        resize: 'vertical', outline: 'none', transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = C.gold}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  </div>
);

export const Checkbox = ({ label, checked, onChange, id }) => (
  <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ accentColor: C.navy, width: 15, height: 15, cursor: 'pointer' }} />
    <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.body }}>{label}</span>
  </label>
);

// ─── STARS ────────────────────────────────────────────────────────────────────

export const Stars = ({ value = 0, max = 5, interactive = false, onChange, size = 18 }) => (
  <span style={{ display: 'inline-flex', gap: 2 }}>
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        onClick={() => interactive && onChange && onChange(i + 1)}
        style={{ color: i < value ? C.gold : C.border, fontSize: size, cursor: interactive ? 'pointer' : 'default', lineHeight: 1 }}
      >★</span>
    ))}
  </span>
);

// ─── NOTE / SUGGESTION BOX ────────────────────────────────────────────────────

export const Note = ({ children, type = 'gold' }) => {
  const MAP = {
    gold:  { bg: C.cream,    border: C.gold,    text: '#92640A' },
    blue:  { bg: C.blueBg,   border: '#3B82F6', text: C.blueText },
    green: { bg: C.greenBg,  border: '#22C55E', text: C.greenText },
    red:   { bg: C.redBg,    border: '#F43F5E', text: C.redText },
  };
  const s = MAP[type] || MAP.gold;
  return (
    <div style={{ background: s.bg, border: `1.5px dashed ${s.border}`, borderRadius: RADII.md, padding: '8px 12px', fontSize: 11, color: s.text, lineHeight: 1.55, margin: '8px 0', fontFamily: FONTS.body }}>
      💡 {children}
    </div>
  );
};

// ─── SECTION LABEL ────────────────────────────────────────────────────────────

export const SecLabel = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.gold, marginBottom: 6, fontWeight: 700, fontFamily: FONTS.body }}>
    {children}
  </div>
);

export const DisplayH = ({ children, size = 22 }) => (
  <div style={{ fontFamily: FONTS.display, fontSize: size, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>
    {children}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────

export const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: RADII.xl, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', boxShadow: SHADOWS.lg }}
      >
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: C.navy }}>{title}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.muted, padding: 4 }}>✕</button>
          </div>
        )}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
};

// ─── LOADING SPINNER ─────────────────────────────────────────────────────────

export const Spinner = ({ size = 24, color = C.gold }) => (
  <div style={{ display: 'inline-block', width: size, height: size, border: `3px solid ${C.border}`, borderTop: `3px solid ${color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

export const EmptyState = ({ icon = '📭', title, message, action }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    {title && <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{title}</div>}
    {message && <div style={{ fontSize: 13, color: C.textSoft, marginBottom: 16, maxWidth: 320, margin: '0 auto 16px' }}>{message}</div>}
    {action}
  </div>
);

// ─── TOGGLE ──────────────────────────────────────────────────────────────────

export const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{ width: 38, height: 20, background: checked ? C.navy : C.border, borderRadius: RADII.full, position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
  >
    <div style={{ width: 16, height: 16, background: checked ? C.gold : C.white, borderRadius: '50%', position: 'absolute', top: 2, left: checked ? 20 : 2, transition: 'left 0.2s', boxShadow: SHADOWS.sm }} />
  </div>
);

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────

export const ProgressBar = ({ value, max = 100, label, showValue = true }) => (
  <div style={{ width: '100%' }}>
    {(label || showValue) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        {label && <span style={{ fontSize: 12, color: C.textSoft, fontFamily: FONTS.body }}>{label}</span>}
        {showValue && <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: FONTS.body }}>{value}%</span>}
      </div>
    )}
    <div style={{ background: C.border, borderRadius: RADII.full, height: 8 }}>
      <div style={{ background: `linear-gradient(90deg,${C.gold},${C.goldLight})`, width: `${Math.min(value, max)}%`, height: 8, borderRadius: RADII.full, transition: 'width 0.4s ease' }} />
    </div>
  </div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────

export const StatCard = ({ icon, value, label, bg = C.blueBg }) => (
  <Card style={{ background: bg, textAlign: 'center', padding: 14 }}>
    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: C.navy }}>{value}</div>
    <div style={{ fontSize: 11, color: '#64748B', fontFamily: FONTS.body }}>{label}</div>
  </Card>
);

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

export const Divider = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    {text && <span style={{ fontSize: 12, color: C.muted, fontFamily: FONTS.body, flexShrink: 0 }}>{text}</span>}
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

// ─── ALERT ───────────────────────────────────────────────────────────────────

export const Alert = ({ children, type = 'info', onClose }) => {
  const MAP = {
    info:    { bg: C.blueBg,  border: C.blueBorder,  text: C.blueText  },
    success: { bg: C.greenBg, border: C.greenBorder, text: C.greenText },
    error:   { bg: C.redBg,   border: C.redBorder,   text: C.redText   },
  };
  const s = MAP[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: RADII.md, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, fontFamily: FONTS.body }}>
      <span style={{ fontSize: 13, color: s.text, flex: 1 }}>{children}</span>
      {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text, fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>}
    </div>
  );
};
