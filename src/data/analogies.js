const ANALOGIES = [
  {
    liga: 'Liga Paulista',
    analogoEuropeu: 'Premier League',
    populacao: 46_000_000,
    rationale: 'Centro financeiro, marcas globais, elenco profundo.',
  },
  {
    liga: 'Liga Nordeste',
    analogoEuropeu: 'Serie A (Itália)',
    populacao: 54_000_000,
    rationale: 'Multi-cidade, rivalidades urbanas históricas.',
  },
  {
    liga: 'Liga Mineira/Centro-Oeste',
    analogoEuropeu: 'La Liga',
    populacao: 28_000_000,
    rationale: 'Dois gigantes dominantes fatiando o resto.',
  },
  {
    liga: 'Liga Guanabara-Capixaba',
    analogoEuropeu: 'Primeira Liga (Portugal)',
    populacao: 19_000_000,
    rationale: 'Território pequeno, marcas globais desproporcionais.',
  },
  {
    liga: 'Liga Sulista',
    analogoEuropeu: 'Bundesliga',
    populacao: 30_000_000,
    rationale: 'Herança germânica, cultura de torcida organizada.',
  },
  {
    liga: 'Liga Norte',
    analogoEuropeu: 'Eredivisie',
    populacao: 18_000_000,
    rationale: 'Liga menor com identidade forte, formadora de talento.',
  },
];

export function getAnalogies() {
  return ANALOGIES;
}
export function getAnalogyForLeague(nome) {
  return ANALOGIES.find((a) => a.liga === nome);
}
