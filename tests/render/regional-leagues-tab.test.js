// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderRegionalLeaguesTab } from '../../assets/js/render/regional-leagues-tab.js';

const emptyRow = (id, i) => ({
  posicao: i + 1, id, nome: id, jogos: 34, vitorias: 0, empates: 0, derrotas: 0,
  golsPro: 0, golsContra: 0, saldoGols: 0, pontos: 0,
});
const fakeLiga = (nome) => ({
  nome,
  tabelaA: Array.from({ length: 18 }, (_, i) => emptyRow(`${nome[0]}A${i}`, i)),
  tabelaB: Array.from({ length: 18 }, (_, i) => emptyRow(`${nome[0]}B${i}`, i)),
  qualificadosCampeoes: [],
  rebaixados: [],
  acessos: [],
});

describe('renderRegionalLeaguesTab', () => {
  it('renders 6 blocks in the canonical order', () => {
    const ligas = ['Liga Paulista','Liga Rio-Capixaba','Liga Central','Liga Sulista','Liga Nordestina','Liga Amazônica']
      .map(fakeLiga);
    const frag = renderRegionalLeaguesTab({ ligasRegionais: ligas });
    const blocks = frag.querySelectorAll('.lig-block');
    expect(blocks.length).toBe(6);
    expect(blocks[0].querySelector('.lig-block__title').textContent).toBe('Liga Paulista');
    expect(blocks[5].querySelector('.lig-block__title').textContent).toBe('Liga Amazônica');
  });

  it('each block contains two standings tables (A and B)', () => {
    const ligas = [fakeLiga('Liga Paulista')];
    const frag = renderRegionalLeaguesTab({ ligasRegionais: ligas });
    const tables = frag.querySelectorAll('.standings-table');
    expect(tables.length).toBe(2);
  });
});
