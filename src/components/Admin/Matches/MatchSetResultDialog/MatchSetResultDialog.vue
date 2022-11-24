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
import { isNil } from 'lodash/fp'
import { watch, ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import MatchSetResultForm from './MatchSetResultForm/MatchSetResultForm.vue'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'
import { MATCH_STATUSES } from '@/constants/matches'

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

const isPenaltiesRoundType = computed(() =>
  [
    CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
    CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
  ].includes(match.value.round.type)
)

const showPenaltiesResults = computed(
  () =>
    isPenaltiesRoundType.value &&
    !isNil(match.value.penaltiesTimeTimeHomeTeamGoals) &&
    !isNil(match.value.penaltiesTimeTimeAwayTeamGoals) &&
    match.value.penaltiesTimeTimeHomeTeamGoals ===
      match.value.penaltiesTimeTimeAwayTeamGoals
)

const penaltiesFieldsValidationSchema = computed(() =>
  showPenaltiesResults.value
    ? {
        penaltiesTimeHomeTeamGoals: yup
          .number()
          .required()
          .notOneOf([yup.ref('penaltiesTimeAwayTeamGoals')], 'message'),
        penaltiesTimeAwayTeamGoals: yup
          .number()
          .required()
          .notOneOf([yup.ref('penaltiesTimeHomeTeamGoals')], 'message')
      }
    : {}
)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    regularTimeHomeTeamGoals: yup.number().required(),
    regularTimeAwayTeamGoals: yup.number().required(),
    ...penaltiesFieldsValidationSchema.value
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
    emits('submit', {
      ...match,
      status: MATCH_STATUSES.FINISHED
    })
  },
  () => (submitted.value = true)
)
</script>
