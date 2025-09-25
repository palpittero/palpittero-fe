<script setup lang="ts">
import BaseImage from '@/components/Shared/BaseImage.vue'
import type { iLeague } from '@/types'

defineProps<{
  league: iLeague
}>()

const emit = defineEmits<{
  join: [league: iLeague]
}>()

const handleJoinLeague = (league: iLeague) => {
  emit('join', league)
}
</script>

<template>
  <div class="card bg-base-200/50 shadow-sm">
    <div class="card-body p-4">
      <div class="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div class="flex justify-between lg:items-center gap-4 w-full">
          <BaseImage :src="league.badge" class="size-14" />
          <div class="flex-1">
            <h3 class="font-bold text-lg">{{ league.name }}</h3>
            <!-- <p class="text-sm text-base-content/70 mt-1">
            {{ league.description || 'Sem descrição' }}
          </p> -->
            <div class="flex gap-2 justify-between">
              <div class="flex flex-col lg:flex-row gap-2 mt-2">
                <div class="badge badge-sm badge-success">Pública</div>
                <div class="badge badge-sm badge-outline">
                  {{ league.users?.length || 0 }} participantes
                </div>
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-sm hidden lg:block" @click="handleJoinLeague(league)">
            Entrar
          </button>

          <div class="dropdown dropdown-end block lg:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
              <i class="fa-solid fa-ellipsis-vertical text-lg" />
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a @click="handleJoinLeague(league)">Entrar</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
