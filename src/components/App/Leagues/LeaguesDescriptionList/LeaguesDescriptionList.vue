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
          class="flex flex-row align-items-start md:align-items-center justify-content-between w-full py-3 px-2 border-top-1 surface-border flex-wrap"
        >
          <div
            class="text-500 font-medium flex align-items-center md:align-items-center justify-content-start gap-3 py-2 px-3"
          >
            <BadgeAvatar :image="league.badge" />
            {{ league.name }}
            <span
              class="pi pi-id-card"
              v-show="isOwner(league)"
              v-tooltip.top="$t('app.leagues.owner')"
            />
          </div>
          <slot name="actions" :league="league">
            <span class="flex md:hidden">
              <Button
                icon="pi pi-cog"
                class="p-button-text"
                @click="(event) => toggleMenu(event, league)"
                aria-haspopup="true"
                aria-controls="overlay_menu"
              />
            </span>
            <div
              class="md:flex flex-column align-items-start md:flex-row flex-wrap hidden"
            >
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
                icon="pi pi-pencil"
                class="p-button-text"
                :label="$t('common.edit')"
                @click="emits('edit', league)"
              />

              <Button
                v-if="isOwner(league)"
                icon="pi pi-trash"
                :label="$t('common.remove')"
                class="p-button-text p-button-danger"
                @click="emits('remove', league)"
              />
            </div>
          </slot>
        </li>
      </ul>
      <div v-else class="text-500 mb-5">
        {{ innerDescription }}
      </div>
    </div>
  </div>
  <Menu ref="menu" :model="menuItems" popup />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'

const authStore = useAuthStore()
const i18n = useI18n()

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

const currentLeague = ref()

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
const menu = ref()

const toggleMenu = async (event, league) => {
  currentLeague.value = league
  menu.value.toggle(event)
}

const menuItems = computed(() => [
  {
    label: i18n.t('app.leagues.join'),
    icon: 'pi pi-sign-in',
    visible: () => !isParticipant(currentLeague.value),
    command: () => emits('join', currentLeague.value)
  },
  {
    label: i18n.t('app.leagues.ranking'),
    icon: 'pi pi-list',
    visible: () => isParticipant(currentLeague.value),
    command: () => emits('ranking', currentLeague.value)
  },
  {
    label: i18n.t('app.leagues.participants'),
    icon: 'pi pi-users',
    visible: () => isOwner(currentLeague.value),
    command: () => emits('manage', currentLeague.value)
  },
  {
    label: i18n.t('app.leagues.guesses'),
    icon: 'pi pi-user-edit',
    visible: () => isParticipant(currentLeague.value),
    command: () => emits('guesses', currentLeague.value)
  },
  {
    label: i18n.t('app.leagues.leave'),
    icon: 'pi pi-sign-out',
    visible: () => canLeave(currentLeague.value),
    command: () => emits('leave', currentLeague.value),
    class: 'p-button-danger'
  },
  {
    label: i18n.t('common.edit'),
    icon: 'pi pi-pencil',
    visible: () => isOwner(currentLeague.value),
    command: () => emits('edit', currentLeague.value)
  },
  {
    label: i18n.t('common.remove'),
    icon: 'pi pi-trash',
    visible: () => isOwner(currentLeague.value),
    command: () => emits('remove', currentLeague.value),
    class: 'p-button-danger'
  }
])
</script>
