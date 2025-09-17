<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1
        class="text-3xl md:text-4xl font-bold text-base-content flex items-center justify-center gap-3 mb-2"
      >
        <i class="fa-solid fa-book" />
        Regras de Pontuação
      </h1>
      <p class="text-base-content/70">Como funciona a pontuação dos seus palpites</p>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-2">
          <span class="text-primary">⚽</span>
          Pontuação - Tempo Regular
        </h2>
        <div class="divider"></div>
        <p class="text-base-content/80 mb-6">
          A pontuação padrão segue as seguintes regras para palpites do resultado de tempo regular
          de jogo:
        </p>

        <div class="space-y-4">
          <RuleCard
            v-for="(rule, index) in rules"
            :key="index"
            header="Resultado do Tempo Regular"
            :rule="rule"
          />
        </div>
      </div>
    </div>

    <!-- Penalties Scoring -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-2">
          <span class="text-secondary">🥅</span>
          Pontuação - BÔNUS (Pênaltis)*
        </h2>
        <div class="divider"></div>
        <p class="text-base-content/80 mb-6">
          A pontuação bônus segue as seguintes regras para palpites de resultados de disputas de
          pênaltis:
        </p>

        <div class="space-y-4">
          <RuleCard
            v-for="(rule, index) in penaltiesRules"
            :key="index"
            header="Resultado da Disputa de Pênaltis"
            :rule="rule"
          />
        </div>

        <div class="alert alert-info mt-6">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span><em>* disputas de pênaltis nunca terminarão empatadas</em></span>
        </div>
      </div>
    </div>

    <!-- Championship Positions Scoring -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-2">
          <span class="text-accent">🏆</span>
          Pontuação - Campeão / Vice-campeão
        </h2>
        <div class="divider"></div>
        <p class="text-base-content/80 mb-6">
          A pontuação padrão segue as seguintes regras para palpites de campeão e vice-campeão de um
          determinado campeonato:
        </p>

        <div class="space-y-4">
          <RuleCard
            v-for="(rule, index) in positionsRules"
            :key="index"
            header="Resultado Final do Campeonato"
            :rule="rule"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RuleCard from '@/components/App/Rules/RuleCard.vue'

const rules = [
  {
    points: 5,
    hint: 'pontuação máxima por palpite',
    description: 'Caso você acerte o placar <b>exato</b>',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
      },
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3,
        },
      },
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 0,
        },
      },
    ],
  },
  {
    points: 4,
    description:
      'Caso você acerte empate com o placar incorreto <b>ou</b> acerte o vencedor e seu respectivo número de gols',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 0,
        },
      },
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 2,
        },
      },
    ],
  },
  {
    points: 3,
    description:
      'Caso você acerte o vencedor, errando seu número exato de gols <b>e</b> acerte o número de gols do perdedor',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 3,
          regularTimeAwayTeamGoals: 1,
        },
      },
    ],
  },
  {
    points: 2,
    description: 'Caso você acerte o vencedor porém erre o placar',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 4,
          regularTimeAwayTeamGoals: 0,
        },
      },
    ],
  },
  {
    points: 1,
    hint: 'pontuação mínima por palpite',
    description: 'Caso você acerte o <b>número de gols</b> de pelo menos um dos times',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 2,
        },
      },
    ],
  },
  {
    points: 0,
    description: 'Caso você erre o vencedor e placar do resultado do tempo regular',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 0,
          regularTimeAwayTeamGoals: 3,
        },
      },
    ],
  },
]

const penaltiesRules = [
  {
    points: 5,
    hint: 'pontuação máxima por palpite',
    description: 'Caso você acerte o placar <b>exato</b> da disputa de pênaltis',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4,
        },
      },
    ],
  },
  {
    points: 4,
    description: 'Caso você acerte o vencedor e seu respectivo número de gols',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 2,
        },
      },
    ],
  },
  {
    points: 3,
    description:
      'Caso você acerte o vencedor, errando seu número exato de gols <b>e</b> acerte o número de gols do perdedor',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 4,
          regularTimeAwayTeamGoals: 3,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 3,
        },
      },
    ],
  },
  {
    points: 2,
    description: 'Caso você acerte o vencedor porém erre o placar',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 4,
          regularTimeAwayTeamGoals: 3,
        },
      },
    ],
  },
  {
    points: 1,
    hint: 'pontuação mínima por palpite',
    description: 'Caso você acerte o <b>número de gols</b> de pelo menos um dos times',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 3,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 3,
        },
      },
    ],
  },
  {
    points: 0,
    description: 'Caso você erre o vencedor e placar final da disputa de pênaltis',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 5,
          regularTimeAwayTeamGoals: 4,
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 1,
          regularTimeAwayTeamGoals: 3,
        },
      },
    ],
  },
]

const positionsRules = [
  {
    points: 10,
    description: 'Caso você acerte o <b>campeão e o vice-campeão</b> da competição',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Campeão' },
          awayTeam: { name: 'Vice Campeão' },
          regularTimeHomeTeamGoals: 'Brasil',
          regularTimeAwayTeamGoals: 'Argentina',
        },
        result: {
          homeTeam: { name: 'Campeão' },
          awayTeam: { name: 'Vice Campeão' },
          regularTimeHomeTeamGoals: 'Brasil',
          regularTimeAwayTeamGoals: 'Argentina',
        },
      },
    ],
  },
  {
    points: 5,
    description:
      'Caso você acerte <b>somente o campeão</b> OU <b>somente o vice-campeão</b> da competição',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Campeão' },
          awayTeam: { name: 'Vice Campeão' },
          regularTimeHomeTeamGoals: 'Brasil',
          regularTimeAwayTeamGoals: 'Argentina',
        },
        result: {
          homeTeam: { name: 'Campeão' },
          awayTeam: { name: 'Vice Campeão' },
          regularTimeHomeTeamGoals: 'Brasil',
          regularTimeAwayTeamGoals: 'Alemanha',
        },
      },
    ],
  },
  {
    points: 0,
    description:
      'Caso você não acerte nem <b>o campeão</b> nem <b>o vice-campeão</b> da competição',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Campeão' },
          awayTeam: { name: 'Vice Campeão' },
          regularTimeHomeTeamGoals: 'Brasil',
          regularTimeAwayTeamGoals: 'Argentina',
        },
        result: {
          homeTeam: { name: 'Campeão' },
          awayTeam: { name: 'Vice Campeão' },
          regularTimeHomeTeamGoals: 'Espanha',
          regularTimeAwayTeamGoals: 'Alemanha',
        },
      },
    ],
  },
]
</script>
