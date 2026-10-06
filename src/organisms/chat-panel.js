import { h } from '../lib/dom.js';
import { Badge } from '../atoms/badge.js';
import { typewrite } from '../atoms/typewriter.js';
import { MessageBubble } from '../molecules/message-bubble.js';
import { MetricRow } from '../molecules/metric-row.js';
import { TagList } from '../molecules/tag-list.js';
import { NeuralCanvas } from './neural-canvas.js';

// Painel de conversa: rede neural + pergunta + resposta em streaming + métricas.
// variant: 'blind' (sem contexto) | 'informed' (com contexto)
export function ChatPanel({ variant, slot = null }) {
  const informed = variant === 'informed';
  const neural = NeuralCanvas({ variant });
  const userBubble = MessageBubble({ role: 'user' });
  const aiBubble = MessageBubble({ role: 'ai' });
  const relevance = MetricRow({ label: 'Relevância', tone: informed ? 'good' : 'warn' });
  const risk = MetricRow({ label: 'Risco de alucinação', tone: 'bad' });
  const tags = h('div', { class: 'panel__tags' });
  let cancel = () => {};

  const el = h('section', { class: `panel panel--${variant}`, 'aria-label': informed ? 'IA com contexto' : 'IA sem contexto' },
    h('header', { class: 'panel__head' },
      h('div', { class: 'panel__title-wrap' },
        h('span', { class: 'panel__index', 'aria-hidden': 'true' }, informed ? '02' : '01'),
        h('div', {},
          h('p', { class: 'panel__eyebrow' }, informed ? 'CONTEXTO ATIVO' : 'APENAS A PERGUNTA'),
          h('h2', {}, informed ? 'Com contexto' : 'Sem contexto'))),
      Badge({ text: informed ? 'Mais relevante' : 'Genérica', tone: informed ? 'good' : 'warn' })),
    slot,
    h('div', { class: 'panel__stage' },
      h('span', { class: 'panel__stage-label', 'aria-hidden': 'true' }, 'REDE DE PROCESSAMENTO'),
      neural.el),
    h('div', { class: 'panel__chat', 'aria-live': 'polite' }, userBubble, aiBubble),
    tags,
    h('div', { class: 'panel__metrics' }, relevance, risk));

  return {
    el,
    neural,
    setQuestion(q) { userBubble.body.textContent = q; },
    respond({ segments, level, relevance: rel, risk: rk, tags: tagList, tagTone }) {
      cancel();
      tags.replaceChildren();
      neural.setLevel(level);
      neural.setThinking(true);
      relevance.set(rel); risk.set(rk);
      aiBubble.classList.add('is-thinking');
      // pequena pausa "pensando…" antes do streaming
      const wait = setTimeout(() => {
        aiBubble.classList.remove('is-thinking');
        cancel = typewrite(aiBubble.body, segments, {
          onDone: () => { neural.setThinking(false); tags.replaceChildren(TagList({ tags: tagList, tone: tagTone })); },
        });
      }, 650);
      cancel = () => clearTimeout(wait);
      aiBubble.body.replaceChildren(h('span', { class: 'dots', 'aria-label': 'pensando' }, h('i'), h('i'), h('i')));
    },
  };
}
