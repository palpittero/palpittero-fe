<template>
  <Dropdown
    v-model="round"
    :options="parsedRounds"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
    :placeholder="$t('admin.rounds.selectRound')"
    :class="{ 'p-invalid': invalid }"
  >
    <!-- <template #value="{ value, placeholder }">
      <div v-if="value" class="flex align-items-center gap-3">
        <div>{{ value.name }} {{ value.year }}</div>
      </div>
      <span v-else>
        {{ placeholder }}
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex align-items-center gap-3">
        <div>{{ option.name }} {{ option.year }}</div>
      </div>
    </template> -->
  </Dropdown>
</template>

<script setup>
import services from '@/services'
import { computed, reactive, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  filter: {
    type: Function,
    default: (championships) => championships
  },
  championshipId: {
    type: Number,
    required: true
  },
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])
const rounds = reactive({
  loading: false,
  error: null,
  data: []
})

const round = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  const rows = await services.championships.fetchRounds(props.championshipId)
  rounds.data = props.filter(rows)
})

const parsedRounds = computed(() =>
  rounds.data.map(({ id, name }) => ({ id, name }))
)

const getOptionValue = ({ id, name }) => ({ id, name })
</script>
