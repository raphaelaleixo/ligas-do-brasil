import { describe, it, expect } from 'vitest';
import { getAllTeams, getLeagues, getTeamById } from '../../src/data/teams.js';

describe('teams.js is browser-portable', () => {
  it('does not throw on import (no fs access at module init)', () => {
    // If it did, importing at the top would have already failed.
    expect(true).toBe(true);
  });

  it('getAllTeams returns 192 clubs', () => {
    const teams = getAllTeams();
    expect(teams.length).toBe(192);
  });

  it('getLeagues returns 6 ligas', () => {
    expect(getLeagues().length).toBe(6);
  });

  it('getTeamById returns Palmeiras by canonical id', () => {
    const t = getTeamById('PAL');
    expect(t?.nome).toBe('Palmeiras');
    expect(t?.divisao).toBe('A');
  });
});
