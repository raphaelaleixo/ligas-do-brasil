import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

describe('regressão anti-baked-seed', () => {
  it('data/season-default.json não existe mais', () => {
    expect(existsSync('data/season-default.json')).toBe(false);
  });

  it('scripts/bake-default.js não existe mais', () => {
    expect(existsSync('scripts/bake-default.js')).toBe(false);
  });

  it('assets/js/season.js não existe mais', () => {
    expect(existsSync('assets/js/season.js')).toBe(false);
  });

  it('initial-data/teams.json não existe mais', () => {
    expect(existsSync('initial-data/teams.json')).toBe(false);
  });

  it('nenhum arquivo do site referencia season-default ou loadSeason', () => {
    const out = execSync(
      `grep -rn 'season-default\\|loadSeason' assets/ *.html package.json 2>/dev/null || true`,
      { encoding: 'utf8' }
    );
    expect(out.trim()).toBe('');
  });

  it('package.json não tem script "bake"', () => {
    const pkg = JSON.parse(execSync('cat package.json', { encoding: 'utf8' }));
    expect(pkg.scripts?.bake).toBeUndefined();
  });
});
