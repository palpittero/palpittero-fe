<template>
  <div
    class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden sign-up"
  >
    <div class="grid justify-content-center p-2 lg:p-0 sign-up__container">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <img
          :src="'/images/logo-dark.svg'"
          alt="Palpittero logo"
          class="mb-5 sign-up__logo"
        />
      </div>
      <div class="text-center">
        <template v-if="isSuccess">
          <span class="text-blue-500 font-bold text-3xl">
            {{ $t('admin.auth.invitationAccepted.title') }}
          </span>
          <h1
            class="text-900 font-bold text-3xl lg:text-5xl mb-2 flex align-items-center gap-3"
          >
            {{ $t('admin.auth.invitationAccepted.subtitle', league) }}
            <span class="pi pi-check text-green-500 text-3xl" />
          </h1>
          <span class="text-gray-600">
            {{ $t('admin.auth.invitationAccepted.message') }}
          </span>
        </template>
        <template v-else>
          <span class="text-blue-500 font-bold text-3xl">
            {{ $t('admin.auth.acceptInvitation.title') }}
          </span>
          <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
            {{ $t('admin.auth.acceptInvitation.subtitle') }}
          </h1>
          <span
            class="text-gray-600"
            v-html="$t('admin.auth.acceptInvitation.message', league)"
          />
        </template>
        <div class="flex align-items-center justify-content-center mt-5">
          <ProgressSpinner v-if="isLoading" />
          <template v-else>
            <i
              class="pi pi-fw pi-flag text-blue-500 mr-2"
              style="vertical-align: center"
            ></i>
            <router-link :to="{ name: 'Home' }" class="text-blue-500">
              {{ $t('admin.auth.acceptInvitation.cta') }}</router-link
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import services from '@/services'
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { omit } from 'lodash/fp'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const isSuccess = ref(false)

const league = reactive({
  name: '',
  owner: '',
  visibility: ''
})

onMounted(async () => {
  try {
    isLoading.value = true
    const { token, league: name, owner, visibility } = route.query

    league.name = name
    league.owner = owner
    league.visibility = visibility

    if (!token) {
      router.replace({ name: 'NotFound' })
      return
    }

    await services.usersLeagues.acceptInvitation(token)
    router.replace(omit('query', route))

    isSuccess.value = true
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})
</script>
