const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'authToken';
const JWT_SECRET = process.env.JWT_SECRET || 'quiz-dev-secret-change-me';

function parseCookies(header) {
  const out = {};
  if (!header || typeof header !== 'string') return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function getUserDbIdFromCookieHeader(cookieHeader) {
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  const payload = verifyToken(token);
  if (!payload || payload.uid == null) return null;
  const id = Number(payload.uid);
  return Number.isFinite(id) ? id : null;
}

module.exports = {
  COOKIE_NAME,
  JWT_SECRET,
  parseCookies,
  verifyToken,
  getUserDbIdFromCookieHeader
};
