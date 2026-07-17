// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderCcBracket } from '../../assets/js/render/cc-bracket.js';

const mkMatch = (casaId, foraId, gc, gf) => ({
  casaId, foraId, golsCasa: gc, golsFora: gf,
  vencedorId: gc > gf ? casaId : foraId,
});
const fakeMatamata = {
  '16avos': Array.from({ length: 16 }, (_, i) => mkMatch(`C${i}A`, `C${i}B`, 2, 0)),
  oitavas:  Array.from({ length: 8 },  (_, i) => mkMatch(`O${i}A`, `O${i}B`, 2, 0)),
  quartas:  Array.from({ length: 4 },  (_, i) => mkMatch(`Q${i}A`, `Q${i}B`, 2, 0)),
  semis:    Array.from({ length: 2 },  (_, i) => mkMatch(`S${i}A`, `S${i}B`, 2, 0)),
  final: mkMatch('PAL', 'FOR', 3, 1),
  campeao: 'PAL',
  vice: 'FOR',
  semifinalistas: ['S0A', 'S1A'],
};

describe('renderCcBracket', () => {
  it('renders 5 rounds', () => {
    const frag = renderCcBracket({ matamata: fakeMatamata });
    expect(frag.querySelectorAll('.cc-bracket__round').length).toBe(5);
  });

  it('renders 16 matches in 16avos and 1 in final', () => {
    const frag = renderCcBracket({ matamata: fakeMatamata });
    const rounds = frag.querySelectorAll('.cc-bracket__round');
    expect(rounds[0].querySelectorAll('.cc-match').length).toBe(16);
    expect(rounds[4].querySelectorAll('.cc-match').length).toBe(1);
  });

  it('marks the campeão with --campeao class', () => {
    const frag = renderCcBracket({ matamata: fakeMatamata });
    const champ = frag.querySelector('.cc-match--campeao');
    expect(champ).toBeTruthy();
    expect(champ.dataset.vencedor).toBe('PAL');
  });
});
