<script setup lang="ts">
import type { iChampionship } from '@/types'

defineProps<{
  championship: iChampionship
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const handleToggle = () => {
  emit('toggle')
}
</script>

<template>
  <div class="flex justify-between items-center cursor-pointer" @click="handleToggle">
    <div class="flex items-center gap-3">
      <h2 class="text-xl font-bold">{{ championship.name }} {{ championship.year }}</h2>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-base-content/60">
        {{ isOpen ? 'Ocultar' : 'Mostrar' }}
      </span>
      <i
        :class="{ 'rotate-180': isOpen }"
        class="fa-solid fa-angle-down transition-transform duration-200"
      />
    </div>
  </div>
</template>
