<script setup lang="ts">
import InputFileImage from '@/components/Shared/InputFileImage.vue'
import { computed } from 'vue'

export type iProfile = {
  name: string
  email: string
  avatar: File | string
}

defineProps<{
  loading?: boolean
}>()

const profile = defineModel<iProfile>({ required: true })

const emit = defineEmits<{
  submit: [data: iProfile]
}>()

const avatar = computed(() => {
  if (typeof profile.value.avatar === 'string') {
    return profile.value.avatar
  }

  return profile.value.avatar ? URL.createObjectURL(profile.value.avatar) : null
})

const handleSubmit = () => {
  emit('submit', profile.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box max-w-3xl border p-4">
      <div class="avatar" v-if="avatar">
        <div class="w-24 rounded-full">
          <img :src="avatar as string" />
        </div>
      </div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Escolha uma imagem</legend>
        <InputFileImage v-model="profile.avatar" />
      </fieldset>

      <legend class="fieldset-legend">Meus Dados</legend>
      <label for="name">Nome</label>
      <input
        v-model="profile.name"
        id="name"
        type="text"
        class="input validator"
        required
        placeholder="Informe o seu nome"
      />
      <div class="validator-hint">Nome é obrigatório</div>
      <label for="email">E-mail</label>
      <input
        v-model="profile.email"
        id="email"
        type="email"
        class="input validator"
        required
        placeholder="Informe o seu e-mail"
      />
      <div class="validator-hint">Informe um e-mail válido</div>
      <button type="submit" class="justify-self-end btn btn-success mt-4" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner"></span>
        Salvar Dados
      </button>
    </fieldset>
  </form>
</template>
