<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.championships.championshipDetails')"
    :disabled="submitting"
    @submit="onSubmit"
    @hide="emits('hide')"
    type="dynamic"
  >
    <ChampionshipForm
      :model-value="championship"
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
import { clone } from 'lodash'

const props = defineProps({
  championship: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean,
  submitting: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit', 'hide'])

const championship = ref(clone(props.championship))
const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    year: yup.number().required(),
    status: yup.string()
  })
})

watch(
  () => championship.value,
  (championship) => {
    setValues(championship)
  },
  {
    deep: true,
    immediate: true
  }
)

const onSubmit = handleSubmit(
  (championship) => {
    submitted.value = true
    emits('submit', championship)
  },
  () => (submitted.value = true)
)
</script>
