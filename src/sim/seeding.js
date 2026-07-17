import { getLeagues } from '../data/teams.js';

function byRankDescNameAsc(a, b) {
  if (b.ranking_forca !== a.ranking_forca) return b.ranking_forca - a.ranking_forca;
  // Basic string comparison (not locale-aware) — consistent with any downstream string compares.
  if (a.nome < b.nome) return -1;
  if (a.nome > b.nome) return 1;
  return 0;
}

export function seedYearZero() {
  const ligas = getLeagues().map((liga) => {
    const a = liga.clubes.filter((c) => c.divisao === 'A').slice().sort(byRankDescNameAsc);
    const b = liga.clubes.filter((c) => c.divisao === 'B').slice().sort(byRankDescNameAsc);
    return { nome: liga.nome, tabelaA: a, tabelaB: b };
  });
  return { ligas };
}
