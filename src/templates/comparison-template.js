import { h } from '../lib/dom.js';

function WireframeStage({ number, title, label, content }) {
  return h('section', {
    class: `wireframe-stage wireframe-stage--${number}`,
    'aria-label': `Wireframe ${number}: ${title}`,
  },
  h('div', { class: 'wireframe-stage__caption', 'aria-hidden': 'true' },
    h('span', { class: 'wireframe-stage__number' }, `WIREFRAME ${number}`),
    h('span', { class: 'wireframe-stage__title' }, label),
    h('span', { class: 'wireframe-stage__rule' })),
  content);
}

// Organiza o fluxo em três quadros sem interromper a demonstração interativa.
export function ComparisonTemplate({ header, controls, tray, left, right, footer }) {
  return h('main', { class: 'tpl' },
    header,
    WireframeStage({
      number: '01',
      title: 'pergunta e cenário',
      label: 'ENTRADA',
      content: h('div', { class: 'tpl__controls' }, controls),
    }),
    WireframeStage({
      number: '02',
      title: 'fontes de contexto',
      label: 'CONTEXTO',
      content: tray,
    }),
    WireframeStage({
      number: '03',
      title: 'comparação das respostas',
      label: 'SAÍDA',
      content: h('div', { class: 'tpl__grid' }, left, right),
    }),
    footer);
}
