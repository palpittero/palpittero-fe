<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.matches.matchDetails')"
    @submit="onSubmit"
    type="dynamic"
    @hide="emits('hide')"
  >
    <MatchUpdateForm
      v-if="match.id"
      :model-value="match"
      :submitted="submitted"
      :errors="errors"
    />
    <MatchCreateForm
      v-else
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
import MatchUpdateForm from './MatchUpdateForm/MatchUpdateForm.vue'
import MatchCreateForm from './MatchCreateForm/MatchCreateForm.vue'
import { clone } from 'lodash'

const props = defineProps({
  match: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const match = ref(clone(props.match))
const submitted = ref(false)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    championshipId: yup.number().required(),
    roundId: yup.mixed().required(),
    details: yup
      .array()
      .of(
        yup.object().shape({
          homeTeamId: yup.number().required(),
          awayTeamId: yup.number().required(),
          date: yup.date().required()
        })
      )
      .min(1)
  })
})

watch(
  () => match.value,
  (match) => {
    setValues(match)
  },
  {
    deep: true,
    immediate: true
  }
)

const onSubmit = handleSubmit(
  (match) => {
    submitted.value = true
    emits('submit', match)
  },
  () => (submitted.value = true)
)
</script>
