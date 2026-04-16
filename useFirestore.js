// ─── FIRESTORE QUERY HOOKS ────────────────────────────────────────────────────
// Drop-in replacements for mock data once Firebase is connected.
// Usage: const { data, loading, error } = useJobs(filters)

import { useState, useEffect, useCallback } from 'react';
import {
  db,
  collection, query, where, orderBy, limit, getDocs,
  onSnapshot, doc, getDoc, serverTimestamp,
} from '../firebase';

// ─── Generic real-time collection hook ───────────────────────────────────────
export function useCollection(collectionName, constraints = []) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    const ref = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}

// ─── Generic one-time document hook ──────────────────────────────────────────
export function useDocument(collectionName, docId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!docId) { setLoading(false); return; }
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, collectionName, docId),
      (snap) => {
        setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [collectionName, docId]);

  return { data, loading, error };
}

// ─── Jobs hook ────────────────────────────────────────────────────────────────
/**
 * useJobs — fetch active jobs from Firestore with optional filters
 *
 * @param {object} filters
 * @param {string[]} filters.types        - ['full-time', 'part-time']
 * @param {string[]} filters.markets      - ['ae', 'sg', ...]
 * @param {string[]} filters.departments  - ['Kitchen / Culinary', ...]
 * @param {boolean}  filters.visaOnly
 * @param {boolean}  filters.accomOnly
 * @param {number}   limitCount
 */
export function useJobs(filters = {}, limitCount = 30) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const constraints = [
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc'),
        limit(limitCount),
      ];

      // Firestore only supports one array-contains or inequality per query.
      // For multi-filter support, apply additional filtering client-side.
      if (filters.markets?.length === 1) {
        constraints.push(where('country', '==', filters.markets[0]));
      }
      if (filters.types?.length === 1) {
        constraints.push(where('type', '==', filters.types[0]));
      }
      if (filters.visaOnly) {
        constraints.push(where('visaSponsorship', '==', true));
      }
      if (filters.accomOnly) {
        constraints.push(where('accommodationProvided', '==', true));
      }

      const snap = await getDocs(query(collection(db, 'jobs'), ...constraints));
      let results = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Client-side multi-value filtering
      if (filters.markets?.length > 1)     results = results.filter(j => filters.markets.includes(j.country));
      if (filters.types?.length > 1)       results = results.filter(j => filters.types.includes(j.type));
      if (filters.departments?.length > 0) results = results.filter(j => filters.departments.includes(j.department));
      if (filters.experience?.length > 0)  results = results.filter(j => filters.experience.includes(j.experience));
      if (filters.verifiedOnly)            results = results.filter(j => j.verified);

      setJobs(results);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), limitCount]);

  useEffect(() => { fetch(); }, [fetch]);

  return { jobs, loading, error, refetch: fetch };
}

// ─── Single job hook ──────────────────────────────────────────────────────────
export function useJob(jobId) {
  return useDocument('jobs', jobId);
}

// ─── Applications for a candidate ────────────────────────────────────────────
export function useCandidateApplications(candidateId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!candidateId) { setLoading(false); return; }
    const q = query(
      collection(db, 'applications'),
      where('candidateId', '==', candidateId),
      orderBy('appliedAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [candidateId]);

  return { applications, loading };
}

// ─── Applications for an employer job ────────────────────────────────────────
export function useJobApplications(jobId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!jobId) { setLoading(false); return; }
    const q = query(
      collection(db, 'applications'),
      where('jobId', '==', jobId),
      orderBy('appliedAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [jobId]);

  return { applications, loading };
}

// ─── All applications for employer (all their jobs) ──────────────────────────
export function useEmployerApplications(employerId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!employerId) { setLoading(false); return; }
    const q = query(
      collection(db, 'applications'),
      where('employerId', '==', employerId),
      orderBy('appliedAt', 'desc'),
      limit(100)
    );
    const unsub = onSnapshot(q, snap => {
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [employerId]);

  return { applications, loading };
}

// ─── Employer's own jobs ──────────────────────────────────────────────────────
export function useEmployerJobs(employerId) {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) { setLoading(false); return; }
    const q = query(
      collection(db, 'jobs'),
      where('employerId', '==', employerId),
      orderBy('postedAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [employerId]);

  return { jobs, loading };
}

// ─── Offer letters ────────────────────────────────────────────────────────────
export function useOfferLetters(userId, role = 'candidate') {
  const field = role === 'candidate' ? 'candidateId' : 'employerId';
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const q = query(
      collection(db, 'offerLetters'),
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [userId, field]);

  return { offers, loading };
}

// ─── Ratings for a hotel or candidate ────────────────────────────────────────
export function useRatings(targetId, targetType = 'hotel') {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) { setLoading(false); return; }
    const q = query(
      collection(db, 'ratings'),
      where('targetId', '==', targetId),
      where('targetType', '==', targetType),
      orderBy('submittedAt', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(q, snap => {
      const r = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRatings(r);
      if (r.length > 0) {
        const avg = r.reduce((sum, rating) => sum + (rating.avg || 0), 0) / r.length;
        setAverage(Math.round(avg * 10) / 10);
      }
      setLoading(false);
    });
    return unsub;
  }, [targetId, targetType]);

  return { ratings, average, count: ratings.length, loading };
}

// ─── Part-time shifts (today + upcoming) ─────────────────────────────────────
export function useShifts(countryCode = null) {
  const [shifts, setShifts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const constraints = [
      where('type', '==', 'part-time'),
      where('status', '==', 'active'),
      where('shiftDate', '>=', now.toISOString()),
      orderBy('shiftDate', 'asc'),
      limit(20),
    ];
    if (countryCode) constraints.push(where('country', '==', countryCode));

    const q = query(collection(db, 'jobs'), ...constraints);
    const unsub = onSnapshot(q, snap => {
      setShifts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [countryCode]);

  return { shifts, loading };
}

// ─── Messages / conversations ─────────────────────────────────────────────────
export function useConversations(userId) {
  const [convos, setConvos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setConvos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  return { convos, loading };
}

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!conversationId) { setLoading(false); return; }
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('sentAt', 'asc'),
      limit(100)
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [conversationId]);

  return { messages, loading };
}
