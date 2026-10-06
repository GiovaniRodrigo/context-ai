import { h } from '../lib/dom.js';
import { Badge } from '../atoms/badge.js';

export function SiteHeader() {
  return h('header', { class: 'site-header' },
    Badge({ text: 'Janela de contexto', tone: 'good' }),
    h('h1', {}, 'A mesma IA. ', h('span', { class: 'grad' }, 'Respostas bem diferentes.')),
    h('p', {}, 'Um modelo de linguagem só sabe o que está na conversa. Escolha um cenário, envie a pergunta e compare o que acontece quando ele recebe — ou não — o contexto certo.'));
}
