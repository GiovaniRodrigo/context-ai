// Cada cenário: uma pergunta, uma resposta genérica (sem contexto) e
// itens de contexto que, quando ativos, acrescentam trechos específicos à resposta.
export const scenarios = [
  {
    id: 'jantar',
    label: 'Onde jantar?',
    icon: '🍽️',
    question: 'Onde devo jantar hoje à noite?',
    without:
      'Existem muitas opções excelentes! Depende do seu gosto, orçamento e localização. Você poderia considerar um restaurante italiano ou japonês bem avaliado. Que tal consultar avaliações online?',
    withoutTags: ['Genérica', 'Sem localização', 'Chute'],
    context: [
      { id: 'diet', icon: '🥗', title: 'Dieta', detail: 'Vegetariana', text: 'Como você é vegetariana, descartei churrascarias e fui direto para cardápios sem carne.' },
      { id: 'place', icon: '📍', title: 'Localização', detail: 'Pinheiros, São Paulo', text: 'Estando em Pinheiros, busquei só opções a até 10 minutos a pé.' },
      { id: 'budget', icon: '💸', title: 'Orçamento', detail: 'até R$ 90 por pessoa', text: 'Priorizei lugares até R$ 90 por pessoa, o seu orçamento.' },
      { id: 'date', icon: '🎂', title: 'Calendário', detail: 'Aniversário de namoro hoje', text: 'Como hoje é o aniversário de namoro de vocês, filtrei lugares tranquilos e com mesa reservada.' },
    ],
    partial: 'Quer que eu refine a busca com mais detalhes?',
    full: 'Resultado: Raiz Verde, 20h30, mesa na varanda. Confirmo a reserva?',
  },
  {
    id: 'bug',
    label: 'Bug no código',
    icon: '🐞',
    question: 'Por que meu componente quebra ao abrir o carrinho?',
    without:
      'Pode haver vários motivos: erro de sintaxe, variável indefinida, dependências desatualizadas ou problema de estado. Tente verificar o console e adicionar alguns logs para investigar.',
    withoutTags: ['Genérica', 'Sem código', 'Chute'],
    context: [
      { id: 'trace', icon: '🧨', title: 'Stack trace', detail: "TypeError … reading 'map' · CartList.tsx:14", text: 'O erro é um TypeError em CartList.tsx, linha 14: você chama .map em algo que está undefined.' },
      { id: 'commit', icon: '🔀', title: 'Commit recente', detail: 'refactor: API do carrinho retorna { items }', text: 'Isso começou no último commit: a API agora devolve { items: [...] } em vez de um array direto.' },
      { id: 'code', icon: '📄', title: 'Trecho do código', detail: 'cart.map(item => …)', text: 'No componente, `cart.map(...)` ainda trata a resposta como se fosse um array.' },
      { id: 'tests', icon: '🧪', title: 'Testes', detail: 'CartList.test.tsx passa com mock antigo', text: 'O teste continua verde porque o mock ainda usa o formato antigo; ele precisa ser atualizado também.' },
    ],
    partial: 'Com mais contexto consigo apontar a correção exata.',
    full: 'Correção: troque por `cart.items.map(...)` e atualize o mock do teste.',
  },
  {
    id: 'suporte',
    label: 'Cancelar pedido',
    icon: '📦',
    question: 'Quero cancelar meu pedido.',
    without:
      'Sinto muito pelo transtorno. Para cancelar, acesse sua conta, vá em "Meus pedidos" e selecione a opção de cancelar. Se não encontrar, entre em contato com o suporte.',
    withoutTags: ['Genérica', 'Sem pedido', 'Passo-a-passo cego'],
    context: [
      { id: 'order', icon: '📦', title: 'Pedido', detail: '#4821 · saiu para entrega às 14h', text: 'Seu pedido #4821 já saiu para entrega, então o cancelamento direto não está mais disponível.' },
      { id: 'policy', icon: '📜', title: 'Política da loja', detail: 'Recusa na porta = reembolso integral', text: 'Pela política da loja, se você recusar na porta, o reembolso integral cai em até 3 dias úteis.' },
      { id: 'history', icon: '💬', title: 'Conversa anterior', detail: 'Endereço digitado errado ontem', text: 'Vi que você relatou ontem um endereço errado, então posso redirecionar a entrega sem custo.' },
      { id: 'tier', icon: '⭐', title: 'Perfil', detail: 'Cliente Premium', text: 'Como cliente Premium, o frete de devolução fica por nossa conta.' },
    ],
    partial: 'Posso detalhar as opções assim que souber mais sobre o pedido.',
    full: 'Prefere recusar na porta ou redirecionar a entrega para o endereço certo?',
  },
];
