import { describe, it, expect } from 'vitest';
import { allocateConmebolSlots } from '../../src/sim/conmebol.js';

describe('allocateConmebolSlots', () => {
  const input = {
    copaCampeoes: {
      campeao: 'PAL', vice: 'FLA',
      semifinalistas: ['FOR', 'CAP'],
      campanhaGeral: ['PAL','FLA','FOR','CAP','SAO','COR','GRE','BAH','INT','BOT','FLU','CEA'],
    },
    copaBrasil: { campeao: 'SAO', vice: 'BOT' },
    ligasRegionais: [
      { nome: 'Liga Paulista', tabelaA: [{ id: 'PAL' }, { id: 'SAO' }, { id: 'COR' }, { id: 'SAN' }] },
      { nome: 'Liga Nordestina', tabelaA: [{ id: 'FOR' }, { id: 'BAH' }, { id: 'CEA' }] },
      { nome: 'Liga Rio-Capixaba', tabelaA: [{ id: 'FLA' }, { id: 'FLU' }, { id: 'BOT' }] },
      { nome: 'Liga Sulista', tabelaA: [{ id: 'CAP' }, { id: 'GRE' }, { id: 'INT' }] },
      { nome: 'Liga Central', tabelaA: [{ id: 'CRU' }, { id: 'CAM' }, { id: 'GOI' }] },
      { nome: 'Liga Amazônica', tabelaA: [{ id: 'REM' }, { id: 'PAY' }, { id: 'ABC' }] },
    ],
  };
  const out = allocateConmebolSlots(input);

  it('Libertadores has exactly 7 unique clubs in priority order', () => {
    expect(out.libertadores).toHaveLength(7);
    expect(new Set(out.libertadores).size).toBe(7);
    expect(out.libertadores[0]).toBe('PAL');
    expect(out.libertadores[1]).toBe('FLA');
    expect(out.libertadores[2]).toBe('SAO');
  });

  it('cascades when a slot would be a duplicate', () => {
    const dup = allocateConmebolSlots({
      ...input,
      copaBrasil: { campeao: 'PAL', vice: 'FLA' },
    });
    expect(dup.libertadores).toHaveLength(7);
    expect(new Set(dup.libertadores).size).toBe(7);
  });

  it('Sul-Americana has 6 slots, one per region, all NOT in Libertadores', () => {
    expect(out.sulAmericana).toHaveLength(6);
    for (const id of out.sulAmericana) {
      expect(out.libertadores).not.toContain(id);
    }
  });
});
