import { describe, it, expect } from 'vitest';
import { simulateSeason } from '../../src/sim/run.js';

describe('season JSON schema', () => {
  const season = simulateSeason(0);

  it('top-level shape', () => {
    const keys = Object.keys(season).sort();
    expect(keys).toEqual([
      'calendariosPorClube', 'clubes', 'conmebol', 'copaBrasil', 'copaCampeoes',
      'ligasRegionais', 'matchesGeral', 'meta', 'perfisDashboard', 'seed',
    ]);
  });

  it('meta shape', () => {
    expect(Object.keys(season.meta).sort()).toEqual([
      'desempregadosEmAbril', 'mesesGarantidos', 'reducaoVoos', 'semanasRodadaDupla',
      'semanasRodadaSimples', 'semanasUtilizaveis', 'tetoJogos', 'totalClubes',
    ]);
  });

  it('every clube has required fields; calendars live at top level', () => {
    for (const c of season.clubes) {
      for (const k of ['id', 'nome', 'liga_regional', 'divisao', 'ranking_forca', 'estatisticas_temporada', 'status_ano_seguinte']) {
        expect(c).toHaveProperty(k);
      }
      expect(c).not.toHaveProperty('calendario');
      expect(season.calendariosPorClube[c.id]).toHaveLength(42);
    }
  });

  it('copaCampeoes has potes (4), grupos (12), matamata with campeao', () => {
    expect(season.copaCampeoes.potes).toHaveLength(4);
    expect(season.copaCampeoes.grupos).toHaveLength(12);
    expect(season.copaCampeoes.matamata.campeao).toBeDefined();
  });

  it('copaBrasil has funil phases and matamata', () => {
    for (const k of ['preliminar', 'primeira', 'segunda', 'terceira']) {
      expect(season.copaBrasil.funil).toHaveProperty(k);
    }
    expect(season.copaBrasil.matamata.campeao).toBeDefined();
  });

  it('conmebol has 7 libertadores and 6 sulAmericana slots, all distinct', () => {
    expect(season.conmebol.libertadores).toHaveLength(7);
    expect(season.conmebol.sulAmericana).toHaveLength(6);
    const all = new Set([...season.conmebol.libertadores, ...season.conmebol.sulAmericana]);
    expect(all.size).toBe(13);
  });

  it('perfisDashboard buckets add to 216', () => {
    expect(
      season.perfisDashboard.elite.count +
      season.perfisDashboard.media.count +
      season.perfisDashboard.base.count
    ).toBe(216);
  });
});
