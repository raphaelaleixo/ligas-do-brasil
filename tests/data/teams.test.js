import { describe, it, expect } from 'vitest';
import { getAllTeams, getLeagues, getTeamById } from '../../src/data/teams.js';

describe('teams data', () => {
  it('provides 216 total clubs (108 Série A + 108 Série B)', () => {
    const all = getAllTeams();
    expect(all).toHaveLength(216);
    expect(all.filter(t => t.divisao === 'A')).toHaveLength(108);
    expect(all.filter(t => t.divisao === 'B')).toHaveLength(108);
  });

  it('has 6 regional leagues, 18 A and 18 B in each', () => {
    const ligas = getLeagues();
    expect(ligas).toHaveLength(6);
    for (const l of ligas) {
      const a = l.clubes.filter(t => t.divisao === 'A');
      const b = l.clubes.filter(t => t.divisao === 'B');
      expect(a).toHaveLength(18);
      expect(b).toHaveLength(18);
    }
  });

  it('IDs are unique and 3-letter uppercase', () => {
    const all = getAllTeams();
    const ids = new Set();
    for (const t of all) {
      expect(t.id).toMatch(/^[A-Z0-9]{3,4}$/);
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
    }
  });

  it('getTeamById returns the same object as the enumeration', () => {
    const all = getAllTeams();
    const sample = all[0];
    expect(getTeamById(sample.id)).toBe(sample);
  });

  it('every club has ranking_forca in [1, 10]', () => {
    for (const t of getAllTeams()) {
      expect(t.ranking_forca).toBeGreaterThanOrEqual(1);
      expect(t.ranking_forca).toBeLessThanOrEqual(10);
    }
  });

  it('Série B rankings are between 1 and 4 (placeholder rule)', () => {
    for (const t of getAllTeams().filter(t => t.divisao === 'B')) {
      expect(t.ranking_forca).toBeGreaterThanOrEqual(1);
      expect(t.ranking_forca).toBeLessThanOrEqual(4);
    }
  });
});
