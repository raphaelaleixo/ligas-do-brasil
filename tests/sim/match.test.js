import { describe, it, expect } from 'vitest';
import { createRng } from '../../src/sim/rng.js';
import { simulateMatch } from '../../src/sim/match.js';

describe('simulateMatch', () => {
  it('returns a valid score shape', () => {
    const rng = createRng(1);
    const result = simulateMatch({ rankingHome: 8, rankingAway: 5 }, rng);
    expect(result).toHaveProperty('golsCasa');
    expect(result).toHaveProperty('golsFora');
    expect(Number.isInteger(result.golsCasa)).toBe(true);
    expect(Number.isInteger(result.golsFora)).toBe(true);
    expect(result.golsCasa).toBeGreaterThanOrEqual(0);
    expect(result.golsFora).toBeGreaterThanOrEqual(0);
  });

  it('stronger home team wins more often over many samples', () => {
    let strongerWins = 0;
    let weakerWins = 0;
    for (let seed = 0; seed < 2000; seed++) {
      const rng = createRng(seed);
      const r = simulateMatch({ rankingHome: 10, rankingAway: 3 }, rng);
      if (r.golsCasa > r.golsFora) strongerWins++;
      if (r.golsCasa < r.golsFora) weakerWins++;
    }
    expect(strongerWins).toBeGreaterThan(weakerWins * 3);
  });

  it('equal-ranking match trends toward draw distribution over many samples', () => {
    let home = 0, away = 0, draw = 0;
    for (let seed = 0; seed < 2000; seed++) {
      const rng = createRng(seed);
      const r = simulateMatch({ rankingHome: 6, rankingAway: 6 }, rng);
      if (r.golsCasa > r.golsFora) home++;
      else if (r.golsCasa < r.golsFora) away++;
      else draw++;
    }
    // Home advantage exists but no side dominates
    expect(home).toBeGreaterThan(away);
    expect(home).toBeLessThan(away * 2);
    expect(draw).toBeGreaterThan(300);
  });

  it('is deterministic under the same seed', () => {
    const a = simulateMatch({ rankingHome: 7, rankingAway: 4 }, createRng(42));
    const b = simulateMatch({ rankingHome: 7, rankingAway: 4 }, createRng(42));
    expect(a).toEqual(b);
  });
});
