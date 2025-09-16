<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import services from '@/services'
import type { iChampionship, iState } from '@/types'
import { computed, reactive, ref } from 'vue'

const props = defineProps<{
  selectedChampionships: iChampionship[]
}>()

const model = ref<iChampionship[]>([])

const emit = defineEmits<{
  confirm: [iChampionship[]]
}>()

const championships = reactive<iState<iChampionship[]>>({
  loading: false,
  data: [],
  error: null,
})

const handleOpen = async () => {
  model.value = [...props.selectedChampionships]
  championships.loading = true

  championships.data = (await services.championships.fetchChampionships()).map((championship) => {
    const selectedChampionship = model.value?.find((c) => c.id === championship.id)

    return {
      ...championship,
      selected: !!selectedChampionship,
      enableGuesses: !!selectedChampionship?.enableGuesses,
    }
  })

  championships.loading = false
}

const handleClose = () => {
  championships.data = []
}

const handleConfirm = () => {
  emit('confirm', model.value)
}

const allSelected = computed<boolean>(() =>
  championships.data.every((championship) => championship.selected),
)

const handleToggleAll = () => {
  championships.data = championships.data.map((championship) => ({
    ...championship,
    selected: !allSelected.value,
  }))

  model.value = championships.data.filter((championship) => championship.selected)
}

const handleToggle = (championship: iChampionship) => {
  championship.selected = !championship.selected

  model.value = championship.selected
    ? [...model.value, championship]
    : model.value.filter(({ id }) => id !== championship.id)
}

const toggleAllLabel = computed<string>(() =>
  allSelected.value ? 'Desmarcar todos' : 'Marcar todos',
)
</script>

<template>
  <BaseModal
    id="championships_modal_select"
    title="Selecionar Campeonatos"
    confirm-button-text="Confirmar"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleConfirm"
  >
    <div
      v-if="championships.loading"
      class="my-auto mx-auto w-full flex items-center justify-center"
    >
      <span class="loading loading-ring loading-xl" />
    </div>
    <div class="overflow-x-auto py-6">
      <div class="w-full text-right text-xs">
        <a class="link link-hover link-primary" @click="handleToggleAll">
          {{ toggleAllLabel }}
        </a>
      </div>
      <ul class="list bg-base-100 rounded-box shadow-md">
        <li
          class="list-row hover:bg-base-200 cursor-pointer"
          v-for="championship in championships.data"
          :key="championship.id"
          @click="handleToggle(championship)"
        >
          <div class="text-4xl font-thin opacity-30 tabular-nums">{{ championship.id }}</div>
          <div>
            <div>{{ championship.name }}</div>
            <div class="text-xs uppercase font-semibold opacity-60">{{ championship.year }}</div>
          </div>
          <div class="flex items-center justify-end">
            <input type="checkbox" class="checkbox checkbox-sm" v-model="championship.selected" />
          </div>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>
