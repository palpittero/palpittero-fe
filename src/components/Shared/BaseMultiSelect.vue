<script setup lang="ts">
import type { iOption } from '@/types'
import { intersection } from 'lodash/fp'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    options: iOption[]
    disabled?: boolean
    placeholder?: string
    required?: boolean
    variant?: 'chip' | 'list'
    help?: string
    filter?: (option: iOption) => boolean
  }>(),
  {
    filter: () => true,
    variant: 'chip',
  },
)

const model = defineModel<iOption[]>({ required: true })
const inputRef = ref<HTMLInputElement | null>(null)
const search = ref<string>('')

const isList = computed<boolean>(() => props.variant === 'list')
const showList = computed<boolean>(() => isList.value && model.value.length > 0)

const isChip = computed<boolean>(() => props.variant === 'chip')
const showChips = computed<boolean>(() => isChip.value && model.value.length > 0)

watch(search, (current) => {
  if (current) {
    inputRef.value?.focus()
  }
})

const hasValue = computed(() => model.value?.length > 0)

const handleToggle = (option: iOption) => {
  console.log(option)
  if (model.value?.some(({ id }) => id === option.id)) {
    model.value = model.value.filter(({ id }) => id !== option.id)
  } else {
    model.value.push({ ...option })
  }
}

const handleRemove = (option: iOption) => {
  model.value = model.value.filter(({ id }) => id !== option.id)
}

const filteredOptions = computed(() =>
  props.options.filter((option) => {
    const isSelected = false //model.value?.some(({ id }) => id === option.id)
    const isMatch = Boolean(
      search.value && option.name.toLowerCase().includes(search.value.toLowerCase()),
    )
    const isFiltered = props.filter(option)

    return !isSelected && isFiltered && (!search.value || isMatch)
  }),
)

watch(
  () => props.options,
  (current, previous) => {
    if (current.length !== previous?.length && model.value?.length > 0) {
      const modelIds = model.value.map(({ id }) => id)
      const ids = props.options.map(({ id }) => id)

      if (intersection(modelIds, ids).length === 0) {
        model.value = []
      }
    }
  },
)

const handleClear = () => {
  model.value = []
  search.value = ''
}

const isSelected = (option: iOption) => model.value?.some(({ id }) => id === option.id)
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend w-full flex justify-between" for="role">
      {{ label }}
      <button v-if="hasValue" class="link-hover cursor-pointer" @click="handleClear">Limpar</button>
    </legend>

    <div class="dropdown input relative min-h-fit flex flex-col gap-2">
      <div class="flex flex-1 gap-2 flex-wrap w-full">
        <input
          type="text"
          v-model="search"
          id="dropdown"
          ref="inputRef"
          class="h-auto border-none shadow-none focus:outline-none focus:shadow-none"
          :placeholder="placeholder"
          :aria-invalid="true"
        />
      </div>

      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-full top-12 flex-nowrap max-h-80 overflow-auto left-0 absolute"
      >
        <li v-for="option in filteredOptions" :key="option.id">
          <slot name="option" :option="option">
            <div class="flex items-center justify-between" @click="handleToggle(option)">
              <a :class="{ 'text-primary': isSelected(option) }">{{ option.name }}</a>
              <i
                v-if="model?.some(({ id }) => id === option.id)"
                class="fa-solid fa-check text-primary"
              />
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

    <div class="flex gap-2 flex-wrap" v-if="showChips">
      <template v-for="option in model" :key="option.id">
        <slot name="chip" :option="option" :handleRemove="handleRemove">
          <div class="badge badge-primary cursor-pointer">
            {{ option.name }}
            <span class="fa-solid fa-xmark hover:opacity-80" @click="handleRemove(option)" />
          </div>
        </slot>
      </template>
    </div>

    <ul class="list bg-base-100 rounded-box shadow-md" v-if="showList">
      <li
        class="list-row w-full flex gap-2 items-center"
        v-for="(value, index) in model"
        :key="value.id"
      >
        <slot name="selected" :option="value" :index="index">
          {{ value.name }}
        </slot>
        <button class="btn btn-ghost text-error btn-sm" @click="handleRemove(value)">
          <span class="fa-solid fa-trash" />
        </button>
      </li>
    </ul>
  </fieldset>
</template>
