// Reform's 2024-anchored calendar template. Purely structural — assigns fixture
// TYPES to weeks. No opponents, no scores.
//
// Week 1 is a pre-season ramp week (no games) starting Sat Jan 20, 2024. The
// real Brazilian season start (Sat Jan 27, 2024) now lands on week 2. FIFA
// break weekends are excluded from Liga Regional; FIFA midweeks lose only
// their midweek slot. June break normalized to a single FIFA window.

// 47 weeks: Sat Jan 20, 2024 through Sat Dec 7, 2024. Closes with the reform's
// Copa dos Campeões final one week AFTER Libertadores — respects Conmebol's
// fixed continental dates and gives the domestic "national title" the last
// word instead of colliding with Sul-Americana on the same Saturday.
const TOTAL_WEEKS = 47;

// Approximate real 2024 Saturday date for each week (Jan 20 + N weeks — week 1
// is the pre-season ramp, so week 2 lands on the real Jan 27 season start).
function saturdayForWeek(n) {
  const start = new Date(Date.UTC(2024, 0, 20));
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
// slots go dark on these weeks. (Old weeks {8,20,31,36,41} shifted +1 to keep
// the real calendar dates fixed under the new week-1 ramp.)
export const FIFA_BREAKS = new Set([9, 21, 32, 37, 42]);
export const FIFA_MIDWEEKS = FIFA_BREAKS;
// Rest weekends: pre-season ramp (week 1, NEW) + pre-season warm-up (week 2,
// old week 1) + a couple of mid-season pauses + the four non-Liga finals
// weeks (Copa do Brasil, Sul-Americana, Libertadores, Copa dos Campeões).
// The Liga última rodada itself lives on week 44 (16 nov), sandwiched between
// the CB final (9 nov) and the continental finals so no archetype has a
// 3-week gap before Sul-Am/Libertadores. (Old weeks {1,14,25,42,44,45,46}
// shifted +1, plus the new ramp week 1.)
const REST_WEEKENDS = new Set([1, 2, 15, 26, 43, 45, 46, 47]);
// Liga Regional lands on the weekends left after FIFA + rest.
// Design intent: 34 rounds spread through the whole year, LAST round on week 44
// (16 nov), following the Copa do Brasil final on the previous Saturday.
const LIGA_WEEKS = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1)
  .filter((n) => !FIFA_BREAKS.has(n) && !REST_WEEKENDS.has(n));

// Cup calendar — Libertadores anchored to real Botafogo 2024 dates (weeks
// shifted +1 from the pre-reform template to keep the real dates fixed):
//   Grupos: 3-4, 10-11 abr; 24 abr; 8 mai; 16 mai; 28 mai
//   Oitavas: 13/22 ago (vs Palmeiras)
//   Quartas: 17/24 set
//   Semis: 23/30 out
//   Final: 30 nov (single-leg, Buenos Aires) — WEEKEND game
// Copa dos Campeões final placed a week before Libertadores final for the
// "national championship" drama. Copa do Brasil final placed a week earlier
// still, so November has content every week for the elite finalist.
const CC_GRUPOS = [4, 6, 8, 10, 13, 18];   // grupos + cruzadas (Fev–Mai)
// Copa dos Campeões: 8 KO midweeks, ida-e-volta (16-avos → semis). Pulled
// ahead of the Libertadores KO stretch (16-avos/oitavas); only quartas/semis
// overlap the Lib window. Final is a WEEKEND (see FINAIS).
const CC_KO_MIDWEEKS = [20, 22, 24, 26, 28, 31, 33, 34];
const CB_BASE   = [4, 6, 14, 19];         // Preliminar, 1ª, 2ª, 3ª (Fev–Mai) — dead code, pre-existing
// Copa do Brasil: 8 KO midweeks, ida-e-volta (16-avos → semis), starting
// after the CC 16-avos (feeder: the elite side that fell out of the CC
// 16-avos drops into the CB bracket there). Final is a WEEKEND.
const CB_KO_MIDWEEKS = [23, 25, 27, 28, 31, 33, 34, 38];
// Libertadores midweeks matching real 2024 Botafogo dates (shifted +1 from
// the pre-reform template to keep the real dates fixed under the new ramp week).
const LIB_MIDWEEKS = [11, 12, 14, 16, 17, 19, 29, 30, 35, 36, 40, 41];

// Weekend finals — five consecutive Saturdays close the season.
// Conmebol dates (Sul-Am 23 nov, Libertadores 30 nov) are fixed by Conmebol.
// The reform slots its own finals (CB, CC) around them, ending with Copa dos
// Campeões — the Brasileirão em formato de Libertadores — on Sat 7 Dez as the finale.
const FINAIS = {
  copa_brasil:    { week: 43, key: 'copa_brasil',           label: 'Copa do Brasil · final (9 nov)' },
  liga_regional:  { week: 44, key: 'liga_regional',         label: 'Liga Regional · última rodada (16 nov)' },
  sul_americana:  { week: 45, key: 'conmebol_sul_americana',label: 'Sul-Americana · final (23 nov)' },
  libertadores:   { week: 46, key: 'conmebol_libertadores', label: 'Libertadores · final (30 nov)' },
  copa_campeoes:  { week: 47, key: 'copa_campeoes',         label: 'Copa dos Campeões · final (7 dez)' },
};

// Which fixture types are eligible for each week under each archetype.
// Value = a label for the mds slot (fds is always liga_regional for weeks 1-34).
function buildWeekMap(rounds) {
  const map = new Map();
  for (const { week, key, label } of rounds) map.set(week, { key, label });
  return map;
}

const LIB_KO_LABELS = ['grupo 1','grupo 2','grupo 3','grupo 4','grupo 5','grupo 6','oitavas ida','oitavas volta','quartas ida','quartas volta','semis ida','semis volta'];
const CC_KO_LABELS  = ['16-avos ida','16-avos volta','oitavas ida','oitavas volta','quartas ida','quartas volta','semis ida','semis volta'];
const CB_KO_LABELS  = ['16-avos ida','16-avos volta','oitavas ida','oitavas volta','quartas ida','quartas volta','semis ida','semis volta'];

// "O clube mais sobrecarregado" (copas-nacionais-e-internacionais): caiu nos
// 16-avos da Copa dos Campeões (2 pernas, eliminado), foi à final da Copa do
// Brasil (bracket completo ida-volta, feeder pelo funil da CC), e disputou a
// Libertadores até o fim. Sem final de Copa dos Campeões — foi eliminado.
const ELITE_CAIDO = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO_MIDWEEKS.slice(0, 2).map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${CC_KO_LABELS[i]} (eliminado)` })),
  ...CB_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_brasil', label: `Copa do Brasil · ${CB_KO_LABELS[i]}` })),
  ...LIB_MIDWEEKS.map((w, i) => ({ week: w, key: 'conmebol_libertadores', label: `Libertadores · ${LIB_KO_LABELS[i]}` })),
]);

// "Campeão nacional + Libertadores" (campeao-nacional): vence a Copa dos
// Campeões (bracket completo ida-volta) e disputa a Libertadores até o fim —
// o caminho do Botafogo. Sem Copa do Brasil.
const CAMPEAO_NACIONAL = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${CC_KO_LABELS[i]}` })),
  ...LIB_MIDWEEKS.map((w, i) => ({ week: w, key: 'conmebol_libertadores', label: `Libertadores · ${LIB_KO_LABELS[i]}` })),
]);

// Só ligas + copas nacionais (ligas-e-copas-nacionais): finalista da Copa dos
// Campeões (bracket completo ida-volta). Sem Copa do Brasil, sem competição
// continental.
const NATIONAL_ONLY = buildWeekMap([
  ...CC_GRUPOS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${i < 3 ? 'grupo' : 'cruzada'} R${(i % 3) + 1}` })),
  ...CC_KO_MIDWEEKS.map((w, i) => ({ week: w, key: 'copa_campeoes', label: `Copa dos Campeões · ${CC_KO_LABELS[i]}` })),
]);

// Regional Série A: no continental, no Copa dos Campeões — Copa do Brasil via
// funil da base, eliminado na Preliminar (agora ida-e-volta).
// Clube regional: 34 Liga Regional + 2 Preliminar Copa do Brasil (ida-volta,
// eliminado). Total = 36 jogos, mesmo número usado no card do Madureira no
// gráfico da home.
const REGIONAL_A = buildWeekMap([
  { week: 3, key: 'copa_brasil', label: 'Copa do Brasil · Preliminar ida (eliminado)' },
  { week: 5, key: 'copa_brasil', label: 'Copa do Brasil · Preliminar volta (eliminado)' },
]);

export const ARCHETYPES = {
  'copas-nacionais-e-internacionais': {
    slug: 'copas-nacionais-e-internacionais',
    label: 'O clube mais sobrecarregado',
    subtitle: 'Caiu nos 16-avos da Copa dos Campeões, foi à final da Copa do Brasil, e disputou a Libertadores. O teto do sistema.',
    totalGames: 64,
    comparacao: { atual: 75, delta: '−15%' },
    exemplos: 'A campanha mais longa que o formato permite.',
    mdsMap: ELITE_CAIDO,
    hasLigaRegional: true,
    weekendFinals: ['liga_regional', 'copa_brasil', 'libertadores'],
  },
  'campeao-nacional': {
    slug: 'campeao-nacional',
    label: 'Campeão nacional + Libertadores',
    subtitle: 'Vence a Copa dos Campeões e disputa a Libertadores até o fim — o caminho do Botafogo.',
    totalGames: 62,
    comparacao: { atual: 75, delta: '−17%' },
    exemplos: 'Botafogo em 2024 fez 75 por caminhos diferentes; aqui o bicampeão joga 62.',
    mdsMap: CAMPEAO_NACIONAL,
    hasLigaRegional: true,
    weekendFinals: ['liga_regional', 'copa_campeoes', 'libertadores'],
  },
  'ligas-e-copas-nacionais': {
    slug: 'ligas-e-copas-nacionais',
    label: 'Ligas e copas nacionais',
    subtitle: 'Finalista da Copa dos Campeões, sem competição continental.',
    totalGames: 49,
    comparacao: { atual: 60, delta: '−18%' },
    exemplos: 'Clube que vai à final da Copa dos Campeões mas ficou fora do continental.',
    mdsMap: NATIONAL_ONLY,
    hasLigaRegional: true,
    weekendFinals: ['liga_regional', 'copa_campeoes'],
  },
  'calendario-regional': {
    slug: 'calendario-regional',
    label: 'Calendário regional',
    subtitle: 'Liga Regional + Copa do Brasil pelo funil da base. Sem competição nacional ou continental.',
    totalGames: 36,
    comparacao: { atual: 13, delta: '+177%' },
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
    // Weekend: either a weekend final (last 5 weeks) or Liga Regional round
    let fds = finalsByWeek.get(n) ?? null;
    if (!fds && arch.hasLigaRegional && LIGA_WEEKS.includes(n)) {
      fds = { key: 'liga_regional', label: 'Liga Regional' };
    }
    const mds = arch.mdsMap.get(n) ?? null;
    weeks.push({ n, sat: weekLabel(n).sat, fds, mds });
  }
  return weeks;
}
