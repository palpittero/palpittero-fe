<script setup lang="ts">
defineProps<{
  date: string
}>()
</script>

<template>
  <span>
    {{
      new Date(date)
        .toLocaleString('pt-BR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(',', ' -')
    }}
  </span>
  <!-- <div class="text-sm opacity-50">
    {{
      new Date(date).toLocaleString('pt-BR', {
        weekday: 'long',
      })
    }}
  </div> -->
</template>
