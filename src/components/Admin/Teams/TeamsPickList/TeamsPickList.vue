<template>
  <BaseDataRenderer :state="teams">
    <PickList
      v-model="selectedTeams"
      listStyle="height:342px"
      data-key="id"
      class="teams-pick-list"
    >
      <template #sourceheader> Todos os Times </template>
      <template #targetheader> Selecionados </template>
      <template #item="{ item }">
        <div class="flex align-items-center">
          <Avatar
            :image="item.badge"
            size="small"
            shape="circle"
            class="mr-2"
          />
          <span>{{ item.name }}</span>
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
    default: (teams) => teams
  },
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])

const teams = reactive({
  loading: false,
  error: null,
  data: []
})

const selectedTeams = computed({
  set([, value]) {
    emits('update:modelValue', value)
  },
  get() {
    const teamsData = differenceBy('id', teams.data, props.modelValue)
    return [teamsData, props.modelValue]
  }
})

onMounted(async () => {
  teams.loading = true
  const rows = await services.teams.fetchTeams()
  teams.data = props.filter(rows)
  teams.loading = false
})
</script>

<style lang="scss">
.teams-pick-list {
  .p-picklist-source-controls,
  .p-picklist-target-controls {
    display: none;
  }
}
</style>
