import { h, prefersReducedMotion } from '../lib/dom.js';

const NODE_COUNT = 24;
const rand = (a, b) => a + Math.random() * (b - a);
const lerp = (a, b, t) => a + (b - a) * t;

// Rede neural animada.
//  - blind:    nós vagam sem direção, ligações piscam, "?" flutua do núcleo.
//  - informed: nós se organizam em anéis, partículas de contexto fluem para o núcleo.
// API: setLevel(0..1), setThinking(bool), burst(n)
export function NeuralCanvas({ variant }) {
  const canvas = h('canvas', { class: `neural neural--${variant}`, role: 'img',
    'aria-label': variant === 'blind' ? 'Rede neural sem direção' : 'Rede neural focada pelo contexto' });
  const ctx = canvas.getContext('2d');
  const reduced = prefersReducedMotion();
  const informed = variant === 'informed';

  let w = 0, h_ = 0, dpr = 1;
  let level = informed ? 0 : 0, shown = 0, thinking = false, t = 0;
  const particles = [];

  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
    x: rand(0.05, 0.95), y: rand(0.05, 0.95),
    vx: rand(-0.0004, 0.0004), vy: rand(-0.0004, 0.0004),
    ring: i % 3, angle: (i / NODE_COUNT) * Math.PI * 2 * 3,
  }));

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h_ = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h_ * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  new ResizeObserver(resize).observe(canvas);

  const hue = () => (informed ? lerp(200, 165, shown) : 36);
  const color = (a, l = 62) => `hsla(${hue()}, ${informed ? 90 : 70}%, ${l}%, ${a})`;

  function spawn() {
    if (informed) {
      particles.push({ kind: 'flow', x: rand(0.1, 0.9) * w, y: -4, speed: rand(1.2, 2.4), life: 1 });
    } else {
      const a = rand(0, Math.PI * 2);
      particles.push({ kind: 'q', x: w / 2, y: h_ / 2, vx: Math.cos(a) * rand(0.3, 0.9), vy: Math.sin(a) * rand(0.3, 0.9), life: 1 });
    }
  }

  function step() {
    t += thinking ? 0.06 : 0.02;
    shown = lerp(shown, level, 0.04);
    const cx = w / 2, cy = h_ / 2;

    // posição dos nós
    const pts = nodes.map((n) => {
      if (!reduced) {
        n.x += n.vx * (informed ? 1 - shown * 0.8 : 1.6);
        n.y += n.vy * (informed ? 1 - shown * 0.8 : 1.6);
        if (n.x < 0.03 || n.x > 0.97) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
        if (!informed || shown < 0.9) { n.vx += rand(-0.00004, 0.00004); n.vy += rand(-0.00004, 0.00004); }
      }
      let x = n.x * w, y = n.y * h_;
      if (informed) {
        const r = (0.2 + n.ring * 0.11) * Math.min(w, h_) * 1.5;
        const a = n.angle + t * (0.15 + n.ring * 0.05);
        x = lerp(x, cx + Math.cos(a) * r * 1.3, shown);
        y = lerp(y, cy + Math.sin(a) * r * 0.75, shown);
      }
      return { x, y };
    });

    ctx.clearRect(0, 0, w, h_);

    // ligações entre nós
    const maxD = Math.min(w, h_) * 0.55;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d > maxD) continue;
        const base = 1 - d / maxD;
        const flicker = informed ? 1 : 0.35 + 0.65 * Math.abs(Math.sin(t * 1.5 + i * 3.1 + j));
        ctx.strokeStyle = color((informed ? 0.08 + 0.35 * shown : 0.14) * base * flicker);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
      if (informed && shown > 0.02) {
        ctx.strokeStyle = color(0.5 * shown * (0.4 + 0.6 * Math.sin(t * 2 + i) ** 2));
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(cx, cy); ctx.stroke();
      }
    }

    // nós
    pts.forEach((p, i) => {
      const glow = informed ? 0.35 + 0.65 * shown : 0.35;
      ctx.fillStyle = color(glow + 0.2 * Math.sin(t + i), informed ? 55 + shown * 20 : 55);
      ctx.beginPath(); ctx.arc(p.x, p.y, informed ? 2.2 + shown * 1.6 : 2.2, 0, Math.PI * 2); ctx.fill();
    });

    // partículas
    const rate = informed ? (thinking ? 0.5 : shown * 0.18) : (thinking ? 0.35 : 0.06);
    if (!reduced && Math.random() < rate) spawn();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.kind === 'flow') {
        const dx = cx - p.x, dy = cy - p.y, d = Math.hypot(dx, dy) || 1;
        p.x += (dx / d) * p.speed * 2; p.y += (dy / d) * p.speed * 2;
        ctx.fillStyle = color(0.9, 75);
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = color(0.25, 75); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - (dx / d) * 14, p.y - (dy / d) * 14); ctx.stroke();
        if (d < 14) particles.splice(i, 1);
      } else {
        p.x += p.vx; p.y += p.vy; p.life -= 0.012;
        ctx.fillStyle = color(Math.max(p.life, 0) * 0.8, 65);
        ctx.font = '600 14px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('?', p.x, p.y);
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    // núcleo do modelo
    const pulse = 1 + 0.12 * Math.sin(t * (thinking ? 3 : 1.4));
    const r = (14 + (informed ? shown * 6 : 0)) * pulse;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.2);
    g.addColorStop(0, color(informed ? 0.55 + 0.3 * shown : 0.28, 65));
    g.addColorStop(1, color(0, 65));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color(informed ? 1 : 0.55, informed ? 70 : 55);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    if (!informed) {
      ctx.fillStyle = 'rgba(20,14,4,.8)'; ctx.font = '700 16px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('?', cx, cy + 1);
    }

    raf = requestAnimationFrame(step);
  }

  let raf;
  const start = () => { resize(); raf = requestAnimationFrame(step); };
  // só anima enquanto visível
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) start();
  }).observe(canvas);

  return {
    el: canvas,
    setLevel: (v) => { level = v; },
    setThinking: (v) => { thinking = v; },
    burst: (n = 14) => { for (let i = 0; i < n; i++) setTimeout(spawn, i * 40); },
  };
}
