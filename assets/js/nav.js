export function markCurrentNav() {
  const links = document.querySelectorAll('.site-nav__links a[href]');
  const path = location.pathname.replace(/\.html$/, '') || '/';
  for (const a of links) {
    const href = a.getAttribute('href').replace(/\.html$/, '');
    if (href === path || (href === '/' && path === '/index')) {
      a.setAttribute('aria-current', 'page');
    }
  }
}

/**
 * When the mobile [popover] drawer is open, mark the <main> inert so background
 * links and controls are removed from tab flow and AT tree.
 */
export function wireDrawerInert() {
  const drawer = document.getElementById('primary-nav');
  const main = document.querySelector('main');
  if (!drawer || !main) return;
  const sync = () => main.toggleAttribute('inert', drawer.matches(':popover-open'));
  drawer.addEventListener('toggle', sync);
}

document.addEventListener('DOMContentLoaded', () => {
  markCurrentNav();
  wireDrawerInert();
});
