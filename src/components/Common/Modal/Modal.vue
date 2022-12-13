<template>
  <div
    class="modal fade"
    :id="target"
    tabindex="-1"
    :aria-labelledby="`base-dialog-header__${target}`"
    aria-hidden="true"
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
            data-bs-dismiss="modal"
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
              :label="$t('common.no')"
            />
            <PButton
              @click="handleSubmit"
              variant="success"
              type="button"
              icon="fas fa-check"
              :label="visible"
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
  }
})

const emits = defineEmits(['hide', 'submit'])

const modal = ref(null)
const open = ref(false)

watch(
  () => props.visible,
  (value) => (value ? modal.value.show() : modal.value.hide())
)

onMounted(() => {
  modal.value = new Modal(`#${props.target}`, {
    keyboard: false
  })

  // onMounted(() => {
  const modalElement = document.getElementById(props.target)

  modalElement?.addEventListener('show.bs.modal', () => {
    open.value = true
  })
  // })
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', modal.value)
</script>
