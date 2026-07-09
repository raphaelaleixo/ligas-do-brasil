import { createRng } from './rng.js';
import { seedYearZero } from './seeding.js';
import { simulateAllRegionalLeagues } from './regional-league.js';
import { buildPots, drawGroups, simulateGroupStage, selectKnockoutQualifiers, simulateKnockout } from './copa-campeoes.js';
import { buildParticipantPool, simulateFunnel, simulateMataMata } from './copa-brasil.js';
import { allocateConmebolSlots } from './conmebol.js';
import { assignCalendar } from './calendar.js';
import { computePerfis } from './perfis.js';
import { getAllTeams, getLeagues } from '../data/teams.js';

const META = {
  totalClubes: 192,
  tetoJogos: 63,
  mesesGarantidos: 10,
  desempregadosEmAbril: 0,
  reducaoVoos: '>50%',
  semanasUtilizaveis: 42,
  semanasRodadaDupla: 21,
  semanasRodadaSimples: 21,
};

function ligaLookupFrom(qualificados) {
  const map = new Map();
  for (const l of qualificados) for (const id of l.qualificadosCampeoes) map.set(id, l.nome);
  return map;
}

function computeKOReach(matamata) {
  // Score = furthest round survived. Higher is better.
  // Group-only clubs never appear here → default to 1 downstream.
  const scores = { '16avos': 2, 'oitavas': 3, 'quartas': 4, 'semis': 5 };
  const reach = new Map();
  const bump = (id, s) => reach.set(id, Math.max(reach.get(id) ?? 0, s));
  for (const [round, s] of Object.entries(scores)) {
    for (const m of matamata[round]) { bump(m.casaId, s); bump(m.foraId, s); }
  }
  // Final (both finalists reach = 6)
  bump(matamata.final.casaId, 6);
  bump(matamata.final.foraId, 6);
  return reach;
}

/**
 * "Melhor campanha geral" = order by how deep a club went in the KO (semifinalist
 * outranks quarter-finalist outranks oitavas outranks 16-avos outranks group-only),
 * tiebroken by group-stage table (pontos > SG > GP > name). Fixes the artefact
 * where a club with an easy group but zero KO progression outranks a legit
 * quarter-finalist.
 */
function campanhaGeral(grupos, matamata) {
  const reach = computeKOReach(matamata);
  const rows = grupos.flatMap((g) => g.tabela);
  return rows
    .slice()
    .sort((a, b) => {
      const ra = reach.get(a.id) ?? 1;
      const rb = reach.get(b.id) ?? 1;
      if (rb !== ra) return rb - ra;
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
      if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
      if (a.nome < b.nome) return -1;
      if (a.nome > b.nome) return 1;
      return 0;
    })
    .map((r) => r.id);
}

export function simulateSeason(seed) {
  const rng = createRng(seed);
  const seeded = seedYearZero();

  const regional = simulateAllRegionalLeagues({ rng });

  const pots = buildPots(regional.ligas);
  const lookup = ligaLookupFrom(regional.ligas);
  const groupsDrawn = drawGroups(pots, lookup, rng);
  const { grupos, crossGroupMatches } = simulateGroupStage(groupsDrawn, rng);
  const { top2, melhoresTerceiros } = selectKnockoutQualifiers(grupos);
  const clubes32Campeoes = [...top2.map((r) => ({ id: r.id })), ...melhoresTerceiros.map((r) => ({ id: r.id }))];
  const koCampeoes = simulateKnockout(clubes32Campeoes, rng);

  const pool = buildParticipantPool(seeded);
  const funnel = simulateFunnel(pool, rng);
  const koBrasil = simulateMataMata(pool.eliteBypass, funnel.qualificadosParaMataMata, rng);

  const conmebol = allocateConmebolSlots({
    copaCampeoes: {
      campeao: koCampeoes.campeao,
      vice: koCampeoes.vice,
      semifinalistas: koCampeoes.semifinalistas,
      campanhaGeral: campanhaGeral(grupos, koCampeoes),
    },
    copaBrasil: { campeao: koBrasil.campeao, vice: koBrasil.vice },
    ligasRegionais: regional.ligas,
  });

  const regionalMatches = regional.ligas.flatMap((l) => l.matches);
  const campeoesMatches = [
    ...grupos.flatMap((g) => g.jogos),
    ...crossGroupMatches,
    ...koCampeoes['16avos'].map((m) => ({ ...m, rodada: '16avos' })),
    ...koCampeoes.oitavas.map((m) => ({ ...m, rodada: 'oitavas' })),
    ...koCampeoes.quartas.map((m) => ({ ...m, rodada: 'quartas' })),
    ...koCampeoes.semis.map((m) => ({ ...m, rodada: 'semis' })),
    { ...koCampeoes.final, rodada: 'final' },
  ];
  const brasilMatches = [
    ...funnel.preliminar.matches,
    ...funnel.primeira.matches,
    ...funnel.segunda.matches,
    ...funnel.terceira.matches,
    ...koBrasil['16avos'],
    ...koBrasil.oitavas,
    ...koBrasil.quartas,
    ...koBrasil.semis,
    koBrasil.final,
  ];
  const clubIds = getAllTeams().map((t) => t.id);
  const calendar = assignCalendar({
    regionalLeagueMatches: regionalMatches,
    copaCampeoesMatches: campeoesMatches,
    copaBrasilMatches: brasilMatches,
    conmebolLibertadores: conmebol.libertadores,
    conmebolSulAmericana: conmebol.sulAmericana,
    clubIds,
  });

  const jogosPorClube = new Map();
  for (const id of clubIds) jogosPorClube.set(id, 0);
  for (const m of calendar.matchesGeral) {
    jogosPorClube.set(m.casaId, (jogosPorClube.get(m.casaId) ?? 0) + 1);
    jogosPorClube.set(m.foraId, (jogosPorClube.get(m.foraId) ?? 0) + 1);
  }
  const perfisDashboard = computePerfis({ clubIds, jogosPorClube });

  const rebaixadosSet = new Set(regional.ligas.flatMap((l) => l.rebaixados));
  const acessosSet = new Set(regional.ligas.flatMap((l) => l.acessos));
  const libSet = new Set(conmebol.libertadores);
  const sulSet = new Set(conmebol.sulAmericana);
  const clubes = getAllTeams().map((t) => {
    const liga = regional.ligas.find((l) => l.nome === t.liga_regional);
    const row = liga.tabelaA.find((r) => r.id === t.id) ?? liga.tabelaB.find((r) => r.id === t.id);
    // Calendar lives in top-level `calendariosPorClube` keyed by id; not duplicated here.
    return {
      id: t.id,
      nome: t.nome,
      estado: t.estado,
      liga_regional: t.liga_regional,
      divisao: t.divisao,
      ranking_forca: t.ranking_forca,
      estatisticas_temporada: row ? {
        jogos: row.jogos, vitorias: row.vitorias, empates: row.empates, derrotas: row.derrotas,
        golsPro: row.golsPro, golsContra: row.golsContra, saldoGols: row.saldoGols, pontos: row.pontos,
        posicaoLiga: row.posicao,
      } : null,
      status_ano_seguinte: {
        rebaixado: rebaixadosSet.has(t.id),
        acesso: acessosSet.has(t.id),
        libertadores: libSet.has(t.id),
        sul_americana: sulSet.has(t.id),
      },
    };
  });

  // Strip matches from each liga on output — they live in matchesGeral (filter by ligaNome).
  const ligasRegionaisSlim = regional.ligas.map(({ matches: _m, ...rest }) => rest);

  return {
    seed,
    meta: META,
    ligasRegionais: ligasRegionaisSlim,
    copaCampeoes: {
      potes: pots,
      grupos,
      matamata: koCampeoes,
    },
    copaBrasil: {
      eliteBypass: pool.eliteBypass,
      convidadoId: pool.convidadoId,
      funil: {
        preliminar: funnel.preliminar,
        primeira: funnel.primeira,
        segunda: funnel.segunda,
        terceira: funnel.terceira,
        luckyLosers: funnel.luckyLosers,
      },
      matamata: koBrasil,
    },
    conmebol,
    perfisDashboard,
    calendariosPorClube: calendar.calendariosPorClube,
    matchesGeral: calendar.matchesGeral,
    clubes,
  };
}
