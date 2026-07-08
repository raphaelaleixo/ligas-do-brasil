import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { simulateSeason } from '../src/sim/run.js';

// Default seed chosen by hand for its narrative: Botafogo lifts the Copa dos Campeões
// (5–1 vs Flamengo in the final) AND the Copa do Brasil in the same season.
// The site ships this pre-baked so the first-load story is on-brand.
const DEFAULT_SEED = 740;

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../data');
const outPath = resolve(outDir, 'season-default.json');

mkdirSync(outDir, { recursive: true });
const season = simulateSeason(DEFAULT_SEED);
writeFileSync(outPath, JSON.stringify(season));
console.log(`Baked ${outPath} (seed=${DEFAULT_SEED}, ${(JSON.stringify(season).length / 1024).toFixed(1)} KB)`);
