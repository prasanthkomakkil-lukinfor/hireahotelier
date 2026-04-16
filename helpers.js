// ─── SHARED UTILITIES ─────────────────────────────────────────────────────────

// ─── DATE / TIME ──────────────────────────────────────────────────────────────

/** "2h ago", "3d ago", "Just now" */
export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)  return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** "15 Apr 2025" */
export function fmtDate(iso, opts = {}) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', ...opts,
  });
}

/** Countdown to a future date — returns "3h 22m" or "Expired" */
export function countdown(iso) {
  const diff = new Date(iso) - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0)  return `${h}h ${m}m`;
  if (m > 0)  return `${m}m ${s}s`;
  return `${s}s`;
}

// ─── NUMBER FORMATTERS ────────────────────────────────────────────────────────

/** 94180 → "94.2k" */
export function fmtNum(n) {
  if (n === null || n === undefined) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

/** "$1,800" */
export function fmtUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

/** salary object → display string */
export function fmtSalary(salary) {
  if (!salary) return 'Competitive';
  if (salary.amount) return `${salary.currency || '$'}${salary.amount}/${salary.period}`;
  if (salary.min && salary.max) {
    return `${salary.currency || '$'}${salary.min.toLocaleString()}–${salary.max.toLocaleString()}/${salary.period}`;
  }
  return 'Competitive';
}

// ─── STRING HELPERS ───────────────────────────────────────────────────────────

/** Truncate to N chars with ellipsis */
export function truncate(str, n = 120) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

/** Capitalise first letter */
export function ucFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Slugify for URLs */
export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────

export const isEmail    = (v) => /\S+@\S+\.\S+/.test(v);
export const isPhone    = (v) => /^\+?[\d\s\-().]{7,20}$/.test(v);
export const isURL      = (v) => /^https?:\/\/.+\..+/.test(v);
export const isPassword = (v) => v && v.length >= 8;
export const isLinkedIn = (v) => /linkedin\.com\/in\//.test(v);

/** Returns first error string or '' if valid */
export function validateJobForm(form) {
  if (!form.title?.trim())    return 'Job title is required';
  if (!form.department)       return 'Department is required';
  if (!form.country)          return 'Country is required';
  if (!form.description?.trim()) return 'Job description is required';
  return '';
}

export function validateProfile(form) {
  if (!form.displayName?.trim()) return 'Full name is required';
  if (!form.headline?.trim())    return 'Professional headline is required';
  return '';
}

// ─── PROFILE STRENGTH CALCULATOR ─────────────────────────────────────────────

export function calcProfileStrength(profile) {
  if (!profile) return 0;
  let score = 10;
  const checks = [
    [profile.displayName,          10],
    [profile.headline,              5],
    [profile.about,                10],
    [profile.photoURL,             10],
    [profile.videoProfileURL,      15],
    [profile.linkedinURL,           5],
    [profile.resumeURL,             5],
    [profile.skills?.length > 0,    5],
    [profile.certifications?.length > 0, 5],
    [profile.workHistory?.length > 0,   10],
    [profile.languages?.length > 0,     5],
    [profile.targetMarkets?.length > 0,  5],
  ];
  checks.forEach(([cond, pts]) => { if (cond) score += pts; });
  return Math.min(score, 100);
}

// ─── AI PROMPT BUILDERS ───────────────────────────────────────────────────────

/**
 * Builds the system + user prompt for AI resume generation.
 * Sent to OpenAI / Gemini via Firebase Cloud Function.
 */
export function buildResumePrompt({ profile, targetRole, tone, language, enhancements, template }) {
  const enhancementInstructions = [];
  if (enhancements.includes('rewrite'))  enhancementInstructions.push('Rewrite the professional summary in compelling, recruiter-friendly language. Use strong action verbs.');
  if (enhancements.includes('quantify')) enhancementInstructions.push('Where work history is vague, add realistic quantification. e.g. "Led team" → "Led cross-functional team of 40+ staff, achieving 22% reduction in food waste"');
  if (enhancements.includes('keywords')) enhancementInstructions.push('Embed relevant hospitality industry keywords: HACCP, Opera PMS, revenue management, yield management, F&B cost control, guest satisfaction scores (GSS), TripAdvisor ranking, etc.');

  const system = `You are an expert hospitality industry recruitment specialist and professional resume writer. You create compelling, ATS-optimised CVs for candidates applying to luxury hotels, resorts and hospitality groups across GCC, Southeast Asia, and Australia. Your resumes are concise, impactful, and follow international hotel industry standards.`;

  const user = `Create a professional resume in JSON format for the following candidate. The resume is for the target role: ${targetRole || 'Senior Hospitality Professional'}.

Tone: ${tone || 'Professional and confident'}
Language: ${language || 'English'}
Template style: ${template || 'luxury'}

Candidate data:
- Name: ${profile.displayName || 'Candidate'}
- Headline: ${profile.headline || ''}
- About: ${profile.about || ''}
- Department: ${profile.department || ''}
- Experience level: ${profile.experience || ''}
- Location: ${profile.currentLocation || ''}
- Languages: ${profile.languages?.join(', ') || 'English'}
- Skills: ${profile.skills?.join(', ') || ''}
- Certifications: ${profile.certifications?.join(', ') || ''}
- Work history: ${JSON.stringify(profile.workHistory || [])}

Enhancement instructions:
${enhancementInstructions.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "name": "...",
  "headline": "...",
  "contact": { "email": "...", "phone": "...", "location": "...", "linkedin": "..." },
  "summary": "3-4 sentence professional summary",
  "experience": [{ "title": "...", "company": "...", "period": "...", "bullets": ["...", "..."] }],
  "education": [{ "degree": "...", "institution": "...", "year": "..." }],
  "skills": ["..."],
  "certifications": ["..."],
  "languages": ["..."]
}`;

  return { system, user };
}

/**
 * Builds the prompt for AI job description generation.
 */
export function buildJobDescPrompt({ title, department, hotelName, experience, country, benefits }) {
  return `Write a compelling job description for a ${title} position in the ${department} department at ${hotelName} in ${country}.

Requirements to include:
- Experience level: ${experience}
- Benefits: ${benefits || 'Standard hospitality package'}

The description should:
1. Be 3-4 paragraphs, professional but engaging
2. Mention the opportunity to work in a luxury hospitality environment  
3. Emphasise direct hire — no agency involvement
4. Close with a compelling call to action

Return ONLY the plain text description, no markdown, no headings.`;
}

// ─── FILE HELPERS ─────────────────────────────────────────────────────────────

/** Convert a File to base64 string */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Format file size */
export function fmtFileSize(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── URL HELPERS ──────────────────────────────────────────────────────────────

/** Build a shareable job URL */
export function jobShareURL(jobId) {
  return `${window.location.origin}/jobs/${jobId}`;
}

/** Build WhatsApp share link */
export function whatsappShare(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Build LinkedIn share link */
export function linkedinShare(url, title) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
}

// ─── COUNTRIES / MARKETS ──────────────────────────────────────────────────────

export const CURRENCY_BY_COUNTRY = {
  ae: 'AED', sa: 'SAR', qa: 'QAR', kw: 'KWD',
  bh: 'BHD', om: 'OMR', sg: 'SGD', my: 'MYR',
  au: 'AUD', hk: 'HKD', mv: 'USD',
};

export function getCurrencyForCountry(countryCode) {
  return CURRENCY_BY_COUNTRY[countryCode] || 'USD';
}

// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────

/** Safe localStorage get with fallback */
export function localGet(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

/** Safe localStorage set */
export function localSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/** Toggle item in a saved array (e.g. saved jobs) */
export function localToggleArray(key, item) {
  const arr = localGet(key, []);
  const exists = arr.includes(item);
  const updated = exists ? arr.filter(x => x !== item) : [...arr, item];
  localSet(key, updated);
  return !exists; // returns true if item was added
}
