import { describe, it, expect } from 'vitest';
import { CB_PHASES, QUOTAS, CC_KO, CB_KO } from '../assets/js/data/copas.js';
import { ARCHETYPES, calendarFor } from '../assets/js/data/archetypes.js';

describe('copas data module é puro (importável em node)', () => {
  it('exporta QUOTAS somando 48', () => {
    expect(QUOTAS.reduce((s, q) => s + q.vagas, 0)).toBe(48);
  });
  it('exporta CB_PHASES', () => {
    expect(Array.isArray(CB_PHASES)).toBe(true);
  });
});

describe('funil da Copa do Brasil fecha 100% (decoupled)', () => {
  // Cada fase: total de entrantes deve ser par e = 2× vencedores da próxima entrada de sobreviventes.
  const totals = CB_PHASES.map(ph => ph.parts.reduce((s, p) => s + p.count, 0));
  it('nenhuma fase tem total ímpar', () => {
    for (const t of totals) expect(t % 2, `fase com total ${t}`).toBe(0);
  });
  it('16-avos = 16 sobreviventes do funil + 16 caídos da CC = 32', () => {
    const dezasseis = CB_PHASES.find(p => p.fase === '16-avos');
    const total = dezasseis.parts.reduce((s, p) => s + p.count, 0);
    expect(total).toBe(32);
    const caidos = dezasseis.parts.find(p => p.kind === 'cc_caido');
    expect(caidos.count).toBe(16);
  });
  it('cadeia de sobreviventes: 80→40→(128)→64→32→16', () => {
    // Preliminar 80 SB → 40; 1ª 128 → 64; 2ª 64 → 32; 3ª 32 → 16
    const byName = Object.fromEntries(CB_PHASES.map(p => [p.fase, p.parts.reduce((s, x) => s + x.count, 0)]));
    expect(byName['Preliminar']).toBe(80);
    expect(byName['1ª Fase']).toBe(128);
    expect(byName['2ª Fase']).toBe(64);
    expect(byName['3ª Fase']).toBe(32);
  });
});

describe('formato dos mata-matas', () => {
  for (const [nome, KO] of [['CC', CC_KO], ['CB', CB_KO]]) {
    it(`${nome}: só a final é jogo único`, () => {
      for (const r of KO) {
        if (r.rodada === 'Final') expect(r.formato).toBe('Jogo único');
        else expect(r.formato).toBe('Ida e volta');
      }
    });
  }
});

describe('arquétipos do calendário (decoupled, 47 semanas)', () => {
  const esperado = {
    'copas-nacionais-e-internacionais': 64,
    'campeao-nacional': 62,
    'ligas-e-copas-nacionais': 49,
    'calendario-regional': 36,
  };
  for (const [slug, total] of Object.entries(esperado)) {
    it(`${slug} soma ${total} jogos`, () => {
      expect(ARCHETYPES[slug].totalGames).toBe(total);
    });
  }

  it('nenhum arquétipo dobra o slot (mds e fds nunca são 2 jogos reais na mesma semana)', () => {
    for (const slug of Object.keys(esperado)) {
      const weeks = calendarFor(slug);
      for (const w of weeks) {
        // fds e mds podem coexistir (fim de semana + meio de semana), mas
        // nenhum dos dois deve conter mais de um jogo. Slot nunca é array.
        expect(Array.isArray(w.fds)).toBe(false);
        expect(Array.isArray(w.mds)).toBe(false);
      }
    }
  });

  it('a contagem de jogos reais de cada arquétipo bate com totalGames', () => {
    const conta = (slug) => calendarFor(slug).reduce((n, w) => {
      const real = (k) => k && k.key && k.key !== 'fifa_pause';
      return n + (real(w.fds) ? 1 : 0) + (real(w.mds) ? 1 : 0);
    }, 0);
    for (const [slug, total] of Object.entries(esperado)) {
      expect(conta(slug), slug).toBe(total);
    }
  });
});
