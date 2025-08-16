<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

defineProps<{
  id: string
  src: string
}>()

const file = ref<File>()

const emit = defineEmits<{
  submit: [src: File]
}>()

const handleChange = async (result: any) => {
  const blob = (await new Promise((resolve) =>
    result.canvas.toBlob(resolve, 'image/png'),
  )) as BlobPart

  file.value = new File([blob], 'avatar', { type: 'image/png' })
}

const handleSubmit = () => {
  emit('submit', file.value!)
}
</script>

<template>
  <dialog :id="id" class="modal">
    <div class="modal-box max-w-5xl">
      <h3 class="text-lg font-bold">Ajuste o seu avatar</h3>
      <cropper
        class="cropper h-[60vh]"
        :src="src"
        :stencil-props="{
          aspectRatio: 10 / 12,
        }"
        @change="handleChange"
      />
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn btn-neutral">Cancelar</button>
          <button class="btn btn-primary" @click.prevent="handleSubmit">Confirmar</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
