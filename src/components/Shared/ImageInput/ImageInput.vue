<template>
  <div>
    <div
      class="image-input__cropped-image d-flex flex-column align-items-center gap-3"
      :class="className"
    >
      <img class="img-fluid rounded-circle" :src="avatarImage" />
      <div class="d-flex justify-content-center">
        <PButton
          v-if="croppedImage && clearable"
          type="button"
          class="btn-danger"
          :label="$t('common.remove')"
          icon="fa-solid fa-trash"
          @click="handleRemove"
        />
        <FileUpload
          accept="image/*"
          mode="basic"
          auto
          custom-upload
          class="btn btn-outline-primary btn-sm"
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
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'

// import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
import ImageCropperDialog from '@/components/Shared/ImageCropperDialog/ImageCropperDialog.vue'

import { BADGE_AVATAR_PLACEHOLDER } from '@/constants'

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

const avatarImage = computed(() => croppedImage.value || props.placeholder)

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
    max-width: 100%;

    .p-avatar img {
      max-width: 100%;
    }
  }
}
</style>
