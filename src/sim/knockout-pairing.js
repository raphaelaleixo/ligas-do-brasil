import { simulateMatch } from './match.js';
import { getTeamById } from '../data/teams.js';

// Plays a cup confrontation between two clubs.
// - twoLegs=true: two legs, home swaps in leg 2. Winner = higher aggregate.
//   Aggregate-tied → coin flip via rng (no away-goals rule).
// - twoLegs=false: single leg. Draw → coin flip.
//
// The returned pairing keeps a bracket-friendly top-level shape
// (casaId/foraId/golsCasa/golsFora/vencedorId) where the goals are aggregates,
// and a `legs` array with per-leg detail (calendar consumes each leg as a
// separate slot).
export function playCupPairing(homeId, awayId, rng, { competicao, rodada, twoLegs }) {
  const home = getTeamById(homeId);
  const away = getTeamById(awayId);

  const leg1 = simulateMatch(
    { rankingHome: home.ranking_forca, rankingAway: away.ranking_forca },
    rng
  );

  if (!twoLegs) {
    let vencedorId;
    if (leg1.golsCasa > leg1.golsFora) vencedorId = homeId;
    else if (leg1.golsCasa < leg1.golsFora) vencedorId = awayId;
    else vencedorId = rng() < 0.5 ? homeId : awayId;
    return {
      competicao, rodada,
      casaId: homeId, foraId: awayId,
      golsCasa: leg1.golsCasa, golsFora: leg1.golsFora,
      vencedorId,
      legs: [{ casaId: homeId, foraId: awayId, golsCasa: leg1.golsCasa, golsFora: leg1.golsFora }],
    };
  }

  const leg2 = simulateMatch(
    { rankingHome: away.ranking_forca, rankingAway: home.ranking_forca },
    rng
  );

  const homeAgg = leg1.golsCasa + leg2.golsFora;
  const awayAgg = leg1.golsFora + leg2.golsCasa;

  let vencedorId;
  if (homeAgg > awayAgg) vencedorId = homeId;
  else if (homeAgg < awayAgg) vencedorId = awayId;
  else vencedorId = rng() < 0.5 ? homeId : awayId;

  return {
    competicao, rodada,
    casaId: homeId, foraId: awayId,
    golsCasa: homeAgg, golsFora: awayAgg,
    vencedorId,
    legs: [
      { casaId: homeId, foraId: awayId, golsCasa: leg1.golsCasa, golsFora: leg1.golsFora },
      { casaId: awayId, foraId: homeId, golsCasa: leg2.golsCasa, golsFora: leg2.golsFora },
    ],
  };
}
