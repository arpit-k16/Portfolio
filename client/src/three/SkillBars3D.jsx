// Skills page: a 3D bar chart (bars = projects that use each skill).
// Drag to rotate; hover a bar to highlight it.
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PALETTE = { 'Query & wrangle': '#42D3F2', Model: '#A594FF', Report: '#F7B740', Build: '#FF7A6B' };

function labelSprite(text, sub) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 96;
  const x = c.getContext('2d');
  x.fillStyle = '#E6ECF5';
  x.font = '600 34px "IBM Plex Sans", sans-serif';
  x.textAlign = 'center';
  x.fillText(text, 128, 42);
  x.fillStyle = '#8D9AB3';
  x.font = '400 26px "IBM Plex Mono", monospace';
  x.fillText(sub, 128, 82);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(2.1, 0.79, 1);
  return sp;
}

export default function SkillBars3D({ data }) {
  const mount = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const el = mount.current;
    if (!el || !data.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    scene.add(new THREE.AmbientLight('#9bb6ff', 0.7));
    const dl = new THREE.DirectionalLight('#ffffff', 1.2);
    dl.position.set(4, 10, 6);
    scene.add(dl);

    const group = new THREE.Group();
    scene.add(group);
    const max = Math.max(...data.map((d) => d.n));
    const radius = Math.max(3.4, data.length * 0.42);
    const bars = [];
    data.forEach((d, i) => {
      const a = (i / data.length) * Math.PI * 2;
      const h = 0.4 + (d.n / max) * 3.2;
      const geo = new THREE.BoxGeometry(0.55, h, 0.55);
      geo.translate(0, h / 2, 0);
      const color = new THREE.Color(PALETTE[d.group] || '#42D3F2');
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.2, emissive: color, emissiveIntensity: 0.12 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      mesh.userData = { i, base: 0.12 };
      group.add(mesh);
      bars.push(mesh);
      const lbl = labelSprite(d.name, `${d.n} ${d.n === 1 ? 'project' : 'projects'}`);
      lbl.position.set(Math.cos(a) * radius, h + 0.65, Math.sin(a) * radius);
      group.add(lbl);
    });
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius + 1, radius + 1, 0.06, 64),
      new THREE.MeshStandardMaterial({ color: '#121C30', roughness: 0.9 })
    );
    disc.position.y = -0.04;
    group.add(disc);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius + 1, 0.02, 8, 96), new THREE.MeshBasicMaterial({ color: '#42D3F2' }));
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      const dist = (radius + 4) * (camera.aspect < 1 ? 2.3 : 1.5);
      camera.position.set(0, dist * 0.72, dist);
      camera.lookAt(0, 0.6, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // drag to rotate
    let rotY = 0, vel = reduce ? 0 : 0.003, dragging = false, lastX = 0;
    const down = (e) => { dragging = true; lastX = e.clientX; el.setPointerCapture?.(e.pointerId); };
    const up = () => { dragging = false; };
    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2();
    const move = (e) => {
      const r = el.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; rotY += dx * 0.008; vel = dx * 0.0004; }
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    el.addEventListener('pointermove', move);

    let raf, current = -1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!dragging) { rotY += vel; vel = vel * 0.98 + (reduce ? 0 : 0.003) * 0.02; }
      group.rotation.y = rotY;
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(bars)[0];
      const idx = hit ? hit.object.userData.i : -1;
      if (idx !== current) {
        current = idx;
        setHovered(idx >= 0 ? data[idx] : null);
        bars.forEach((b) => { b.material.emissiveIntensity = b.userData.i === idx ? 0.6 : 0.12; });
        el.style.cursor = idx >= 0 ? 'pointer' : 'grab';
      }
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      el.removeEventListener('pointermove', move);
      scene.traverse((o) => { o.geometry?.dispose(); if (o.material) { o.material.map?.dispose(); o.material.dispose(); } });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [data]);

  return (
    <div className="bars3d-wrap" data-reveal="scale">
      <div ref={mount} className="bars3d" role="img" aria-label={`3D chart of skills by number of projects: ${data.map((d) => `${d.name} ${d.n}`).join(', ')}`} />
      <div className="bars3d-legend">
        {Object.entries(PALETTE).filter(([g]) => data.some((d) => d.group === g)).map(([g, c]) => <span key={g}><i style={{ background: c }} />{g}</span>)}
        <span className="hint">{hovered ? `${hovered.name}: used in ${hovered.n} ${hovered.n === 1 ? 'project' : 'projects'}` : 'Drag to rotate · hover a bar'}</span>
      </div>
    </div>
  );
}
