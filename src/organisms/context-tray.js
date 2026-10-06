import { h } from '../lib/dom.js';
import { ContextCard } from '../molecules/context-card.js';

// Bandeja com os cartões de contexto que alimentam a IA informada.
export function ContextTray({ items, enabled, onToggle }) {
  return h('div', { class: 'tray', role: 'group', 'aria-label': 'Contexto disponível' },
    h('p', { class: 'tray__hint' }, 'Ligue e desligue o contexto e veja a resposta mudar:'),
    h('div', { class: 'tray__grid' },
      items.map((item) => ContextCard({ item, enabled: enabled.has(item.id), onToggle: (on) => onToggle(item.id, on) }))));
}
