# Especificação de Input/Output do Simulador - Estrutura JSON

Para integrar o motor de simulação ao front-end do site, o script deve gerar um output no formato JSON seguindo a estrutura abaixo.

## 1. Objeto de Configuração dos Clubes (`clubes.json`)
```json
[
  {
    "id": "BOT",
    "nome": "Botafogo",
    "liga_regional": "Guanabara-Capixaba",
    "divisao": "A",
    "ranking_forca": 9,
    "estatisticas_temporada": {
      "jogos_totais": 0,
      "jogos_fim_semana": 0,
      "jogos_meio_semana": 0,
      "vitorias": 0,
      "empates": 0,
      "derrotas": 0,
      "gols_pro": 0,
      "gols_contra": 0
    },
    "status_ano_seguinte": {
      "classificado_copa_campeoes": false,
      "vaga_conmebol": "Nenhuma", 
      "rebaixado": false
    }
  }
]