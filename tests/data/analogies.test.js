import { describe, it, expect } from 'vitest';
import { getAnalogies, getAnalogyForLeague } from '../../src/data/analogies.js';

describe('analogies', () => {
  it('provides one mapping per Regional League', () => {
    const a = getAnalogies();
    expect(a).toHaveLength(6);
    const ligas = a.map((x) => x.liga);
    expect(ligas).toContain('Liga Paulista');
    expect(ligas).toContain('Liga Nordestina');
    expect(ligas).toContain('Liga Sulista');
    expect(ligas).toContain('Liga Central');
    expect(ligas).toContain('Liga Rio-Capixaba');
    expect(ligas).toContain('Liga Amazônica');
  });

  it('each entry has all required fields', () => {
    for (const a of getAnalogies()) {
      expect(a).toHaveProperty('liga');
      expect(a).toHaveProperty('regiaoPop');
      expect(a).toHaveProperty('pais');
      expect(a).toHaveProperty('paisFlag');
      expect(a).toHaveProperty('paisPop');
      expect(a).toHaveProperty('rationale');
      expect(typeof a.regiaoPop).toBe('number');
      expect(typeof a.paisPop).toBe('number');
      expect(a.regiaoPop).toBeGreaterThan(0);
      expect(a.paisPop).toBeGreaterThan(0);
    }
  });

  it('getAnalogyForLeague returns the correct entry', () => {
    expect(getAnalogyForLeague('Liga Paulista').pais).toBe('Inglaterra');
    expect(getAnalogyForLeague('Liga Nordestina').pais).toBe('Itália');
    expect(getAnalogyForLeague('Liga Amazônica').pais).toBe('Portugal');
  });
});
