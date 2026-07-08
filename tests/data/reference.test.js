import { describe, it, expect } from 'vitest';
import { getReferenceProfiles } from '../../src/data/reference.js';

describe('reference profiles (2024 current model)', () => {
  it('has the three canonical buckets', () => {
    const r = getReferenceProfiles();
    expect(r).toHaveProperty('elite');
    expect(r).toHaveProperty('media');
    expect(r).toHaveProperty('base');
  });

  it('each bucket has jogosMediaAno and a description', () => {
    for (const key of ['elite', 'media', 'base']) {
      const b = getReferenceProfiles()[key];
      expect(typeof b.jogosMediaAno).toBe('number');
      expect(typeof b.descricao).toBe('string');
      expect(b.descricao.length).toBeGreaterThan(0);
    }
  });

  it('elite > media > base in game count', () => {
    const r = getReferenceProfiles();
    expect(r.elite.jogosMediaAno).toBeGreaterThan(r.media.jogosMediaAno);
    expect(r.media.jogosMediaAno).toBeGreaterThan(r.base.jogosMediaAno);
  });
});
