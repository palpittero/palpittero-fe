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
            {{ $t('admin.auth.accountActivated.title', user) }}
          </span>
          <h1
            class="text-900 font-bold text-3xl lg:text-5xl mb-2 flex align-items-center gap-3"
          >
            {{ $t('admin.auth.accountActivated.subtitle') }}
            <span class="pi pi-check text-green-500 text-3xl" />
          </h1>
          <span class="text-gray-600">{{
            $t('admin.auth.accountActivated.message')
          }}</span></template
        >
        <template v-else>
          <span class="text-blue-500 font-bold text-3xl">
            {{ $t('admin.auth.activateAccount.title', user) }}
          </span>
          <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
            {{ $t('admin.auth.activateAccount.subtitle') }}
          </h1>
          <span class="text-gray-600">{{
            $t('admin.auth.activateAccount.message')
          }}</span>
        </template>
        <div class="flex align-items-center justify-content-center mt-5">
          <ProgressSpinner v-if="isLoading" />
          <template v-else>
            <i
              class="pi pi-fw pi-sign-in text-blue-500 mr-2"
              style="vertical-align: center"
            ></i>
            <router-link :to="{ name: 'Login' }" class="text-blue-500">
              {{ $t('admin.auth.signUp.cta') }}</router-link
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import services from '@/services'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { omit } from 'lodash/fp'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const isSuccess = ref(false)

onMounted(async () => {
  isLoading.value = true

  const { token } = route.query
  if (!token) {
    router.replace({ name: 'NotFound' })
    return
  }

  await services.auth.activateAccount(token)
  router.replace(omit('query', route))

  isSuccess.value = true
  isLoading.value = false
})
</script>
