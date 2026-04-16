// ─── HIREAHOTELIER DESIGN TOKENS ─────────────────────────────────────────────
// Single source of truth. Import this in every component.

export const C = {
  // Brand
  navy:        '#0D1B3E',
  navyLight:   '#1A3260',
  navyHover:   '#0A1530',
  gold:        '#C9A052',
  goldLight:   '#E8C47A',
  goldHover:   '#B8903E',

  // Backgrounds
  white:       '#FFFFFF',
  slate:       '#F8FAFC',
  slateHover:  '#F1F5F9',
  cream:       '#FFFBEB',

  // Borders
  border:      '#E2E8F0',
  borderDark:  '#CBD5E1',

  // Text
  text:        '#1E293B',
  textSoft:    '#475569',
  muted:       '#94A3B8',

  // Semantic
  greenBg:     '#F0FDF4',
  greenBorder: '#86EFAC',
  greenText:   '#166534',
  blueBg:      '#EFF6FF',
  blueBorder:  '#BFDBFE',
  blueText:    '#1E3A8A',
  redBg:       '#FFF1F2',
  redBorder:   '#FECDD3',
  redText:     '#9F1239',
  purpleBg:    '#F5F3FF',
  purpleBorder:'#C4B5FD',
  purpleText:  '#6B21A8',
  amberBg:     '#FEF3C7',
  amberText:   '#92400E',
};

export const FONTS = {
  display: "'Cormorant Garamond', serif",
  body:    "'Plus Jakarta Sans', sans-serif",
};

export const SHADOWS = {
  sm:   '0 1px 3px rgba(0,0,0,0.08)',
  md:   '0 4px 16px rgba(0,0,0,0.1)',
  lg:   '0 8px 40px rgba(0,0,0,0.12)',
  gold: '0 2px 12px rgba(201,160,82,0.35)',
  navy: '0 4px 20px rgba(13,27,62,0.25)',
};

export const RADII = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

// ─── JOB MARKET CONSTANTS ────────────────────────────────────────────────────

export const JOB_MARKETS = [
  { code: 'ae', label: 'UAE', flag: '🇦🇪', region: 'GCC' },
  { code: 'sa', label: 'Saudi Arabia', flag: '🇸🇦', region: 'GCC' },
  { code: 'qa', label: 'Qatar', flag: '🇶🇦', region: 'GCC' },
  { code: 'kw', label: 'Kuwait', flag: '🇰🇼', region: 'GCC' },
  { code: 'bh', label: 'Bahrain', flag: '🇧🇭', region: 'GCC' },
  { code: 'om', label: 'Oman', flag: '🇴🇲', region: 'GCC' },
  { code: 'my', label: 'Malaysia', flag: '🇲🇾', region: 'Asia' },
  { code: 'sg', label: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  { code: 'mv', label: 'Maldives', flag: '🇲🇻', region: 'Asia' },
  { code: 'hk', label: 'Hong Kong', flag: '🇭🇰', region: 'Asia' },
  { code: 'au', label: 'Australia', flag: '🇦🇺', region: 'Pacific' },
  { code: 'local', label: 'Local Jobs', flag: '📍', region: 'Local' },
];

export const LABOUR_ORIGINS = [
  { code: 'in', label: 'India', flag: '🇮🇳' },
  { code: 'bd', label: 'Bangladesh', flag: '🇧🇩' },
  { code: 'ph', label: 'Philippines', flag: '🇵🇭' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'np', label: 'Nepal', flag: '🇳🇵' },
  { code: 'lk', label: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'mm', label: 'Myanmar', flag: '🇲🇲' },
];

export const DEPARTMENTS = [
  'Kitchen / Culinary', 'F&B Service', 'Front Office', 'Housekeeping',
  'Spa & Wellness', 'Sales & Marketing', 'Finance & Admin', 'Engineering',
  'Banquet & Events', 'Recreation', 'Security', 'IT & Systems',
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0–2 yrs)' },
  { value: 'mid',   label: 'Mid Level (2–5 yrs)' },
  { value: 'senior',label: 'Senior (5–10 yrs)' },
  { value: 'exec',  label: 'Executive (10+ yrs)' },
];

export const HOTEL_CATEGORIES = [
  '5-Star / Luxury', '4-Star', '3-Star / Budget',
  'Resort', 'Boutique', 'Airport Hotel', 'Serviced Apartment',
];
