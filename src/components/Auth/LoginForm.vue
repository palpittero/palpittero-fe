<script setup lang="ts">
export type iCredentials = {
  email: string
  password: string
}

const credentials = defineModel<iCredentials>({ required: true })

const emit = defineEmits<{
  submit: [data: iCredentials]
}>()

const handleSubmit = () => {
  emit('submit', credentials.value)
}
</script>

<template>
  <form class="card bg-base-200 w-full max-w-sm shrink-0 shadow-2xl" @submit.prevent="handleSubmit">
    <div class="card-body">
      <fieldset class="fieldset">
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
        <label class="label flex justify-between" for="password">
          Senha
          <router-link class="link" :to="{ name: 'forgot-password' }"
            >Esqueci minha senha</router-link
          >
        </label>
        <input
          id="password"
          type="password"
          class="input validator"
          required
          placeholder="Informe sua senha"
          v-model="credentials.password"
        />
        <div class="validator-hint">Senha é obrigatória</div>
        <button class="btn btn-success">Login</button>
        <div class="text-center">
          Ainda não é cadastrado?
          <router-link class="link" :to="{ name: 'sign-up' }">Criar uma conta</router-link>
        </div>
      </fieldset>
    </div>
  </form>
</template>
