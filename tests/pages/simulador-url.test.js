// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { _test } from '../../assets/js/pages/simulador.js';

describe('simulador URL param handling', () => {
  beforeEach(() => {
    // Reset URL
    history.replaceState({}, '', '/');
  });

  it('readSeedFromUrl returns null when no ?seed', () => {
    history.replaceState({}, '', '/');
    expect(_test.readSeedFromUrl()).toBe(null);
  });

  it('readSeedFromUrl returns integer when ?seed=143', () => {
    history.replaceState({}, '', '/?seed=143');
    expect(_test.readSeedFromUrl()).toBe(143);
  });

  it('readSeedFromUrl returns null for non-numeric seed', () => {
    history.replaceState({}, '', '/?seed=abc');
    expect(_test.readSeedFromUrl()).toBe(null);
  });

  it('readSeedFromUrl returns null for negative seed', () => {
    history.replaceState({}, '', '/?seed=-5');
    expect(_test.readSeedFromUrl()).toBe(null);
  });

  it('randomSeed returns an integer in [0, 1e9]', () => {
    for (let i = 0; i < 100; i++) {
      const s = _test.randomSeed();
      expect(Number.isInteger(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1e9);
    }
  });
});
