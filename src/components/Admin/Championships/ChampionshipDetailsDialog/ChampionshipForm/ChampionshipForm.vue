<template>
  <div class="field">
    <label for="name">{{ $t('admin.championships.name') }}</label>
    <InputText
      id="name"
      v-model.trim="championship.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.championships.validation.name') }}
    </small>
  </div>

  <div class="field">
    <label for="name">{{ $t('admin.championships.year') }}</label>
    <InputNumber
      id="year"
      :step="1"
      v-model="championship.year"
      required
      :class="{ 'p-invalid': submitted && errors.year }"
    />
    <small class="p-invalid" v-if="submitted && errors.year">
      {{ $t('admin.championships.validation.year') }}
    </small>
  </div>

  <div class="field">
    <label for="teams">{{ $t('admin.championships.teams') }}</label>
    <TeamsPickList id="teams" v-model="championship.teams" required />
  </div>

  <div class="field">
    <label for="name">{{ $t('admin.championships.rounds') }}</label>
    <InputNumber
      id="rounds"
      :step="1"
      v-model="championship.rounds"
      required
      :class="{ 'p-invalid': submitted && errors.rounds }"
    />
    <small class="p-invalid" v-if="submitted && errors.rounds">
      {{ $t('admin.championships.validation.rounds') }}
    </small>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="championship.status" />
  </div>
</template>

<script setup>
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'
import TeamsPickList from '@/components/Admin/Teams/TeamsPickList/TeamsPickList.vue'
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])
const championship = reactive(props.modelValue.value)

watch(
  championship,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)
</script>
