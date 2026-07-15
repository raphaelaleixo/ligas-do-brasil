// Scroll-triggered reveal: mark [data-reveal] elements with .is-revealed
// the first time they intersect the viewport, then stop observing them.
// Pairs with motion.css rules gated behind `.js` + `.is-revealed`.
//
// Fallbacks:
// - No JS / script fails to load → `.js` never set → CSS animations don't
//   pause-hold, elements render normally (no reveal, but no missing content).
// - prefers-reduced-motion: reduce → observer skipped, .is-revealed added
//   immediately so CSS pause rules (inside no-preference media query) never
//   fire and content shows at rest.

document.documentElement.classList.replace('no-js', 'js');

const targets = document.querySelectorAll('[data-reveal]');
if (targets.length) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const el of targets) el.classList.add('is-revealed');
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: 0.2 });
    for (const el of targets) io.observe(el);
  }
}
