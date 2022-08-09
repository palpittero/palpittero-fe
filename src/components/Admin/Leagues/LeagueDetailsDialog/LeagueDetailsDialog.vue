<template>
  <BaseDialog
    :visible="visible"
    :header="$t('admin.leagues.leagueDetails')"
    @submit="onSubmit"
    @hide="emits('hide')"
  >
    <LeagueForm :model-value="league" :submitted="submitted" :errors="errors" />
  </BaseDialog>
</template>

<script setup>
import { watch, ref, reactive } from 'vue'
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
  visible: Boolean,
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue', 'submit', 'hide'])

const submitted = ref(false)
const league = reactive(props.modelValue)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    badge: yup.string().nullable(),
    users: yup.array(),
    championships: yup.array().min(1),
    private: yup.boolean(),
    pointsStrategy: yup.string(),
    status: yup.string()
  })
})

watch(props.modelValue, (league) => setValues(league.value), {
  deep: true
})

watch(
  () => props.visible,
  async (visible) => {
    if (visible && league.value.id) {
      // league.value.users = await services.leagues.fetchUsers(league.value)
      league.value.championships = await services.leagues.fetchChampionships(
        league.value.id
      )
    }
  }
)

const onSubmit = handleSubmit(
  (user) => {
    submitted.value = true
    emits('submit', user)
  },
  () => (submitted.value = true)
)
</script>
