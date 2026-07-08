const REVELATION_CLUBS = [
  { jogador: 'Romário',        clubeRevelador: 'Olaria',                     estado: 'RJ', liga: 'Liga Guanabara-Capixaba',    copasVencidas: [1994] },
  { jogador: 'Ronaldo',        clubeRevelador: 'São Cristóvão',              estado: 'RJ', liga: 'Liga Guanabara-Capixaba',    copasVencidas: [1994, 2002] },
  { jogador: 'Rivaldo',        clubeRevelador: 'Santa Cruz',                 estado: 'CE', liga: 'Liga Nordeste',              copasVencidas: [2002] },
  { jogador: 'Lúcio',          clubeRevelador: 'Guará',                      estado: 'DF', liga: 'Liga Mineira/Centro-Oeste',  copasVencidas: [2002] },
  { jogador: 'Cafu',           clubeRevelador: 'Itaquaquecetuba',            estado: 'SP', liga: 'Liga Paulista',              copasVencidas: [1994, 2002] },
  { jogador: 'Roberto Carlos', clubeRevelador: 'União São João de Araras',   estado: 'SP', liga: 'Liga Paulista',              copasVencidas: [2002] },
];

export function getRevelationClubs() {
  return REVELATION_CLUBS;
}
