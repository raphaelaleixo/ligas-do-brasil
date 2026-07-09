// Reform's 2024-anchored calendar template. Purely structural — assigns fixture
// TYPES to weeks. No opponents, no scores.
//
// Week 1 starts on the weekend of Sat Jan 27, 2024 (real Brazilian season start).
// FIFA break weekends are excluded from Liga Regional; the 3 FIFA midweeks (14, 24, 34)
// lose only their midweek slot. June break normalized to a single FIFA window.

// 45 weeks: Sat Jan 27, 2024 through Sat Nov 30, 2024. Long enough to hold
// the real 2024 Libertadores final (Botafogo 3-1 Atlético-MG in Buenos Aires).
const TOTAL_WEEKS = 45;

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

// FIFA breaks — full weeks lost to national-team dates (real 2024 windows,
// June Copa América normalized to a single window). Both weekend and midweek
// slots go dark on these weeks.
export const FIFA_BREAKS = new Set([8, 20, 31, 36, 41]);
export const FIFA_MIDWEEKS = FIFA_BREAKS;
// Rest weekends: mid-season pauses + end-of-season rest for base clubs.
// Continental competitions can still happen (e.g., Libertadores final on week 45).
const REST_WEEKENDS = new Set([14, 25, 42, 43, 44]);
// The 34 Liga Regional rounds land on the weekends left after FIFA + rest.
const LIGA_WEEKS = Array.from({ length: 45 }, (_, i) => i + 1)
  .filter((n) => !FIFA_BREAKS.has(n) && !REST_WEEKENDS.has(n));

// Cup calendar — Libertadores anchored to real Botafogo 2024 dates:
//   Grupos: 3-4, 10-11 abr; 24 abr; 8 mai; 16 mai; 28 mai
//   Oitavas: 13/22 ago (vs Palmeiras)
//   Quartas: 17/24 set
//   Semis: 23/30 out
//   Final: 30 nov (single-leg, Buenos Aires) — WEEKEND game
const CC_GRUPOS = [3, 5, 7, 9, 11, 13];         // 3 in-group + 3 cross-group (Fev–Abr)
const CC_KO     = [17, 22, 27, 32, 39];         // 16-avos → final (Mai–Out)
const CB_BASE   = [4, 6, 10, 12];               // Preliminar, 1ª, 2ª, 3ª (Fev–Mar)
const CB_KO     = [19, 24, 29, 34, 40];         // 16-avos → final (elite bypass, Mai–Nov)
// Libertadores — midweeks matching real 2024 Botafogo dates
const LIB_MIDWEEKS = [10, 11, 13, 15, 16, 18, 28, 29, 34, 35, 39, 40]; // 12 midweeks
// Libertadores final is 30 nov 2024 — Saturday, weekend slot on week 45
const LIB_FINAL_WEEK = 45;
const SUL_AM        = [4, 16, 18, 25, 28, 33, 37, 40];

// Which fixture types are eligible for each week under each archetype.
// Value = a label for the mds slot (fds is always liga_regional for weeks 1-34).
function buildWeekMap(rounds) {
  const map = new Map();
  for (const { week, key, label } of rounds) map.set(week, { key, label });
  return map;
}

const LIB_KO_LABELS = ['grupo 1','grupo 2','grupo 3','grupo 4','grupo 5','grupo 6','oitavas ida','oitavas volta','quartas ida','quartas volta','semis ida','semis volta'];
const ELITE_FINALISTA = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${['16-avos','oitavas','quartas','semis','final'][i]}` })),
  ...CB_KO.map((w, i) => ({ week: w, key: 'copa_brasil', label: `Copa do Brasil · ${['16-avos','oitavas','quartas','semis','final'][i]}` })),
  ...LIB_MIDWEEKS.map((w, i) => ({ week: w, key: 'conmebol_libertadores', label: `Libertadores · ${LIB_KO_LABELS[i]}` })),
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
    // FIFA break: both slots dark
    if (FIFA_BREAKS.has(n)) {
      weeks.push({
        n, sat: weekLabel(n).sat,
        fds: { key: 'fifa_pause', label: 'Data FIFA' },
        mds: { key: 'fifa_pause', label: 'Data FIFA' },
      });
      continue;
    }
    // Weekend
    let fds = arch.hasLigaRegional && LIGA_WEEKS.includes(n)
      ? { key: 'liga_regional', label: 'Liga Regional' }
      : null;
    // Special: Libertadores final on week 45 weekend (only Elite finalist)
    if (n === LIB_FINAL_WEEK && archetype === 'elite-finalista') {
      fds = { key: 'conmebol_libertadores', label: 'Libertadores · final (30 nov)' };
    }
    const mds = arch.mdsMap.get(n) ?? null;
    weeks.push({ n, sat: weekLabel(n).sat, fds, mds });
  }
  return weeks;
}
