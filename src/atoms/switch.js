import { h } from '../lib/dom.js';

export function Switch({ checked = false, label, onChange }) {
  const input = h('input', { type: 'checkbox', role: 'switch', 'aria-label': label, class: 'switch__input' });
  input.checked = checked;
  input.addEventListener('change', () => onChange?.(input.checked));
  return h('label', { class: 'switch' }, input, h('span', { class: 'switch__track' }, h('span', { class: 'switch__thumb' })));
}
