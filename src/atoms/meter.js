import { h } from '../lib/dom.js';

// Barra animada de 0 a 100. Retorna o elemento com .set(valor).
export function Meter({ tone = 'neutral' }) {
  const fill = h('span', { class: 'meter__fill' });
  const el = h('span', { class: `meter meter--${tone}`, role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' }, fill);
  el.set = (value) => {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    fill.style.width = `${v}%`;
    el.setAttribute('aria-valuenow', String(v));
  };
  return el;
}
