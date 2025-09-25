<script lang="ts" setup>
import { onMounted, ref } from 'vue'

withDefaults(
  defineProps<{
    id: string
    title: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    disableConfirm?: boolean
    cancelButtonText?: string
    confirmButtonText?: string
    hideCloseButton?: boolean
    hideConfirmButton?: boolean
  }>(),
  {
    size: 'xl',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Salvar',
  },
)

const emit = defineEmits<{
  submit: []
  open: []
  close: []
}>()

const modalRef = ref<HTMLDialogElement>()
const isOpen = ref<boolean>(false)

onMounted(() => {
  const modal = modalRef.value!

  // quando fecha
  modal.addEventListener('close', () => {
    isOpen.value = false
    document.body.style.overflow = 'auto'
    emit('close')
  })

  // opcional: observer para quando abrir
  const observer = new MutationObserver(() => {
    if (modal.hasAttribute('open')) {
      isOpen.value = true
      document.body.style.overflow = 'hidden'
      emit('open')
    }
  })

  observer.observe(modal, { attributes: true, attributeFilter: ['open'] })
})

const handleSubmit = () => {
  emit('submit')
}

const sizeClasses = {
  sm: 'max-w-xl',
  md: '!max-w-2xl',
  lg: '!max-w-3xl',
  xl: '!max-w-4xl',
  '2xl': 'max-w-5xl',
}
</script>

<template>
  <dialog ref="modalRef" :id="id" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box overflow-y-auto max-h-[90vh]" :class="sizeClasses[size]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <form v-if="isOpen" class="w-full shrink-0" @submit.prevent="handleSubmit">
        <h3 class="text-xl font-bold mb-3">
          {{ title }}
        </h3>
        <div class="w-full">
          <slot />
        </div>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button class="btn btn-neutral" v-if="!hideCloseButton">
              {{ cancelButtonText }}
            </button>
          </form>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="disableConfirm"
            v-if="!hideConfirmButton"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<style lang="scss">
.modal {
  @media (width < 40rem) {
    @apply modal-bottom;
  }
}
</style>

<!-- <style lang="scss">
.modal-box {
  @media (width < 40rem) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    overflow-x: hidden;
    height: 100vh;
    max-height: 100vh;
    scale: 1;
    border-radius: 0;

    .modal-action {
      position: fixed;
      bottom: 20px;
      justify-self: self-end;
    }
  }
}
</style> -->
