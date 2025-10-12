<template>
  <div class="h-screen my-auto flex flex-col items-center justify-center bg-base-200">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />

    <div class="hero">
      <div class="hero-content text-center">
        <div class="gap-6 flex flex-col items-center max-w-md">
          <h1 class="text-5xl font-bold">Erro inesperado</h1>
          <p class="text-lg">Ocorreu um erro ao processar sua solicitação.</p>
          <p class="text-sm opacity-70">
            Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com o
            suporte.
          </p>
          <div class="flex gap-4">
            <router-link :to="{ name: 'app.index' }" class="btn btn-primary">
              Voltar para o início
            </router-link>
            <button @click="reload" class="btn btn-outline">Recarregar página</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const reload = () => {
  window.location.reload()
}
</script>
