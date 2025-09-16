<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import InputFileImage from '@/components/Shared/InputFileImage.vue'
import { USER_MODEL } from '@/constants'
import { parseUserForm } from '@/helpers/users'
import services from '@/services'
import { useToastStore } from '@/stores'
import type { iUser, iState } from '@/types'
import { computed, reactive, ref } from 'vue'

const toastStore = useToastStore()

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const changePassword = ref<boolean>(false)

const user = reactive<iState<iUser>>({
  loading: false,
  error: null,
  data: { ...USER_MODEL },
})

const handleOpen = async () => {
  changePassword.value = false

  if (!props.userId) {
    user.data = { ...USER_MODEL }

    return
  }

  try {
    user.data = await services.users.fetchUserById(props.userId)
    user.data.password = ''
  } catch (error: any) {
    user.error = error.message
  }
}

const handleClose = () => {
  emit('cancel')
}

const passwordsMismatch = computed<boolean>(
  () => !!user.data.passwordConfirmation && user.data.password !== user.data.passwordConfirmation,
)

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  if (passwordsMismatch.value) return

  try {
    submitting.value = true

    const parsedUser = parseUserForm({ user: user.data, changePassword: changePassword.value })

    if (user.data.id) {
      await services.users.updateUser(parsedUser)
    } else {
      await services.users.createUser(parsedUser)
    }

    toastStore.success('Usuário salvo com sucesso')
    emit('success')
  } catch (error: any) {
    if (error.response.status === 409) {
      toastStore.error('E-mail já está em uso')
    }
  } finally {
    submitting.value = false
  }
}

const showPassword = computed<boolean>(() => Boolean(changePassword.value || !user.data.id))

const passwordLabel = computed<string>(() => (user.data.id ? 'Alterar Senha' : 'Cadastrar Senha'))
</script>

<template>
  <BaseModal
    id="user_modal_form"
    title="Usuário"
    cancelButtonText="Cancelar"
    confirmButtonText="Salvar"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <fieldset class="fieldset">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nome</legend>
        <input
          id="name"
          type="text"
          class="input validator"
          required
          placeholder="Informe o nome"
          v-model="user.data.name"
        />
        <div class="validator-hint">Nome é obrigatório</div>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">E-mail</legend>
        <input
          id="email"
          type="email"
          class="input validator"
          required
          placeholder="Informe o email"
          v-model="user.data.email"
        />
        <div class="validator-hint">Informe um e-mail válido</div>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tipo</legend>
        <select class="select" v-model="user.data.role">
          <option disabled selected>Selecione um tipo</option>
          <option value="player">Jogador</option>
          <option value="admin">Administrador</option>
          <option value="system">Sistema</option>
        </select>
      </fieldset>

      <!-- @vue-ignore -->
      <InputFileImage v-model="user.data.avatar" label="Escolha um avatar" />

      <fieldset class="fieldset" v-if="user.data.id">
        <legend class="fieldset-legend">
          {{ passwordLabel }}
        </legend>
        <input v-model="changePassword" type="checkbox" class="toggle" />
      </fieldset>

      <template v-if="showPassword">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Senha</legend>
          <input
            id="password"
            type="password"
            class="input validator"
            required
            placeholder="Informe uma nova senha"
            v-model="user.data.password"
          />
          <div class="validator-hint">Senha é obrigatória</div>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Confirmação de Senha</legend>
          <input
            id="confirm-password"
            type="password"
            class="input validator"
            required
            placeholder="Confirme a nova senha"
            v-model="user.data.passwordConfirmation"
            :aria-invalid="passwordsMismatch"
          />
          <div class="validator-hint">Senhas não conferem</div>
        </fieldset>
      </template>
    </fieldset>
  </BaseModal>
</template>
