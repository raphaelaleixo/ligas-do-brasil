export function computePerfis({ clubIds, jogosPorClube }) {
  const sorted = clubIds
    .slice()
    .sort((a, b) => (jogosPorClube.get(b) ?? 0) - (jogosPorClube.get(a) ?? 0));
  const elite = sorted.slice(0, 24);
  const media = sorted.slice(24, 108);
  const base = sorted.slice(108);
  const avg = (ids) => ids.reduce((s, id) => s + (jogosPorClube.get(id) ?? 0), 0) / ids.length;
  return {
    elite: { count: elite.length, mediaJogos: Number(avg(elite).toFixed(1)), exemplos: elite.slice(0, 3) },
    media: { count: media.length, mediaJogos: Number(avg(media).toFixed(1)), exemplos: media.slice(0, 3) },
    base: { count: base.length, mediaJogos: Number(avg(base).toFixed(1)), exemplos: base.slice(0, 3) },
  };
}
