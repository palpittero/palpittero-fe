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
        <span class="text-blue-500 font-bold text-3xl">
          {{ $t('admin.auth.accountRemoved.title') }}
        </span>
        <h1
          class="text-900 font-bold text-3xl lg:text-5xl mb-2 flex align-items-center gap-3"
        >
          {{ $t('admin.auth.accountRemoved.subtitle') }}
          <span class="pi pi-check text-green-500 text-3xl" />
        </h1>
        <span class="text-gray-600">{{
          $t('admin.auth.accountRemoved.message')
        }}</span>
        <div class="flex align-items-center justify-content-center mt-5">
          <i
            class="pi pi-fw pi-user-edit text-blue-500 mr-2"
            style="vertical-align: center"
          ></i>
          <router-link :to="{ name: 'SignUp' }" class="text-blue-500">
            {{ $t('admin.auth.accountRemoved.cta') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
