/**
 * Deterministic pseudo-randomness for demo seed data.
 *
 * Seeds must NOT use Math.random(). Two reasons, both of which show up on a
 * sales call: the numbers on screen would change on every reload (a prospect
 * screenshots a 78% score and sees 41% a minute later), and server-rendered
 * markup would disagree with the client render, producing hydration errors in
 * the console of a demo we are asking someone to trust.
 *
 * Everything below is a pure function of a string seed, so the same key always
 * produces the same value, on the server and in the browser, forever.
 */

/** FNV-1a — small, fast, good enough spread for fixture data. */
function hashString(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — compact PRNG with a decent period for fixture-sized use. */
export function makeRng(seed: string): () => number {
  let a = hashString(seed);
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable float in [min, max) for a given seed. */
export function seededFloat(seed: string, min: number, max: number): number {
  return min + makeRng(seed)() * (max - min);
}

/** Stable integer in [min, max] for a given seed. */
export function seededInt(seed: string, min: number, max: number): number {
  return Math.floor(seededFloat(seed, min, max + 1));
}

/** Stable pick from a list. */
export function seededPick<T>(seed: string, items: readonly T[]): T {
  return items[seededInt(seed, 0, items.length - 1)];
}

/** Stable boolean that is true with the given probability. */
export function seededBool(seed: string, probability = 0.5): boolean {
  return makeRng(seed)() < probability;
}

/** Stable shuffle (Fisher-Yates driven by the seeded RNG). Does not mutate input. */
export function seededShuffle<T>(seed: string, items: readonly T[]): T[] {
  const rng = makeRng(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Stable sample of `count` distinct items. */
export function seededSample<T>(seed: string, items: readonly T[], count: number): T[] {
  return seededShuffle(seed, items).slice(0, Math.min(count, items.length));
}
