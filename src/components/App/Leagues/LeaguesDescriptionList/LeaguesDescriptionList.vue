<template>
  <Accordion :title="title" :open="open">
    <div v-if="loading" class="vstack gap-3 placeholder-glow">
      <span class="placeholder col-12 p-3" />
      <span class="placeholder col-10 p-3" />
      <span class="placeholder col-8 p-3" />
    </div>

    <Alert v-else-if="leagues.length === 0" :text="innerDescription" />
    <ul v-else class="list-group">
      <li
        v-for="league in leagues"
        :key="league.id"
        class="list-group-item hstack pe-2"
      >
        <div class="hstack gap-3">
          <Avatar :img="league.badge" />
          <span class="w-100">
            {{ league.name }}
          </span>
        </div>
        <div class="ms-auto">
          <div class="d-lg-none dropdown">
            <PButton
              variant="clear"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              icon="fas fa-ellipsis-vertical"
            />

            <ul class="dropdown-menu">
              <li v-if="!isParticipant(league)">
                <a
                  href="#"
                  class="dropdown-item hstack row m-0 gap-3"
                  @click="emits('join', league)"
                >
                  <font-awesome-icon icon="fas fa-sign-in" class="col-2 p-0" />
                  <span class="col p-0">
                    {{ $t('app.leagues.join') }}
                  </span>
                </a>
              </li>
              <li v-if="isParticipant(league)">
                <a
                  href="#"
                  class="dropdown-item row m-0 hstack gap-3"
                  @click="emits('ranking', league)"
                >
                  <font-awesome-icon
                    icon="fas fa-ranking-star"
                    class="col-2 p-0"
                  />
                  <span class="col p-0">
                    {{ $t('app.leagues.ranking') }}
                  </span>
                </a>
              </li>

              <li v-if="isParticipant(league)">
                <a
                  href="#"
                  class="dropdown-item hstack m-0 gap-3 row"
                  @click="emits('guesses', league)"
                >
                  <font-awesome-icon class="col-2 p-0" icon="fas fa-book" />
                  <span class="col p-0">
                    {{ $t('app.leagues.guesses') }}
                  </span>
                </a>
              </li>

              <li v-if="isOwner(league)" @click="emits('manage', league)">
                <a href="#" class="dropdown-item hstack row m-0 gap-3">
                  <font-awesome-icon icon="fas fa-users" class="col-2 p-0" />
                  <span class="col p-0">
                    {{ $t('app.leagues.participants') }}
                  </span>
                </a>
              </li>

              <li v-if="canLeave(league)" @click="emits('leave', league)">
                <a href="#" class="dropdown-item hstack row m-0 gap-3">
                  <font-awesome-icon icon="fas fa-sign-out" class="col-2 p-0" />
                  <span class="col p-0">
                    {{ $t('app.leagues.leave') }}
                  </span>
                </a>
              </li>

              <template v-if="isOwner">
                <li>
                  <a
                    class="dropdown-item row hstack gap-3 m-0"
                    href="#"
                    @click="emits('edit', league)"
                  >
                    <font-awesome-icon icon="fas fa-pencil" class="col-2 p-0" />
                    <span class="col p-0">
                      {{ $t('common.edit') }}
                    </span>
                  </a>
                </li>
                <li @click="emits('remove', league)">
                  <a href="#" class="dropdown-item row hstack gap-3 m-0">
                    <font-awesome-icon icon="fas fa-trash" class="col-2 p-0" />
                    <span class="col p-0">
                      {{ $t('common.remove') }}
                    </span>
                  </a>
                </li>
              </template>
            </ul>
          </div>

          <div class="d-none d-lg-flex gap-2">
            <PButton
              v-if="!isParticipant(league)"
              :label="$t('app.leagues.join')"
              icon="fas fa-sign-in"
              @click="emits('join', league)"
            />

            <PButton
              v-if="isParticipant(league)"
              :label="$t('app.leagues.ranking')"
              variant="info"
              icon="fas fa-ranking-star"
              @click="emits('ranking', league)"
            />

            <PButton
              v-if="isParticipant(league)"
              :label="$t('app.leagues.guesses')"
              icon="fas fa-book"
              variant="success"
              @click="emits('guesses', league)"
            />

            <PButton
              v-if="isOwner(league)"
              :label="$t('app.leagues.participants')"
              icon="fas fa-users"
              @click="emits('manage', league)"
            />

            <PButton
              v-if="canLeave(league)"
              :label="$t('app.leagues.leave')"
              icon="fas fa-sign-out"
              class="p-button-text p-button-danger"
              @click="emits('leave', league)"
            />

            <div v-if="isOwner(league)" class="dropdown ms-auto">
              <PButton
                variant="dark"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                icon="fas fa-cog"
                class="h-100"
              />

              <ul class="dropdown-menu">
                <li>
                  <a
                    href="#"
                    class="dropdown-item hstack gap-2"
                    @click="emits('edit', league)"
                  >
                    <font-awesome-icon icon="fas fa-pencil" />
                    {{ $t('common.edit') }}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="dropdown-item hstack gap-2"
                    @click="emits('remove', league)"
                  >
                    <font-awesome-icon icon="fas fa-trash" />
                    {{ $t('common.remove') }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </Accordion>
  <!-- <Menu ref="menu" :model="menuItems" popup /> -->
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
// import { useI18n } from 'vue-i18n'

// import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
// import Heading from '@/components/Shared/Heading/Heading.vue'
import Accordion from '@/components/Shared/Accordion/Accordion.vue'
import Avatar from '@/components/Shared/Avatar/Avatar.vue'
import Alert from '@/components/Shared/Alert/Alert.vue'

import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'

const authStore = useAuthStore()
// const i18n = useI18n()

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
  onGetRoute: {
    type: Function,
    default: () => null
  },
  loading: Boolean,
  open: Boolean
})

const emits = defineEmits([
  'manage',
  'ranking',
  'join',
  'leave',
  'edit',
  'remove'
])

// const currentLeague = ref()

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
  props.leagues.length === 0 ? props.description : props.emptyState
)

const canLeave = (league) => isParticipant(league) && isGuest(league)
// const menu = ref()

// const toggleMenu = async (event, league) => {
//   currentLeague.value = league
//   menu.value.toggle(event)
// }

// const menuItems = computed(() => [
//   {
//     label: i18n.t('app.leagues.join'),
//     icon: 'pi pi-sign-in',
//     visible: () => !isParticipant(currentLeague.value),
//     command: () => emits('join', currentLeague.value)
//   },
//   {
//     label: i18n.t('app.leagues.ranking'),
//     icon: 'pi pi-list',
//     visible: () => isParticipant(currentLeague.value),
//     command: () => emits('ranking', currentLeague.value)
//   },
//   {
//     label: i18n.t('app.leagues.participants'),
//     icon: 'pi pi-users',
//     visible: () => isOwner(currentLeague.value),
//     command: () => emits('manage', currentLeague.value)
//   },
//   {
//     label: i18n.t('app.leagues.guesses'),
//     icon: 'pi pi-user-edit',
//     visible: () => isParticipant(currentLeague.value),
//     command: () => emits('guesses', currentLeague.value)
//   },
//   {
//     label: i18n.t('app.leagues.leave'),
//     icon: 'pi pi-sign-out',
//     visible: () => canLeave(currentLeague.value),
//     command: () => emits('leave', currentLeague.value),
//     class: 'p-button-danger'
//   },
//   {
//     label: i18n.t('common.edit'),
//     icon: 'pi pi-pencil',
//     visible: () => isOwner(currentLeague.value),
//     command: () => emits('edit', currentLeague.value)
//   },
//   {
//     label: i18n.t('common.remove'),
//     icon: 'pi pi-trash',
//     visible: () => isOwner(currentLeague.value),
//     command: () => emits('remove', currentLeague.value),
//     class: 'p-button-danger'
//   }
// ])
</script>
