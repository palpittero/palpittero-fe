<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.championships.championshipDetails')"
    :disabled="submitting"
    @submit="onSubmit"
    @hide="emits('hide')"
  >
    <ChampionshipForm
      :model-value="props.modelValue"
      :submitted="submitted"
      :errors="errors"
    />
  </BaseDialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import ChampionshipForm from './ChampionshipForm/ChampionshipForm.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean,
  submitting: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit', 'hide'])

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    year: yup.number().required(),
    status: yup.string()
  })
})

watch(props.modelValue, (championship) => setValues(championship.value), {
  deep: true
})

const onSubmit = handleSubmit(
  (championship) => {
    submitted.value = true
    emits('submit', championship)
  },
  () => (submitted.value = true)
)
</script>
