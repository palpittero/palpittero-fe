<template>
  <BaseDataRenderer class="users-chips" :state="users">
    <!-- <pre>{{ selectedUsers }}</pre> -->
    <!-- <AutoComplete
      v-model="selectedUsers"
      :suggestions="filteredUsers"
      @complete="filterUsers"
      option-label="name"
    >
      <template #chip="{ value }">
        {{ value.name }}
      </template>
    </AutoComplete> -->

    <Chips
      v-model="selectedUsers"
      class="block"
      @add="handleAdd"
      @input="filterUsers"
      input-id="users-chips"
    >
      <template #chip="{ value }">
        <div class="flex align-items-center gap-2">
          <span> {{ value[optionLabel] || value.email || value }}</span>
          <span
            :class="getAttrs(value).icon"
            v-tooltip="getAttrs(value).tooltip"
          />
        </div>
      </template>
    </Chips>
    <Popper :show="showFilteredUsers">
      <span />
      <template #content>
        <div class="p-autocomplete-panel p-component">
          <ul class="p-autocomplete-items">
            <li
              class="p-autocomplete-item"
              v-for="user in filteredUsers"
              :key="user.id"
              @click="handleAdd({ value: [user.email] })"
            >
              {{ user.name }}
              <small class="text-gray-400">
                <em>({{ user.email }})</em>
              </small>
            </li>
          </ul>
        </div>
      </template>
    </Popper>
    <div></div>
    <small class="text-gray-500">
      {{ $t(hint) }}
    </small>
  </BaseDataRenderer>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { last, pick } from 'lodash/fp'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

import services from '@/services'
import { validateEmail } from '@/helpers/utils'

import Popper from 'vue3-popper'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'

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
    default: 'name'
  },
  notAllowed: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Array,
    default: () => []
  },
  hint: {
    type: String,
    default: 'admin.leagues.usersWithoutAccount'
  }
})

const emits = defineEmits(['update:modelValue'])

const users = ref({
  loading: false,
  error: null,
  data: []
})

const filteredUsers = ref([])

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

  selectedUsers.value = selectedUsers.value.filter(
    (selectedUser) => (selectedUser?.email || selectedUser) !== email
  )

  await nextTick()

  if (user) {
    if (props.selected.includes(user.id)) {
      toast.add({
        group: 'app',
        severity: 'warn',
        summary: i18n.t('common.warning'),
        detail: i18n.t('admin.users.validation.userAlreadySelected'),
        life: 4000
      })
    } else if (props.notAllowed.includes(user.id)) {
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
    showFilteredUsers.value = false
  } else if (!validateEmail(email)) {
    toast.add({
      group: 'app',
      severity: 'warn',
      summary: i18n.t('common.warning'),
      detail: i18n.t('admin.users.validation.invalidEmail'),
      life: 4000
    })
  } else {
    selectedUsers.value = [...selectedUsers.value, email]
    showFilteredUsers.value = false
  }

  document.querySelector('[input-id="users-chips"]').value = ''
  document.querySelector('[input-id="users-chips"]').focus()
}

const filterUsers = (event) => {
  const { value } = event.target

  filteredUsers.value =
    value.length >= 3
      ? users.value.data.filter(
          (user) =>
            !props.selected.includes(user.id) &&
            (user.name.toLowerCase().includes(value.toLowerCase()) ||
              user.email.toLowerCase().includes(value.toLowerCase()))
        )
      : []

  showFilteredUsers.value = filteredUsers.value.length > 0
}

const showFilteredUsers = ref(false)
</script>

<style lang="scss">
.users-chips {
  .p-autocomplete-panel {
    top: -25px;
    left: 0;
    min-width: 300px;
    z-index: 1;
    max-height: 235px;
    overflow: auto;
  }

  .p-chips + .inline-block {
    border: 0 !important;
    margin: 0 !important;
  }
}
</style>
