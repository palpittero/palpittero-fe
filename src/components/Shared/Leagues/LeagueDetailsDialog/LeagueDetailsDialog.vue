<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.leagues.leagueDetails')"
    :disabled="submitting"
    @submit="onSubmit"
    @hide="emits('hide')"
    type="dynamic"
  >
    <LeagueForm
      :model-value="league"
      :submitted="submitted"
      :owner-id="ownerId"
      :errors="errors"
    />
  </BaseDialog>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import LeagueForm from './LeagueForm/LeagueForm.vue'
import services from '@/services'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  ownerId: {
    type: Number,
    default: null
  },
  visible: Boolean,
  submitting: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit', 'hide'])

const submitted = ref(false)
const league = ref(props.modelValue)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    badge: yup.string().nullable(),
    users: yup.array(),
    championships: yup.array().min(1),
    private: yup.number(),
    pointsStrategy: yup.string(),
    status: yup.string()
  })
})

watch(props.modelValue, (league) => setValues(league), {
  deep: true
})

watch(
  () => props.visible,
  async (visible) => {
    if (visible && props.modelValue.id) {
      league.value.championships = await services.leagues.fetchChampionships(
        league.value.id
      )
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(
  (user) => {
    submitted.value = true
    emits('submit', user)
  },
  () => (submitted.value = true)
)
</script>
