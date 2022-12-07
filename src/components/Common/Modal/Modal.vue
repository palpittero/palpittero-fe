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
        <div class="modal-header">
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
        <div class="modal-body" v-if="visible">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <PButton
              @click="handleHide"
              type="button"
              class="btn-outline-secondary"
              data-bs-dismiss="modal"
              :label="$t('common.no')"
            />
            <PButton
              @click="handleSubmit"
              type="button"
              class="btn-primary"
              :label="$t('common.yes')"
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

watch(
  () => props.visible,
  (value) => (value ? modal.value.show() : modal.value.hide())
)

onMounted(() => {
  modal.value = new Modal(`#${props.target}`, {
    keyboard: false
  })
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', modal.value)
</script>
