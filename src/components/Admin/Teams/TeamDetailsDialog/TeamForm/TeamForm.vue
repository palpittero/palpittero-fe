<template>
  <div class="field">
    <label for="name">{{ $t('admin.teams.name') }}</label>
    <InputText
      id="name"
      v-model.trim="team.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.teams.validation.name') }}
    </small>
  </div>
  <div class="field">
    <label for="badge">{{ $t('admin.teams.badge') }}</label>
    <InputText
      id="badge"
      v-model.trim="team.badge"
      :class="{ 'p-invalid': hasImageError }"
    />
    <img
      v-show="isBadgeLoaded"
      :src="team.badge"
      class="team-form__badge my-2"
      @error="handleBadgeError"
      @load="handleBadgeLoad"
    />
    <span v-if="hasImageError">
      {{ $t('admin.Erro ao carregar imagem') }}
    </span>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="team.status" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])
const team = reactive(props.modelValue.value)
const isBadgeLoaded = ref(false)

watch(
  team,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

const handleBadgeLoad = () => (isBadgeLoaded.value = true)
const handleBadgeError = () => (isBadgeLoaded.value = false)

const hasImageError = computed(() => team.badge && !isBadgeLoaded.value)
</script>

<style lang="scss">
.team-form__badge {
  display: flex;
  justify-content: center;
  max-width: 50%;
  border-radius: 50%;
}
</style>
