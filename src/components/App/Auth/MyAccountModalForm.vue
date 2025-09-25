<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import InputFileImage from '@/components/Shared/InputFileImage.vue'
import services from '@/services'
import { useAuthStore, useToastStore } from '@/stores'
import type { iState } from '@/types'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'

const toastStore = useToastStore()

const emit = defineEmits<{
  success: []
}>()

const changePassword = ref<boolean>(false)

const authStore = useAuthStore()
const { loggedUser } = storeToRefs(authStore)

const myAccount = reactive<
  iState<{
    avatar: string
    name: string
    email: string
    currentPassword: string
    newPassword: string
    newPasswordConfirmation: string
  }>
>({
  loading: false,
  error: null,
  data: {
    avatar: '',
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  },
})

const handleOpen = async () => {
  changePassword.value = false

  try {
    myAccount.loading = true
    const user = await services.users.fetchUserById(loggedUser.value!.id!)

    myAccount.data.avatar = user.avatar ?? ''
    myAccount.data.name = user.name
    myAccount.data.email = user.email
  } catch (error: any) {
    myAccount.error = error.message
  } finally {
    myAccount.loading = false
  }
}

const passwordsMismatch = computed<boolean>(
  () =>
    !!myAccount.data.newPasswordConfirmation &&
    myAccount.data.newPassword !== myAccount.data.newPasswordConfirmation,
)

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  if (passwordsMismatch.value) return

  try {
    submitting.value = true

    await Promise.all([
      services.users.updateUser({
        id: loggedUser.value?.id,
        name: myAccount.data.name,
        email: myAccount.data.email,
        avatar: myAccount.data.avatar,
      }),

      changePassword.value &&
        services.auth.updatePassword({
          currentPassword: myAccount.data.currentPassword,
          newPassword: myAccount.data.newPassword,
        }),
    ])

    toastStore.success('Dados alterados com sucesso')
    emit('success')
  } catch (error: any) {
    if (error.response.status === 409) {
      toastStore.error('E-mail já está em uso')
    }

    if (error.response.status === 400) {
      toastStore.error('Senha atual incorreta')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal
    id="my_account_modal_form"
    title="Minha Conta"
    cancelButtonText="Cancelar"
    confirmButtonText="Salvar"
    @open="handleOpen"
    @submit="handleSubmit"
  >
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Escolha um avatar</legend>
      <InputFileImage v-model="myAccount.data.avatar" />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Nome</legend>
      <input
        v-model="myAccount.data.name"
        id="name"
        type="text"
        class="input validator"
        required
        placeholder="Informe o seu nome"
      />
      <div class="validator-hint">Nome é obrigatório</div>
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">E-mail</legend>
      <input
        v-model="myAccount.data.email"
        id="email"
        type="email"
        class="input validator"
        required
        placeholder="Informe o seu e-mail"
      />
      <div class="validator-hint">Informe um e-mail válido</div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Alterar Senha</legend>
      <input v-model="changePassword" type="checkbox" class="toggle" />
    </fieldset>

    <template v-if="changePassword">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Senha Atual</legend>
        <input
          id="password"
          type="password"
          class="input validator"
          required
          placeholder="Informe a sua senha atual"
          v-model="myAccount.data.currentPassword"
        />
        <div class="validator-hint">Senha atual é obrigatória</div>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nova Senha</legend>
        <input
          id="password"
          type="password"
          class="input validator"
          required
          placeholder="Informe uma nova senha"
          v-model="myAccount.data.newPassword"
        />
        <div class="validator-hint">Nova senha é obrigatória</div>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Confirmação de Senha</legend>
        <input
          id="confirm-password"
          type="password"
          class="input validator"
          required
          placeholder="Confirme a nova senha"
          v-model="myAccount.data.newPasswordConfirmation"
          :aria-invalid="passwordsMismatch"
        />
        <div class="validator-hint">Senhas não conferem</div>
      </fieldset>
    </template>
  </BaseModal>
</template>
