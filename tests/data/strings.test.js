import { describe, it, expect } from 'vitest';
import strings from '../../src/data/strings.js';

describe('strings module', () => {
  it('exposes a pt branch', () => {
    expect(strings.pt).toBeDefined();
  });

  it('has core section keys', () => {
    expect(strings.pt.homepage.heroPullquote).toBe('O problema não é o calendário. É a escala.');
    expect(strings.pt.homepage.heroThesis.length).toBeGreaterThan(20);
    expect(strings.pt.sleepingGiants.tagline).toContain('torcida');
    expect(strings.pt.revelationClubs.tagline).toContain('nostalgia');
  });
});
