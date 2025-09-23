<script setup lang="ts">
import type { iMatchDetail } from '@/types'

defineProps<{
  details: iMatchDetail[]
}>()

const emit = defineEmits<{
  edit: [detail: iMatchDetail]
  remove: [detail: iMatchDetail]
}>()

const handleRemoveMatch = (detail: iMatchDetail) => {
  emit('remove', detail)
}

const handleEditMatch = (detail: iMatchDetail) => {
  emit('edit', detail)
}
</script>

<template>
  <ul class="list bg-base-100 rounded-box shadow-md">
    <li
      class="list-row items-center hover:bg-base-200 cursor-pointer"
      v-for="detail in details"
      :key="detail.id || detail.uuid!"
      @click="handleEditMatch(detail)"
    >
      <div class="flex gap-2 items-center">
        {{
          new Date(detail.date!)
            .toLocaleString('pt-BR', {
              day: 'numeric',
              month: 'numeric',
            })
            .replace('/', '.')
        }}
      </div>
      <div class="flex flex-col gap-1 items-center">
        <div class="flex justify-start items-center gap-1 w-full">
          <img class="size-4 rounded-box object-cover" :src="detail.homeTeam?.badge!" />
          {{ detail.homeTeam?.name }}
        </div>

        <div class="flex justify-start items-center gap-1 w-full">
          <img class="size-4 rounded-box object-cover" :src="detail.awayTeam?.badge!" />
          {{ detail.awayTeam?.name }}
        </div>
      </div>
      <kbd class="kbd kbd-xs flex flex-col" v-if="detail.group">
        {{ detail.group?.name }}
      </kbd>
      <span>
        {{
          new Date(detail.date!)
            .toLocaleString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
            .replace('/', '.')
        }}
      </span>
      <a class="link link-hover link-error" @click.stop="handleRemoveMatch(detail)">
        <i class="fa-solid fa-trash" />
      </a>
    </li>
  </ul>
</template>
