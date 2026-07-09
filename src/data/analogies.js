// Each Brazilian regional league is roughly the size of a European country.
// Populations: IBGE 2022 Census (Brasil) / UN 2023 estimates (Europa).
const ANALOGIES = [
  {
    liga: 'Liga Nordestina',
    regiaoPop: 54_000_000,
    pais: 'Inglaterra',
    paisFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    paisPop: 57_000_000,
    rationale: 'Multi-cidade, rivalidades urbanas históricas em nove estados.',
  },
  {
    liga: 'Liga Paulista',
    regiaoPop: 44_000_000,
    pais: 'Itália',
    paisFlag: '🇮🇹',
    paisPop: 59_000_000,
    rationale: 'Centro financeiro, marcas globais, elenco profundo.',
  },
  {
    liga: 'Liga Central',
    regiaoPop: 37_000_000,
    pais: 'Espanha',
    paisFlag: '🇪🇸',
    paisPop: 48_000_000,
    rationale: 'MG + Centro-Oeste: dois gigantes dominantes e vasto interior.',
  },
  {
    liga: 'Liga Sulista',
    regiaoPop: 30_000_000,
    pais: 'Ucrânia',
    paisFlag: '🇺🇦',
    paisPop: 32_000_000,
    rationale: 'RS + SC + PR: herança germânica, cultura de torcida organizada.',
  },
  {
    liga: 'Liga Rio-Capixaba',
    regiaoPop: 20_000_000,
    pais: 'Países Baixos',
    paisFlag: '🇳🇱',
    paisPop: 18_000_000,
    rationale: 'Território pequeno, marcas globais desproporcionais.',
  },
  {
    liga: 'Liga Amazônica',
    regiaoPop: 18_000_000,
    pais: 'Portugal',
    paisFlag: '🇵🇹',
    paisPop: 10_000_000,
    rationale: 'Mesmo a menor região do país é maior que Portugal — que sustenta 18 clubes na elite.',
  },
];

export function getAnalogies() {
  return ANALOGIES;
}
export function getAnalogyForLeague(nome) {
  return ANALOGIES.find((a) => a.liga === nome);
}
