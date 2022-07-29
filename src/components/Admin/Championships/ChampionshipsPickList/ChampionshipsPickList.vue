<template>
  <BaseDataRenderer :state="championships">
    <PickList
      v-model="selectedChampionships"
      listStyle="height:342px"
      data-key="id"
      class="championships-pick-list"
    >
      <template #sourceheader>
        {{ $t('admin.championships.allChampionships') }}
      </template>
      <template #targetheader> {{ $t('common.selected') }} </template>
      <template #item="{ item }">
        <div class="flex align-items-center">
          <span>{{ item.name }} {{ item.year }}</span>
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
    type: Number,
    default: null
  },
  filter: {
    type: Function,
    default: (championships) => championships
  },
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
  const rows = await services.championships.fetchChampionships()
  championships.data = props.filter(rows)
  championships.loading = false
})
</script>

<style lang="scss">
.championships-pick-list {
  .p-picklist-source-controls,
  .p-picklist-target-controls {
    display: none;
  }
}
</style>
