import { h } from '../lib/dom.js';

// Balão de mensagem. role: 'user' | 'ai'. Retorna elemento com .body (onde o texto entra).
export function MessageBubble({ role, text = '' }) {
  const body = h('p', { class: 'bubble__text' }, text);
  const el = h('div', { class: `bubble bubble--${role}` },
    h('span', { class: 'bubble__who' }, role === 'user' ? 'Você' : 'IA'),
    body);
  el.body = body;
  return el;
}
