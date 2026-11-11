import { useEffect, useRef, useState } from 'react';

// Counts from 0 to `value` the first time it scrolls into view.
export default function CountUp({ value, duration = 1100 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setShown(value); return; }
    let raf;
    const run = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / duration, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (started.current) { setShown(value); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { started.current = true; run(); io.disconnect(); }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return <span ref={ref}>{shown.toLocaleString()}</span>;
}
