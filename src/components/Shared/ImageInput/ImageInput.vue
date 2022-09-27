<template>
  <div>
    <div v-if="croppedImage" class="image-input__cropped-image">
      <img :src="croppedImage" />
      <div class="flex justify-content-center">
        <Button
          class="p-button-text p-button-danger p-button-icon p-button-sm"
          @click="handleRemove"
        >
          <span class="pi pi-trash mr-2" /> {{ $t('common.remove') }}
        </Button>
      </div>
    </div>
    <!-- <span v-else> -->
    <FileUpload
      v-else
      accept="image/*"
      mode="basic"
      auto
      custom-upload
      @uploader="uploader"
    />
    <ImageCropperDialog
      :visible="isImageCropperDialogOpen"
      :image="image"
      :mime-type="mimeType"
      @submit="handleSubmit"
      @hide="handleHide"
    />
  </div>
</template>

<script setup>
import ImageCropperDialog from '@/components/Shared/ImageCropperDialog/ImageCropperDialog.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Blob, String],
    default: null
  },
  validation: {
    type: [Object, Boolean],
    default: () => ({})
  }
})

const isImageCropperDialogOpen = ref(false)
const croppedImage = ref('')
const image = ref(null)
const mimeType = ref(null)
const model = ref(props.modelValue)

const emits = defineEmits(['update:modelValue'])

watch(
  model,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (value) => {
    if (typeof value === 'string') {
      croppedImage.value = value
    }
  },
  { immediate: true }
)

const uploader = (event) => {
  const file = event.files[0]

  if (file) {
    mimeType.value = file.type

    if (typeof FileReader === 'function') {
      const reader = new FileReader()

      reader.onload = (event) => {
        image.value = event.target.result
        isImageCropperDialogOpen.value = true
      }

      reader.readAsDataURL(file)
    } else {
      alert('FileReader API is not supported')
    }
  }
}

const handleSubmit = (blob) => {
  isImageCropperDialogOpen.value = false
  model.value = blob
  var URLCreator = window.URL || window.webkitURL
  croppedImage.value = URLCreator.createObjectURL(blob)
}

const handleRemove = () => {
  croppedImage.value = null
  model.value = null
}

const handleHide = () => {
  isImageCropperDialogOpen.value = false
}
</script>

<style lang="scss" scoped>
.image-input {
  &__cropped-image {
    width: 200px;

    img {
      max-width: 100%;
    }
  }
}
</style>
