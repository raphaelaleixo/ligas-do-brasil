import { describe, it, expect } from 'vitest';
import { CB_PHASES, QUOTAS } from '../assets/js/data/copas.js';

describe('copas data module é puro (importável em node)', () => {
  it('exporta QUOTAS somando 48', () => {
    expect(QUOTAS.reduce((s, q) => s + q.vagas, 0)).toBe(48);
  });
  it('exporta CB_PHASES', () => {
    expect(Array.isArray(CB_PHASES)).toBe(true);
  });
});
