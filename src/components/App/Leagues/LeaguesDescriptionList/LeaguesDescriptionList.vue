<template>
  <div class="leagues-description-list">
    <div class="surface-section p-5">
      <div class="font-medium text-3xl text-900 mb-3">
        {{ title }}
      </div>
      <ul v-if="loading" class="m-0 p-0">
        <li class="mb-4">
          <Skeleton width="100%" class="mb-2" />
          <Skeleton width="75%" />
        </li>
        <li class="mb-4">
          <Skeleton width="100%" class="mb-2" />
          <Skeleton width="75%" />
        </li>
        <li class="mb-4">
          <Skeleton width="100%" class="mb-2" />
          <Skeleton width="75%" />
        </li>
        <li class="mb-4">
          <Skeleton width="100%" class="mb-2" />
          <Skeleton width="75%" />
        </li>
        <li class="mb-4">
          <Skeleton width="100%" class="mb-2" />
          <Skeleton width="75%" />
        </li>
      </ul>
      <ul v-else-if="leagues.length" class="list-none p-0 m-0 grid">
        <li
          v-for="league in leagues"
          :key="league.id"
          class="flex align-items-center justify-content-between w-full py-3 px-2 border-top-1 surface-border flex-wrap"
        >
          <div class="text-500 font-medium flex align-items-center gap-3">
            <BadgeAvatar :image="league.badge" />
            {{ league.name }}
            <span
              class="pi pi-id-card"
              v-show="isOwner(league)"
              v-tooltip.top="$t('app.leagues.owner')"
            />
          </div>
          <div class="flex flex-column md:flex-row">
            <slot name="actions" :league="league">
              <Button
                v-if="!isParticipant(league)"
                :label="$t('app.leagues.join')"
                icon="pi pi-sign-in"
                class="p-button-text"
                @click="emits('join', league)"
              />
              <Button
                v-if="isParticipant(league)"
                :label="$t('app.leagues.ranking')"
                icon="pi pi-list"
                class="p-button-text"
                @click="emits('ranking', league)"
              />

              <Button
                v-if="isOwner(league)"
                :label="$t('app.leagues.participants')"
                icon="pi pi-users"
                class="p-button-text"
                @click="emits('manage', league)"
              />

              <Button
                v-if="isParticipant(league)"
                :label="$t('app.leagues.guesses')"
                icon="pi pi-user-edit"
                class="p-button-text"
                @click="emits('guesses', league)"
              />

              <Button
                v-if="canLeave(league)"
                :label="$t('app.leagues.leave')"
                icon="pi pi-sign-out"
                class="p-button-text p-button-danger"
                @click="emits('leave', league)"
              />

              <Button
                v-if="isOwner(league)"
                icon="pi pi-cog"
                class="p-button-text"
                @click="emits('edit', league)"
                v-tooltip.top="$t('app.leagues.edit')"
              />

              <Button
                v-if="isOwner(league)"
                icon="pi pi-trash"
                class="p-button-text p-button-danger"
                @click="emits('remove', league)"
                v-tooltip.top="$t('app.leagues.remove')"
              />
            </slot>
          </div>
        </li>
      </ul>
      <div v-else class="text-500 mb-5">
        {{ innerDescription }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'
import { useAuthStore } from '@/stores/auth'

import { computed } from 'vue'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const authStore = useAuthStore()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  emptyState: {
    type: String,
    default: ''
  },
  leagues: {
    type: Array,
    default: () => []
  },
  loading: Boolean
})

const emits = defineEmits([
  'manage',
  'ranking',
  'join',
  'leave',
  'edit',
  'remove'
])

const isParticipant = (league) =>
  league?.users?.find(
    ({ id, status }) =>
      id === authStore.loggedUser?.id &&
      status === USERS_LEAGUES_STATUSES.APPROVED
  )

const isGuest = (league) =>
  league?.users?.find(
    ({ owner, id, status }) =>
      id === authStore.loggedUser?.id &&
      !owner &&
      status === USERS_LEAGUES_STATUSES.APPROVED
  )

const isOwner = (league) =>
  league?.users?.find(
    ({ owner, id }) => id === authStore.loggedUser?.id && owner
  )

const innerDescription = computed(() =>
  props.leagues.length > 0 ? props.description : props.emptyState
)

const canLeave = (league) => isParticipant(league) && isGuest(league)
</script>

<style lang="scss">
.leagues-description-list {
  .p-button-label {
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
}
</style>
