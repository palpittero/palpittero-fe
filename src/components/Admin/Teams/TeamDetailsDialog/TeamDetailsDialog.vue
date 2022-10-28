<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.teams.teamDetails')"
    @submit="onSubmit"
    :disabled="submitting"
    @hide="emits('hide')"
    type="dynamic"
  >
    <TeamForm
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
import TeamForm from './TeamForm/TeamForm.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitting: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit', 'hide'])

const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    badge: yup.string().nullable(),
    status: yup.string()
  })
})

watch(props.modelValue, (team) => setValues(team.value), { deep: true })

const onSubmit = handleSubmit(
  (team) => {
    submitted.value = true
    emits('submit', team)
  },
  () => (submitted.value = true)
)
</script>
