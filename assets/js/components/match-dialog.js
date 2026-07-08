export function openMatchDialog({ semana, entry, ownerClub, adversario }) {
  const dlg = document.getElementById('match-dialog');
  const title = document.getElementById('match-title');
  const body = document.getElementById('match-body');
  const compLabel = {
    liga_regional: 'Liga Regional',
    copa_campeoes: 'Copa dos Campeões',
    copa_brasil: 'Copa do Brasil',
  }[entry.competicao] ?? entry.competicao;
  title.textContent = `Semana ${semana} · ${compLabel}${entry.rodada ? ' · ' + entry.rodada : ''}`;
  body.innerHTML = `
    <p style="font-size:var(--step-2);text-align:center;font-family:var(--font-sans);font-variant-numeric:tabular-nums;">
      ${ownerClub.nome} <strong>${entry.golsPro} – ${entry.golsContra}</strong> ${adversario.nome}
    </p>
    <p style="text-align:center;color:var(--color-muted);font-family:var(--font-sans);">
      ${entry.casa ? 'em casa' : 'fora'}
    </p>`;
  dlg.showModal();
}
