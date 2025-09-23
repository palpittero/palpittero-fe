<script setup lang="ts">
import type { iMatchStatus } from '@/types'

defineProps<{
  status: iMatchStatus
}>()

const matchStatuses: Record<iMatchStatus, { text: string; class: string }> = {
  scheduled: {
    text: 'Agendada',
    class: 'fa-solid fa-calendar text-secondary',
  },
  preparation: {
    text: 'Pré-jogo',
    class: 'fa-solid fa-clock text-warning',
  },
  in_progress: {
    text: 'Em Andamento',
    class: 'fa-solid fa-play text-primary',
  },
  finished: {
    text: 'Concluída',
    class: 'fa-solid fa-check-circle text-success',
  },
  cancelled: {
    text: 'Cancelada',
    class: 'fa-solid fa-times text-danger',
  },
  postponed: {
    text: 'Adiada',
    class: 'fa-solid fa-clock text-base-100',
  },
  deleted: {
    text: 'Removida',
    class: 'fa-solid fa-times text-danger',
  },
}
</script>

<template>
  <div class="flex items-center gap-1 text-xs">
    <i :class="matchStatuses[status].class" />
    {{ matchStatuses[status].text }}
  </div>
</template>
