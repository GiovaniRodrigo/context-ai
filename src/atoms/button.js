import { h } from '../lib/dom.js';

export function Button({ label, variant = 'primary', icon, onClick, type = 'button' }) {
  return h('button', { class: `btn btn--${variant}`, type, onClick },
    icon ? h('span', { class: 'btn__icon', 'aria-hidden': 'true' }, icon) : null,
    label);
}
