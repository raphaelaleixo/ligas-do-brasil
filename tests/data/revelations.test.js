import { describe, it, expect } from 'vitest';
import { getRevelationClubs } from '../../src/data/revelations.js';

describe('revelation clubs', () => {
  it('has exactly 6 players', () => {
    expect(getRevelationClubs()).toHaveLength(6);
  });

  it('each entry has the required shape', () => {
    for (const r of getRevelationClubs()) {
      expect(r).toHaveProperty('jogador');
      expect(r).toHaveProperty('clubeRevelador');
      expect(r).toHaveProperty('estado');
      expect(r).toHaveProperty('liga');
      expect(r).toHaveProperty('copasVencidas');
      expect(Array.isArray(r.copasVencidas)).toBe(true);
      expect(r.copasVencidas.length).toBeGreaterThan(0);
    }
  });

  it('covers at least 4 distinct Ligas Regionais', () => {
    const ligas = new Set(getRevelationClubs().map((r) => r.liga));
    expect(ligas.size).toBeGreaterThanOrEqual(4);
  });
});
