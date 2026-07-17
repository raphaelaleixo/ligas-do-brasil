// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderCcGroups } from '../../assets/js/render/cc-groups.js';

const mkGroup = (id, ids) => ({
  id,
  clubes: ids,
  tabela: ids.map((cid, i) => ({
    posicao: i + 1, id: cid, nome: cid,
    pontos: 10 - i * 3, saldoGols: 5 - i * 2, golsPro: 10,
  })),
});

const grupos = Array.from({ length: 12 }, (_, i) =>
  mkGroup(String.fromCharCode(65 + i), [`A${i}`, `B${i}`, `C${i}`, `D${i}`]));

const koQualifiers16 = [
  // 24 top-2 + 8 melhores 3ºs = 32 clubes; para o teste basta uma amostra
  // de 3ºs que passaram — usaremos C0, C1, C2, C3, C4, C5, C6, C7 (8 grupos).
  ...['C0','C1','C2','C3','C4','C5','C6','C7'].map((id) => ({ casaId: id, foraId: 'X', golsCasa: 0, golsFora: 0, vencedorId: id })),
];

describe('renderCcGroups', () => {
  it('renders 12 group cards', () => {
    const frag = renderCcGroups({ grupos, koRound16: koQualifiers16 });
    expect(frag.querySelectorAll('.cc-group').length).toBe(12);
  });

  it('marks top-2 with --classificado-direto', () => {
    const frag = renderCcGroups({ grupos, koRound16: koQualifiers16 });
    const first = frag.querySelector('.cc-group');
    const rows = first.querySelectorAll('.cc-group__row');
    expect(rows[0].classList.contains('cc-group__row--classificado-direto')).toBe(true);
    expect(rows[1].classList.contains('cc-group__row--classificado-direto')).toBe(true);
  });

  it('marks qualifying 3rd with --classificado-terceiro', () => {
    const frag = renderCcGroups({ grupos, koRound16: koQualifiers16 });
    const gA = frag.querySelector('.cc-group[data-id="A"]');
    const rows = gA.querySelectorAll('.cc-group__row');
    // Grupo A → 3º é "C0" que está na lista de qualificados
    expect(rows[2].classList.contains('cc-group__row--classificado-terceiro')).toBe(true);
  });

  it('does not mark non-qualifying 3rd', () => {
    const frag = renderCcGroups({ grupos, koRound16: koQualifiers16 });
    const gI = frag.querySelector('.cc-group[data-id="I"]');
    const rows = gI.querySelectorAll('.cc-group__row');
    // Grupo I → 3º é "C8" que NÃO está entre os 8 melhores
    expect(rows[2].classList.contains('cc-group__row--classificado-terceiro')).toBe(false);
  });

  it('marks 4th as eliminated', () => {
    const frag = renderCcGroups({ grupos, koRound16: koQualifiers16 });
    const rows = frag.querySelector('.cc-group').querySelectorAll('.cc-group__row');
    expect(rows[3].classList.contains('cc-group__row--eliminado')).toBe(true);
  });
});
