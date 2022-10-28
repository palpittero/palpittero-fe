<template>
  <BaseDialog
    :visible="visible"
    :header="$t('common.cropImage')"
    @submit="handleSubmit"
    @hide="emits('hide')"
    type="dynamic"
  >
    <vue-cropper
      ref="cropper"
      :src="image"
      :aspect-ratio="1 / 1"
      @ready="onReady"
    >
    </vue-cropper>
  </BaseDialog>
</template>

<script setup>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

import BaseDialog from '../BaseDialog/BaseDialog.vue'
import { ref } from 'vue'

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

const isReady = ref(false)
const cropper = ref(null)

const onReady = () => (isReady.value = true)

const handleSubmit = () =>
  cropper.value
    .getCroppedCanvas()
    .toBlob((blob) => emits('submit', blob), props.mimeType)
</script>
