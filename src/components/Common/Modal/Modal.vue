<template>
  <div
    class="modal modal-xl fade"
    :id="target"
    tabindex="-1"
    :aria-labelledby="`base-dialog-header__${target}`"
    :aria-hidden="visible || open"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-bottom border-grey">
          <h1
            v-if="header"
            class="modal-title fs-5"
            :id="`base-dialog-header__${target}`"
          >
            {{ header }}
          </h1>
          <button
            type="button"
            class="btn-close"
            @click="handleHide"
            :aria-label="$t('common.close')"
          />
        </div>
        <div class="modal-body" v-if="visible || open">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <PButton
              @click="handleHide"
              type="button"
              variant="secondary"
              data-bs-dismiss="modal"
              icon="fas fa-times"
              :label="cancelButtonText || $t('common.no')"
              :class="cancelButtonClass"
            />
            <PButton
              @click="handleSubmit"
              variant="success"
              type="button"
              icon="fas fa-check"
              :label="okButtonText || $t('common.yes')"
              :class="okButtonClass"
            />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  visible: Boolean,
  target: {
    type: String,
    required: true
  },
  header: {
    type: String,
    default: ''
  },
  okButtonClass: {
    type: String,
    default: ''
  },
  cancelButtonClass: {
    type: String,
    default: ''
  },
  okButtonText: {
    type: String,
    default: ''
  },
  cancelButtonText: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['hide', 'submit'])

const modal = ref(null)
const open = ref(false)

watch(
  () => props.visible,
  (value) => {
    value ? modal.value.show() : modal.value.hide()
  }
)

onMounted(() => {
  modal.value = new Modal(`#${props.target}`, {
    keyboard: false
  })

  const modalElement = document.getElementById(props.target)

  modalElement?.addEventListener('show.bs.modal', () => (open.value = true))

  modalElement?.addEventListener('hide.bs.modal', () => {
    emits('hide')
    setTimeout(() => (open.value = false), 300)
  })
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', modal.value)
</script>
