<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.matches.setResult', match.round)"
    @submit="onSubmit"
    @hide="emits('hide')"
    :style="{ width: 'auto' }"
  >
    <MatchSetResultForm
      :model-value="match"
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
import MatchSetResultForm from './MatchSetResultForm/MatchSetResultForm.vue'

const props = defineProps({
  match: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const submitted = ref(false)
const match = ref(props.match.value)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    regularTimeHomeTeamGoals: yup.number().required(),
    regularTimeAwayTeamGoals: yup.number().required()
  })
})

setValues(props.match.value)

watch(match, (value) => setValues(value), { deep: true })

const onSubmit = handleSubmit(
  (match) => {
    submitted.value = true
    emits('submit', match)
  },
  () => (submitted.value = true)
)
</script>
