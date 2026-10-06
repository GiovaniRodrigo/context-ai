import { h } from '../lib/dom.js';

// Layout da página: cabeçalho, barra de controles e duas colunas comparativas.
export function ComparisonTemplate({ header, controls, tray, left, right, footer }) {
  return h('main', { class: 'tpl' },
    header,
    h('div', { class: 'tpl__controls' }, controls),
    tray,
    h('div', { class: 'tpl__grid' }, left, right),
    footer);
}
