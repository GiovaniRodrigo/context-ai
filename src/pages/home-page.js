import { h } from '../lib/dom.js';
import { scenarios } from '../data/scenarios.js';
import { Button } from '../atoms/button.js';
import { ScenarioPicker } from '../molecules/scenario-picker.js';
import { ChatPanel } from '../organisms/chat-panel.js';
import { ContextTray } from '../organisms/context-tray.js';
import { SiteHeader } from '../organisms/site-header.js';
import { ComparisonTemplate } from '../templates/comparison-template.js';

function FloatingLetters() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const columns = 10;
  const glyphs = Array.from({ length: 90 }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const x = 2.5 + column * 10.1 + ((index * 7) % 6);
    const y = 1.5 + row * 11.3 + ((index * 11) % 5);
    const size = [0.72, 0.88, 1.02, 1.22, 1.45][index % 5];
    const opacity = [0.16, 0.23, 0.18, 0.28, 0.2][index % 5];
    const style = [
      `--glyph-x:${x.toFixed(1)}%`,
      `--glyph-y:${y.toFixed(1)}%`,
      `--glyph-size:${size}rem`,
      `--glyph-opacity:${opacity}`,
      `--glyph-tilt:${(index * 13) % 15 - 7}deg`,
      `--glyph-delay:-${((index * 7) % 120) / 10}s`,
      `--glyph-duration:${14 + (index * 5) % 13}s`,
      `--glyph-drift-x:${(index * 7) % 25 - 12}px`,
      `--glyph-drift-y:${(index * 11) % 25 - 12}px`,
    ].join(';');
    const tone = index % 9 === 0 ? ' letter-field__glyph--warm' : '';

    return h('span', {
      class: `letter-field__glyph${tone}`,
      style,
    }, alphabet[(index * 17 + row) % alphabet.length]);
  });

  return h('div', { class: 'letter-field', 'aria-hidden': 'true' }, glyphs);
}

export function HomePage() {
  const state = { scenario: scenarios[0], enabled: new Set(scenarios[0].context.map((c) => c.id)) };

  const blind = ChatPanel({ variant: 'blind' });
  const trayHost = h('div', { class: 'tray-host' });
  const informed = ChatPanel({ variant: 'informed' });
  const pickerHost = h('div', { class: 'picker-host' });
  const question = h('p', { class: 'question', 'aria-live': 'polite' });

  // monta a resposta com contexto a partir dos itens ligados
  function informedAnswer() {
    const { context, partial, full, without } = state.scenario;
    const active = context.filter((c) => state.enabled.has(c.id));
    if (!active.length) return { segments: [{ text: without }], level: 0, relevance: 15, risk: 78, tags: ['Sem contexto ligado'], tagTone: 'warn' };
    const segments = [];
    active.forEach((c) => { segments.push({ text: c.text, ctx: c.id }, { text: ' ' }); });
    segments.push({ text: active.length === context.length ? full : partial });
    const ratio = active.length / context.length;
    return {
      segments, level: ratio,
      relevance: 15 + 85 * ratio, risk: 78 - 68 * ratio,
      tags: active.map((c) => `${c.icon} ${c.title}`), tagTone: 'good',
    };
  }

  function runBlind() {
    blind.respond({
      segments: [{ text: state.scenario.without }], level: 0,
      relevance: 15, risk: 78, tags: state.scenario.withoutTags, tagTone: 'warn',
    });
  }
  const runInformed = () => informed.respond(informedAnswer());

  function ask() {
    blind.setQuestion(state.scenario.question);
    informed.setQuestion(state.scenario.question);
    question.textContent = `“${state.scenario.question}”`;
    informed.neural.burst(18);
    runBlind();
    runInformed();
  }

  function renderControls() {
    pickerHost.replaceChildren(ScenarioPicker({
      scenarios, activeId: state.scenario.id,
      onSelect: (id) => {
        state.scenario = scenarios.find((s) => s.id === id);
        state.enabled = new Set(state.scenario.context.map((c) => c.id));
        renderControls();
        ask();
      },
    }));
    trayHost.replaceChildren(ContextTray({
      items: state.scenario.context, enabled: state.enabled,
      onToggle: (id, on) => {
        on ? state.enabled.add(id) : state.enabled.delete(id);
        if (on) informed.neural.burst(10);
        trayHost.querySelector(`[data-ctx="${id}"]`)?.classList.toggle('is-on', on);
        runInformed();
      },
    }));
  }

  renderControls();
  const page = ComparisonTemplate({
    header: SiteHeader(),
    tray: trayHost,
    controls: [
      h('section', { class: 'scenario-control', id: 'comparacao', 'aria-label': 'Etapa 1: escolha um cenário' },
        h('div', { class: 'control-heading' },
          h('div', { class: 'control-heading__title' },
            h('span', { class: 'step-number', 'aria-hidden': 'true' }, '01'),
            h('div', {},
              h('h2', {}, 'Escolha a situação'),
              h('p', {}, 'A pergunta e o contexto mudam junto.'))),
          h('span', { class: 'control-count' }, `${scenarios.length} CENÁRIOS`)),
        pickerHost),
      h('div', { class: 'prompt-bar' },
        h('div', { class: 'prompt-bar__copy' },
          h('span', { class: 'prompt-label' }, 'PERGUNTA ATUAL'),
          question),
        Button({ label: 'Comparar respostas', icon: '→', onClick: ask })),
    ],
    left: blind.el,
    right: informed.el,
    footer: h('footer', { class: 'site-footer' },
      h('span', { class: 'site-footer__label' }, 'EM UMA FRASE'),
      h('p', {}, h('strong', {}, 'Contexto'), ' é tudo o que acompanha a pergunta: preferências, histórico, documentos e dados relevantes.'),
      h('p', { class: 'site-footer__note' }, 'As respostas e métricas desta página são exemplos simulados para demonstração.')),
  });

  // primeira execução, após o layout existir
  requestAnimationFrame(() => setTimeout(ask, 400));
  return h('div', { class: 'page-shell' }, FloatingLetters(), page);
}
