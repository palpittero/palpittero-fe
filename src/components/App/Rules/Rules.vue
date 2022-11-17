<template>
  <div class="flex flex-column gap-3 font-large">
    <div class="surface-section p-3">
      <h2>Pontuação - Tempo Regular</h2>
      <Divider />
      <p>
        A pontuação padrão da segue as seguintes regras para palpites do
        resultaods de tempo regular de jogo:
      </p>

      <RuleCard
        v-for="(rule, index) in rules"
        :key="index"
        header="Resultado do Tempo Regular"
        :rule="rule"
      />
    </div>
    <Divider />
    <div class="surface-section p-3">
      <h2>Pontuação - BÔNUS (Pênaltis)*</h2>
      <Divider />
      <p>
        A pontuação bônus segue as seguintes regras para palpites de resultados
        de disputas de pênaltis:
      </p>

      <RuleCard
        v-for="(rule, index) in penaltiesRules"
        :key="index"
        header="Resultado da Disputa de Pênaltis"
        :rule="rule"
      />

      <em>* disputas de pênaltis nunca terminarão empatadas</em>
    </div>
  </div>
</template>

<script setup>
import RuleCard from './RuleCard/RuleCard.vue'

const rules = [
  {
    points: 5,
    hint: 'pontuação máxima por palpite',
    description: 'Caso você acerte o placar <b>exato</b>',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0
        }
      }
    ]
  },
  {
    points: 4,
    description:
      'Caso você acerte empate com o placar incorreto <b>ou</b> acerte o vencedor e seu respectivo número de gols',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 0
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 4
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 2
        }
      }
    ]
  },
  {
    points: 3,
    description:
      'Caso você acerte o vencedor, errando seu número exato de gols <b>e</b> acerte o número de gols do perdedor',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 1
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 1
        }
      }
    ]
  },
  {
    points: 2,
    description: 'Caso você acerte o vencedor porém erre o placar',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 4,
          regularTimeAwayTeamGoals: 0
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 2
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 3
        }
      }
    ]
  },
  {
    points: 1,
    hint: 'pontuação mínima por palpite',
    description:
      'Caso você acerte o <b>número de gols</b> de pelo menos um dos times',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 2
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 1
        }
      }
    ]
  },
  {
    points: 0,
    description:
      'Caso você erre o vencedor e placar do resultado do tempo regular',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 2
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 3
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 0
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 1
        }
      }
    ]
  }
]

const penaltiesRules = [
  {
    points: 5,
    hint: 'pontuação máxima por palpite',
    description:
      'Caso você acerte o placar <b>exato</b> da disputa de pênaltis',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 1
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3
        }
      }
    ]
  },
  {
    points: 4,
    description: 'Caso você acerte o vencedor e seu respectivo número de gols',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 2
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 4
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 2
        }
      }
    ]
  },
  {
    points: 3,
    description:
      'Caso você acerte o vencedor, errando seu número exato de gols <b>e</b> acerte o número de gols do perdedor',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 4,
          regularTimeAwayTeamGoals: 3
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 3
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 5
        }
      }
    ]
  },
  {
    points: 2,
    description: 'Caso você acerte o vencedor porém erre o placar',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 4,
          regularTimeAwayTeamGoals: 3
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 3
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 5
        }
      }
    ]
  },
  {
    points: 1,
    hint: 'pontuação mínima por palpite',
    description:
      'Caso você acerte o <b>número de gols</b> de pelo menos um dos times',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 3
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 3
        }
      }
    ]
  },
  {
    points: 0,
    description:
      'Caso você erre o vencedor e placar final da disputa de pênaltis',
    examples: [
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 3
        }
      },
      {
        guess: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 4
        },
        result: {
          homeTeam: {
            name: 'Time da Casa'
          },
          awayTeam: {
            name: 'Time Visitante'
          },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 3
        }
      }
    ]
  }
]
</script>
