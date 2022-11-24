<template>
  <BaseDialog
    :visible="visible"
    :disabled="disabled"
    :header="header"
    @submit="onSubmit"
    @hide="emits('hide')"
    type="dynamic"
  >
    <ChampionshipSetRankingForm
      :model-value="championship"
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
import ChampionshipSetRankingForm from './ChampionshipSetRankingForm/ChampionshipSetRankingForm.vue'

const i18n = useI18n()

const props = defineProps({
  championship: {
    type: Object,
    default: () => ({})
  },
  visible: Boolean,
  submitted: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const submitted = ref(false)
const championship = ref(props.championship)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({})
})

setValues(props.championship)

watch(championship, (value) => setValues(value), { deep: true })

const header = computed(() =>
  i18n.t('admin.championships.setRanking', {
    name: `${props.championship.name} ${props.championship.year}`
  })
)

const onSubmit = handleSubmit(
  (match) => {
    submitted.value = true
    emits('submit', match)
  },
  () => (submitted.value = true)
)
</script>
