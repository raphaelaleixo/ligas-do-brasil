export const QUOTAS = [
  { liga: 'Liga Nordestina',   vagas: 10 },
  { liga: 'Liga Paulista',     vagas: 10 },
  { liga: 'Liga Central',      vagas: 8  },
  { liga: 'Liga Sulista',      vagas: 8  },
  { liga: 'Liga Rio-Capixaba', vagas: 8  },
  { liga: 'Liga Amazônica',    vagas: 4  },
];

export const POTES = [
  { id: 1, label: 'Pote 1 · Gigantes',    corte: '1 clube da Amazônica, 2 de cada demais região, e 1 extra sorteado entre Nordestina e Paulista.' },
  { id: 2, label: 'Pote 2 · Elite forte', corte: 'Mesma regra do Pote 1 — o extra é sorteado a cada ano.' },
  { id: 3, label: 'Pote 3 · Meio-alto',   corte: 'Mesma regra.' },
  { id: 4, label: 'Pote 4 · Ascendentes', corte: 'Mesma regra. Ao final dos 4 potes, Nordestina e Paulista terão 2 extras cada (10 vagas totais).' },
];

export const GROUPS = [
  { id: 'A', slots: [[1, 'Amazonas FC', 'AM'], [2, 'Corinthians', 'SP'], [3, 'CRB', 'NE'], [4, 'Bangu', 'RJ']] },
  { id: 'B', slots: [[1, 'Bahia', 'NE'], [2, 'Paysandu', 'AM'], [3, 'Mirassol', 'SP'], [4, 'Athletic Club', 'CE']] },
  { id: 'C', slots: [[1, 'Palmeiras', 'SP'], [2, 'Fluminense', 'RJ'], [3, 'Remo', 'AM'], [4, 'Botafogo-PB', 'NE']] },
  { id: 'D', slots: [[1, 'Botafogo', 'RJ'], [2, 'Sport Recife', 'NE'], [3, 'América-MG', 'CE'], [4, 'Manaus FC', 'AM']] },
  { id: 'E', slots: [[1, 'Atlético-MG', 'CE'], [2, 'Internacional', 'SUL'], [3, 'ABC', 'NE'], [4, 'Guarani', 'SP']] },
  { id: 'F', slots: [[1, 'Cruzeiro', 'CE'], [2, 'Criciúma', 'SUL'], [3, 'América-RN', 'NE'], [4, 'Ituano', 'SP']] },
  { id: 'G', slots: [[1, 'Flamengo', 'RJ'], [2, 'Vitória', 'NE'], [3, 'Juventude', 'SUL'], [4, 'Ponte Preta', 'SP']] },
  { id: 'H', slots: [[1, 'Athletico-Paranaense', 'SUL'], [2, 'Atlético-GO', 'CE'], [3, 'Novorizontino', 'SP'], [4, 'Boavista', 'RJ']] },
  { id: 'I', slots: [[1, 'Grêmio', 'SUL'], [2, 'Red Bull Bragantino', 'SP'], [3, 'Nova Iguaçu', 'RJ'], [4, 'CSA', 'NE']] },
  { id: 'J', slots: [[1, 'Fortaleza', 'NE'], [2, 'Vasco da Gama', 'RJ'], [3, 'Goiás', 'CE'], [4, 'Maringá', 'SUL']] },
  { id: 'K', slots: [[1, 'São Paulo', 'SP'], [2, 'Cuiabá', 'CE'], [3, 'Volta Redonda', 'RJ'], [4, 'Avaí', 'SUL']] },
  { id: 'L', slots: [[1, 'Ceará', 'NE'], [2, 'Santos', 'SP'], [3, 'Coritiba', 'SUL'], [4, 'Vila Nova-GO', 'CE']] },
];

export const CROSS_ROUNDS = [
  { title: 'Rodada 1 · Grupo A × Grupo B', matches: [[1, 'Amazonas FC', 'Bahia'], [2, 'Corinthians', 'Paysandu'], [3, 'CRB', 'Mirassol'], [4, 'Bangu', 'Athletic Club']] },
  { title: 'Rodada 2 · Grupo A × Grupo C', matches: [[1, 'Amazonas FC', 'Palmeiras'], [2, 'Corinthians', 'Fluminense'], [3, 'CRB', 'Remo'], [4, 'Bangu', 'Botafogo-PB']] },
  { title: 'Rodada 3 · Grupo A × Grupo D', matches: [[1, 'Amazonas FC', 'Botafogo'], [2, 'Corinthians', 'Sport Recife'], [3, 'CRB', 'América-MG'], [4, 'Bangu', 'Manaus FC']] },
];

export const CC_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta', detalhe: '2 melhores de cada grupo + 8 melhores 3ºs. Os 16 eliminados caem nos 16-avos da Copa do Brasil.' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Quartas', clubes: 8,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Semis',   clubes: 4,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Final',   clubes: 2,  formato: 'Jogo único',  detalhe: 'Sábado 7 dez — o último jogo da temporada brasileira.' },
];

export const CB_KO = [
  { rodada: '16-avos', clubes: 32, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Oitavas', clubes: 16, formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Quartas', clubes: 8,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Semis',   clubes: 4,  formato: 'Ida e volta', detalhe: '' },
  { rodada: 'Final',   clubes: 2,  formato: 'Jogo único',  detalhe: 'Sábado 9 nov — encerra o ciclo dos mata-matas nacionais antes das finais continentais.' },
];

export const CB_PHASES = [
  {
    fase: 'Preliminar',
    parts: [{ kind: 'serieb', count: 80 }],
    origem: 'Os 80 clubes de Série B de menor ranking abrem a caminhada.',
  },
  {
    fase: '1ª Fase',
    parts: [
      { kind: 'survivor', count: 40 },
      { kind: 'serieb',   count: 28 },
      { kind: 'seriea',   count: 60 },
    ],
    origem: '40 vencedores da Preliminar + os 28 clubes de Série B mais bem ranqueados + os 60 clubes de Série A que não subiram à Copa dos Campeões.',
  },
  {
    fase: '2ª Fase',
    parts: [{ kind: 'survivor', count: 64 }],
    origem: '64 vencedores da 1ª Fase.',
  },
  {
    fase: '3ª Fase',
    parts: [{ kind: 'survivor', count: 32 }],
    origem: '32 sobreviventes da 2ª Fase.',
  },
  {
    fase: '16-avos',
    parts: [
      { kind: 'survivor', count: 16 },
      { kind: 'cc_caido', count: 16 },
    ],
    origem: '16 sobreviventes do funil encontram os 16 clubes eliminados nos 16-avos da Copa dos Campeões — a elite que tropeçou cai aqui.',
  },
];

export const SERIE_A_FUNIL = [
  { liga: 'Liga Nordestina',   vagas: 8  },
  { liga: 'Liga Paulista',     vagas: 8  },
  { liga: 'Liga Central',      vagas: 10 },
  { liga: 'Liga Sulista',      vagas: 10 },
  { liga: 'Liga Rio-Capixaba', vagas: 10 },
  { liga: 'Liga Amazônica',    vagas: 14 },
]; // soma = 60

export const LIBERTADORES = [
  { pos: 1, origem: 'Campeão da Copa dos Campeões' },
  { pos: 2, origem: 'Vice-campeão da Copa dos Campeões' },
  { pos: 3, origem: 'Campeão da Copa do Brasil' },
  { pos: 4, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 5, origem: 'Semifinalista da Copa dos Campeões' },
  { pos: 6, origem: 'Vice-campeão da Copa do Brasil' },
  { pos: 7, origem: 'Próximo melhor colocado na Copa dos Campeões.' },
];
