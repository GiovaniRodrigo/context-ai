import { h } from '../lib/dom.js';

export function Badge({ text, tone = 'neutral' }) {
  return h('span', { class: `badge badge--${tone}` }, text);
}
