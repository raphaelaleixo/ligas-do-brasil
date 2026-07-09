// Approximate 2024 season game counts for the CURRENT Brazilian football model.
// Base bucket represents state-only clubs (the "esquecidos" of the reform's argument):
// short state championship crammed into Jan-Apr, then idle for the rest of the year.
const REFERENCE_PROFILES = {
  elite: {
    jogosMediaAno: 75,
    descricao: 'Botafogo em 2024 (campeão da Libertadores e do Brasileirão) jogou 75 partidas — o time com mais jogos no mundo naquele ano. Flamengo em 2025 chegou a 78 com o novo Mundial de Clubes da FIFA. Estadual + Brasileirão + Copa do Brasil + Libertadores (+ eventualmente Mundial).',
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
