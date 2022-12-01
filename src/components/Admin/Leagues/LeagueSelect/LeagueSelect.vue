<template>
  <Dropdown
    v-model="league"
    :options="filteredLeagues"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
    :showClear="clearable"
    :placeholder="placeholder || $t('app.leagues.selectLeague')"
    :class="{ 'p-invalid': invalid }"
    class="league-select"
    :loading="leagues.loading"
  >
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex align-items-center gap-3">
        <BadgeAvatar :image="value.badge" />
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
    <template #empty>
      {{ $t('app.leagues.noAvailableLeagues') }}
    </template>
  </Dropdown>
</template>

<script setup>
import services from '@/services'
import { computed, onMounted, ref } from 'vue'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  filter: {
    type: Function,
    default: (leagues) => leagues
  },
  championshipId: {
    type: Number,
    default: null
  },
  placeholder: {
    type: String,
    default: ''
  },
  invalid: Boolean,
  clearable: Boolean
})

const emits = defineEmits(['update:modelValue'])
const leagues = ref({
  loading: false,
  error: null,
  data: []
})

const league = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  leagues.value.loading = true
  leagues.value.data = await services.leagues.fetchLeagues()
  leagues.value.loading = false
})

const filteredLeagues = computed(() =>
  leagues.value.data
    .filter(props.filter)
    .map(({ id, name, badge }) => ({ id, name, badge }))
)

const getOptionValue = ({ id, name, badge }) => ({ id, name, badge })
</script>

<style lang="scss">
.league-select {
  .p-avatar {
    width: 17px;
    height: 17px;
  }
}
</style>
