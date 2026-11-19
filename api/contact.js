// Vercel serverless function: receives the website's contact/brief forms and
// emails them to AcornByte through Resend (https://resend.com).
//
// Environment variables (set in Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY  required. Resend API key with sending access.
//   CONTACT_TO      optional. Inbox that receives inquiries. Default: ewaisg@acornbyte.com
//   CONTACT_FROM    optional. Verified sender. Default: AcornByte Website <website@acornbyte.com>
//
// Spam and abuse protection: hidden honeypot field, minimum fill time,
// same-origin check, per-IP rate limit (best effort, per instance), and
// strict length/format validation. Nothing is stored by this function.

const TO = process.env.CONTACT_TO || 'ewaisg@acornbyte.com';
const FROM = process.env.CONTACT_FROM || 'AcornByte Website <website@acornbyte.com>';

const TOPICS = new Set([
  'Not sure yet — let’s talk',
  'Business app or dashboard',
  'Document, invoice or PDF workflow',
  'AI assistant or software integration',
  'Website or mobile app',
  'Computer & home-office help',
  'Wi-Fi & connected devices',
  'Files, backups & AI guidance',
]);
const MODES = new Set(['Email to start', 'Phone', 'Teams']);

// Best-effort rate limit: 5 messages per IP per 10 minutes per warm instance.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

function clean(value, max) {
  return typeof value === 'string' ? value.replace(/\r\n?/g, '\n').trim().slice(0, max) : '';
}

function oneLine(value) {
  return value.replace(/[\r\n]+/g, ' ');
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20000) throw new Error('Body too large');
  }
  return JSON.parse(raw || '{}');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  // Only accept posts from a page on this same site.
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return send(res, 403, { ok: false, error: 'Forbidden.' });
    } catch {
      return send(res, 403, { ok: false, error: 'Forbidden.' });
    }
  }

  let data;
  try {
    data = await readJson(req);
  } catch {
    return send(res, 400, { ok: false, error: 'The message could not be read. Please try again.' });
  }

  // Honeypot and fill-time checks: answer "ok" so bots learn nothing.
  const elapsed = Number(data.elapsed);
  if (clean(data.website, 200) || !Number.isFinite(elapsed) || elapsed < 3000) {
    return send(res, 200, { ok: true });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return send(res, 429, { ok: false, error: 'Too many messages in a short time. Please try again in a few minutes.' });
  }

  const topic = clean(data.topic, 100);
  const mode = clean(data.mode, 40);
  const name = oneLine(clean(data.name, 100));
  const email = oneLine(clean(data.email, 254));
  const phone = oneLine(clean(data.phone, 40));
  const message = clean(data.message, 1500);
  const source = data.source === 'brief' ? 'Project brief' : 'Contact form';

  const errors = [];
  if (!TOPICS.has(topic)) errors.push('Please choose a topic.');
  if (!MODES.has(mode)) errors.push('Please choose how you would like to talk.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('Please enter a valid email address.');
  if (phone && !/^[0-9+().\-\s]{7,40}$/.test(phone)) errors.push('Please check the phone number.');
  if (mode === 'Phone' && !phone) errors.push('Please add a phone number so we can call you.');
  if (message.length < 10) errors.push('Please add a little more detail (at least 10 characters).');
  if (errors.length) return send(res, 422, { ok: false, error: errors.join(' ') });

  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return send(res, 503, { ok: false, error: 'The form is temporarily unavailable. Please try again later.' });
  }

  const text = [
    `New ${source.toLowerCase()} inquiry from acornbyte.com`,
    '',
    `Topic: ${topic}`,
    `Name: ${name || '(not given)'}`,
    `Email: ${email}`,
    `Phone: ${phone || '(not given)'}`,
    `Preferred contact: ${mode}`,
    '',
    'Message:',
    message,
    '',
    'Reply to this email to answer the sender directly.',
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Website inquiry: ${topic}${name ? ` (${name})` : ''}`,
        text,
      }),
    });
    if (!r.ok) {
      console.error('contact: Resend error', r.status, (await r.text()).slice(0, 500));
      return send(res, 502, { ok: false, error: 'Your message could not be sent right now. Please try again in a few minutes.' });
    }
  } catch (err) {
    console.error('contact: send failed', err);
    return send(res, 502, { ok: false, error: 'Your message could not be sent right now. Please try again in a few minutes.' });
  }

  return send(res, 200, { ok: true });
};
