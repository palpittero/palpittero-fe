<template>
  <div>
    <div
      class="image-input__cropped-image flex align-items-center"
      :class="className"
    >
      <Avatar shape="circle" size="xlarge" :image="avatarImage" />
      <div class="flex justify-content-center">
        <Button
          v-if="croppedImage && clearable"
          class="p-button-text p-button-danger p-button-icon p-button-sm"
          @click="handleRemove"
        >
          <span class="pi pi-trash mr-2" /> {{ $t('common.remove') }}
        </Button>
        <FileUpload
          v-else
          accept="image/*"
          mode="basic"
          auto
          custom-upload
          class="p-button-text"
          :choose-label="label"
          @uploader="uploader"
        />
      </div>
    </div>
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
import { BADGE_AVATAR_PLACEHOLDER } from '@/constants'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const props = defineProps({
  modelValue: {
    type: [Blob, String],
    default: null
  },
  validation: {
    type: [Object, Boolean],
    default: () => ({})
  },
  selectButtonClass: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: BADGE_AVATAR_PLACEHOLDER
  },
  clearable: Boolean
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

const avatarImage = computed(() => {
  console.log({ crop: croppedImage.value, place: props.placeholder })
  return croppedImage.value || props.placeholder
})

const label = computed(() =>
  croppedImage.value ? i18n.t('common.edit') : i18n.t('common.select')
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

    .p-avatar img {
      max-width: 100%;
    }
  }
}
</style>
