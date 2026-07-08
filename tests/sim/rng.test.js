import { describe, it, expect } from 'vitest';
import { createRng } from '../../src/sim/rng.js';

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('produces different sequences for different seeds', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toBe(b());
  });

  it('returns values in [0, 1)', () => {
    const rng = createRng(123);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('has approximately uniform distribution', () => {
    const rng = createRng(7);
    const buckets = new Array(10).fill(0);
    const N = 10000;
    for (let i = 0; i < N; i++) buckets[Math.floor(rng() * 10)]++;
    for (const c of buckets) expect(c).toBeGreaterThan(N * 0.08);
  });
});
