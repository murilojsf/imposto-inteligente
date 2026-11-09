# Imposto Inteligente | Simulador Tributário PF vs PJ

## 🤖 Projeto Desenvolvido com Inteligência Artificial (IA)

Este protótipo funcional foi desenvolvido com auxílio de Inteligência Artificial na plataforma [Lovable](https://lovable.dev), utilizando Engenharia de Prompts e desenvolvimento assistido para construir uma interface financeira e implementar simulações tributárias locais.

O **Imposto Inteligente** compara estimativas de impostos, custos e renda líquida entre **Pessoa Física (PF)** e **Pessoa Jurídica (PJ)**. O objetivo é apresentar os cenários de forma clara, com atualização instantânea e caráter exclusivamente educacional.

## 🌟 Principais Destaques do Projeto

### 1. Formulário de Simulação

- **Renda mensal:** campo numérico e slider para ajustar o valor recebido.
- **Projeção anual:** estimativa automática baseada na renda mensal informada.
- **Dados complementares:** atividade exercida, estado e cidade.
- **Custos operacionais:** seleção de existência de custos e valor mensal estimado.
- **Cenários PJ:** MEI, Simples Nacional, LTDA e SLU; LTDA e SLU são simuladas no Simples Nacional.
- **Anexos do Simples:** seleção manual entre Anexo III e Anexo V.

### 2. Simulação como Pessoa Física

- Estimativa de INSS e IRPF mensal, apresentado na interface como IRPF (DARF).
- Demonstrativo de renda bruta, total de impostos e renda líquida.
- Exibição da alíquota efetiva sobre a renda informada.

### 3. Simulação como Pessoa Jurídica

- **MEI:** estimativa de DAS fixo para serviços e aviso quando a projeção anual ultrapassa o limite configurado.
- **Simples Nacional:** estimativa de DAS com base no faturamento anual projetado e no anexo selecionado.
- **Pró-labore:** valor estimado, com cálculo simplificado de INSS e IRRF.
- **Distribuição de lucros:** estimativa baseada nas premissas do modelo.
- **Custos PJ:** discriminação de custos operacionais e contador estimado.
- **Resultado final:** impostos totais, alíquota efetiva e renda líquida mensal.

### 4. Comparação Visual PF vs PJ

- Demonstrativos lado a lado para facilitar a leitura dos dois cenários.
- Barras comparativas da renda líquida mensal.
- Destaque do cenário com maior resultado líquido na simulação.
- Diferença estimada mensal e anual entre os resultados.
- Atualização automática ao modificar os campos usados nos cálculos.

### 5. Interface & Experiência de Uso

- Interface financeira com organização visual de dados e valores em reais.
- Layout adaptável a diferentes tamanhos de tela.
- Campos numéricos, seletores e slider de renda.
- Cálculos realizados localmente, sem consultas a APIs tributárias externas.
- Sem cadastro de usuário ou armazenamento das simulações nesta versão.

## 🤖 Desenvolvimento com Inteligência Artificial

O projeto demonstra a aplicação de IA no desenvolvimento de um protótipo financeiro:

- **Prototipação de MVP:** construção do formulário, demonstrativos e comparação de cenários.
- **Interface & UX:** organização visual das informações para facilitar a leitura dos resultados.
- **Lógica de simulação:** implementação de funções locais para estimativas de impostos e custos.
- **Evolução assistida:** continuidade do desenvolvimento no Lovable, com possibilidade de sincronização do código com o GitHub.

## 🛠️ Tecnologias Utilizadas

- **React 19 e TypeScript:** interface e tipagem do projeto.
- **TanStack Start e TanStack Router:** estrutura da aplicação e navegação.
- **Vite 7:** servidor de desenvolvimento e geração da versão de produção.
- **Tailwind CSS 4:** estilização.
- **shadcn/ui e Radix UI:** componentes de interface.
- **Lucide React:** ícones.
- **Hooks do React:** estado do formulário e atualização dos cálculos.

## ⚠️ Premissas & Limitações

> **Simulação tributária educacional.** Os resultados são estimativas e não constituem aconselhamento jurídico, contábil ou garantia de economia. Consulte um contador antes de tomar decisões.

- As constantes tributárias do protótipo contêm referências de **2024/2025** e simplificações; não devem ser consideradas automaticamente vigentes em 2026 ou em anos posteriores.
- O modelo de INSS PF utiliza faixas progressivas e não contempla todas as formas de contribuição e recebimento de um profissional autônomo.
- O aplicativo não emite DARF, DAS ou qualquer guia oficial, nem transmite declarações fiscais.
- Atividade, estado e cidade são campos informativos: atualmente não alteram os cálculos nem validam o enquadramento tributário.
- O anexo é selecionado manualmente; o sistema não calcula o fator R nem valida a elegibilidade da atividade para MEI ou Simples Nacional.
- A receita dos últimos 12 meses é aproximada pela renda mensal multiplicada por 12.
- Pró-labore, contador e tratamento da distribuição de lucros usam premissas simplificadas, que exigem revisão conforme cada situação.
- Não são contempladas todas as deduções, dependentes, particularidades municipais ou cenários fora dos limites dos regimes simulados.
- A diferença anual é uma projeção da diferença mensal multiplicada por 12, não um cálculo completo de ajuste anual do IRPF.

## 🚀 Como Executar o Projeto Localmente

Tenha o **Bun** instalado e abra um terminal na pasta do projeto.

```sh
# Instalar dependências
bun install

# Iniciar o servidor de desenvolvimento
bun run dev

# Gerar a versão de produção
bun run build

# Executar a análise de código
bun run lint
```

Acesse o endereço exibido no terminal após iniciar o servidor. A porta pode variar conforme o ambiente.

## 🔗 Desenvolvimento no Lovable

Continue desenvolvendo no [editor do projeto](https://lovable.dev/projects/15f51b1f-ddd9-49f8-9f0d-07d2d07a51f1).

Quando a sincronização Git estiver conectada, alterações feitas no Lovable são enviadas ao repositório vinculado, e alterações enviadas à branch sincronizada no GitHub retornam ao projeto.

---

Desenvolvido com auxílio de IA na plataforma **Lovable** · Protótipo educacional de comparação tributária.
