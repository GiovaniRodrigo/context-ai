import { h } from '../lib/dom.js';
import { Chip } from '../atoms/chip.js';

export function ScenarioPicker({ scenarios, activeId, onSelect }) {
  return h('div', { class: 'scenario-picker', role: 'group', 'aria-label': 'Escolha um cenário' },
    scenarios.map((s) => Chip({ label: s.label, icon: s.icon, active: s.id === activeId, onClick: () => onSelect(s.id) })));
}
