# Projeto Futebol Brasileiro 2.0 - Regras de Negócio e Engenharia do Calendário

Este documento estabelece as diretrizes estritas para a simulação da reforma estrutural do futebol brasileiro, baseada no Ano Civil (Janeiro a Dezembro).

## 1. Estrutura do Ecossistema (192 Clubes)
O sistema gerencia 192 clubes profissionais divididos igualmente em 6 Ligas Regionais. Cada liga possui uma Série A (18 times) e uma Série B (14 times).

### As 6 Ligas Regionais:
1. **Liga Paulista:** 18 times na Série A.
2. **Liga Nordeste:** 18 times na Série A.
3. **Liga Sulista (RS, SC, PR):** 18 times na Série A.
4. **Liga Mineira/Centro-Oeste (MG, GO, MT, MS, DF):** 18 times na Série A.
5. **Liga Guanabara-Capixaba (RJ, ES):** 18 times na Série A.
6. **Liga Norte:** 18 times na Série A.

## 2. Competições e Algoritmos de Pareamento

### A. Ligas Regionais (Série A e B)
- **Formato:** Pontos corridos, turno e returno (34 rodadas).
- **Dias de Jogo:** Exclusivamente aos **Finais de Semana** (Sábados/Domingos).
- **Acesso/Descenso:** Os 3 piores de cada Série A caem para a Série B regional do ano seguinte; os 3 melhores da Série B sobem.
- **Vagas Nacionais:** O desempenho define os classificados para a Copa dos Campeões Regionais do *ano seguinte*.

### B. Copa dos Campeões Regionais (O Novo "Brasileirão")
- **Participantes:** 48 clubes qualificados via Ligas Regionais do ano anterior.
- **Distribuição Demográfica de Vagas:**
  - Liga Nordeste: 10 vagas
  - Liga Paulista: 10 vagas
  - Liga Guanabara-Capixaba: 8 vagas
  - Liga Sulista: 8 vagas
  - Liga Mineira/Centro-Oeste: 8 vagas
  - Liga Norte: 4 vagas
- **Fase de Grupos (Modelo FIFA 48 times):** 12 grupos de 4 times. Turno único (3 jogos por time).
  - *Trava Geográfica:* Clubes da mesma Liga Regional não podem cair no mesmo grupo.
- **Fase de Mata-Mata:** Avançam os 2 melhores de cada grupo (24) + os 8 melhores terceiros colocados, totalizando 32 times.
- **Formato do Mata-Mata:** Jogo Único (Eliminatória simples) em 5 fases: 16 avos, Oitavas, Quartas, Semifinal e Grande Final (Sede neutra).
- **Dias de Jogo:** Exclusivamente nos **Meios de Semana** (Quartas/Quintas).
- **Total de Jogos do Finalista:** 8 jogos.

### C. Copa do Brasil (O Funil da Base)
- **Participantes:** 144 clubes (108 da Série A regional + 36 melhores da Série B regional do ano anterior).
- **Formato:** Mata-mata em Jogo Único do início ao fim.
- **Dias de Jogo:** Exclusivamente nos **Meios de Semana**.
- **Regra de Bypass da Elite:** Os 13 times classificados para competições da Conmebol (Libertadores e Sul-Americana) entram direto na Fase de 16 avos de final (32 times).
- **Algoritmo do Funil Matemático (131 clubes da base gerando 19 sobreviventes):**
  1. *Fase Preliminar:* 26 times de menor ranking se enfrentam em jogo único -> 13 avançam.
  2. *Primeira Fase:* Os 13 sobreviventes + 105 clubes restantes = 118 times se enfrentam -> 59 avançam.
  3. *Segunda Fase:* Os 59 sobreviventes + 1 vaga de convidado técnico/campeão regional anterior = 60 times -> 30 avançam.
  4. *Terceira Fase:* Os 30 times se enfrentam -> 15 avançam.
  5. *Filtro Final dos 19:* Os 15 sobreviventes ganham a companhia dos 4 melhores eliminados da fase anterior (Lucky Losers) por índice técnico -> 19 sobreviventes finais.
  6. *Consolidação:* 19 sobreviventes da base + 13 gigantes do Bypass = 32 times nos 16 avos de final.
- **Total de Jogos da Elite:** Exatos 5 jogos para quem entra nos 16 avos.

### D. Distribuição de Vagas Conmebol
Calculada ao final da temporada com base nos seguintes critérios hierárquicos:
- **Copa Libertadores (7 Vagas):**
  1. Vaga 1: Campeão da Copa dos Campeões Regionais
  2. Vaga 2: Vice-campeão da Copa dos Campeões Regionais
  3. Vaga 3: Campeão da Copa do Brasil
  4. Vaga 4: Semifinalista 1 da Copa dos Campeões Regionais
  5. Vaga 5: Semifinalista 2 da Copa dos Campeões Regionais
  6. Vaga 6: Vice-campeão da Copa do Brasil
  7. Vaga 7 (G7): Melhor campanha geral na Copa dos Campeões Regionais que ainda não tenha vaga.
  *(Efeito Cascata: Se houver acúmulo de títulos, a vaga desce sequencialmente para a tabela geral da Copa dos Campeões).*
- **Copa Sul-Americana (6 Vagas):**
  - Destinada diretamente ao **melhor time classificado de cada uma das 6 Ligas Regionais** que não tenha conseguido vaga na Libertadores.

## 3. Restrições e Métricas de Validação do Calendário
- **Duração da Temporada:** 10 meses (Janeiro a Dezembro, excluindo férias/Data FIFA).
- **Semanas Utilizáveis:** 42 semanas (teto de 84 datas disponíveis).
- **Teto Físico da Elite:** Um clube que chegue a todas as finais possíveis (inclusive Libertadores) jogará exatamente **60 jogos**:
  $$\text{Liga Regional (34)} + \text{Copa dos Campeões (8)} + \text{Copa do Brasil (5)} + \text{Libertadores (13)} = \mathbf{60\text{ jogos}}$$
- **Equilíbrio de Esforço:** A temporada deve apresentar exatamente **21 semanas de rodada dupla** (Quarta e Domingo) e **21 semanas de rodada simples** (Apenas final de semana) para o clube de elite.
- **Estabilidade da Base:** Times da Série B ou eliminados precocemente devem manter um calendário regular de 34 datas distribuídas ao longo dos 10 meses, evitando desemprego sazonal.