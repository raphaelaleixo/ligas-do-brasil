# Projeto Futebol Brasileiro 2.0 - Especificações do Front-End

Este documento orienta a criação da interface web interativa para visualizar a reforma estrutural e os dados gerados pelo simulador (`clubes.json`, `calendario_geral.json` e `perfis_dashboard.json`).

## 1. Stack Tecnológica Recomendada
- **Framework:** Next.js (React) com TypeScript (App Router).
- **Estilização:** TailwindCSS + Shadcn/ui (para componentes de tabela, cards e abas).
- **Gráficos:** Recharts ou Tremor (para a timeline e gráficos de desgaste).
- **Ícones:** Lucide React.

## 2. Arquitetura de Telas e Componentes

### Tela 1: Dashboard Geral (O Impacto da Pirâmide)
- **Métricas de Destaque (Cards):**
  - [cite_start]Total de Clubes Ativos: 192 [cite: 1589]
  - [cite_start]Teto Máximo de Jogos: 60 [cite: 1589]
  - [cite_start]Meses de Calendário Garantido: 10 meses (Agosto a Maio) [cite: 1589, 2257]
  - [cite_start]Clubes Desempregados em Abril: 0 [cite: 1589]
- **Gráficos de Comparação de Desgaste:**
  - [cite_start]Gráfico de barras horizontais usando os dados de `perfis_dashboard.json`, comparando o Modelo Atual (Insano de 80 jogos) contra o Modelo 2.0 (Elite, Classe Média e Base)[cite: 1605, 1606].

### Tela 2: Central das Ligas Regionais
- [cite_start]**Seletor de Liga:** Abas (Tabs) para alternar entre as 6 Ligas (Paulista, Nordeste, Sulista, Mineira/CO, Guanabara-Capixaba, Norte)[cite: 1592].
- [cite_start]**Tabela de Classificação:** - Renderizar os clubes de cada liga (Série A e Série B) ordenados por pontos[cite: 1592, 1973].
  - [cite_start]**Destaque Visual:** Colorir as linhas de qualificação (Zonas de classificação para a Copa dos Campeões, Sul-Americana e Rebaixamento)[cite: 1593].

### Tela 3: A Linha do Tempo Dinâmica (O Calendário)
- [cite_start]**Seletor de Clube:** Um input de busca (Combobox) para o usuário escolher qualquer um dos 192 times[cite: 1597].
- [cite_start]**Timeline Anual:** Um componente de linha do tempo ou grade dividida nas 42 semanas utilizáveis[cite: 1596].
  - Cada bloco de semana deve mostrar de forma visual os jogos daquele clube baseados no `calendario_geral.json`.
  - [cite_start]**Filtro de Cores por Competição:** Diferenciar visualmente os jogos da Liga Regional, Copa do Brasil, Copa dos Campeões e Conmebol[cite: 1598].

### Tela 4: Copa dos Campeões (Modo Competição)
- [cite_start]**Fase de Grupos:** Exibir os 12 grupos de 4 times em formato de cards de tabela[cite: 1602, 2325].
- [cite_start]**Chaveamento do Mata-Mata:** Uma árvore visual de colunas para o mata-mata de jogo único a partir dos 16 avos de final até a Grande Final[cite: 1603, 2328].

## 3. Comportamento e Interatividade
- [cite_start]**Estado de Simulação:** Adicionar um botão no header "Rodar Simulação em Tempo Real"[cite: 1591]. [cite_start]Quando clicado, ele dispara o script Python via API (ou simula o preenchimento progressivo dos dados na tela) atualizando os gráficos e tabelas com um efeito visual de transição[cite: 1593].