<script setup lang="ts">
import BaseMultiSelect from '@/components/Shared/BaseMultiSelect.vue'
import { parseUser } from '@/helpers/users'
import { validateEmail } from '@/helpers/utils'
import services from '@/services'
import type { iState, iOption, iUserOption } from '@/types'
import { computed, onMounted, reactive } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    required?: boolean
    disabled?: boolean
    filter?: (option: iOption) => boolean
  }>(),
  {
    filter: (option: iOption) => !!option,
  },
)

const users = defineModel<iUserOption[]>({ required: true })

const state = reactive<iState<iUserOption[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadUsers = async () => {
  try {
    state.loading = true
    const users = await services.users.fetchUsers()

    state.data = parseUser(users)
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

const filteredUsers = computed<iUserOption[]>(() => state.data.filter(props.filter))

onMounted(loadUsers)

const getOptionAttrs = (option: iOption): { tooltip?: string; icon: string } => {
  if (option.name) {
    if (option.status === 'invited') {
      return {
        icon: 'fa-solid fa-clock',
        tooltip: 'Convite enviado (aguardando resposta)',
      }
    } else if (option.status === 'approved') {
      return {
        icon: 'fa-solid fa-check',
        tooltip: 'Convite Aceito',
      }
    }

    return {
      icon: 'hidden',
    }
  }

  return {
    icon: 'fa-solid fa-warning',
    tooltip: 'Usuário não possui conta na plataforma',
  }
}

const handleInviteUser = (email: string) => {
  users.value.push(email)
}
</script>

<template>
  <BaseMultiSelect
    id="users-multi-select"
    v-model="users"
    :label="label"
    :options="filteredUsers"
    :required="required"
    :filter="filter"
    :disabled="disabled || state.loading"
    help="Usuários que não possuem conta na plataforma receberão um link de criação de conta antes do convite para a liga"
  >
    <template #chip="{ option, handleRemove }">
      <div class="badge badge-primary">
        {{ option.name || option.email }}
        <div
          class="tooltip"
          v-if="getOptionAttrs(option).tooltip"
          :data-tip="getOptionAttrs(option).tooltip"
        >
          <span class="fa-solid cursor-default" :class="getOptionAttrs(option).icon" />
        </div>

        <span class="fa-solid fa-xmark cursor-pointer" @click="handleRemove(option)" />
      </div>
    </template>

    <template #empty="{ search }">
      <li>
        <a v-if="validateEmail(search)" @click="handleInviteUser(search)">
          {{ search }} (convidar usuário)
        </a>
        <a v-else class="pointer-events-none">Nenhum resultado encontrado</a>
      </li>
    </template>
  </BaseMultiSelect>
</template>
