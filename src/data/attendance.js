// Ballpark 2024 average attendance, rounded. Surface as "estimativa 2024" in UI.
const SLEEPING_GIANTS = [
  { nome: 'Sport',         estado: 'PE', liga: 'Liga Nordeste',              mediaPublico: 28000, divisaoAtual: 'Série B' },
  { nome: 'Náutico',       estado: 'PE', liga: 'Liga Nordeste',              mediaPublico: 17000, divisaoAtual: 'Série C' },
  { nome: 'Santa Cruz',    estado: 'PE', liga: 'Liga Nordeste',              mediaPublico: 22000, divisaoAtual: 'Série D' },
  { nome: 'Vitória',       estado: 'BA', liga: 'Liga Nordeste',              mediaPublico: 25000, divisaoAtual: 'Série A' },
  { nome: 'América-RN',    estado: 'RN', liga: 'Liga Nordeste',              mediaPublico: 8000,  divisaoAtual: 'Série C' },
  { nome: 'Remo',          estado: 'PA', liga: 'Liga Norte',                 mediaPublico: 32000, divisaoAtual: 'Série B' },
  { nome: 'Paysandu',      estado: 'PA', liga: 'Liga Norte',                 mediaPublico: 30000, divisaoAtual: 'Série B' },
  { nome: 'Goiás',         estado: 'GO', liga: 'Liga Mineira/Centro-Oeste',  mediaPublico: 18000, divisaoAtual: 'Série B' },
  { nome: 'Vila Nova',     estado: 'GO', liga: 'Liga Mineira/Centro-Oeste',  mediaPublico: 14000, divisaoAtual: 'Série B' },
  { nome: 'Coritiba',      estado: 'PR', liga: 'Liga Sulista',               mediaPublico: 20000, divisaoAtual: 'Série B' },
  { nome: 'Paraná',        estado: 'PR', liga: 'Liga Sulista',               mediaPublico: 6000,  divisaoAtual: 'Série D' },
];

export function getSleepingGiants() {
  return SLEEPING_GIANTS;
}
