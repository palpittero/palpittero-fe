<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import services from '@/services'
import type { iTeam, iState } from '@/types'
import { computed, reactive, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    selectedTeams: iTeam[]
    filter?: (team: iTeam) => boolean
    disabledTeams?: number[]
  }>(),
  {
    filter: () => true,
  },
)

const model = ref<iTeam[]>([])

const emit = defineEmits<{
  confirm: [iTeam[]]
}>()

const teams = reactive<iState<iTeam[]>>({
  loading: false,
  data: [],
  error: null,
})

const handleOpen = async () => {
  model.value = [...props.selectedTeams]
  teams.loading = true

  teams.data = (await services.teams.fetchTeams()).map((team) => {
    const selectedTeam = model.value?.find((c) => c.id === team.id)

    return {
      ...team,
      selected: !!selectedTeam,
    }
  })

  teams.loading = false
}

const handleClose = () => {
  teams.data = []
}

const handleConfirm = () => {
  emit('confirm', model.value)
}

const allSelected = computed<boolean>(() => teams.data.every((team) => team.selected))

const handleToggleAll = () => {
  teams.data = teams.data.map((team) =>
    isDisabled(team)
      ? team
      : {
          ...team,
          selected: !allSelected.value,
        },
  )

  model.value = teams.data.filter((team) => team.selected)
}

const handleToggle = (team: iTeam) => {
  team.selected = !team.selected

  model.value = team.selected
    ? [...model.value, team]
    : model.value.filter(({ id }) => id !== team.id)
}

const toggleAllLabel = computed<string>(() =>
  allSelected.value ? 'Desmarcar todos' : 'Marcar todos',
)

const search = ref<string>('')

const filteredTeams = computed<iTeam[]>(() =>
  teams.data.filter((team) => {
    const isMatch = Boolean(
      search.value && team.name.toLowerCase().includes(search.value.toLowerCase()),
    )

    const isFiltered = props.filter(team)

    return isFiltered && (!search.value || isMatch)
  }),
)

const isDisabled = (team: iTeam) => props.disabledTeams?.includes(team.id as number)
</script>

<template>
  <BaseModal
    :id="id"
    size="sm"
    title="Selecionar Times"
    confirm-button-text="Confirmar"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleConfirm"
  >
    <div v-if="teams.loading" class="my-auto mx-auto w-full flex items-center justify-center">
      <span class="loading loading-ring loading-xl" />
    </div>
    <div class="overflow-x-auto py-6 max-h-[50vh] overflow-y-auto">
      <div class="flex flex-col p-2 gap-2">
        <input type="search" class="input" placeholder="Pesquisar times" v-model="search" />
        <a class="link link-hover w-full text-xs text-right link-primary" @click="handleToggleAll">
          {{ toggleAllLabel }}
        </a>
      </div>
      <ul class="list bg-base-100 rounded-box shadow-md">
        <li
          class="list-row hover:bg-base-200 cursor-pointer items-center p-2"
          :class="{ 'opacity-50 pointer-events-none !cursor-not-allowed': isDisabled(team) }"
          v-for="team in filteredTeams"
          :key="team.id"
          @click="handleToggle(team)"
        >
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            v-model="team.selected"
            :disabled="isDisabled(team)"
          />
          <div class="flex items-center gap-2">
            <div>
              <img class="size-8 rounded-box object-cover" :src="team.badge!" />
            </div>

            <div>
              <div>{{ team.name }}</div>
              <div class="text-xs font-semibold" v-if="team.country">
                <div class="flex items-center gap-2">
                  <img class="size-3 rounded-box object-cover" :src="team.country?.flag!" />
                  {{ team.country?.name }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </BaseModal>
</template>
