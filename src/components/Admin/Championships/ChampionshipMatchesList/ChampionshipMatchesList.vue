<template>
  <div class="surface-section p-5">
    <div
      class="flex justify-content-between cursor-pointer"
      @click="handleToggle"
    >
      <span class="font-medium text-3xl text-900">
        {{ championship.name }} {{ championship.year }}
      </span>
      <span class="flex align-items-center gap-3">
        {{ toggle.label }} <span :class="toggle.icon" />
      </span>
    </div>

    <Transition name="championships-matches-list">
      <UsersGuessesDataTable
        v-show="isOpen"
        class="mt-3"
        :guesses="championship.guesses"
      />
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

import UsersGuessesDataTable from '../../Guesses/UsersGuessesDataTable/UsersGuessesDataTable.vue'

const i18n = useI18n()

defineProps({
  championship: {
    type: Object,
    required: true
  }
})

const isOpen = ref(true)

const toggle = computed(() => {
  return isOpen.value
    ? {
        icon: 'pi pi-angle-down',
        label: i18n.t('common.hide')
      }
    : {
        icon: 'pi pi-angle-right',
        label: i18n.t('common.show')
      }
})

const handleToggle = () => (isOpen.value = !isOpen.value)
</script>

<style lang="scss">
.championships-matches-list-enter-active,
.championships-matches-list-leave-active {
  transition: all 0.3s ease-in-out;
}

.championships-matches-list-enter-from,
.championships-matches-list-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
