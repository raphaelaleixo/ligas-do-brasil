// Reform's 2024-anchored calendar template. Purely structural — assigns fixture
// TYPES to weeks. No opponents, no scores.
//
// Week 1 starts on the weekend of Sat Jan 27, 2024 (real Brazilian season start).
// FIFA break weekends are excluded from Liga Regional; the 3 FIFA midweeks (14, 24, 34)
// lose only their midweek slot. June break normalized to a single FIFA window.

// 46 weeks: Sat Jan 27, 2024 through Sat Dec 7, 2024. Closes with the reform's
// Copa dos Campeões final one week AFTER Libertadores — respects Conmebol's
// fixed continental dates and gives the domestic "national title" the last
// word instead of colliding with Sul-Americana on the same Saturday.
const TOTAL_WEEKS = 46;

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
// Rest weekends: pre-season warm-up (week 1) + a couple of mid-season pauses.
// Weeks 42, 44, 45, 46 are dark for Liga Regional so the CB → Sul-Am → Lib → CC
// finals sequence owns them (weekly override via FINAIS). The Liga última rodada
// itself lives on week 43 (Nov 16), sandwiched between CB final (9 nov) and the
// continental finals so no archetype has a 3-week gap before Sul-Am/Libertadores.
const REST_WEEKENDS = new Set([1, 14, 25, 42, 44, 45, 46]);
// Liga Regional lands on the weekends left after FIFA + rest.
// Design intent: 34 rounds spread through the whole year, LAST round on week 43
// (16 nov), following the Copa do Brasil final on the previous Saturday.
const LIGA_WEEKS = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)
  .filter((n) => !FIFA_BREAKS.has(n) && !REST_WEEKENDS.has(n));

// Cup calendar — Libertadores anchored to real Botafogo 2024 dates:
//   Grupos: 3-4, 10-11 abr; 24 abr; 8 mai; 16 mai; 28 mai
//   Oitavas: 13/22 ago (vs Palmeiras)
//   Quartas: 17/24 set
//   Semis: 23/30 out
//   Final: 30 nov (single-leg, Buenos Aires) — WEEKEND game
// Copa dos Campeões final placed a week before Libertadores final for the
// "national championship" drama. Copa do Brasil final placed a week earlier
// still, so November has content every week for the elite finalist.
const CC_GRUPOS = [3, 5, 7, 9, 12, 17];   // grupos + cruzadas (Fev–Mai)
// Copa dos Campeões: 4 KO midweeks (16-avos → semis), final is a WEEKEND (see FINAIS)
const CC_KO_MIDWEEKS = [22, 25, 30, 32];
const CB_BASE   = [4, 6, 14, 19];         // Preliminar, 1ª, 2ª, 3ª (Fev–Mai)
// Copa do Brasil: 4 KO midweeks (16-avos → semis), final is a WEEKEND
const CB_KO_MIDWEEKS = [21, 26, 33, 37];
// Libertadores midweeks matching real 2024 Botafogo dates
const LIB_MIDWEEKS = [10, 11, 13, 15, 16, 18, 28, 29, 34, 35, 39, 40];
// Sul-Americana midweeks matching real 2024 Sul-Am schedule for a finalist path:
//   Grupos: same window as Libertadores group stage (Apr–May)
//   R16 ida/volta: 14 / 21 ago  → weeks 29, 30
//   Quartas: 17 / 24 set        → weeks 34, 35
//   Semis: 22 / 29 out          → weeks 39, 40
// (Real Sul-Am final is Sat 23 nov = week 44 weekend — handled by FINAIS below)
const SUL_AM_MIDWEEKS = [10, 11, 13, 15, 16, 18, 29, 30, 34, 35, 39, 40];

// Weekend finals — five consecutive Saturdays close the season.
// Conmebol dates (Sul-Am 23 nov, Libertadores 30 nov) are fixed by Conmebol.
// The reform slots its own finals (CB, CC) around them, ending with Copa dos
// Campeões — the Brasileirão em formato de Libertadores — on Sat 7 Dez as the finale.
const FINAIS = {
  copa_brasil:    { week: 42, key: 'copa_brasil',           label: 'Copa do Brasil · final (9 nov)' },
  liga_regional:  { week: 43, key: 'liga_regional',         label: 'Liga Regional · última rodada (16 nov)' },
  sul_americana:  { week: 44, key: 'conmebol_sul_americana',label: 'Sul-Americana · final (23 nov)' },
  libertadores:   { week: 45, key: 'conmebol_libertadores', label: 'Libertadores · final (30 nov)' },
  copa_campeoes:  { week: 46, key: 'copa_campeoes',         label: 'Copa dos Campeões · final (7 dez)' },
};

// Which fixture types are eligible for each week under each archetype.
// Value = a label for the mds slot (fds is always liga_regional for weeks 1-34).
function buildWeekMap(rounds) {
  const map = new Map();
  for (const { week, key, label } of rounds) map.set(week, { key, label });
  return map;
}

const LIB_KO_LABELS = ['grupo 1','grupo 2','grupo 3','grupo 4','grupo 5','grupo 6','oitavas ida','oitavas volta','quartas ida','quartas volta','semis ida','semis volta'];
const CC_KO_LABELS  = ['16-avos','oitavas','quartas','semis'];
const CB_KO_LABELS  = ['16-avos','oitavas','quartas','semis'];
const ELITE_FINALISTA = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${CC_KO_LABELS[i]}` })),
  ...CB_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_brasil', label: `Copa do Brasil · ${CB_KO_LABELS[i]}` })),
  ...LIB_MIDWEEKS.map((w, i) => ({ week: w, key: 'conmebol_libertadores', label: `Libertadores · ${LIB_KO_LABELS[i]}` })),
]);

// Sul-Am archetype: regional Serie A + Copa dos Campeões grupos + Copa do Brasil
// bypass (eliminated quartas) + Sul-Am finalist path.
const SUL_AM_LABELS = ['grupo 1','grupo 2','grupo 3','grupo 4','grupo 5','grupo 6','R16 ida','R16 volta','quartas ida','quartas volta','semis ida','semis volta'];
const SUL_AM_ARCHETYPE = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  // Copa Brasil: bypass to 16-avos, wins to oitavas, loses in quartas — 3 games
  { week: 21, key: 'copa_brasil', label: 'Copa do Brasil · 16-avos' },
  { week: 26, key: 'copa_brasil', label: 'Copa do Brasil · oitavas' },
  { week: 33, key: 'copa_brasil', label: 'Copa do Brasil · quartas (eliminado)' },
  ...SUL_AM_MIDWEEKS.map((w, i) => ({ week: w, key: 'conmebol_sul_americana', label: `Sul-Americana · ${SUL_AM_LABELS[i]}` })),
]);

// Regional Serie A: no continental, Copa Brasil base pool (1ª → 2ª → 3ª, out)
// Clube regional: 34 Liga Regional + 1 Preliminar Copa do Brasil (eliminado no 1º jogo).
// Total ≈ 35 jogos, mesmo número usado no card do Madureira no gráfico da home.
const REGIONAL_A = buildWeekMap([
  { week: 3, key: 'copa_brasil', label: 'Copa do Brasil · Preliminar (eliminado)' },
]);

// Só ligas + copas nacionais: Copa dos Campeões (finalista) + Copa do Brasil (via bypass Conmebol
// se qualificado, ou pelo funil). Sem competição continental.
const NATIONAL_ONLY = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${CC_KO_LABELS[i]}` })),
  ...CB_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_brasil', label: `Copa do Brasil · ${CB_KO_LABELS[i]}` })),
]);

export const ARCHETYPES = {
  'copas-nacionais-e-internacionais': {
    slug: 'copas-nacionais-e-internacionais',
    label: 'Copas nacionais e internacionais',
    subtitle: 'Liga Regional + Copa dos Campeões + Copa do Brasil + Libertadores. O clube que joga tudo.',
    totalGames: 63,
    comparacao: { atual: 75, delta: '−16%' },
    exemplos: 'Botafogo em 2024 — campeão brasileiro e da Libertadores (75 jogos).',
    mdsMap: ELITE_FINALISTA,
    hasLigaRegional: true,
    weekendFinals: ['liga_regional', 'copa_brasil', 'copa_campeoes', 'libertadores'],
  },
  'ligas-e-copas-nacionais': {
    slug: 'ligas-e-copas-nacionais',
    label: 'Ligas e copas nacionais',
    subtitle: 'Liga Regional + Copa dos Campeões + Copa do Brasil. Sem competição continental.',
    totalGames: 50,
    comparacao: { atual: 60, delta: '−17%' },
    exemplos: 'Clube que se qualifica à Copa dos Campeões mas fica fora do continental.',
    mdsMap: NATIONAL_ONLY,
    hasLigaRegional: true,
    weekendFinals: ['liga_regional', 'copa_brasil', 'copa_campeoes'],
  },
  'calendario-regional': {
    slug: 'calendario-regional',
    label: 'Calendário regional',
    subtitle: 'Liga Regional + Copa do Brasil pelo funil da base. Sem competição nacional ou continental.',
    totalGames: 35,
    comparacao: { atual: 13, delta: '+169%' },
    exemplos: 'Madureira em 2024 — 13 partidas, todas entre janeiro e abril.',
    mdsMap: REGIONAL_A,
    hasLigaRegional: true,
    weekendFinals: ['liga_regional'],
  },
};

export function calendarFor(archetype) {
  const arch = ARCHETYPES[archetype];
  if (!arch) return [];
  // Build a lookup of which weekend-final competitions this archetype reaches
  const finalsByWeek = new Map();
  for (const compKey of arch.weekendFinals ?? []) {
    const f = FINAIS[compKey];
    if (f) finalsByWeek.set(f.week, f);
  }
  const weeks = [];
  for (let n = 1; n <= TOTAL_WEEKS; n++) {
    if (FIFA_BREAKS.has(n)) {
      weeks.push({
        n, sat: weekLabel(n).sat,
        fds: { key: 'fifa_pause', label: 'Data FIFA' },
        mds: { key: 'fifa_pause', label: 'Data FIFA' },
      });
      continue;
    }
    // Weekend: either a weekend final (last 4 weeks) or Liga Regional round
    let fds = finalsByWeek.get(n) ?? null;
    if (!fds && arch.hasLigaRegional && LIGA_WEEKS.includes(n)) {
      fds = { key: 'liga_regional', label: 'Liga Regional' };
    }
    const mds = arch.mdsMap.get(n) ?? null;
    weeks.push({ n, sat: weekLabel(n).sat, fds, mds });
  }
  return weeks;
}
