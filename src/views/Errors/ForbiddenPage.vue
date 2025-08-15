<template>
  <div class="h-screen my-auto flex flex-col items-center justify-center">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />
    <div class="hero">
      <div class="hero-content text-center">
        <div class="gap-6 flex flex-col items-center">
          <h1 class="text-5xl font-bold">Acesso negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
          <router-link :to="{ name: 'home' }" class="link">Voltar para o início</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
