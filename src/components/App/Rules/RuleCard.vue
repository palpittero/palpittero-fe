<template>
  <div class="card bg-base-200/50 shadow-sm border border-base-300">
    <div class="card-body p-6">
      <!-- Rule Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div
            class="badge badge-lg font-bold text-white"
            :class="getPointsBadgeClass(rule.points)"
          >
            {{ rule.points }} pts
          </div>
          <div v-if="rule.hint" class="text-sm text-base-content/60 italic">
            {{ rule.hint }}
          </div>
        </div>
        <div class="text-sm text-base-content/60">
          {{ header }}
        </div>
      </div>

      <!-- Rule Description -->
      <div class="mb-6">
        <p class="text-base-content/80 leading-relaxed" v-html="rule.description"></p>
      </div>

      <!-- Examples -->
      <div v-if="rule.examples && rule.examples.length > 0" class="space-y-4">
        <h4 class="font-semibold text-base-content/80 text-sm uppercase tracking-wide">
          Exemplos:
        </h4>
        <div class="grid gap-3">
          <div
            v-for="(example, index) in rule.examples"
            :key="index"
            class="card bg-base-100 shadow-sm"
          >
            <div class="card-body p-4">
              <div class="grid md:grid-cols-2 gap-4">
                <!-- Guess -->
                <div>
                  <h5 class="font-medium text-sm text-base-content/70 mb-2">
                    Seu Palpite:
                  </h5>
                  <div class="bg-info/10 rounded-lg p-3">
                    <div class="flex items-center justify-center gap-4 text-sm">
                      <div class="text-center">
                        <div class="font-medium">{{ example.guess.homeTeam.name }}</div>
                        <div class="text-2xl font-bold text-info">
                          {{ example.guess.regularTimeHomeTeamGoals }}
                        </div>
                      </div>
                      <div class="text-base-content/50">×</div>
                      <div class="text-center">
                        <div class="font-medium">{{ example.guess.awayTeam.name }}</div>
                        <div class="text-2xl font-bold text-info">
                          {{ example.guess.regularTimeAwayTeamGoals }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Result -->
                <div>
                  <h5 class="font-medium text-sm text-base-content/70 mb-2">
                    Resultado Real:
                  </h5>
                  <div class="bg-success/10 rounded-lg p-3">
                    <div class="flex items-center justify-center gap-4 text-sm">
                      <div class="text-center">
                        <div class="font-medium">{{ example.result.homeTeam.name }}</div>
                        <div class="text-2xl font-bold text-success">
                          {{ example.result.regularTimeHomeTeamGoals }}
                        </div>
                      </div>
                      <div class="text-base-content/50">×</div>
                      <div class="text-center">
                        <div class="font-medium">{{ example.result.awayTeam.name }}</div>
                        <div class="text-2xl font-bold text-success">
                          {{ example.result.regularTimeAwayTeamGoals }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Points Earned -->
              <div class="text-center mt-3">
                <div
                  class="badge badge-lg font-bold text-white"
                  :class="getPointsBadgeClass(rule.points)"
                >
                  +{{ rule.points }} pontos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Example {
  guess: {
    homeTeam: { name: string }
    awayTeam: { name: string }
    regularTimeHomeTeamGoals: number | string
    regularTimeAwayTeamGoals: number | string
  }
  result: {
    homeTeam: { name: string }
    awayTeam: { name: string }
    regularTimeHomeTeamGoals: number | string
    regularTimeAwayTeamGoals: number | string
  }
}

interface Rule {
  points: number
  hint?: string
  description: string
  examples?: Example[]
}

defineProps<{
  header: string
  rule: Rule
}>()

const getPointsBadgeClass = (points: number) => {
  if (points === 0) return 'badge-neutral'
  if (points <= 2) return 'badge-error'
  if (points <= 4) return 'badge-warning'
  if (points === 5) return 'badge-success'
  if (points === 10) return 'badge-primary'
  return 'badge-accent'
}
</script>