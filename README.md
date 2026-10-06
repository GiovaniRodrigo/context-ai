# Context AI — a sopa de letrinhas

Uma tela **visual, animada e interativa** que mostra como uma LLM "pensa" a partir do contexto que recebe.

Letrinhas soltas flutuam pela tela, sem direção. Quando você digita uma palavra, elas começam a se atrair, se agrupar e se ligar a outros termos: sinônimos, assuntos relacionados, contexto e conceitos típicos do uso atual de LLMs. Cada palavra a mais no prompt muda os vínculos e, com isso, o resultado que a IA calcula.

O objetivo é fazer quem usa **sentir** que o prompt não é uma pergunta isolada. Ele é um conjunto de pistas, e a resposta da LLM é o caminho mais provável entre elas.

## A ideia

1. **Estado inicial: a sopa.** Letras soltas à deriva, sem significado. É a LLM sem nenhum contexto.
2. **Você digita uma palavra.** As letras correspondentes se juntam e formam o termo no centro da tela.
3. **A palavra ganha vínculos.** Surgem ao redor sinônimos, termos relacionados e temas fiéis ao uso real de LLMs (por exemplo: *prompt*, *token*, *embedding*, *janela de contexto*, *RAG*, *agente*, *alucinação*, *temperatura*).
4. **Mais contexto, outro caminho.** Ao acrescentar palavras ou frases, os vínculos se reorganizam: alguns se fortalecem, outros somem, e o resultado final muda.
5. **O resultado aparece como consequência.** A resposta é o desfecho do que a rede de termos "calculou", e você vê por que ela veio assim.

## O que o usuário deve entender

- Mudar uma palavra do prompt muda o caminho que a LLM percorre.
- Contexto específico estreita as possibilidades. Falta de contexto deixa tudo aberto e genérico.
- A LLM não "sabe" a resposta: ela pondera relações entre termos e escolhe a mais provável.

## Estado atual do projeto

O código atual é a **primeira versão**: uma comparação lado a lado entre uma IA sem contexto e uma IA com contexto, com cenários prontos (jantar, bug no código, cancelamento de pedido), cartões de contexto que se liga e desliga, e uma rede neural animada em canvas.

A sopa de letrinhas descrita acima é a **direção do projeto** e ainda não está implementada. A rede neural em canvas e o efeito de digitação já existentes servem de base para ela.

### Próximos passos

- [ ] Campo de entrada de texto que reage a cada tecla
- [ ] Letras soltas em canvas com física simples (deriva, atração, repulsão)
- [ ] Formação de palavras a partir das letras
- [ ] Grafo de vínculos: sinônimos, contexto e temas de LLM, com peso por relação
- [ ] Reorganização animada quando o prompt muda
- [ ] Resultado final derivado dos vínculos mais fortes
- [ ] Respeito a `prefers-reduced-motion`

## Tecnologias

- HTML, CSS e JavaScript puro (ES Modules), sem framework e sem etapa de build
- Canvas 2D para as animações
- Servidor estático via `python3 -m http.server`

## Como executar

Pré-requisito: Python 3 (ou qualquer servidor estático; ES Modules não funcionam via `file://`).

```bash
npm start
```

Depois abra <http://localhost:5173>.

## Estrutura do projeto

Organização em **Atomic Design**:

```
index.html
src/
├── main.js            # ponto de entrada
├── atoms/             # botão, chip, badge, switch, meter, typewriter
├── molecules/         # cartão de contexto, bolha de mensagem, métricas, seletor de cenário, lista de tags
├── organisms/         # cabeçalho, painel de chat, bandeja de contexto, rede neural (canvas)
├── templates/         # layout da comparação
├── pages/             # página inicial
├── data/scenarios.js  # cenários e itens de contexto (versão atual)
├── lib/dom.js         # helpers de DOM
└── styles/            # tokens, atoms, molecules, organisms, templates
```
