// Hero background: a live 3D "data terrain" — a grid of bars whose heights
// follow a moving wave field, coloured cyan → violet → coral by height.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const C_LOW = new THREE.Color('#1b3a63');
const C_MID = new THREE.Color('#42D3F2');
const C_HIGH = new THREE.Color('#A594FF');
const C_PEAK = new THREE.Color('#FF7A6B');

function heightAt(x, z, t) {
  return (
    0.55 +
    0.45 * Math.sin(x * 0.42 + t * 0.9) * Math.cos(z * 0.36 - t * 0.6) +
    0.35 * Math.sin(Math.hypot(x - 4, z + 3) * 0.55 - t * 1.4) +
    0.18 * Math.cos(x * 0.9 - z * 0.7 + t * 0.5)
  );
}

function colorFor(h, out) {
  const v = Math.min(Math.max(h / 1.6, 0), 1);
  if (v < 0.45) out.copy(C_LOW).lerp(C_MID, v / 0.45);
  else if (v < 0.8) out.copy(C_MID).lerp(C_HIGH, (v - 0.45) / 0.35);
  else out.copy(C_HIGH).lerp(C_PEAK, (v - 0.8) / 0.2);
  return out;
}

export default function DataTerrain() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 700;
    const N = small ? 18 : 30; // grid size
    const GAP = 0.62;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return; // no WebGL: the CSS gradient behind stays as the fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    el.appendChild(renderer.domElement);

    const col = new THREE.Color();
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#0D1424', 14, 30);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

    scene.add(new THREE.AmbientLight('#8fb4ff', 0.55));
    const key = new THREE.DirectionalLight('#ffffff', 1.1);
    key.position.set(6, 12, 8);
    scene.add(key);
    const rim = new THREE.PointLight('#42D3F2', 30, 30);
    rim.position.set(-6, 4, -4);
    scene.add(rim);

    const geo = new THREE.BoxGeometry(0.46, 1, 0.46);
    geo.translate(0, 0.5, 0); // grow from the floor
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25 });
    const bars = new THREE.InstancedMesh(geo, mat, N * N);
    bars.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(bars);

    // floor grid lines for the "chart" feel
    const grid = new THREE.GridHelper(N * GAP + 2, N + 3, '#22304B', '#1a2742');
    grid.position.y = -0.01;
    scene.add(grid);

    // dotted wave surface floating above the bars (point-cloud layer)
    const W = small ? 46 : 80;
    const span = N * GAP * 1.5;
    const ptsGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(W * W * 3);
    const pcol = new Float32Array(W * W * 3);
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    ptsGeo.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
    const pts = new THREE.Points(ptsGeo, new THREE.PointsMaterial({ size: small ? 0.07 : 0.055, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
    pts.position.y = 4.2;
    scene.add(pts);
    const wave = (t) => {
      let k = 0;
      for (let i = 0; i < W; i++) {
        for (let j = 0; j < W; j++) {
          const x = (i / (W - 1) - 0.5) * span;
          const z = (j / (W - 1) - 0.5) * span;
          const y = 0.55 * Math.sin(x * 0.35 + t * 0.8) + 0.45 * Math.cos(z * 0.3 + t * 0.55) + 0.25 * Math.sin((x + z) * 0.5 - t);
          pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z;
          colorFor(0.8 + y * 0.6, col);
          pcol[k * 3] = col.r; pcol[k * 3 + 1] = col.g; pcol[k * 3 + 2] = col.b;
          k++;
        }
      }
      ptsGeo.attributes.position.needsUpdate = true;
      ptsGeo.attributes.color.needsUpdate = true;
    };

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const half = ((N - 1) * GAP) / 2;

    const update = (t) => {
      let k = 0;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const x = i * GAP - half;
          const z = j * GAP - half;
          const h = Math.max(0.05, heightAt(i * 0.5, j * 0.5, t) * 1.5);
          p.set(x, 0, z);
          s.set(1, h, 1);
          m.compose(p, q, s);
          bars.setMatrixAt(k, m);
          bars.setColorAt(k, colorFor(h, col));
          k++;
        }
      }
      bars.instanceMatrix.needsUpdate = true;
      if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
    };

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // mouse parallax
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);

    const clock = new THREE.Clock();
    let angle = 0.6;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      angle += 0.0012;
      const r = small ? 15 : 13.5;
      camera.position.set(Math.cos(angle) * r + target.x * 1.2, 7.2 - target.y * 1.2, Math.sin(angle) * r);
      camera.lookAt(0, 0.8, 0);
      update(t);
      wave(t);
      renderer.render(scene, camera);
    };

    if (reduce) {
      camera.position.set(Math.cos(angle) * 13.5, 7.2, Math.sin(angle) * 13.5);
      camera.lookAt(0, 0.8, 0);
      update(1.2);
      wave(1.2);
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      geo.dispose(); mat.dispose(); ptsGeo.dispose(); pts.material.dispose(); grid.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="terrain" aria-hidden="true" />;
}
