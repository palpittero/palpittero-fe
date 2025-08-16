<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: iCredentials]
}>()

export type iCredentials = {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

const credentials = defineModel<iCredentials>({ required: true })

const passwordsMismatch = computed<boolean>(
  () => credentials.value.newPassword !== credentials.value.newPasswordConfirmation,
)

const handleSubmit = () => {
  if (passwordsMismatch.value) return
  emit('submit', credentials.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box max-w-3xl border p-4">
      <legend class="fieldset-legend">Alterar Senha</legend>
      <label for="current-password">Senha atual</label>
      <input
        v-model="credentials.currentPassword"
        id="current-password"
        type="password"
        class="input validator"
        required
        placeholder="Senha atual"
      />
      <div class="validator-hint">Senha atual é obrigatória</div>
      <label for="new-password">Nova senha</label>
      <input
        v-model="credentials.newPassword"
        id="new-password"
        type="password"
        class="input validator"
        required
        placeholder="Nova senha"
      />
      <div class="validator-hint">Nova senha é obrigatória</div>
      <label for="new-password-confirmation">Confirmar senha</label>
      <input
        v-model="credentials.newPasswordConfirmation"
        id="new-password-confirmation"
        type="password"
        class="input validator"
        required
        placeholder="Confirmar senha"
        :aria-invalid="passwordsMismatch"
      />

      <div class="validator-hint">Senhas não conferem</div>
      <button type="submit" class="justify-self-end btn btn-success mt-4" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner"></span>
        Alterar Senha
      </button>
    </fieldset>
  </form>
</template>
