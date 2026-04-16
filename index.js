// ─── FIREBASE CLOUD FUNCTIONS ─────────────────────────────────────────────────
// Deploy: firebase deploy --only functions
// Setup:  npm install in /functions, then set config:
//   firebase functions:config:set linkedin.client_id="..." linkedin.client_secret="..."
//   firebase functions:config:set openai.key="..." sendgrid.key="..."

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const axios     = require('axios');

admin.initializeApp();
const db = admin.firestore();

// ─── LINKEDIN OAUTH TOKEN EXCHANGE ───────────────────────────────────────────
/**
 * Exchanges LinkedIn auth code for access token, fetches profile,
 * creates or links Firebase user, returns custom token.
 *
 * Frontend calls: POST /linkedinAuth { code, codeVerifier, redirectUri }
 */
exports.linkedinAuth = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', functions.config().app?.origin || '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { code, codeVerifier, redirectUri } = req.body;
  if (!code || !redirectUri) { res.status(400).json({ error: 'Missing code or redirectUri' }); return; }

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type:    'authorization_code',
        code,
        redirect_uri:  redirectUri,
        client_id:     functions.config().linkedin.client_id,
        client_secret: functions.config().linkedin.client_secret,
        ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token } = tokenRes.data;

    // 2. Fetch LinkedIn profile (OpenID Connect)
    const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const li = profileRes.data;
    const uid = `linkedin_${li.sub}`;

    // 3. Create or update Firebase auth user
    try {
      await admin.auth().updateUser(uid, {
        displayName: li.name,
        photoURL:    li.picture || '',
        email:       li.email   || `${uid}@linkedin.hireahotelier.com`,
      });
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        await admin.auth().createUser({
          uid,
          displayName: li.name,
          photoURL:    li.picture || '',
          email:       li.email   || `${uid}@linkedin.hireahotelier.com`,
        });
      } else throw e;
    }

    // 4. Store LinkedIn account mapping
    await db.collection('linkedinAccounts').doc(li.sub).set({
      uid, linkedinSub: li.sub, email: li.email, updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5. Upsert Firestore profile
    const userRef = db.collection('users').doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      await userRef.set({
        uid, displayName: li.name, email: li.email || '', photoURL: li.picture || '',
        role: 'seeker', headline: li.headline || '', linkedinURL: li.publicProfileUrl || '',
        linkedinData: { name: li.name, email: li.email, picture: li.picture },
        profileStrength: 30, createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.update({
        linkedinData: { name: li.name, email: li.email, picture: li.picture },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 6. Return custom token
    const firebaseToken = await admin.auth().createCustomToken(uid);
    res.json({ firebaseToken, profile: li, isNewUser: !snap.exists });

  } catch (error) {
    console.error('LinkedIn auth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'LinkedIn authentication failed', details: error.message });
  }
});

// ─── AI CONTENT GENERATION ───────────────────────────────────────────────────
/**
 * Proxies AI calls to OpenAI — keeps API key server-side.
 * POST /aiGenerate { system, user, json, maxTokens }
 */
exports.aiGenerate = functions.runWith({ timeoutSeconds: 60, memory: '256MB' }).https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', functions.config().app?.origin || '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

  // Verify Firebase auth token
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) { res.status(401).json({ error: 'Unauthorised' }); return; }
  try { await admin.auth().verifyIdToken(token); } catch { res.status(401).json({ error: 'Invalid token' }); return; }

  const { system, user, json = false, maxTokens = 1000 } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      max_tokens: Math.min(maxTokens, 2000),
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user   },
      ],
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }, {
      headers: { Authorization: `Bearer ${functions.config().openai.key}`, 'Content-Type': 'application/json' },
    });
    const text = response.data.choices?.[0]?.message?.content || '';
    const result = json ? JSON.parse(text) : text;
    res.json({ result });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// ─── EMAIL NOTIFICATIONS ──────────────────────────────────────────────────────

const EMAIL_TEMPLATES = {
  applicationReceived: (data) => ({
    subject: `✅ Application received — ${data.jobTitle} at ${data.hotelName}`,
    html: `<h2>We received your application!</h2><p>Hi ${data.candidateName},</p><p>Your application for <strong>${data.jobTitle}</strong> at <strong>${data.hotelName}</strong> has been submitted successfully. The hotel will review it and you'll be notified of every update right here.</p><p><a href="https://hireahotelier.com/candidate/applications">View your application →</a></p><p>Good luck!<br>The HireAHotelier Team</p>`,
  }),
  statusChanged: (data) => ({
    subject: `📋 Application update — ${data.jobTitle}`,
    html: `<h2>Your application was updated</h2><p>Hi ${data.candidateName},</p><p>Your application for <strong>${data.jobTitle}</strong> at <strong>${data.hotelName}</strong> has moved to: <strong>${data.newStatus}</strong>.</p>${data.newStatus === 'interview' ? `<p>📅 Interview scheduled: ${data.interviewDate || 'TBD — check your messages'}</p>` : ''}${data.newStatus === 'offer' ? `<p>🎉 Congratulations! You have a job offer waiting for your signature.</p>` : ''}<p><a href="https://hireahotelier.com/candidate/applications">View status →</a></p>`,
  }),
  offerSent: (data) => ({
    subject: `🎉 You have a job offer — ${data.jobTitle} at ${data.hotelName}`,
    html: `<h2>Congratulations, ${data.candidateName}!</h2><p><strong>${data.hotelName}</strong> has sent you an official offer for <strong>${data.jobTitle}</strong>.</p><p>Salary: ${data.salary} | Start Date: ${data.startDate}</p><p><a href="https://hireahotelier.com/candidate/offers" style="background:#C9A052;color:#0D1B3E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">✍️ View & Sign Offer →</a></p><p>This offer expires in 7 days. Act quickly!</p>`,
  }),
  newMessage: (data) => ({
    subject: `💬 New message from ${data.senderName}`,
    html: `<h2>You have a new message</h2><p>${data.senderName} sent: <em>"${data.preview}"</em></p><p><a href="https://hireahotelier.com/candidate/messages">View conversation →</a></p>`,
  }),
  hotelVerified: (data) => ({
    subject: `✅ Your hotel has been verified — ${data.hotelName}`,
    html: `<h2>Verification Complete!</h2><p>Great news, ${data.hrName}. <strong>${data.hotelName}</strong> is now verified on HireAHotelier.com. Your ✓ Verified badge is now live on all your job listings.</p><p>Verified hotels receive 2× more applications. Start posting jobs now.</p><p><a href="https://hireahotelier.com/employer/post-job">Post a Job →</a></p>`,
  }),
};

/**
 * Triggered when an application document is created or updated.
 * Sends email to candidate about their application status.
 */
exports.onApplicationUpdate = functions.firestore.document('applications/{appId}').onWrite(async (change, context) => {
  const after  = change.after.data();
  const before = change.before.data();
  if (!after) return; // Deleted

  const isNew = !before;
  const statusChanged = before?.status !== after.status;
  if (!isNew && !statusChanged) return;

  try {
    const [candidate, job] = await Promise.all([
      db.collection('users').doc(after.candidateId).get(),
      db.collection('jobs').doc(after.jobId).get(),
    ]);

    if (!candidate.exists || !job.exists) return;
    const c = candidate.data();
    const j = job.data();

    const tmpl = isNew
      ? EMAIL_TEMPLATES.applicationReceived({ candidateName: c.displayName, jobTitle: j.title, hotelName: j.hotelName })
      : EMAIL_TEMPLATES.statusChanged({ candidateName: c.displayName, jobTitle: j.title, hotelName: j.hotelName, newStatus: after.status, interviewDate: after.interviewDate });

    await sendEmail({ to: c.email, ...tmpl });
  } catch (error) {
    console.error('onApplicationUpdate error:', error);
  }
});

/**
 * Triggered when an offer letter is created.
 */
exports.onOfferCreated = functions.firestore.document('offerLetters/{offerId}').onCreate(async (snap) => {
  const offer = snap.data();
  try {
    const candidate = await db.collection('users').doc(offer.candidateId).get();
    if (!candidate.exists) return;
    const c = candidate.data();
    const tmpl = EMAIL_TEMPLATES.offerSent({
      candidateName: c.displayName, jobTitle: offer.jobTitle,
      hotelName: offer.hotelName, salary: `${offer.currency} ${offer.salary}/month`,
      startDate: offer.startDate,
    });
    await sendEmail({ to: c.email, ...tmpl });
  } catch (error) {
    console.error('onOfferCreated error:', error);
  }
});

/**
 * Triggered when a hotel is verified.
 */
exports.onHotelVerified = functions.firestore.document('users/{uid}').onUpdate(async (change) => {
  const after  = change.after.data();
  const before = change.before.data();
  if (after.role !== 'employer') return;
  if (before.isVerified || !after.isVerified) return; // Only on verification

  try {
    const tmpl = EMAIL_TEMPLATES.hotelVerified({ hotelName: after.hotelName, hrName: after.hrName || after.displayName });
    await sendEmail({ to: after.hrEmail || after.email, ...tmpl });
  } catch (error) {
    console.error('onHotelVerified error:', error);
  }
});

// ─── SCHEDULED JOBS ───────────────────────────────────────────────────────────

/** Daily: mark expired job boosts as inactive */
exports.expireJobBoosts = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  const now = new Date();
  const snap = await db.collection('jobs').where('boostedUntil', '<', now).where('boosted', '==', true).get();
  const batch = db.batch();
  snap.docs.forEach(doc => batch.update(doc.ref, { boosted: false }));
  await batch.commit();
  console.log(`Expired ${snap.size} job boosts`);
});

/** Weekly: send digest email to active seekers with new matching jobs */
exports.weeklyJobDigest = functions.pubsub.schedule('every monday 09:00').timeZone('Asia/Dubai').onRun(async () => {
  const seekers = await db.collection('users').where('role', '==', 'seeker').where('isOpenToWork', '==', true).limit(500).get();
  let sent = 0;
  for (const seeker of seekers.docs) {
    const s = seeker.data();
    if (!s.email) continue;
    await sendEmail({
      to: s.email,
      subject: '🏨 New jobs matching your profile this week',
      html: `<h2>Good morning ${s.displayName?.split(' ')[0] || 'there'}!</h2><p>We found new jobs matching your profile on HireAHotelier.com. Log in to view your matches.</p><p><a href="https://hireahotelier.com/jobs">Browse This Week's Jobs →</a></p>`,
    });
    sent++;
    // Rate limit: 100ms between emails
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`Sent ${sent} weekly digests`);
});

// ─── SENDGRID EMAIL HELPER ───────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  const apiKey = functions.config().sendgrid?.key;
  if (!apiKey) {
    console.log(`[DEV] Email to ${to}: ${subject}`);
    return;
  }
  await axios.post('https://api.sendgrid.com/v3/mail/send', {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: 'noreply@hireahotelier.com', name: 'HireAHotelier' },
    subject,
    content: [{ type: 'text/html', value: html }],
  }, {
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  });
}

// ─── PDF OFFER LETTER GENERATION ─────────────────────────────────────────────
/**
 * Generates a PDF offer letter using Puppeteer and stores in Firebase Storage.
 * POST /generateOfferPDF { offerId }
 */
exports.generateOfferPDF = functions.runWith({ timeoutSeconds: 120, memory: '1GB' }).https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  const { offerId } = data;
  if (!offerId) throw new functions.https.HttpsError('invalid-argument', 'Missing offerId');

  const snap = await db.collection('offerLetters').doc(offerId).get();
  if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Offer not found');
  const offer = snap.data();

  // Verify caller is the employer
  if (context.auth.uid !== offer.employerId) throw new functions.https.HttpsError('permission-denied', 'Not authorised');

  const html = generateOfferHTML(offer);

  try {
    const puppeteer = require('puppeteer');
    const browser   = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page      = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }, printBackground: true });
    await browser.close();

    const path    = `offers/${offerId}/offer-letter.pdf`;
    const fileRef = admin.storage().bucket().file(path);
    await fileRef.save(pdf, { contentType: 'application/pdf' });
    const [url] = await fileRef.getSignedUrl({ action: 'read', expires: '2099-01-01' });
    await db.collection('offerLetters').doc(offerId).update({ pdfURL: url });
    return { pdfURL: url };
  } catch (e) {
    console.error('PDF generation error:', e);
    throw new functions.https.HttpsError('internal', 'PDF generation failed');
  }
});

function generateOfferHTML(offer) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1E293B; line-height: 1.6; }
    .header { background: #0D1B3E; color: #C9A052; padding: 24px; margin: -20mm -20mm 24px; }
    .hotel { font-family: Georgia, serif; font-size: 22px; font-weight: bold; margin-bottom: 4px; }
    .gold-bar { height: 3px; background: #C9A052; margin: 16px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    .table td { padding: 6px 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px; }
    .table td:first-child { color: #64748B; width: 140px; }
    .table td:last-child { font-weight: 600; }
    .sign-area { display: flex; justify-content: space-between; margin-top: 40px; }
    .sign-box { border-top: 1px solid #CBD5E1; padding-top: 8px; min-width: 180px; font-size: 11px; }
  </style></head><body>
    <div class="header">
      <div class="hotel">${offer.hotelName?.toUpperCase() || 'HOTEL NAME'}</div>
      <div style="font-size:10px;color:#94A3B8">${offer.city || ''} · Direct Hire via HireAHotelier.com</div>
    </div>
    <p style="color:#94A3B8;font-size:10px">${new Date().toLocaleDateString('en-GB', { day:'numeric',month:'long',year:'numeric' })} · Ref: ${offer.id?.slice(0,8).toUpperCase()}</p>
    <p style="font-size:14px;font-weight:bold;color:#0D1B3E;margin:12px 0">LETTER OF APPOINTMENT</p>
    <p>Dear <strong>${offer.candidateName}</strong>,</p>
    <p>We are pleased to offer you the position of <strong>${offer.jobTitle}</strong>, subject to the terms and conditions set forth herein.</p>
    <div class="gold-bar"></div>
    <table class="table">
      <tr><td>Position</td><td>${offer.jobTitle}</td></tr>
      <tr><td>Department</td><td>${offer.department || '—'}</td></tr>
      <tr><td>Reporting To</td><td>${offer.reportingTo || '—'}</td></tr>
      <tr><td>Start Date</td><td>${offer.startDate || '—'}</td></tr>
      <tr><td>Gross Salary</td><td>${offer.currency || 'USD'} ${offer.salary}/month</td></tr>
      ${offer.accommodation ? `<tr><td>Accommodation</td><td>${offer.accommodation}</td></tr>` : ''}
      ${offer.annualLeave ? `<tr><td>Annual Leave</td><td>${offer.annualLeave}</td></tr>` : ''}
      <tr><td>Probation Period</td><td>${offer.probation || '3 Months'}</td></tr>
    </table>
    <p style="font-size:11px;color:#64748B">This offer is subject to successful background verification and receipt of all required documents. Terms are confidential and subject to local labour law.</p>
    <div class="sign-area">
      <div class="sign-box"><div style="color:#64748B">Authorised Signatory</div><div style="font-weight:600;margin-top:16px">${offer.hotelName}</div><div style="font-size:10px;color:#64748B">Digitally signed via HireAHotelier.com</div></div>
      <div class="sign-box" style="text-align:right"><div style="color:#64748B">Candidate Acceptance</div><div style="margin-top:16px;border-bottom:1px dashed #CBD5E1;width:160px;height:20px"></div><div style="font-size:10px;color:#64748B;margin-top:4px">${offer.candidateName} · Date: ___________</div></div>
    </div>
  </body></html>`;
}
