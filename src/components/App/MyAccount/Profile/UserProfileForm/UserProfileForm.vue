<template>
  <div class="field">
    <label for="name">{{ $t('admin.users.name') }}</label>
    <InputText
      id="name"
      v-model.trim="user.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.users.validation.name') }}
    </small>
  </div>
  <div class="field">
    <label for="email">{{ $t('admin.users.email') }}</label>
    <InputText
      id="email"
      v-model.trim="user.email"
      required
      :class="{ 'p-invalid': submitted && errors.email }"
    />
    <small class="p-invalid" v-if="submitted && errors.email">
      {{ $t('admin.users.validation.email') }}
    </small>
  </div>
  <div class="flex justify-content-end">
    <Button
      :label="$t('app.myAccount.profile.save')"
      icon="pi pi-check"
      @click="onSubmit"
      :disabled="loading"
    />
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

const emits = defineEmits(['update:modelValue', 'submit'])

const onSubmit = handleSubmit(
  (user) => {
    submitted.value = true
    emits('submit', user)
  },
  () => (submitted.value = true)
)
</script>
