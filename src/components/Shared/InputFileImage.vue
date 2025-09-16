<script setup lang="ts">
import { getMimeType } from '@/utils'
import { computed, onUnmounted, reactive, ref } from 'vue'
import { CircleStencil, Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

defineProps<{
  label?: string
}>()

const image = defineModel<File | string>({ required: true })

const imageSrc = computed(() => {
  if (typeof image.value === 'string') {
    return image.value
  }

  return image.value ? URL.createObjectURL(image.value) : null
})

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
  <div>
    <div class="avatar" v-if="imageSrc">
      <div class="w-24 rounded-full">
        <img :src="imageSrc" />
      </div>
    </div>
    <fieldset class="fieldset">
      <legend class="fieldset-legend" v-if="label">{{ label }}</legend>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <input type="file" class="file-input flex-1" accept="image/*" @change="handleChange" />
          <a
            v-if="image"
            type="button"
            class="link link-hover link-primary"
            @click.prevent="handleRemove"
          >
            <i class="fa-solid fa-trash" />
            Remover
          </a>
        </div>
        <div class="flex gap-4 items-start" v-if="file.src">
          <Cropper
            class="flex-1 cropper w-[calc(100vw-15rem)] lg:w-xl lg:h-[500px]"
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
        <div v-if="file.src" class="flex flex-col lg:flex-row gap-2 justify-end">
          <p class="text-sm w-full">Após confirmar o ajuste da imagem, clique em Salvar</p>
          <button type="button" class="btn" @click.prevent="handleCancel">Cancelar</button>
          <button type="button" class="btn btn-primary" @click.prevent="handleConfirm">
            Confirmar
          </button>
        </div>
      </div>
    </fieldset>
  </div>
</template>
