import { h, prefersReducedMotion } from '../lib/dom.js';

// Escreve segmentos [{ text, ctx? }] dentro de `container`, caractere a caractere.
// Segmentos com `ctx` ganham destaque (trecho veio do contexto). Retorna cancel().
export function typewrite(container, segments, { cps = 70, onDone } = {}) {
  container.replaceChildren();
  const caret = h('span', { class: 'caret', 'aria-hidden': 'true' });
  const spans = segments.map((s) => {
    const span = h('span', { class: s.ctx ? 'mark' : null });
    if (s.ctx) span.dataset.ctx = s.ctx;
    container.append(span);
    return span;
  });
  container.append(caret);

  if (prefersReducedMotion()) {
    segments.forEach((s, i) => (spans[i].textContent = s.text));
    caret.remove();
    onDone?.();
    return () => {};
  }

  let seg = 0, char = 0, last = performance.now(), raf, cancelled = false;
  const tick = (now) => {
    if (cancelled) return;
    const n = Math.max(1, Math.floor(((now - last) / 1000) * cps));
    if (now - last >= 1000 / cps) {
      last = now;
      for (let i = 0; i < n && seg < segments.length; i++) {
        char++;
        spans[seg].textContent = segments[seg].text.slice(0, char);
        if (char >= segments[seg].text.length) { seg++; char = 0; }
      }
    }
    if (seg >= segments.length) { caret.remove(); onDone?.(); return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { cancelled = true; cancelAnimationFrame(raf); caret.remove(); };
}
