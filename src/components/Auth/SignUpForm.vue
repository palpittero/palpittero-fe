<script setup lang="ts">
import { computed, ref } from 'vue'

export type iCredentials = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

const credentials = defineModel<iCredentials>({ required: true })

const emit = defineEmits<{
  submit: [data: iCredentials]
}>()

const submitted = ref<boolean>(false)

const handleSubmit = (event: Event) => {
  submitted.value = true
  event.preventDefault()
  emit('submit', credentials.value)
}

const passwordsMismatch = computed<boolean>(
  () => credentials.value.password !== credentials.value.passwordConfirmation,
)
</script>

<template>
  <form class="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl" @submit="handleSubmit">
    <div class="card-body">
      <fieldset class="fieldset">
        <label class="label" for="email">Nome</label>
        <input
          id="name"
          type="text"
          class="input validator"
          required
          placeholder="Informe seu nome"
          v-model="credentials.name"
        />
        <div class="validator-hint">Nome é obrigatório</div>
        <label class="label" for="email">E-mail</label>
        <input
          id="email"
          type="email"
          class="input validator"
          required
          placeholder="Informe seu email"
          v-model="credentials.email"
        />
        <div class="validator-hint">Informe um e-mail válido</div>
        <label class="label flex justify-between" for="password"> Senha </label>
        <input
          id="password"
          type="password"
          class="input validator"
          required
          placeholder="Informe sua senha"
          v-model="credentials.password"
        />
        <div class="validator-hint">Senha é obrigatória</div>
        <label class="label flex justify-between" for="confirm-password">
          Confirmação de Senha
        </label>
        <input
          id="confirm-password"
          type="password"
          class="input validator"
          required
          placeholder="Confirme sua senha"
          v-model="credentials.passwordConfirmation"
          :aria-invalid="passwordsMismatch"
        />
        <div class="validator-hint">Senhas não conferem</div>
        <button class="btn btn-success">Criar Conta</button>
        <div class="text-center">
          Já possui uma conta?
          <router-link class="link" :to="{ name: 'login' }">Fazer login</router-link>
        </div>
      </fieldset>
    </div>
  </form>
</template>
