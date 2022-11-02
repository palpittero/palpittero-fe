<template>
  <BaseDialog
    :visible="visible"
    :disabled="disabled"
    :header="header"
    @submit="onSubmit"
    @hide="emits('hide')"
    type="dynamic"
  >
    <MatchSetResultForm
      :model-value="match"
      :submitted="submitted"
      :errors="errors"
    />
  </BaseDialog>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import MatchSetResultForm from './MatchSetResultForm/MatchSetResultForm.vue'

const i18n = useI18n()

const props = defineProps({
  match: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const submitted = ref(false)
const match = ref(props.match)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    regularTimeHomeTeamGoals: yup.number().required(),
    regularTimeAwayTeamGoals: yup.number().required()
  })
})

setValues(props.match)

watch(match, (value) => setValues(value), { deep: true })

const header = computed(() => {
  const { name, championship } = props.match.round

  return i18n.t('admin.matches.setResult', {
    name,
    championship: championship.name
  })
})

const onSubmit = handleSubmit(
  (match) => {
    submitted.value = true
    emits('submit', match)
  },
  () => (submitted.value = true)
)
</script>
