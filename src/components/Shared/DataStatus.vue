<script setup lang="ts">
import services from '@/services'
import { useToastStore } from '@/stores'
import type { iStatus } from '@/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  status: iStatus
  resource: 'leagues' | 'teams' | 'championships' | 'users'
  entityId: number
  // row: any
}>()

const model = ref<iStatus>(props.status)

const toastStore = useToastStore()

const handleUpdate = async (value: iStatus) => {
  await services.common.updateStatus({
    resource: props.resource,
    id: props.entityId,
    status: value,
  })

  // props.row.status = value

  toastStore.success('Status atualizado com sucesso')
}

const label = computed<string>(() => (model.value === 'active' ? 'Ativo' : 'Inativo'))
</script>

<template>
  <label class="label">
    <input
      v-model="model"
      type="checkbox"
      :true-value="'active'"
      :false-value="'inactive'"
      class="toggle toggle-primary"
      @update:model-value="handleUpdate"
      @click.stop
    />
    {{ label }}
  </label>
</template>
