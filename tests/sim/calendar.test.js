import { describe, it, expect } from 'vitest';
import { assignCalendar, TOTAL_WEEKS } from '../../src/sim/calendar.js';

describe('assignCalendar', () => {
  it('has 42 weeks', () => {
    expect(TOTAL_WEEKS).toBe(42);
  });

  const fakeSimResult = {
    regionalLeagueMatches: [
      { competicao: 'liga_regional', ligaNome: 'Liga Paulista', rodada: 1, casaId: 'PAL', foraId: 'SAO', golsCasa: 2, golsFora: 1 },
    ],
    copaCampeoesMatches: [
      { competicao: 'copa_campeoes', rodada: 'grupos-1', casaId: 'PAL', foraId: 'FLA', golsCasa: 1, golsFora: 1 },
    ],
    copaBrasilMatches: [
      { competicao: 'copa_brasil', rodada: '16avos', casaId: 'PAL', foraId: 'BOT', golsCasa: 3, golsFora: 0 },
    ],
    clubIds: ['PAL', 'SAO', 'FLA', 'BOT'],
  };
  const cal = assignCalendar(fakeSimResult);

  it('produces a 42-week calendar per club', () => {
    for (const id of fakeSimResult.clubIds) {
      expect(cal.calendariosPorClube[id]).toHaveLength(42);
    }
  });

  it('regional league matches land on weekend slots', () => {
    const palWeeks = cal.calendariosPorClube['PAL'];
    const ligaWeeks = palWeeks.filter((w) => w.fimDeSemana?.competicao === 'liga_regional');
    expect(ligaWeeks.length).toBeGreaterThan(0);
  });

  it('cup matches land on midweek slots', () => {
    const palWeeks = cal.calendariosPorClube['PAL'];
    const midweekCups = palWeeks.filter((w) => w.meioDeSemana?.competicao?.startsWith('copa_'));
    expect(midweekCups.length).toBeGreaterThan(0);
  });
});
