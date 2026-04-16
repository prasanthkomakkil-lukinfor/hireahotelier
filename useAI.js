// ─── AI HOOKS ─────────────────────────────────────────────────────────────────
// All AI calls go through Firebase Cloud Functions to keep API keys server-side.
// For development, we include a direct OpenAI fallback (key from .env).
// In production: deploy functions/aiGenerators/index.js

import { useState, useCallback } from 'react';
import { buildResumePrompt, buildJobDescPrompt } from '../utils/helpers';

const CF_BASE = import.meta.env.VITE_CLOUD_FUNCTIONS_BASE || '';
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

/**
 * Calls OpenAI directly from browser (dev only) OR via Cloud Function (prod).
 */
async function callAI({ system, user, json = false, maxTokens = 1500 }) {
  // ── Production: use Cloud Function ────────────────────────────────────────
  if (CF_BASE) {
    const res = await fetch(`${CF_BASE}/aiGenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, user, json, maxTokens }),
    });
    if (!res.ok) throw new Error('Cloud function error');
    const data = await res.json();
    return data.result;
  }

  // ── Development: call OpenAI directly (NEVER do this in production) ───────
  if (!OPENAI_KEY) {
    // Return rich mock data when no API key is present
    return json ? MOCK_RESUME_JSON : MOCK_JOB_DESC;
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user   },
      ],
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'OpenAI error');
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  if (json) {
    try { return JSON.parse(text); }
    catch { throw new Error('AI returned invalid JSON'); }
  }
  return text;
}

// ─── MOCK DATA (when no API key) ──────────────────────────────────────────────
const MOCK_RESUME_JSON = {
  name: "Rajan Mehta",
  headline: "Executive Chef | Luxury Hospitality | 14 Years",
  contact: { email: "rajan@email.com", phone: "+91-9876543210", location: "Mumbai, India", linkedin: "linkedin.com/in/rajanmehta" },
  summary: "Award-winning Executive Chef with 14 years of luxury hospitality experience across India, UAE and Southeast Asia. Led kitchen brigades of 40+ staff, achieving 22% reduction in food cost while maintaining Michelin-standard quality. Expert in Indian, Pan-Asian and Continental cuisines with strong background in menu engineering and sustainable kitchen practices. Proven track record of increasing guest satisfaction scores by 18% through innovative culinary programmes.",
  experience: [
    { title: "Executive Chef", company: "Oberoi Grand, Kolkata", period: "2020–Present", bullets: ["Led a brigade of 45 culinary professionals across 6 restaurant outlets", "Achieved 22% reduction in food cost through precise inventory management and waste reduction", "Developed 3 new seasonal menus resulting in 18% increase in F&B revenue", "Maintained HACCP compliance with zero violations across 4 consecutive audits"] },
    { title: "Sous Chef", company: "ITC Maurya, New Delhi", period: "2016–2020", bullets: ["Supported Executive Chef in managing Pan-Asian and Indian cuisine operations", "Mentored a team of 28 junior culinary staff", "Introduced farm-to-table programme reducing ingredient costs by 12%"] },
  ],
  education: [{ degree: "Diploma in Culinary Arts", institution: "Institute of Hotel Management, Mumbai", year: "2010" }],
  skills: ["HACCP Level 3", "Menu Engineering", "F&B Cost Control", "Team Leadership", "Inventory Management", "Opera PMS"],
  certifications: ["HACCP Level 3 Certified", "Food Safety Level 4", "ISO 22000"],
  languages: ["English", "Hindi", "Marathi"],
};

const MOCK_JOB_DESC = `We are seeking an exceptional culinary professional to join our award-winning team at one of the region's most prestigious luxury properties. This is a rare opportunity to shape the dining identity of a five-star establishment where creativity, precision, and passion for hospitality are rewarded at every level.

As a key leader in our F&B operation, you will oversee a talented team of culinary professionals, driving excellence across all outlets while maintaining the highest standards of food quality, presentation, and guest satisfaction. Your expertise will be instrumental in developing seasonal menus that reflect both local culinary traditions and international trends.

This is a direct appointment — no recruitment agencies involved. HireAHotelier.com connects hospitality professionals directly with verified properties, ensuring transparency, fair terms, and no hidden fees.

If you are a passionate, driven hospitality professional ready for your next career milestone, we invite you to apply directly. We look forward to welcoming you to our family.`;

// ─── HOOK: AI RESUME GENERATOR ────────────────────────────────────────────────
export function useAIResume() {
  const [resume, setResume]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const generate = useCallback(async ({ profile, targetRole, tone, language, enhancements, template }) => {
    setLoading(true);
    setError('');
    try {
      const { system, user } = buildResumePrompt({ profile, targetRole, tone, language, enhancements, template });
      const result = await callAI({ system, user, json: true, maxTokens: 1800 });
      setResume(result);
      return result;
    } catch (e) {
      setError(e.message || 'Resume generation failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setResume(null); setError(''); }, []);

  return { resume, loading, error, generate, reset };
}

// ─── HOOK: AI JOB DESCRIPTION GENERATOR ──────────────────────────────────────
export function useAIJobDesc() {
  const [desc, setDesc]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const generate = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const prompt = buildJobDescPrompt(params);
      const result = await callAI({ system: 'You are an expert hospitality HR professional writing compelling job descriptions for luxury hotels.', user: prompt, json: false, maxTokens: 600 });
      setDesc(result);
      return result;
    } catch (e) {
      setError(e.message || 'Generation failed');
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  return { desc, loading, error, generate, setDesc };
}

// ─── HOOK: AI MATCH SCORER ────────────────────────────────────────────────────
/**
 * Scores how well a candidate profile matches a job description.
 * Returns 0–100 score + reasoning.
 */
export function useMatchScore() {
  const [score, setScore]     = useState(null);
  const [reason, setReason]   = useState('');
  const [loading, setLoading] = useState(false);

  const calculate = useCallback(async (profile, job) => {
    setLoading(true);
    try {
      const system = 'You are a hospitality HR expert. Score how well a candidate matches a job posting on a scale of 0-100. Return JSON with: { score: number, reasoning: string, strengths: string[], gaps: string[] }';
      const user   = `Job: ${job.title} at ${job.hotelName}, ${job.countryLabel}. Requirements: ${job.description?.slice(0, 300)}.\n\nCandidate: ${profile.headline}. Skills: ${profile.skills?.join(', ')}. Experience: ${profile.experience}.`;
      const result = await callAI({ system, user, json: true, maxTokens: 400 });
      setScore(result.score || 0);
      setReason(result.reasoning || '');
      return result;
    } catch {
      // Fallback: simple keyword matching
      const keywords = [job.title.toLowerCase(), ...(job.description?.toLowerCase().split(' ') || [])];
      const profileText = `${profile.headline} ${profile.skills?.join(' ')} ${profile.about}`.toLowerCase();
      const matches = keywords.filter(k => k.length > 4 && profileText.includes(k)).length;
      const fallback = Math.min(Math.round((matches / Math.max(keywords.length, 1)) * 150), 98);
      setScore(fallback);
      return { score: fallback };
    } finally {
      setLoading(false);
    }
  }, []);

  return { score, reason, loading, calculate };
}

// ─── HOOK: AI COVER LETTER GENERATOR ─────────────────────────────────────────
export function useAICoverLetter() {
  const [letter, setLetter]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const generate = useCallback(async (profile, job) => {
    setLoading(true);
    setError('');
    try {
      const system = 'You are a hospitality career coach writing compelling cover letters for hotel job applications.';
      const user   = `Write a 3-paragraph cover note (not a formal letter) for ${profile.displayName || 'the candidate'} applying for ${job.title} at ${job.hotelName}, ${job.countryLabel}. Make it personal, specific to hospitality, and under 200 words. Start directly — no "Dear Sir/Madam".`;
      const result = await callAI({ system, user, json: false, maxTokens: 300 });
      setLetter(result);
      return result;
    } catch (e) {
      setError(e.message);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  return { letter, loading, error, generate, setLetter };
}

// ─── HOOK: AI INTERVIEW QUESTION GENERATOR ────────────────────────────────────
export function useAIInterviewPrep() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(false);

  const generate = useCallback(async (role, department) => {
    setLoading(true);
    try {
      const system = 'You are a senior hospitality HR director preparing interview questions for luxury hotel positions.';
      const user   = `Generate 8 specific, insightful interview questions for a ${role} position in the ${department} department of a 5-star luxury hotel. Mix technical, behavioral, and situational questions. Return JSON: { questions: [{ q: "...", type: "technical|behavioral|situational", tip: "what to listen for" }] }`;
      const result = await callAI({ system, user, json: true, maxTokens: 800 });
      setQuestions(result.questions || []);
      return result.questions || [];
    } catch {
      setQuestions(FALLBACK_QUESTIONS);
      return FALLBACK_QUESTIONS;
    } finally {
      setLoading(false);
    }
  }, []);

  return { questions, loading, generate };
}

const FALLBACK_QUESTIONS = [
  { q: "Walk me through a time you had to manage a difficult guest situation.", type: "behavioral", tip: "Listen for empathy, problem-solving, and resolution skills." },
  { q: "How do you maintain food quality and consistency across a large team?", type: "technical", tip: "Look for HACCP knowledge and process-thinking." },
  { q: "Describe your experience with menu costing and food cost control.", type: "technical", tip: "Expect specific percentages and cost reduction stories." },
  { q: "If a key supplier fails the night before a major banquet, what do you do?", type: "situational", tip: "Tests resourcefulness and calm under pressure." },
  { q: "What's your leadership philosophy when managing a multicultural kitchen brigade?", type: "behavioral", tip: "Look for cultural sensitivity and inclusion awareness." },
  { q: "How do you approach team training for new menu launches?", type: "technical", tip: "Structured trainers are more effective." },
  { q: "Tell me about the proudest achievement in your hospitality career.", type: "behavioral", tip: "Reveals values and what motivates the candidate." },
  { q: "Why are you looking to leave your current role?", type: "behavioral", tip: "Red flags: badmouthing employer. Green: growth motivation." },
];
