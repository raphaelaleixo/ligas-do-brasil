import { describe, it, expect } from 'vitest';
import { computePerfis } from '../../src/sim/perfis.js';

describe('computePerfis', () => {
  it('buckets 192 clubs into elite (24) / media (84) / base (84)', () => {
    const clubIds = Array.from({ length: 192 }, (_, i) => `T${i}`);
    const jogosPorClube = new Map(clubIds.map((id, i) => [id, 60 - Math.floor((i / 191) * 26)]));
    const perfis = computePerfis({ clubIds, jogosPorClube });
    expect(perfis.elite.count).toBe(24);
    expect(perfis.media.count).toBe(84);
    expect(perfis.base.count).toBe(84);
    expect(perfis.elite.mediaJogos).toBeGreaterThan(perfis.media.mediaJogos);
    expect(perfis.media.mediaJogos).toBeGreaterThan(perfis.base.mediaJogos);
  });
});
