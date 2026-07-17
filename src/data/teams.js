import teamsRaw from './teams-raw.js';
import { createRng } from '../sim/rng.js';

// Canonical 3-letter IDs for well-known clubs. Anything not in this map falls back to a derived ID.
const CANONICAL_IDS = {
  'Palmeiras': 'PAL', 'São Paulo': 'SAO', 'Corinthians': 'COR', 'Santos': 'SAN',
  'Red Bull Bragantino': 'RBB', 'Novorizontino': 'NOV', 'Mirassol': 'MIR',
  'Flamengo': 'FLA', 'Botafogo': 'BOT', 'Fluminense': 'FLU', 'Vasco da Gama': 'VAS',
  'Fortaleza': 'FOR', 'Bahia': 'BAH', 'Ceará': 'CEA', 'Vitória': 'VIT', 'Sport Recife': 'SPT',
  'Internacional': 'INT', 'Grêmio': 'GRE', 'Athletico-Paranaense': 'CAP',
  'Cruzeiro': 'CRU', 'Atlético-MG': 'CAM', 'América-MG': 'AMG', 'Goiás': 'GOI',
};

function deriveId(name, taken) {
  const clean = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let base = clean.slice(0, 3);
  if (!taken.has(base)) return base;
  for (let i = 1; i < 100; i++) {
    const alt = base.slice(0, 2) + i.toString(36).toUpperCase();
    if (!taken.has(alt)) return alt;
  }
  throw new Error(`Cannot derive unique ID for ${name}`);
}

function seededSerieB(ligaName, count) {
  // Deterministic pseudo-hash from the league name to seed placeholder rankings.
  let seed = 0;
  for (const c of ligaName) seed = ((seed * 31) + c.charCodeAt(0)) >>> 0;
  const rng = createRng(seed);
  const clubes = [];
  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(2, '0');
    const ranking = 1 + Math.floor(rng() * 4); // 1..4
    clubes.push({
      nome: `${ligaName.replace(/^Liga /, '')} B-${num}`,
      estado: '—',
      ranking_forca: ranking,
      divisao: 'B',
    });
  }
  return clubes;
}

function normalizeLigaKey(nome) {
  return nome.split('(')[0].trim();
}

let _ligas = null;
let _byId = null;

function build() {
  const raw = teamsRaw;
  // Pre-reserve all canonical IDs so that non-canonical clubs whose names happen
  // to derive to a canonical ID (e.g., Botafogo-SP → BOT) don't steal it.
  const taken = new Set(Object.values(CANONICAL_IDS));
  const ligas = raw.ligas.map((liga) => {
    const nome = normalizeLigaKey(liga.nome);
    const serieA = liga.clubes.map((c) => {
      const id = CANONICAL_IDS[c.nome] ?? deriveId(c.nome, taken);
      taken.add(id);
      return {
        id,
        nome: c.nome,
        estado: c.estado,
        ranking_forca: c.ranking,
        divisao: 'A',
        liga_regional: nome,
      };
    });
    const serieB = seededSerieB(nome, 14).map((c) => {
      const id = deriveId(c.nome, taken);
      taken.add(id);
      return { ...c, id, liga_regional: nome };
    });
    return { nome, clubes: [...serieA, ...serieB] };
  });
  const byId = new Map();
  for (const l of ligas) for (const c of l.clubes) byId.set(c.id, c);
  return { ligas, byId };
}

function ensure() {
  if (!_ligas) {
    const { ligas, byId } = build();
    _ligas = ligas;
    _byId = byId;
  }
}

export function getLeagues() {
  ensure();
  return _ligas;
}
export function getAllTeams() {
  ensure();
  return _ligas.flatMap((l) => l.clubes);
}
export function getTeamById(id) {
  ensure();
  return _byId.get(id);
}
