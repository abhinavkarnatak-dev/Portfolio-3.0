/**
 * In-memory sliding-window rate limiter.
 *
 * Chosen over Upstash deliberately: a portfolio contact form sees trivial
 * traffic, the honeypot filters most bots, and this avoids an external
 * dependency and credential. Trade-off: the window resets on cold starts and
 * isn't shared across serverless instances — acceptable here, since the goal
 * is stopping bursts, not building a quota system. Swap in Upstash Ratelimit
 * behind this same function if that ever changes.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;
const MAX_TRACKED_KEYS = 500;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, timestamps] of hits) {
      if (timestamps.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
