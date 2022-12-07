<template>
  <Modal
    class="image-cropper-dialog"
    :visible="visible"
    target="image-cropper"
    :header="$t('common.cropImage')"
    @hide="handleHide"
    @submit="handleSubmit"
  >
    <div class="d-flex align-items-center justify-content-center">
      <vue-cropper
        v-if="show"
        ref="cropper"
        :src="image"
        :aspect-ratio="1 / 1"
        @ready="onReady"
      />
      <font-awesome-icon v-else icon="fa-solid fa-circle-notch" spin />
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'

import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

import { Modal } from '@/components/Common'

const props = defineProps({
  visible: Boolean,
  image: {
    type: String,
    default: null
  },
  mimeType: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['submit', 'hide'])

const cropper = ref(null)
const show = ref(false)

watch(
  () => props.visible,
  (value) => {
    setTimeout(() => {
      show.value = value
    }, 1000)
  }
)

const handleSubmit = () => {
  cropper.value
    .getCroppedCanvas()
    .toBlob((blob) => emits('submit', blob), props.mimeType)

  show.value = false
  emits('hide')
}

const handleHide = () => {
  show.value = false
  emits('hide')
}
</script>
