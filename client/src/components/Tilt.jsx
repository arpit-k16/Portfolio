import { useRef } from 'react';

// Card that tilts in 3D toward the pointer and shows a moving glare.
export default function Tilt({ as: Tag = 'div', className = '', max = 8, children, ...rest }) {
  const ref = useRef(null);
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
    el.style.setProperty('--gx', `${x * 100}%`);
    el.style.setProperty('--gy', `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <Tag ref={ref} className={`tilt ${className}`} onPointerMove={fine ? onMove : undefined} onPointerLeave={fine ? onLeave : undefined} {...rest}>
      {children}
      <span className="glare" aria-hidden="true" />
    </Tag>
  );
}
