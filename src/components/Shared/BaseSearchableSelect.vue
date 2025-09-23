<script setup lang="ts">
// import type { iOption } from '@/types'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string | number
    label: string
    options: any[]
    disabled?: boolean
    clearable?: boolean
    placeholder?: string
    required?: boolean
    variant?: 'list'
    help?: string
    filter?: (option: any) => boolean
  }>(),
  {
    filter: () => true,
    selection: 'id',
  },
)

const emit = defineEmits<{
  change: [option: any]
}>()

const model = defineModel<any>()
const search = ref<string>('')
const isOpen = ref<boolean>(false)

const inputPlaceholder = computed<string>(() => (model.value ? '' : (props.placeholder ?? '')))

const handleSelect = (option: any) => {
  model.value = option.id
  search.value = option.name

  emit('change', option)

  isOpen.value = false
}

const isClearable = computed<boolean>(() => (!!model.value && props.clearable) ?? false)

const handleClear = () => {
  model.value = null
  search.value = ''

  emit('change', null)
}

const filteredOptions = computed(() =>
  props.options.filter((option) => {
    const isMatch = Boolean(
      search.value && option.name.toLowerCase().includes(search.value.toLowerCase()),
    )
    const isFiltered = props.filter(option)

    return isFiltered && (!search.value || isMatch)
  }),
)

const selectedOption = computed(() => props.options.find((option) => option.id === model.value))

watch(
  () => props.options,
  (current) => {
    if (model.value && current.length) {
      if (selectedOption.value) {
        model.value = selectedOption.value.id
        search.value = selectedOption.value.name

        emit('change', selectedOption.value)
      }
    }
  },
  { immediate: true, deep: true },
)

const handleSearchFocus = () => {
  search.value = ''
  document.getElementById(`selected-option-${props.id}`)?.classList.add('text-base-content/50')

  isOpen.value = true
}

const handleSearchBlur = () => {
  document.getElementById(`selected-option-${props.id}`)?.classList.remove('text-base-content/50')

  // Needed to prevent closing the dropdown before clicking on an option
  setTimeout(() => {
    isOpen.value = false

    if (selectedOption.value) {
      search.value = selectedOption.value.name
    }
  }, 200)
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend" for="role">
      {{ label }}
    </legend>

    <div class="relative">
      <input
        type="text"
        v-model="search"
        class="input relative validator"
        :placeholder="inputPlaceholder"
        ref="inputRef"
        :required="required"
        @focus="handleSearchFocus"
        :disabled="disabled"
        @blur="handleSearchBlur"
      />
      <div class="validator-hint">{{ label }} é obrigatório</div>

      <i
        v-if="isClearable"
        class="fa-solid fa-xmark cursor-pointer absolute right-2 top-3.5"
        @click="handleClear"
      />

      <ul
        v-if="isOpen"
        tabindex="0"
        class="dropdown-content z-10 menu p-2 shadow bg-base-200 rounded-box w-full max-h-72 flex-nowrap overflow-auto top-10 left-0 absolute"
      >
        <li v-for="option in filteredOptions" :key="option.id" @click="handleSelect(option)">
          <slot name="option" :option="option">
            <div class="flex items-center justify-between">
              <a :class="{ 'text-primary': option.id === model }">{{ option.name }}</a>
              <i v-if="option.id === model" class="fa-solid fa-check text-primary" />
            </div>
          </slot>
        </li>
        <slot v-if="filteredOptions.length === 0" name="empty" :search="search">
          <li class="pointer-events-none">
            <a>Nenhum resultado encontrado</a>
          </li>
        </slot>
      </ul>
    </div>

    <div class="label" v-if="help">{{ help }}</div>
  </fieldset>
</template>
