<script setup lang="ts">
import BaseImage from '@/components/Shared/BaseImage.vue'
import type { iLeague } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  league: iLeague
  loggedUserId?: number
}>()

const emit = defineEmits<{
  guesses: [league: iLeague]
  ranking: [league: iLeague]
  manage: [league: iLeague]
  edit: [league: iLeague]
  remove: [league: iLeague]
  leave: [league: iLeague]
}>()

const handleGuessesLeague = (league: iLeague) => {
  emit('guesses', league)
}

const handleRankingLeague = (league: iLeague) => {
  emit('ranking', league)
}

const handleManageLeague = (league: iLeague) => {
  emit('manage', league)
}

const handleEditLeague = (league: iLeague) => {
  emit('edit', league)
}

const handleRemoveLeague = (league: iLeague) => {
  emit('remove', league)
}

const handleLeaveLeague = (league: iLeague) => {
  emit('leave', league)
}

const isPrivate = computed<boolean>(() => !!props.league.private)

const isOwner = computed<boolean>(() =>
  props.league.users.some((user: any) => user.id === props.loggedUserId && user.owner),
)

const visibilityBadge = computed<{ class: string; label: string }>(() =>
  isPrivate.value
    ? { class: 'badge-warning', label: 'Privada' }
    : { class: 'badge-success', label: 'Pública' },
)
</script>

<template>
  <div class="card bg-base-200/50 shadow-sm">
    <div class="card-body p-4">
      <div class="flex justify-between items-center gap-4">
        <BaseImage :src="league.badge" class="size-14" />
        <div class="flex-1">
          <h3 class="font-bold text-lg">{{ league.name }}</h3>
          <!-- <p class="text-sm text-base-content/70 mt-1">
            {{ league.description || 'Sem descrição' }}
          </p> -->
          <div class="flex gap-2 mt-2">
            <div class="badge badge-sm" :class="visibilityBadge.class">
              {{ visibilityBadge.label }}
            </div>
            <!-- <div class="badge badge-sm badge-outline">
              {{ league.users?.length || 0 }} participantes
            </div> -->
          </div>
        </div>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <i class="fa-solid fa-ellipsis-vertical text-lg" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a @click="handleGuessesLeague(league)">Ver Palpites</a>
            </li>
            <li>
              <a @click="handleRankingLeague(league)">Ver Ranking</a>
            </li>
            <li v-if="isOwner">
              <a @click="handleManageLeague(league)">Gerenciar</a>
            </li>
            <li v-if="isOwner">
              <a @click="handleEditLeague(league)">Editar</a>
            </li>
            <li v-if="isOwner">
              <a @click="handleRemoveLeague(league)" class="text-error">Excluir</a>
            </li>
            <li v-else>
              <a @click="handleLeaveLeague(league)" class="text-warning">Sair da Liga</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
