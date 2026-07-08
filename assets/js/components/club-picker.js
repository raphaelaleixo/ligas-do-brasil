/**
 * Populate the customizable <select> with grouped, rich <option>s.
 * Rich HTML inside <option> renders in Chrome/Edge 135+ (appearance: base-select).
 * Older browsers strip the tags and render just the text — still functional.
 */
export function populateClubes(selectEl, clubes) {
  const byLiga = new Map();
  for (const c of clubes) {
    if (!byLiga.has(c.liga_regional)) byLiga.set(c.liga_regional, []);
    byLiga.get(c.liga_regional).push(c);
  }
  const trigger = selectEl.querySelector('button');
  selectEl.innerHTML = '';
  if (trigger) selectEl.appendChild(trigger);

  for (const [liga, list] of byLiga) {
    const group = document.createElement('optgroup');
    group.label = liga;
    for (const c of list) {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.innerHTML = `<span class="club-picker__nome">${c.nome}</span>
                      <span class="club-picker__meta">${c.liga_regional} · Série ${c.divisao}</span>`;
      opt.setAttribute('label', `${c.nome} — ${c.liga_regional}`);
      group.appendChild(opt);
    }
    selectEl.appendChild(group);
  }
}
