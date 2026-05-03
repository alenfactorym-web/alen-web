const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalStore = globalThis;
globalStore.__adminLoginAttempts ??= new Map();

const attempts = globalStore.__adminLoginAttempts;

function getClientKey(request, email = "") {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `${ip}:${email.toLowerCase()}`;
}

function getEntry(key) {
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing) {
    return { count: 0, firstAttemptAt: now, blockedUntil: null };
  }

  if (existing.blockedUntil && existing.blockedUntil > now) {
    return existing;
  }

  if (now - existing.firstAttemptAt > WINDOW_MS) {
    const fresh = { count: 0, firstAttemptAt: now, blockedUntil: null };
    attempts.set(key, fresh);
    return fresh;
  }

  return existing;
}

export function getLoginRateLimitState(request, email = "") {
  const key = getClientKey(request, email);
  const entry = getEntry(key);
  const now = Date.now();

  const isBlocked = Boolean(entry.blockedUntil && entry.blockedUntil > now);
  const retryAfterMs = isBlocked ? entry.blockedUntil - now : 0;

  return {
    key,
    isBlocked,
    retryAfterMs,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - entry.count),
  };
}

export function recordFailedLoginAttempt(request, email = "") {
  const key = getClientKey(request, email);
  const now = Date.now();
  const entry = getEntry(key);

  const nextCount = entry.count + 1;

  const updated = {
    count: nextCount,
    firstAttemptAt: entry.firstAttemptAt || now,
    blockedUntil: nextCount >= MAX_ATTEMPTS ? now + WINDOW_MS : null,
  };

  attempts.set(key, updated);

  return {
    isBlocked: Boolean(updated.blockedUntil),
    retryAfterMs: updated.blockedUntil ? updated.blockedUntil - now : 0,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - updated.count),
  };
}

export function clearFailedLoginAttempts(request, email = "") {
  const key = getClientKey(request, email);
  attempts.delete(key);
}

