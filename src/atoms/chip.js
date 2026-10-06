import { h } from '../lib/dom.js';

// Chip selecionável (usado para escolher cenário).
export function Chip({ label, icon, active = false, onClick }) {
  return h('button', {
    class: `chip${active ? ' is-active' : ''}`,
    type: 'button',
    'aria-pressed': String(active),
    onClick,
  }, icon ? h('span', { class: 'chip__icon', 'aria-hidden': 'true' }, icon) : null, label);
}
