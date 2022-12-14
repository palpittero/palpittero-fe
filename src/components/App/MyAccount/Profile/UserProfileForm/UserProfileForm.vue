<template>
  <div>
    <div class="d-flex flex-column gap-3">
      <PInput
        id="name"
        v-model.trim="user.name"
        required
        autofocus
        :label="$t('admin.users.name')"
        :validation="{
          isInvalid: submitted && errors.name,
          message: $t('admin.users.validation.name')
        }"
      />
      <PInput
        id="email"
        v-model.trim="user.email"
        required
        :label="$t('admin.users.email')"
        :validation="{
          isInvalid: submitted && errors.email,
          message: $t('admin.users.validation.email')
        }"
      />
      <div class="d-flex justify-content-end">
        <PButton
          class="btn-success"
          :label="$t('app.myAccount.profile.save')"
          icon="fa-solid fa-check"
          @click="onSubmit"
          :disabled="loading"
        />
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-end">
      <PButton
        type="button"
        icon="fa-solid fa-trash"
        class="btn-outline"
        :label="$t('app.myAccount.profile.removeAccount.title')"
        @click="handleRemoveAccount"
        :disabled="isSaving"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  loading: Boolean
})

const submitted = ref(false)
const user = ref(props.user)

const { errors, handleSubmit, setValues } = useForm({
  validationSchema: yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email()
  })
})

watch(user, (user) => setValues(user), { deep: true, immediate: true })

const emits = defineEmits(['update:modelValue', 'submit', 'remove'])

const onSubmit = handleSubmit(
  (user) => {
    submitted.value = true
    emits('submit', user)
  },
  () => (submitted.value = true)
)

const handleRemoveAccount = () => emits('remove')
</script>
