import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('ligas.js source is decoupled from the baked season', () => {
  const src = readFileSync('assets/js/pages/ligas.js', 'utf8');

  it('does not import from season.js', () => {
    expect(src).not.toMatch(/from\s+['"][^'"]*season\.js/);
  });

  it('does not call loadSeason', () => {
    expect(src).not.toMatch(/loadSeason\s*\(/);
  });

  it('imports getAllTeams from src/data/teams.js', () => {
    expect(src).toMatch(/import\s*\{[^}]*getAllTeams[^}]*\}\s*from\s+['"][^'"]*data\/teams\.js['"]/);
  });
});
