<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body items-center text-center">
      <h1 class="text-5xl font-bold">404</h1>
      <p class="py-6 text-xl">Ops! Página não encontrada</p>
      <p class="pb-6">A página administrativa que você está procurando não existe ou foi movida.</p>
      <router-link :to="{ name: 'admin.index' }" class="btn btn-primary">
        Voltar para o painel
      </router-link>
    </div>
  </div>
</template>
