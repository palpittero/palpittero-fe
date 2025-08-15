<script setup lang="ts">
import { computed, ref } from 'vue'

export type iCredentials = {
  token: string
  password: string
  passwordConfirmation: string
}

const credentials = defineModel<iCredentials>({ required: true })

const emit = defineEmits<{
  submit: [data: iCredentials]
}>()

const submitted = ref<boolean>(false)

const handleSubmit = () => {
  submitted.value = true
  emit('submit', credentials.value)
}

const passwordConfirmationError = computed<string>(() => {
  if (!submitted.value) {
    return ''
  }

  if (!credentials.value.passwordConfirmation) {
    return 'Confirmação de senha é obrigatória'
  }

  if (credentials.value.password !== credentials.value.passwordConfirmation) {
    return 'Senhas não conferem'
  }

  return ''
})
</script>

<template>
  <form class="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl" @submit.prevent="handleSubmit">
    <div class="card-body">
      <fieldset class="fieldset">
        <label class="label" for="email">Nova senha</label>
        <input
          id="password"
          type="password"
          class="input validator"
          required
          placeholder="Informe uma nova senha"
          v-model="credentials.password"
        />
        <div class="validator-hint">Informe uma senha válida</div>
        <label class="label" for="confirmPassword">Confirmar senha</label>
        <input
          id="confirmPassword"
          type="password"
          class="input validator"
          required
          placeholder="Confirme sua nova senha"
          :aria-invalid="!!passwordConfirmationError"
          v-model="credentials.passwordConfirmation"
        />
        <div class="validator-hint">
          {{ passwordConfirmationError }}
        </div>
        <button class="btn btn-success">Redefinir Senha</button>
      </fieldset>
    </div>
  </form>
</template>
