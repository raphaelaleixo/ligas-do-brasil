// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderCbBracket } from '../../assets/js/render/cb-bracket.js';

const mkMatch = (casaId, foraId, gc, gf) => ({
  casaId, foraId, golsCasa: gc, golsFora: gf,
  vencedorId: gc > gf ? casaId : foraId,
});

const matamata = {
  '16avos': [
    mkMatch('PAL', 'NB2', 2, 1),      // Palmeiras (A) vs "Nordestina B-02" (B)
    ...Array.from({ length: 15 }, (_, i) => mkMatch(`A${i}`, `A${i}b`, 2, 0)),
  ],
  oitavas: Array.from({ length: 8 }, (_, i) => mkMatch(`O${i}`, `O${i}b`, 2, 0)),
  quartas: Array.from({ length: 4 }, (_, i) => mkMatch(`Q${i}`, `Q${i}b`, 2, 0)),
  semis:   Array.from({ length: 2 }, (_, i) => mkMatch(`S${i}`, `S${i}b`, 2, 0)),
  final: mkMatch('SAO', 'FLA', 1, 0),
  campeao: 'SAO',
  vice: 'FLA',
};

describe('renderCbBracket', () => {
  it('applies --placeholder class to Série B teams', () => {
    const frag = renderCbBracket({ matamata, serieBIds: new Set(['NB2']) });
    const placeholders = frag.querySelectorAll('.cb-match__team--placeholder');
    expect(placeholders.length).toBeGreaterThanOrEqual(1);
    expect(Array.from(placeholders).some(el => el.textContent === 'NB2')).toBe(true);
  });

  it('does not apply --placeholder to Série A teams', () => {
    const frag = renderCbBracket({ matamata, serieBIds: new Set(['NB2']) });
    const teams = frag.querySelectorAll('.cb-match__team');
    const palEl = Array.from(teams).find(el => el.textContent === 'PAL');
    expect(palEl.classList.contains('cb-match__team--placeholder')).toBe(false);
  });

  it('marks the campeão with --campeao class on final match', () => {
    const frag = renderCbBracket({ matamata, serieBIds: new Set() });
    const champ = frag.querySelector('.cb-match--campeao');
    expect(champ?.dataset.vencedor).toBe('SAO');
  });
});
