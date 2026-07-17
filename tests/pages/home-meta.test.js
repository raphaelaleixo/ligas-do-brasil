import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('home.js source is decoupled from the baked season', () => {
  const src = readFileSync('assets/js/pages/home.js', 'utf8');

  it('does not import from season.js', () => {
    expect(src).not.toMatch(/from\s+['"][^'"]*season\.js/);
  });

  it('does not call loadSeason', () => {
    expect(src).not.toMatch(/loadSeason\s*\(/);
  });

  it('imports META from src/sim/meta.js', () => {
    expect(src).toMatch(/import\s*\{\s*META\s*\}\s*from\s+['"][^'"]*sim\/meta\.js['"]/);
  });
});
