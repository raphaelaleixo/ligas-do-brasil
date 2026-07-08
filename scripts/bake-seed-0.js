import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { simulateSeason } from '../src/sim/run.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../data');
const outPath = resolve(outDir, 'season-seed-0.json');

mkdirSync(outDir, { recursive: true });
const season = simulateSeason(0);
writeFileSync(outPath, JSON.stringify(season));
console.log(`Baked ${outPath} (${(JSON.stringify(season).length / 1024).toFixed(1)} KB)`);
