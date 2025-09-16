<script setup lang="ts">
import type { iOption } from '@/types'
import { orderBy } from 'lodash/fp'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    options: iOption[]
    disabled?: boolean
    placeholder?: string
    required?: boolean
    help?: string
  }>(),
  {
    placeholder: 'Selecione uma opção',
  },
)

const model = defineModel<string | number | null>({ required: true })

const sortedOptions = computed<iOption[]>(() => orderBy(['name'], ['asc'], props.options))
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">{{ label }}</legend>
    <select
      class="select"
      v-model="model"
      :required="required"
      :disabled="disabled"
      :class="{ validator: required }"
    >
      <option disabled selected>{{ placeholder }}</option>
      <option
        v-for="option in sortedOptions"
        :key="option.id"
        :id="String(option.id)"
        :value="option.id"
      >
        <slot name="option" :option="option">
          {{ option.name }}
        </slot>
      </option>
    </select>
    <span class="label" v-if="help">{{ help }}</span>
    <div class="validator-hint">{{ label }} é obrigatório</div>
  </fieldset>
</template>
