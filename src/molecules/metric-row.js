import { h } from '../lib/dom.js';
import { Meter } from '../atoms/meter.js';

export function MetricRow({ label, tone }) {
  const meter = Meter({ tone });
  const value = h('span', { class: 'metric__value' }, '0%');
  const el = h('div', { class: 'metric' }, h('span', { class: 'metric__label' }, label), meter, value);
  el.set = (v) => { meter.set(v); value.textContent = `${Math.round(v)}%`; };
  return el;
}
