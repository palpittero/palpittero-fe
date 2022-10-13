<template>
  <BaseDataRenderer :state="users">
    <Chips v-model="selectedUsers" class="block" @add="handleAdd">
      <template #chip="{ value }">
        <div class="flex align-items-center gap-2">
          <span> {{ value[optionLabel] || value }}</span>
          <span
            :class="getAttrs(value).icon"
            v-tooltip="getAttrs(value).tooltip"
          />
        </div>
      </template>
    </Chips>
    <small class="text-gray-500">
      {{ $t(hint) }}
    </small>
  </BaseDataRenderer>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import services from '@/services'
import { useI18n } from 'vue-i18n'
import { last, pick } from 'lodash/fp'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import { useToast } from 'primevue/usetoast'
import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'

const i18n = useI18n()
const toast = useToast()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'email'
  },
  notAllowed: {
    type: Array,
    default: () => []
  },
  hint: {
    type: String,
    default: 'admin.leagues.usersWithoutAccount'
  }
})

const emits = defineEmits(['update:modelValue', 'notAllowed'])

const users = ref({
  loading: false,
  error: null,
  data: []
})

const selectedUsers = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  users.value.loading = true
  users.value.data = await services.users.fetchUsers()
  users.value.loading = false
})

const getAttrs = ({ email, status }) => {
  const user = users.value.data.find((user) => user.email === email)

  if (user) {
    if (status === USERS_LEAGUES_STATUSES.INVITED) {
      return {
        icon: 'pi pi-clock text-gray-500',
        tooltip: i18n.t('admin.users.invitationSent')
      }
    } else if (status === USERS_LEAGUES_STATUSES.APPROVED) {
      return {
        icon: 'pi pi-check-circle text-green-500',
        tooltip: i18n.t('admin.users.invitationAccepted')
      }
    }
    return {
      icon: 'hidden'
    }
  }

  return {
    icon: 'pi pi-exclamation-triangle text-orange-500',
    tooltip: i18n.t('admin.users.userDoesNotHaveAccount')
  }
}

const handleAdd = async ({ value }) => {
  const email = last(value)

  const user = users.value.data.find((user) => user.email === email)

  console.log('is unique', isUserUnique(email))

  selectedUsers.value = selectedUsers.value.filter(
    (selectedUser) => (selectedUser?.email || selectedUser) !== email
  )

  await nextTick()

  if (user) {
    if (props.notAllowed.includes(user.id)) {
      toast.add({
        group: 'app',
        severity: 'warn',
        summary: i18n.t('common.warning'),
        detail: i18n.t('admin.users.validation.userNotAllowed'),
        life: 4000
      })
    } else {
      selectedUsers.value = [
        ...selectedUsers.value,
        pick(['id', 'name', 'email'], user)
      ]
    }
  } else {
    selectedUsers.value = [...selectedUsers.value, email]
  }
}

const isUserUnique = (email) =>
  !selectedUsers.value.find((user) => (user.email || user) === email)
</script>
