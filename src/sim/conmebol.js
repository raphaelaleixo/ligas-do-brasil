export function allocateConmebolSlots({ copaCampeoes, copaBrasil, ligasRegionais }) {
  const libertadores = [];
  const seen = new Set();
  const cascadePool = copaCampeoes.campanhaGeral.slice();

  function tryAdd(id) {
    if (id && !seen.has(id)) {
      libertadores.push(id);
      seen.add(id);
      return true;
    }
    return false;
  }
  function cascade() {
    while (cascadePool.length) {
      const next = cascadePool.shift();
      if (tryAdd(next)) return;
    }
  }

  const candidates = [
    copaCampeoes.campeao,
    copaCampeoes.vice,
    copaBrasil.campeao,
    copaCampeoes.semifinalistas?.[0],
    copaCampeoes.semifinalistas?.[1],
    copaBrasil.vice,
  ];
  for (const id of candidates) {
    if (!tryAdd(id)) cascade();
  }
  cascade();
  while (libertadores.length < 7) cascade();

  const sulAmericana = [];
  for (const liga of ligasRegionais) {
    const pick = liga.tabelaA.find((row) => !seen.has(row.id));
    if (pick) {
      sulAmericana.push(pick.id);
      seen.add(pick.id);
    }
  }

  return { libertadores, sulAmericana };
}
