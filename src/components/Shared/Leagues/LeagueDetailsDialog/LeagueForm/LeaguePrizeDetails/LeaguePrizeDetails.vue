<template>
  <div
    class="grid align-items-center mb-3"
    v-for="(prize, index) of modelValue"
    :key="index"
  >
    <label class="col-3">{{ positionsTitles[index] }}</label>
    <InputNumber
      v-model="prizes[index]"
      input-id="ticket-value"
      class="col-4"
      mode="decimal"
      suffix="%"
      showButtons
      :min="0"
      :step="1"
    />
  </div>
  <hr />
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['update:modelValue'])

const prizes = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const i18n = useI18n()

const positionsTitles = {
  1: i18n.t('admin.leagues.positions.first'),
  2: i18n.t('admin.leagues.positions.second'),
  3: i18n.t('admin.leagues.positions.third')
}
</script>
