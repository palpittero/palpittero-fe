<template>
  <AutoComplete
    v-model="selectedTeams"
    :suggestions="filteredTeams"
    @complete="handleComplete"
    option-label="name"
    multiple
    data-key="id"
  >
    <template #item="{ item }">
      {{ item.name }}
    </template>
    <template #chip="{ value }">
      {{ value.name }}
    </template>
  </AutoComplete>
</template>

<script setup>
import { computed, ref } from 'vue'
// import services from '@/services'
// import { useI18n } from 'vue-i18n'
// import { last, pick } from 'lodash/fp'

// import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
// import { useToast } from 'primevue/usetoast'

// const i18n = useI18n()
// const toast = useToast()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'email'
  },
  teams: {
    type: Array,
    default: () => []
  },
  onFilter: {
    type: Function,
    default: () => true
  }
  // notAllowed: {
  //   type: Array,
  //   default: () => []
  // }
})

const emits = defineEmits(['update:modelValue', 'notAllowed'])

// const teams = ref({
//   loading: false,
//   error: null,
//   data: []
// })

const query = ref('')

const selectedTeams = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

// onMounted(async () => {
//   teams.value.loading = true
//   teams.value.data = await services.teams.fetchUsers()
//   users.value.loading = false
// })

// const handleAdd = async ({ value }) => {
//   const teamId = last(value)

//   const team = teams.value.data.find((team) => team.id === teamId)

//   selectedTeams.value = selectedTeams.value.filter(
//     (selectedTeam) => selectedTeam?.id !== teamId
//   )

//   await nextTick()

//   if (team) {
//     if (props.notAllowed.includes(team.id)) {
//       toast.add({
//         group: 'app',
//         severity: 'warn',
//         summary: i18n.t('common.warning'),
//         detail: i18n.t('admin.users.validation.userNotAllowed'),
//         life: 4000
//       })
//     } else {
//       selectedTeams.value = [...selectedTeams.value, pick(['id', 'name'], team)]
//     }
//   } else {
//     selectedTeams.value = [...selectedTeams.value, teamId]
//   }
// }

const handleComplete = (event) => (query.value = event.query.trim())

const filteredTeams = computed(() =>
  query.value.length
    ? props.teams
        .filter(props.onFilter)
        .filter((team) =>
          team.name.toLowerCase().startsWith(query.value.toLowerCase())
        )
    : props.teams.filter(props.onFilter)
)

// const handleSearch = (event) => {
//             setTimeout(() => {
//                 if (!event.query.trim().length) {
//                     this.filteredTeams = [...this.teams];
//                 }
//                 else {
//                     this.filtered = this.countries.filter((country) => {
//                         return country.name.toLowerCase().startsWith(event.query.toLowerCase());
//                     });
//                 }
//             }, 250);
//         }

// const isTeamUnique = (teamId) =>
//   !selectedTeams.value.find((team) => team.id === teamId)
</script>
