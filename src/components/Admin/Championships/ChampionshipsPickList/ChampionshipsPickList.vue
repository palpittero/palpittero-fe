<template>
  <BaseDataRenderer :state="championships">
    <PickList
      v-model="selectedChampionships"
      listStyle="height:342px"
      data-key="id"
      class="championships-pick-list"
      @move-to-source="handleMoveToSourcePickList"
      @move-all-to-source="handleMoveToSourcePickList"
    >
      <template #sourceheader>
        {{ $t('admin.championships.allChampionships') }}
      </template>
      <template #targetheader>
        <div class="flex justify-content-between">
          <span>
            {{ $t('common.selected') }}
          </span>
          <span class="text-right" v-if="enableGuesses">
            {{ $t('admin.championships.enableGuess') }}
          </span>
        </div>
      </template>
      <template #item="{ item }">
        <div class="flex align-items-center justify-content-between">
          <span>{{ item.name }} {{ item.year }}</span>
          <InputSwitch
            v-if="enableGuesses && isChampionshipSelected(item)"
            v-model="item.enableGuesses"
            :true-value="1"
            :false-value="0"
            @click.stop
          />
        </div>
      </template>
    </PickList>
  </BaseDataRenderer>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import differenceBy from 'lodash/fp/differenceBy'
import services from '@/services'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  filter: {
    type: Function,
    default: (championships) => championships
  },
  leagueId: {
    type: Number,
    default: null
  },
  enableGuesses: Boolean,
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])

const championships = reactive({
  loading: false,
  error: null,
  data: []
})

const selectedChampionships = computed({
  set([, value]) {
    emits('update:modelValue', value)
  },
  get() {
    const championshipsData = differenceBy(
      'id',
      championships.data,
      props.modelValue
    )
    return [championshipsData, props.modelValue]
  }
})

onMounted(async () => {
  championships.loading = true
  const rows = props.leagueId
    ? await services.leagues.fetchChampionships(props.leagueId)
    : await services.championships.fetchChampionships()
  championships.data = props.filter(rows)
  championships.loading = false
})

const isChampionshipSelected = (team) => {
  const [, value] = selectedChampionships.value
  return value.map(({ id }) => id).includes(team.id)
}

const handleMoveToSourcePickList = ({ items }) =>
  items.forEach((val) => (val.enableGuesses = false))
</script>

<style lang="scss">
.championships-pick-list {
  .p-picklist-source-controls,
  .p-picklist-target-controls {
    display: none;
  }
}
</style>
