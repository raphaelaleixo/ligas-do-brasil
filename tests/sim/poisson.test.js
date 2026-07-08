import { describe, it, expect } from 'vitest';
import { createRng } from '../../src/sim/rng.js';
import { samplePoisson } from '../../src/sim/poisson.js';

describe('samplePoisson', () => {
  it('returns non-negative integers', () => {
    const rng = createRng(1);
    for (let i = 0; i < 100; i++) {
      const v = samplePoisson(1.5, rng);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });

  it('sample mean approximates lambda over many draws', () => {
    const rng = createRng(999);
    const lambda = 1.4;
    const N = 20000;
    let sum = 0;
    for (let i = 0; i < N; i++) sum += samplePoisson(lambda, rng);
    const mean = sum / N;
    expect(mean).toBeGreaterThan(lambda - 0.1);
    expect(mean).toBeLessThan(lambda + 0.1);
  });

  it('lambda 0 always returns 0', () => {
    const rng = createRng(1);
    for (let i = 0; i < 20; i++) expect(samplePoisson(0, rng)).toBe(0);
  });

  it('is deterministic under the same seed', () => {
    const draws1 = Array.from({ length: 10 }, () => 0).map(
      (_, i) => samplePoisson(2, createRng(i + 1))
    );
    const draws2 = Array.from({ length: 10 }, () => 0).map(
      (_, i) => samplePoisson(2, createRng(i + 1))
    );
    expect(draws1).toEqual(draws2);
  });
});
