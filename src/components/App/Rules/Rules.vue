<template>
  <div class="font-large">
    <h1>Regulamento</h1>

    <div class="surface-section p-5">
      <h2>Pontuação</h2>
      <Divider />
      <p>
        A pontuação padrão da plataforma de palpites segue as seguintes regras:
      </p>

      <RuleCard v-for="(rule, index) in rules" :key="index" :rule="rule" />
    </div>
  </div>
</template>

<script setup>
import RuleCard from './RuleCard/RuleCard.vue'

const rules = [
  {
    points: 4,
    hint: 'pontuação máxima por palpite',
    description: 'Caso você acerte o placar <b>exato</b>',
    examples: [
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        },
        result: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 3
        },
        result: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 3
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 0
        },
        result: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 0
        }
      }
    ]
  },
  {
    points: 3,
    description:
      'Caso você acerte empate com o placar incorreto <b>ou</b> acerte o vencedor e seu respectivo número de gols',
    examples: [
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        },
        result: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 0
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 4
        },
        result: {
          homeTeamRegularTimeGoals: 1,
          awayTeamRegularTimeGoals: 4
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 1,
          awayTeamRegularTimeGoals: 1
        },
        result: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 2
        }
      }
    ]
  },
  {
    points: 2,
    description:
      'Caso você acerte o vencedor, errando seu número exato de gols <b>e</b> acerte o número de gols do perdedor',
    examples: [
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        },
        result: {
          homeTeamRegularTimeGoals: 3,
          awayTeamRegularTimeGoals: 1
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 4
        },
        result: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 1
        }
      }
    ]
  },
  {
    points: 1,
    hint: 'pontuação mínima por palpite',
    description: 'Caso você acerte o vencedor porém erre o placar',
    examples: [
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        },
        result: {
          homeTeamRegularTimeGoals: 4,
          awayTeamRegularTimeGoals: 0
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 2
        },
        result: {
          homeTeamRegularTimeGoals: 1,
          awayTeamRegularTimeGoals: 3
        }
      }
    ]
  },
  {
    points: 0,
    description: 'Caso você erre o vencedor e placar',
    examples: [
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        },
        result: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 3
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 2
        },
        result: {
          homeTeamRegularTimeGoals: 5,
          awayTeamRegularTimeGoals: 3
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 0,
          awayTeamRegularTimeGoals: 0
        },
        result: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 1
        }
      },
      {
        guess: {
          homeTeamRegularTimeGoals: 2,
          awayTeamRegularTimeGoals: 0
        },
        result: {
          homeTeamRegularTimeGoals: 1,
          awayTeamRegularTimeGoals: 1
        }
      }
    ]
  }
]
</script>
