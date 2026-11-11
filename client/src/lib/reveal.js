import { useEffect } from 'react';

// Scroll-reveal: any element with data-reveal="up|left|right|scale|fade" gets the
// class "in" the first time it scrolls into view. Children marked data-reveal-stagger
// get an increasing --i so CSS can delay them one after another.
// Hidden-until-revealed styling only applies when <html> has .reveal-on, so content
// stays visible if JavaScript or IntersectionObserver is unavailable.
export function useReveal(deps = []) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('reveal-on');

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

    const scan = () => {
      document.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
        [...parent.children].forEach((c, i) => c.style.setProperty('--i', i));
      });
      document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => io.observe(el));
    };
    scan();
    // content arrives asynchronously; pick up new elements as they render
    const mo = new MutationObserver(() => scan());
    mo.observe(document.getElementById('main') || document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
