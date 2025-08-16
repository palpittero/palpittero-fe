<script setup lang="ts">
import { getMimeType } from '@/utils'
import { onUnmounted, reactive, ref } from 'vue'
import { CircleStencil, Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const image = defineModel<File | string>({ required: true })
const cropResult = ref<any>({
  canvas: null,
  image: {
    src: '',
    type: '',
  },
  coordinates: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
})

const file = reactive<{
  src: string
  type: string
}>({
  src: '',
  type: '',
})

const handleChange = (event: Event) => {
  const { files } = event.target as HTMLInputElement
  if (files && files[0]) {
    if (file.src) {
      URL.revokeObjectURL(file.src)
    }
    const blob = URL.createObjectURL(files[0])

    const reader = new FileReader()

    reader.onload = (e) => {
      file.src = blob
      file.type = getMimeType({ file: e.target?.result, fallback: files[0].type })
    }

    reader.readAsArrayBuffer(files[0])
  }
}

const handleCrop = async (result: any) => {
  cropResult.value = result
}

const handleCancel = () => {
  file.src = ''
  cropResult.value = null
}

const handleConfirm = async () => {
  if (cropResult.value?.canvas) {
    const blob = (await new Promise((resolve) =>
      cropResult.value.canvas.toBlob(resolve, 'image/png'),
    )) as BlobPart

    const file = new File([blob], 'avatar.png', { type: 'image/png' })

    image.value = file

    handleCancel()
  }
}

const handleRemove = () => {
  image.value = ''
  file.src = ''
  cropResult.value = null
}

onUnmounted(() => {
  if (file.src) {
    URL.revokeObjectURL(file.src)
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <input type="file" class="file-input" accept="image/*" @change="handleChange" />
      <button
        v-if="image"
        type="button"
        class="btn btn-neutral btn-link"
        @click.prevent="handleRemove"
      >
        Remover
      </button>
    </div>
    <div class="flex gap-4 items-start" v-if="file.src">
      <Cropper
        class="flex-1 cropper w-xl h-[500px]"
        :src="file.src"
        :stencil-component="CircleStencil"
        @change="handleCrop"
      />
      <Preview
        class="flex-none w-24 h-24 rounded-full"
        :image="cropResult?.image"
        :coordinates="cropResult?.coordinates"
      />
    </div>
    <div v-if="file.src" class="flex gap-4 justify-end">
      <p class="text-sm w-full">Após confirmar o ajuste da imagem, clique em Salvar</p>
      <button type="button" class="btn btn-outline" @click.prevent="handleCancel">Cancelar</button>
      <button type="button" class="btn btn-success" @click.prevent="handleConfirm">
        Confirmar
      </button>
    </div>
  </div>
</template>
