import { samplePoisson } from './poisson.js';

const BASE_LAMBDA = 1.3;
const RANKING_STEP = 0.15;
const HOME_BONUS = 0.20;
const MIN_LAMBDA = 0.15;
const MAX_LAMBDA = 5;

function clamp(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x));
}

export function simulateMatch({ rankingHome, rankingAway }, rng) {
  const diff = rankingHome - rankingAway;
  const lambdaHome = clamp(BASE_LAMBDA + RANKING_STEP * diff + HOME_BONUS, MIN_LAMBDA, MAX_LAMBDA);
  const lambdaAway = clamp(BASE_LAMBDA - RANKING_STEP * diff, MIN_LAMBDA, MAX_LAMBDA);
  return {
    golsCasa: samplePoisson(lambdaHome, rng),
    golsFora: samplePoisson(lambdaAway, rng),
  };
}
