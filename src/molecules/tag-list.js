import { h } from '../lib/dom.js';
import { Badge } from '../atoms/badge.js';

export function TagList({ tags = [], tone }) {
  return h('div', { class: 'tag-list' }, tags.map((t) => Badge({ text: t, tone })));
}
