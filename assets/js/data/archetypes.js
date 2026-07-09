// Reform's 2024-anchored calendar template. Purely structural — assigns fixture
// TYPES to weeks. No opponents, no scores.
//
// Week 1 starts on the weekend of Sat Jan 27, 2024 (real Brazilian season start).
// FIFA break weekends are excluded from Liga Regional; the 3 FIFA midweeks (14, 24, 34)
// lose only their midweek slot. June break normalized to a single FIFA window.

const TOTAL_WEEKS = 42;

// Approximate real 2024 Saturday date for each week (Jan 27 + N weeks)
function saturdayForWeek(n) {
  const start = new Date(Date.UTC(2024, 0, 27));
  start.setUTCDate(start.getUTCDate() + (n - 1) * 7);
  return start;
}
function formatDate(d) {
  const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}
export function weekLabel(n) {
  const sat = saturdayForWeek(n);
  return { num: n, sat: formatDate(sat) };
}

// FIFA breaks — midweeks lost to national-team dates (real 2024 windows,
// with the June Copa América normalized to a single window)
export const FIFA_MIDWEEKS = new Set([8, 20, 31, 36, 41]);

// Fixed calendar allocation for each competition/round.
const LIGA_WEEKS = Array.from({ length: 34 }, (_, i) => i + 1);
const CC_GRUPOS = [5, 8, 11, 13, 15, 17]; // 3 in-group + 3 cross-group
const CC_KO     = [20, 25, 30, 35, 40];   // 16-avos → final
const CB_BASE   = [3, 6, 9, 12];          // Preliminar, 1ª, 2ª, 3ª
const CB_KO     = [21, 26, 31, 36, 41];   // 16-avos → final (elite bypass enters here)
const LIB       = [2, 4, 7, 10, 15, 17, 19, 22, 27, 32, 37, 39, 42];
const SUL_AM    = [4, 16, 18, 23, 27, 33, 38, 42];

// Which fixture types are eligible for each week under each archetype.
// Value = a label for the mds slot (fds is always liga_regional for weeks 1-34).
function buildWeekMap(rounds) {
  const map = new Map();
  for (const { week, key, label } of rounds) map.set(week, { key, label });
  return map;
}

const ELITE_FINALISTA = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${['16-avos','oitavas','quartas','semis','final'][i]}` })),
  ...CB_KO.map((w, i) => ({ week: w, key: 'copa_brasil', label: `Copa do Brasil · ${['16-avos','oitavas','quartas','semis','final'][i]}` })),
  ...LIB.map((w) => ({ week: w, key: 'conmebol_libertadores', label: 'Libertadores' })),
]);

// Sul-Am archetype: regional Serie A, eliminated in CC groups, in elite bypass for CB
// (usually 16-avos to quartas), plays Sul-Americana slots
const SUL_AM_ARCHETYPE = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  // Copa Brasil: bypass to 16-avos, wins to oitavas, loses in quartas — 3 games
  { week: 21, key: 'copa_brasil', label: 'Copa do Brasil · 16-avos' },
  { week: 26, key: 'copa_brasil', label: 'Copa do Brasil · oitavas' },
  { week: 31, key: 'copa_brasil', label: 'Copa do Brasil · quartas (eliminado)' },
  ...SUL_AM.map((w) => ({ week: w, key: 'conmebol_sul_americana', label: 'Sul-Americana' })),
]);

// Regional Serie A: no continental, Copa Brasil base pool (1ª → 2ª → 3ª, out)
const REGIONAL_A = buildWeekMap([
  { week: 6, key: 'copa_brasil', label: 'Copa do Brasil · 1ª Fase' },
  { week: 9, key: 'copa_brasil', label: 'Copa do Brasil · 2ª Fase' },
  { week: 12, key: 'copa_brasil', label: 'Copa do Brasil · 3ª Fase (eliminado)' },
]);

// Serie B: 34 weekends of Regional B + Preliminar Copa do Brasil (eliminated)
const SERIE_B = buildWeekMap([
  { week: 3, key: 'copa_brasil', label: 'Copa do Brasil · Preliminar (eliminado)' },
]);

export const ARCHETYPES = {
  'elite-finalista': {
    slug: 'elite-finalista',
    label: 'Elite finalista',
    subtitle: 'Copa dos Campeões finalista + Libertadores + Copa do Brasil finalista',
    totalGames: 63,
    comparacao: { atual: 75, delta: '−16%' },
    exemplos: 'Botafogo em 2024 (75 jogos)',
    mdsMap: ELITE_FINALISTA,
    hasLigaRegional: true,
  },
  'sul-americana': {
    slug: 'sul-americana',
    label: 'Vaga Sul-Americana',
    subtitle: 'Regional Série A · Copa dos Campeões grupos · Copa do Brasil (bypass) · Sul-Americana garantida',
    totalGames: 51,
    comparacao: { atual: 65, delta: '−22%' },
    exemplos: 'O melhor clube da região que não sobe à Libertadores',
    mdsMap: SUL_AM_ARCHETYPE,
    hasLigaRegional: true,
  },
  'regional-a': {
    slug: 'regional-a',
    label: 'Regional Série A',
    subtitle: 'Regional Série A · Copa do Brasil pelo funil da base · sem competição continental',
    totalGames: 37,
    comparacao: { atual: 55, delta: '−33%' },
    exemplos: 'Meio de tabela da Liga Regional',
    mdsMap: REGIONAL_A,
    hasLigaRegional: true,
  },
  'serie-b': {
    slug: 'serie-b',
    label: 'Série B',
    subtitle: 'Regional Série B · Copa do Brasil Preliminar · calendário espalhado por 10 meses',
    totalGames: 35,
    comparacao: { atual: 13, delta: '+169%' },
    exemplos: 'Madureira em 2024 jogou 13 partidas em 3 meses. Aqui, 35 espalhados em 10.',
    mdsMap: SERIE_B,
    hasLigaRegional: true,
  },
};

export function calendarFor(archetype) {
  const arch = ARCHETYPES[archetype];
  if (!arch) return [];
  const weeks = [];
  for (let n = 1; n <= TOTAL_WEEKS; n++) {
    const fds = arch.hasLigaRegional && LIGA_WEEKS.includes(n)
      ? { key: 'liga_regional', label: 'Liga Regional' }
      : null;
    let mds = arch.mdsMap.get(n) ?? null;
    if (!mds && FIFA_MIDWEEKS.has(n)) mds = { key: 'fifa_pause', label: 'Data FIFA' };
    weeks.push({ n, sat: weekLabel(n).sat, fds, mds });
  }
  return weeks;
}
