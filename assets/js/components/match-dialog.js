export function openMatchDialog({ semana, entry, ownerClub, adversario }) {
  const dlg = document.getElementById('match-dialog');
  const title = document.getElementById('match-title');
  const body = document.getElementById('match-body');
  const compLabel = {
    liga_regional: 'Liga Regional',
    copa_campeoes: 'Copa dos Campeões',
    copa_brasil: 'Copa do Brasil',
    conmebol_libertadores: 'Copa Libertadores',
    conmebol_sul_americana: 'Copa Sul-Americana',
  }[entry.competicao] ?? entry.competicao;
  const isConmebol = entry.competicao?.startsWith('conmebol_');
  title.textContent = `Semana ${semana} · ${compLabel}${entry.rodada ? ' · ' + entry.rodada : ''}`;
  if (isConmebol) {
    body.innerHTML = `
      <p style="text-align:center;font-family:var(--font-sans);color:var(--color-muted);">
        Data reservada para a ${compLabel}. Adversários e placares seguem o calendário da Conmebol —
        fora do escopo desta simulação.
      </p>`;
  } else {
    body.innerHTML = `
      <p style="font-size:var(--step-2);text-align:center;font-family:var(--font-sans);font-variant-numeric:tabular-nums;">
        ${ownerClub.nome} <strong>${entry.golsPro} – ${entry.golsContra}</strong> ${adversario.nome}
      </p>
      <p style="text-align:center;color:var(--color-muted);font-family:var(--font-sans);">
        ${entry.casa ? 'em casa' : 'fora'}
      </p>`;
  }
  dlg.showModal();
}
