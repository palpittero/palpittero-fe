<template>
  <div class="h-screen my-auto flex flex-col items-center justify-center">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />

    <div class="hero">
      <div class="hero-content text-center">
        <div class="gap-6 flex flex-col items-center">
          <h1 class="text-5xl font-bold">Ops! Página não encontrada</h1>
          <p>Parece que você está perdido.</p>
          <router-link :to="{ name: 'home' }" class="link">Voltar para o início</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
