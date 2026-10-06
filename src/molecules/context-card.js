import { h } from '../lib/dom.js';
import { Switch } from '../atoms/switch.js';

// Cartão de contexto que o usuário liga/desliga.
export function ContextCard({ item, enabled, onToggle }) {
  const el = h('div', { class: `ctx-card${enabled ? ' is-on' : ''}`, dataset: { ctx: item.id } },
    h('span', { class: 'ctx-card__icon', 'aria-hidden': 'true' }, item.icon),
    h('span', { class: 'ctx-card__body' },
      h('strong', {}, item.title),
      h('small', {}, item.detail)),
    Switch({ checked: enabled, label: `${item.title}: ${item.detail}`, onChange: onToggle }));
  return el;
}
