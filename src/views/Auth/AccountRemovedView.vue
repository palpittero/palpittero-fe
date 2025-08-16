<template>
  <div class="h-screen my-auto flex flex-col items-center justify-center">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-[250px]" />
    <div class="hero">
      <div class="hero-content text-center">
        <div class="gap-6 flex flex-col items-center">
          <h1 class="text-5xl font-bold">Conta removida com sucesso!</h1>
          <p>Caso mude de ideia, clique no botão abaixo para criar uma nova conta.</p>
          <router-link :to="{ name: 'sign-up' }" class="link mt-try">Criar nova conta</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
