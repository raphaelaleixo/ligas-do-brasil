const CACHE_NAME = 'futebol-br-v53';
const SEASON_URL = '/data/season-default.json';

let cached = null;

async function fetchAndCache() {
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const stored = await cache.match(SEASON_URL);
    if (stored) return stored.clone().json();
    const res = await fetch(SEASON_URL);
    // Only cache successful responses
    if (res.ok) cache.put(SEASON_URL, res.clone());
    return res.json();
  }
  // Graceful degrade: no Cache Storage → fetch every time
  const res = await fetch(SEASON_URL);
  return res.json();
}

export async function loadSeason() {
  if (cached) return cached;
  cached = await fetchAndCache();
  return cached;
}

/** Handy lookup helpers for pages. */
export function clubById(season, id) {
  return season.clubes.find((c) => c.id === id);
}

export function calendarFor(season, id) {
  return season.calendariosPorClube[id] ?? [];
}
