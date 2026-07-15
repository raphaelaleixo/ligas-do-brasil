# Reforma narrativa da página Copa do Brasil — Design

**Data:** 2026-07-15
**Contexto:** Depois da reforma de dados/modelo (`plans/2026-07-14-copas-ida-e-volta-desacoplamento.md`), a aba "Copa do Brasil" em `copa.html` ficou com dois desalinhamentos: (a) uma seção de copy — "A Série B tem entradas premiadas" — descreve um mecanismo (`star` no `CB_PHASES`) que foi removido no Task 2; (b) dados novos (`SERIE_A_FUNIL`, o dreno CC→CB, o ida-volta do bracket) não estão surfaced. Este spec reforma a página para a nova narrativa "bottom-up" — 168 clubes pelo funil, e a elite entra caindo no 16-avos.

## Objetivo

- **Faxina:** remover copy órfã da versão anterior do modelo.
- **Novas visualizações:** surfacear `SERIE_A_FUNIL` (breakdown regional dos 60 Série A no funil) e o dreno CC→CB (16 sobreviventes + 16 caídos = 32 no 16-avos).
- **Reordenação narrativa:** estrutura bottom-up — quem entra por onde → como o funil fecha → aí a elite cai → mata-mata ida-volta.

## Não-objetivos

- Sem mudanças na aba "Copa dos Campeões" ou na aba "Vagas Conmebol".
- Sem mudanças nos dados de `copas.js` (o modelo já está correto; apenas surface deles).
- Sem reforma visual/design system — reutiliza tokens e componentes existentes.
- Sem alterar o simulador (`src/sim/`) — continua fora do escopo, como no plano anterior.

## Nova estrutura da página (aba "Copa do Brasil")

Cinco seções, na ordem:

### 1. Lede — "A copa aberta a todos"
Substitui a atual "Do funil ao tropeço da elite" (que enterrava o gancho) por uma H2 mais direta:
> **A copa aberta a todos**
> Os 216 clubes profissionais são elegíveis — **168 entram pelo funil**, e **a elite entra caindo**. É o único torneio em que um gigante que tropeçou cruza com um clube da base.

Também ajusta a lede em `copa.html:77` (M4 do final review anterior) trocando "aberta aos 216 clubes profissionais" por algo que reflita a coexistência funil + elite ("aberta a todos os 216, do funil ao dreno da elite" — wording exato TBD na implementação).

### 2. `[NOVO]` Quem entra por onde
Renderiza `SERIE_A_FUNIL` de forma visual:
- **Barra empilhada:** 168 unidades divididas em `108 Série B` (cor `--terra`) e `60 Série A` (cor `--green`), proporção 108:60 ≈ 64%:36%.
- **Breakdown regional dos 60 SA:** grid tipo `cop-quotas` (mesma cara da tabela de vagas na aba CC), com 6 células (Nordestina 8, Paulista 8, Central 10, Sulista 10, Rio-Capixaba 10, Amazônica 14) e uma célula "Total 60".
- **Copy:** duas linhas curtas — "Todo clube da Série B começa aqui" · "Toda liga regional manda ~10 Série A pra base do funil".

### 3. O funil fecha 100%
Mantém a viz atual (`cb-phases` grid: Preliminar 80 → 1ª 128 → 2ª 64 → 3ª 32 → 16-avos 32). Sem mudanças estruturais.

**Faxina:** remove inteiramente a seção "A Série B tem entradas premiadas" (mecanismo `star` não existe mais). A explicação do "28 Série B alta entra direto na 1ª Fase" já vive no `origem` da fase 1ª — suficiente.

### 4. `[NOVO]` E aí a elite cai — viz do dreno
Substitui a H3 atual "A elite entra caindo" (que era só texto redundante com a lede) por uma micro-viz de quadradinhos consistente com o funil. Estrutura visual em 3 linhas:
- **Linha 1** (topo): 16 quadrados azuis (`--survivor`) rotulados "sobreviventes do funil".
- **Linha 2** (meio): 32 quadrados = 16 azuis + 16 dourados em uma única fileira, rotulados "16-avos · 32 clubes". Cada quadrado ainda é 1 clube, consistente com o funil.
- **Linha 3** (base): 16 quadrados dourados (`--cc_caido`) rotulados "caídos da CC".

Setas verticais (`▲` ou seta CSS) conectando linha 1↓meio e linha 3↑meio deixam claro que ambos alimentam o 16-avos.

Copy curta acima da viz: "Perdeu os 16-avos da Copa dos Campeões? Você não acabou a temporada — desce pra cá. Champions → Europa, versão brasileira."

Reutiliza `.cb-square--survivor` e `.cb-square--cc_caido` que já existem no CSS.

### 5. Mata-mata ida-e-volta
Mantém o formato atual (`cop-ko-row`) mas **preenche os detalhes vazios** de `CB_KO`:
- 16-avos: "16 sobreviventes do funil + 16 caídos dos 16-avos da CC"
- Oitavas: "8 duelos por aggregate"
- Quartas: "4 duelos por aggregate"
- Semis: "2 duelos por aggregate"
- Final: mantém "Sábado 9 nov — encerra o ciclo dos mata-matas nacionais antes das finais continentais."

Os detalhes vão em `CB_KO` em `copas.js` (dados) e são renderizados pelo template existente.

## Componentes novos (CSS)

- `.cb-entry-bar` — barra empilhada horizontal (108 SB + 60 SA em proporção 108:60). Novo bloco.
- Para o breakdown regional, **reutiliza** `.cop-quotas` já em uso na aba CC — mesmo layout de grid de células, coerência visual entre as duas abas.
- Para a viz do dreno, **reutiliza** `.cb-square` + `.cb-square--survivor` + `.cb-square--cc_caido`. Adiciona 1 wrapper `.cb-drain` que arruma as 3 linhas + setas verticais entre elas.

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `assets/js/pages/copa.js` | Reescreve `renderBrasil` (~60 linhas de template). Importa `SERIE_A_FUNIL` no top de arquivo. |
| `assets/js/data/copas.js` | Preenche os campos `detalhe` das linhas de `CB_KO` (16-avos, Oitavas, Quartas, Semis). |
| `assets/css/copa.css` | 1 novo bloco `.cb-entry-bar`, opcional `.cb-quotas` se não reutilizar. |
| `copa.html` | 1 linha na lede intro (M4). |

## Testes

- Não adiciona novos testes automatizados — todos os dados já são cobertos por `tests/copas-reforma.test.js` (funil fecha, formatos de mata-mata).
- Verificação humana visual pós-implementação (headless não permite screenshot).
- Suite existente deve continuar 98/98.

## Ordem de implementação

Uma única PR/commit é razoável pelo escopo (~120 linhas):
1. Enriquecer `CB_KO` em `copas.js` com detalhes.
2. Adicionar CSS.
3. Reescrever `renderBrasil` (a seção 2 é a mais nova; as outras 4 são adaptação).
4. Ajustar `copa.html:77`.
5. Rodar suite.
6. Commit.

## Riscos e mitigações

- **Risco:** a barra empilhada 108:60 em telas estreitas pode ficar apertada. **Mitigação:** empilhar verticalmente <480px via media query, ou usar aspect-ratio flexível.
- **Risco:** a viz do dreno (16 + 32 + 16 quadrados) pode ficar mais alta que o funil e desequilibrar o ritmo visual. **Mitigação:** manter tamanho de quadrado consistente com `.cb-square` do funil (12px).
- **Risco:** remover a seção "Série B entradas premiadas" pode parecer que a proposta favorece menos os Série B fortes. **Mitigação:** a explicação já está no `origem` da 1ª Fase ("os 28 clubes de Série B mais bem ranqueados entram direto"); adicionar meia frase no bloco 3 se ficar frio.

## Fora de escopo (backlog)

- M2 do final review anterior: se preferir renderizar `SERIE_A_FUNIL` também na aba CC (pra reforçar a simetria com `QUOTAS`), fica pra outra reforma.
- M5: comentário sobre espaçamento irregular ida/volta no calendário — não é problema desta página.
