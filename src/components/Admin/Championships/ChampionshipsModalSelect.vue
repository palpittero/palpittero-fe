<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import services from '@/services'
import type { iChampionship, iState } from '@/types'
import { computed, reactive, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    selectedChampionships: iChampionship[]
    filter?: (championships: iChampionship[]) => iChampionship[]
    championships?: iChampionship[]
  }>(),
  {
    filter: (championships: iChampionship[]) => championships,
    championships: () => [],
  },
)

const model = ref<iChampionship[]>([])

const emit = defineEmits<{
  confirm: [iChampionship[]]
}>()

const state = reactive<iState<iChampionship[]>>({
  loading: false,
  data: [],
  error: null,
})

const handleOpen = async () => {
  model.value = [...props.selectedChampionships]

  if (props.championships.length > 0) {
    state.data = props.championships
    return
  }

  state.loading = true

  state.data = (await services.championships.fetchChampionships()).map((championship) => {
    const selectedChampionship = model.value?.find((c) => c.id === championship.id)

    return {
      ...championship,
      selected: !!selectedChampionship,
      enableGuesses: !!selectedChampionship?.enableGuesses,
    }
  })

  state.loading = false
}

const handleClose = () => {
  state.data = []
}

const handleConfirm = () => {
  emit('confirm', model.value)
}

const allSelected = computed<boolean>(() =>
  state.data.every((championship) => championship.selected),
)

const handleToggleAll = () => {
  state.data = state.data.map((championship) => ({
    ...championship,
    selected: !allSelected.value,
  }))

  model.value = state.data.filter((championship) => championship.selected)
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

const filteredChampionships = computed<iChampionship[]>(() => props.filter(state.data))
</script>

<template>
  <BaseModal
    id="championships_modal_select"
    title="Selecionar Campeonatos"
    confirm-button-text="Confirmar"
    size="md"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleConfirm"
  >
    <div v-if="state.loading" class="my-auto mx-auto w-full flex items-center justify-center">
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
          v-for="championship in filteredChampionships"
          :key="championship.id"
          @click="handleToggle(championship)"
        >
          <!-- <div class="text-4xl font-thin opacity-30 tabular-nums">{{ championship.id }}</div> -->
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
