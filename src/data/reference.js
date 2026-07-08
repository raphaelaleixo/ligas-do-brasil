// Approximate 2024 season game counts for the CURRENT Brazilian football model.
// Base bucket represents state-only clubs (the "esquecidos" of the reform's argument):
// short state championship crammed into Jan-Apr, then idle for the rest of the year.
const REFERENCE_PROFILES = {
  elite: {
    jogosMediaAno: 75,
    descricao: 'Clubes na Libertadores em 2024 (Botafogo, Palmeiras, Flamengo, Fluminense, Atlético-MG, São Paulo). Estadual + Brasileirão + Copa do Brasil + Libertadores.',
  },
  media: {
    jogosMediaAno: 54,
    descricao: 'Clubes de Série A meio-tabela ou Série B ativos na Copa do Brasil. Estadual + campeonato principal + rodadas iniciais de Copa do Brasil.',
  },
  base: {
    jogosMediaAno: 14,
    descricao: 'Clubes que só disputam Estadual — concentrados em Jan–Abr, depois 8+ meses sem calendário.',
  },
};

export function getReferenceProfiles() {
  return REFERENCE_PROFILES;
}
