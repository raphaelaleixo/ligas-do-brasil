/**
 * Sticky nav wiring:
 *  - Mark the current-page link with aria-current.
 *  - Sync the toggle button's aria-expanded with the popover's open state.
 *  - Close the drawer when a link inside it is clicked (safe for same-page hashes).
 *  - Mark <main> inert while the mobile drawer is open (AT + tab flow).
 */

export function markCurrentNav() {
  const links = document.querySelectorAll('.site-nav__links a[href]');
  const path = location.pathname.replace(/\.html$/, '') || '/';
  for (const a of links) {
    const href = a.getAttribute('href').replace(/\.html$/, '');
    if (href === path || (href === '/' && (path === '/index' || path === '/'))) {
      a.setAttribute('aria-current', 'page');
    }
  }
}

export function wireDrawer() {
  const drawer = document.getElementById('primary-nav');
  const toggle = document.querySelector('.site-nav__toggle');
  const main = document.querySelector('main');
  if (!drawer) return;

  const sync = () => {
    const open = drawer.matches(':popover-open');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (main) main.toggleAttribute('inert', open);
  };

  drawer.addEventListener('toggle', sync);

  // Close on link click (light-dismiss on outside click is native to popover=auto)
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a[href]') && drawer.matches(':popover-open')) {
      drawer.hidePopover();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  markCurrentNav();
  wireDrawer();
});
