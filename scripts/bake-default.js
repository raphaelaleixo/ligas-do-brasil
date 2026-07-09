import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { simulateSeason } from '../src/sim/run.js';

// Default seed chosen by hand for its narrative under the NFL-style cross-group format:
// - Copa dos Campeões: Botafogo 2–0 Flamengo (Rio derby final)
// - Copa do Brasil:    São Paulo 1–0 Palmeiras (Choque-Rei)
// - Libertadores slot 1: Botafogo
const DEFAULT_SEED = 143;

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../data');
const outPath = resolve(outDir, 'season-default.json');

mkdirSync(outDir, { recursive: true });
const season = simulateSeason(DEFAULT_SEED);
writeFileSync(outPath, JSON.stringify(season));
console.log(`Baked ${outPath} (seed=${DEFAULT_SEED}, ${(JSON.stringify(season).length / 1024).toFixed(1)} KB)`);
