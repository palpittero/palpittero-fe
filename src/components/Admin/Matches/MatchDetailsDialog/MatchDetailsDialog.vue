<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.matches.matchDetails')"
    @submit="onSubmit"
    @hide="emits('hide')"
  >
    <MatchForm :model-value="match" :submitted="submitted" :errors="errors" />
  </BaseDialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import MatchForm from './MatchForm/MatchForm.vue'
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
    homeTeamId: yup.number().required(),
    awayTeamId: yup.number().required(),
    date: yup.date().required()
  })
})

watch(props.match, (match) => setValues(match.value), {
  deep: true
})

const onSubmit = handleSubmit(
  (match) => {
    submitted.value = true
    emits('submit', {
      ...match,
      homeTeamId: match.homeTeam?.id,
      awayTeamId: match.awayTeam?.id
    })
  },
  () => (submitted.value = true)
)
</script>
