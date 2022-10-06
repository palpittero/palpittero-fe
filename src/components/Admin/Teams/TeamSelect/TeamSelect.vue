<template>
  <Dropdown
    v-model="team"
    :options="filteredTeams"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
    :placeholder="$t('admin.teams.selectTeam')"
    :class="{ 'p-invalid': invalid }"
    class="team-select"
  >
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex align-items-center gap-3">
        <BadgeAvatar :image="value.badge" />
        <!-- <img :src="value.badge" /> -->
        <div>{{ value.name }}</div>
      </div>
      <span v-else>
        {{ placeholder }}
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex align-items-center gap-3">
        <BadgeAvatar :image="option.badge" />
        <div>{{ option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import services from '@/services'
import { computed, reactive, onMounted } from 'vue'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  filter: {
    type: Function,
    default: (teams) => teams
  },
  championshipId: {
    type: Number,
    default: null
  },
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])
const teams = reactive({
  loading: false,
  error: null,
  data: []
})

const team = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  const rows = props.championshipId
    ? await services.championships.fetchTeams(props.championshipId)
    : await services.teams.fetchTeams()
  teams.data = rows
})

const filteredTeams = computed(() =>
  props.filter(teams.data.map(({ id, name, badge }) => ({ id, name, badge })))
)

const getOptionValue = ({ id, name, badge }) => ({ id, name, badge })
</script>

<style lang="scss">
.team-select {
  .p-avatar {
    width: 17px;
    height: 17px;
  }
}
</style>
