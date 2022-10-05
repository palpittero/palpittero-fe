<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '750px' }"
    :header="$t('app.leagues.pendingInvitations.header')"
    modal
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <div class="leagues-description-list">
      <div class="surface-section p-5">
        <ul class="list-none p-0 m-0 grid" v-if="isReady">
          <li
            v-for="league in leagues"
            :key="league.id"
            class="flex align-items-center justify-content-between w-full py-3 px-2 border-top-1 surface-border flex-wrap"
          >
            <div class="text-500 font-medium flex align-items-center gap-3">
              <Avatar :image="league.badge" size="large" shape="circle" />
              {{ league.name }}
            </div>
            <div class="flex flex-column md:flex-row">
              <SelectButton
                v-model="invitations[league.id].status"
                :options="USERS_LEAGUES_INVITATIONS_OPTIONS"
                option-label="name"
                option-value="id"
                aria-labelledby="single"
              >
                <template #option="{ option }">
                  <span :class="`${option.icon}`" /> {{ $t(option.name) }}
                </template>
              </SelectButton>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <slot name="footer">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="handleHide"
        />
        <Button
          label="Ok"
          icon="pi pi-check"
          class="p-button-text"
          @click="handleSubmit"
          :disabled="isSubmitDisabled"
        />
      </slot>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { USERS_LEAGUES_INVITATIONS_OPTIONS } from '@/constants/leagues'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import { isNil } from 'lodash/fp'

const props = defineProps({
  leagues: {
    type: Array,
    default: () => []
  },
  visible: Boolean,
  loading: Boolean
})

const isReady = ref(false)
const invitations = ref({})

watch(
  () => props.visible,
  (value) => {
    if (value) {
      invitations.value = props.leagues.reduce(
        (result, league) => ({
          ...result,
          [league.id.toString()]: {
            leagueId: league.id,
            status: null
          }
        }),
        {}
      )
      isReady.value = true
    }
  }
)

const emits = defineEmits(['hide', 'submit'])

const parsedInvitations = computed(() =>
  Object.values(invitations.value).filter(({ status }) => !isNil(status))
)

const isSubmitDisabled = computed(() => {
  return !parsedInvitations.value.length || props.loading
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', parsedInvitations.value)
</script>
