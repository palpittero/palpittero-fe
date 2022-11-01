<template>
  <div
    class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden login"
  >
    <div class="grid justify-content-center p-2 lg:p-0 login__container">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <img
          src="/images/logo-dark.svg"
          alt="Palpittero logo"
          class="mb-5 login__logo"
        />
      </div>
      <div class="text-center" v-if="isSuccess">
        <!-- <template v-if="isSuccess"> -->
        <span class="text-blue-500 font-bold text-3xl">
          {{ $t('admin.auth.passwordReset.title', user) }}
        </span>
        <h1
          class="text-900 font-bold text-3xl lg:text-5xl mb-2 flex align-items-center gap-3"
        >
          {{ $t('admin.auth.passwordReset.subtitle') }}
          <span class="pi pi-check text-green-500 text-3xl" />
        </h1>
        <span class="text-gray-600">{{
          $t('admin.auth.passwordReset.message')
        }}</span>
        <!-- </template
        > -->
        <!-- <template v-else>
          <span class="text-blue-500 font-bold text-3xl">
            {{ $t('admin.auth.activateAccount.title', user) }}
          </span>
          <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
            {{ $t('admin.auth.activateAccount.subtitle') }}
          </h1>
          <span class="text-gray-600">{{
            $t('admin.auth.activateAccount.message')
          }}</span>
        </template> -->
        <div class="flex align-items-center justify-content-center mt-5">
          <!-- <ProgressSpinner v-if="isLoading" /> -->
          <!-- <template v-else> -->
          <i
            class="pi pi-fw pi-sign-in text-blue-500 mr-2"
            style="vertical-align: center"
          ></i>
          <router-link :to="{ name: 'Login' }" class="text-blue-500">
            {{ $t('admin.auth.signUp.cta') }}</router-link
          >
          <!-- </template> -->
        </div>
      </div>
      <div v-else class="col-12 xl:col-6 login__form-wrapper">
        <div class="h-full w-full m-0 py-7 px-4 login__form-container">
          <ResetPasswordForm
            v-model="credentials"
            :submitted="submitted"
            :errors="errors"
            :loading="isLoading"
            @submit="onSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import services from '@/services'
import { onMounted, reactive, ref, watch } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
// import { omit } from 'lodash/fp'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { omit } from 'lodash/fp'
// import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const i18n = useI18n()

const credentials = reactive({
  token: '',
  password: '',
  passwordConfirmation: ''
})

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    password: yup.string().required(),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf(
        [yup.ref('password')],
        i18n.t('admin.users.error.passwordsDontMatch')
      )
  })
})

const isLoading = ref(false)
const isSuccess = ref(false)
// const isFinished = ref(false)

watch(credentials, (value) => setValues(value), { deep: true, immediate: true })

onMounted(async () => {
  try {
    isLoading.value = true

    const { token } = route.query
    if (!token) {
      router.replace({ name: 'NotFound' })
      return
    }

    await services.auth.validateToken(token)
    credentials.token = token
    router.replace(omit('query', route))
  } catch (error) {
    if (error.response.status === 422) {
      toast.add({
        severity: 'error',
        summary: i18n.t('common.error'),
        detail: i18n.t('admin.auth.error.tokenInvalidOrExpired'),
        life: 4000,
        group: 'app'
      })
    }
    if (error.response.status === 404) {
      toast.add({
        severity: 'error',
        summary: i18n.t('common.error'),
        detail: i18n.t('admin.auth.error.userNotFound'),
        life: 4000,
        group: 'app'
      })
    }
  } finally {
    isLoading.value = false
  }
})

const onSubmit = handleSubmit(
  async (credentials) => {
    submitted.value = true
    try {
      isLoading.value = true
      await services.auth.resetPassword(credentials)
      // isFinished.value = true
      isSuccess.value = true
    } catch (error) {
      if (error.response.status === 404) {
        toast.add({
          severity: 'error',
          summary: i18n.t('common.error'),
          detail: i18n.t('admin.auth.error.userNotFound'),
          life: 4000,
          group: 'app'
        })
      }
    } finally {
      isLoading.value = false
    }
  },
  () => {
    submitted.value = true
  }
)
</script>
<style lang="scss">
.login {
  .p-inputtext {
    padding: 1rem !important;
  }

  .pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
  }

  .pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
  }

  &__logo {
    width: 81px;
    height: 60px;
  }

  &__container {
    min-width: 80%;
    margin-bottom: 30vh;
  }

  &__form {
    &-wrapper {
      border-radius: 56px;
      padding: 0.3rem;
      background: linear-gradient(
        180deg,
        var(--primary-color),
        rgba(33, 150, 243, 0) 30%
      );
    }

    &-container {
      border-radius: 53px;
      background: linear-gradient(
        180deg,
        var(--surface-50) 38.9%,
        var(--surface-0)
      );
    }
  }
}
</style>
