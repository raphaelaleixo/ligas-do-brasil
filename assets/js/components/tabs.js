/**
 * Wire up a tab bar. Tabs are buttons with role="tab" and data-key attributes.
 * Emits a 'tab-change' custom event on the tablist element with { detail: { key } }.
 */
export function wireTabs(tablistEl, { defaultKey } = {}) {
  const tabs = () => Array.from(tablistEl.querySelectorAll('[role="tab"]'));
  const select = (key) => {
    for (const t of tabs()) {
      const isSelected = t.dataset.key === key;
      t.setAttribute('aria-selected', isSelected);
      t.tabIndex = isSelected ? 0 : -1;
    }
    tablistEl.dispatchEvent(new CustomEvent('tab-change', { detail: { key } }));
  };

  tablistEl.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab.dataset.key);
  });

  tablistEl.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const t = tabs();
    const currentIndex = t.findIndex((x) => x.getAttribute('aria-selected') === 'true');
    let next = currentIndex;
    if (e.key === 'ArrowLeft')  next = (currentIndex - 1 + t.length) % t.length;
    if (e.key === 'ArrowRight') next = (currentIndex + 1) % t.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = t.length - 1;
    select(t[next].dataset.key);
    t[next].focus();
    e.preventDefault();
  });

  if (defaultKey) select(defaultKey);
}
