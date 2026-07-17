// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderStandingsTable } from '../../assets/js/render/standings-table.js';

const fakeTabelaA = Array.from({ length: 18 }, (_, i) => ({
  posicao: i + 1,
  id: `T${i + 1}`,
  nome: `Time ${i + 1}`,
  jogos: 34, vitorias: 20 - i, empates: 5, derrotas: 9 + i,
  golsPro: 50, golsContra: 30 + i, saldoGols: 20 - i, pontos: 80 - i * 4,
}));

describe('renderStandingsTable', () => {
  it('renders 18 rows for Série A', () => {
    const frag = renderStandingsTable({
      tabela: fakeTabelaA,
      qualificadosCampeoes: ['T1', 'T2', 'T3', 'T4'],
      rebaixados: ['T17', 'T18'],
      acessos: [],
      divisao: 'A',
    });
    const rows = frag.querySelectorAll('.standings-row');
    expect(rows.length).toBe(18);
  });

  it('marks top qualificadosCampeoes with --cc class', () => {
    const frag = renderStandingsTable({
      tabela: fakeTabelaA,
      qualificadosCampeoes: ['T1', 'T2', 'T3', 'T4'],
      rebaixados: ['T17', 'T18'],
      acessos: [],
      divisao: 'A',
    });
    const cc = frag.querySelectorAll('.standings-row--cc');
    expect(cc.length).toBe(4);
    expect(cc[0].dataset.id).toBe('T1');
  });

  it('marks rebaixados with --rebaixado class', () => {
    const frag = renderStandingsTable({
      tabela: fakeTabelaA,
      qualificadosCampeoes: ['T1'],
      rebaixados: ['T17', 'T18'],
      acessos: [],
      divisao: 'A',
    });
    const reb = frag.querySelectorAll('.standings-row--rebaixado');
    expect(reb.length).toBe(2);
  });

  it('marks acessos (Série B) with --acesso class', () => {
    const frag = renderStandingsTable({
      tabela: fakeTabelaA,
      qualificadosCampeoes: [],
      rebaixados: ['T18'],
      acessos: ['T1', 'T2'],
      divisao: 'B',
    });
    const ac = frag.querySelectorAll('.standings-row--acesso');
    expect(ac.length).toBe(2);
  });

  it('escapes team names (no HTML injection)', () => {
    const nasty = [{
      ...fakeTabelaA[0],
      nome: '<script>alert(1)</script>',
    }];
    const frag = renderStandingsTable({
      tabela: nasty,
      qualificadosCampeoes: [],
      rebaixados: [],
      acessos: [],
      divisao: 'A',
    });
    // textContent contains the literal text, no script element
    expect(frag.querySelector('script')).toBe(null);
    expect(frag.textContent).toContain('<script>');
  });
});
