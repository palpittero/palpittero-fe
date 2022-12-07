<template>
  <div class="p-input form-floating">
    <input v-model="value" v-bind="$attrs" :type="type" :class="defaultClass" />
    <label :for="$attrs.id">
      {{ props.label }}
    </label>

    <div class="invalid-feedback" v-if="validation.isInvalid">
      {{ validation.message }}
    </div>
    <font-awesome-icon
      v-if="isPassword"
      :icon="password.icon"
      class="p-input__toggle-password position-absolute"
      :class="{ 'is-invalid': validation.isInvalid }"
      @click="togglePassword"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { computed, ref, useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  validation: {
    type: Object,
    default: () => ({
      isInvalid: false,
      message: ''
    })
  }
})

const emits = defineEmits(['update:modelValue'])

const value = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const showPassword = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)

const password = computed(() =>
  showPassword.value
    ? {
        type: 'text',
        icon: 'fa-solid fa-eye-slash'
      }
    : {
        type: 'password',
        icon: 'fa-solid fa-eye'
      }
)

const isPassword = computed(() => attrs.type === 'password')

const type = computed(() =>
  isPassword.value ? password.value.type : attrs.type
)

const defaultClass = computed(() => [
  'form-control',
  props.validation.isInvalid && 'is-invalid'
])
</script>

<style lang="scss">
.p-input {
  &__toggle-password {
    z-index: 5;
    right: 15px;
    top: 21px;
    cursor: pointer;

    &.is-invalid {
      right: 35px;
    }

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
