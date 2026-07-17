// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { simulateSeason } from '../../src/sim/run.js';
import { META } from '../../src/sim/meta.js';

describe('simulateSeason runs in a browser-like environment', () => {
  it('META is a plain object with expected keys', () => {
    expect(META.totalClubes).toBe(216);
    expect(META.semanasUtilizaveis).toBe(47);
  });

  it('simulateSeason(143) returns a well-formed season object', () => {
    const s = simulateSeason(143);
    expect(s.seed).toBe(143);
    expect(s.ligasRegionais.length).toBe(6);
    expect(s.copaCampeoes.grupos.length).toBe(12);
    expect(s.copaCampeoes.matamata.campeao).toBeTruthy();
    expect(s.copaBrasil.matamata.campeao).toBeTruthy();
    expect(s.clubes.length).toBe(192);
  });

  it('simulateSeason is deterministic given the same seed', () => {
    const a = simulateSeason(9999);
    const b = simulateSeason(9999);
    expect(a.copaCampeoes.matamata.campeao).toBe(b.copaCampeoes.matamata.campeao);
    expect(a.copaBrasil.matamata.campeao).toBe(b.copaBrasil.matamata.campeao);
  });
});
