<template>
  <div class="d-flex align-items-center gap-2">
    <div class="vstack align-items-center gap-2">
      <PAvatar :img="team.badge" />
      <span class="text-center">
        {{ team.name }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  team: {
    type: Object,
    required: true
  }
})
</script>
