<template>
  <div class="hero min-h-[60vh]">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">404</h1>
        <p class="py-6 text-xl">Ops! Página não encontrada</p>
        <p class="pb-6">A página que você está procurando não existe ou foi movida.</p>
        <router-link :to="{ name: 'app.index' }" class="btn btn-primary">
          Voltar para o início
        </router-link>
      </div>
    </div>
  </div>
</template>
