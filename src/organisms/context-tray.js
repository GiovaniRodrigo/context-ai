import { h } from '../lib/dom.js';
import { ContextCard } from '../molecules/context-card.js';

// Bandeja com os cartões de contexto que alimentam a IA informada.
export function ContextTray({ items, enabled, onToggle }) {
  return h('section', { class: 'tray', 'aria-labelledby': 'context-heading' },
    h('div', { class: 'tray__head' },
      h('div', {},
        h('p', { class: 'tray__eyebrow' }, 'FONTES DE CONTEXTO'),
        h('h2', { class: 'tray__title', id: 'context-heading' }, 'O que essa IA sabe?')),
      h('span', { class: 'tray__count' }, `${items.length} FONTES SIMULADAS`)),
    h('p', { class: 'tray__hint' }, 'Ative ou desative os cartões. A resposta e as métricas se atualizam na hora.'),
    h('div', { class: 'tray__grid', role: 'group', 'aria-label': 'Fontes de contexto' },
      items.map((item) => ContextCard({ item, enabled: enabled.has(item.id), onToggle: (on) => onToggle(item.id, on) }))));
}
