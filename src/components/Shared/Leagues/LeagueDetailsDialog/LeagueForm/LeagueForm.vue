<template>
  <div class="field">
    <label for="name">{{ $t('admin.leagues.name') }}</label>
    <InputText
      id="name"
      v-model.trim="league.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.leagues.validation.name') }}
    </small>
  </div>
  <div class="field">
    <label for="badge">{{ $t('admin.leagues.badge') }}</label>
    <InputText
      id="badge"
      v-model.trim="league.badge"
      :class="{ 'p-invalid': hasImageError }"
    />
    <img
      v-show="isBadgeLoaded"
      :src="league.badge"
      class="league-form__badge my-2"
      @error="handleBadgeError"
      @load="handleBadgeLoad"
    />
    <span v-if="hasImageError">
      {{ $t('admin.Erro ao carregar imagem') }}
    </span>
  </div>

  <div class="field">
    <label for="badge">{{ $t('admin.leagues.championships') }}</label>
    <ChampionshipsPickList
      v-model="league.championships"
      :invalid="submitted && errors.championships"
    />
    <small class="p-invalid" v-if="submitted && errors.championships">
      {{ $t('admin.leagues.validation.championships') }}
    </small>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.leagues.pointsStrategy') }}</label>
    <div class="grid">
      <div class="field-radiobutton col-6">
        <RadioButton
          id="points-strategy-grouped"
          name="status"
          :value="LEAGUE_POINTS_STRATEGY.GROUPED"
          v-model="league.pointsStrategy"
        />
        <label for="points-strategy-grouped">{{
          $t('admin.leagues.grouped')
        }}</label>
      </div>
      <div class="field-radiobutton col-6">
        <RadioButton
          id="points-strategy-accumulative"
          name="status"
          :value="LEAGUE_POINTS_STRATEGY.ACCUMULATIVE"
          v-model="league.pointsStrategy"
        />
        <label for="points-strategy-accumulative">{{
          $t('admin.leagues.accumulative')
        }}</label>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.leagues.private') }}</label>

    <div class="grid">
      <div class="field-radiobutton col-6">
        <RadioButton
          id="private"
          name="private"
          :value="1"
          v-model="league.private"
        />
        <label for="private">{{ $t('common.yes') }}</label>
      </div>
      <div class="field-radiobutton col-6">
        <RadioButton
          id="public"
          name="private"
          :value="0"
          v-model="league.private"
        />
        <label for="public">{{ $t('common.no') }}</label>
      </div>
    </div>
  </div>

  <div class="field" v-if="!ownerId">
    <label class="mb-3">{{ $t('admin.leagues.owner') }}</label>
    <UserSelect v-model="league.ownerId" />
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.leagues.participants') }}</label>
    <UsersSelect v-model="league.users" :filter-ids="[league.ownerId]" />
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="league.status" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'
import UsersSelect from '@/components/Shared/Users/UsersSelect/UsersSelect.vue'
import UserSelect from '@/components/Shared/Users/UserSelect/UserSelect.vue'

import { LEAGUE_POINTS_STRATEGY } from '@/constants/leagues'
import ChampionshipsPickList from '@/components/Admin/Championships/ChampionshipsPickList/ChampionshipsPickList.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  ownerId: {
    type: Number,
    default: null
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])
const league = reactive(props.modelValue)
const isBadgeLoaded = ref(false)

watch(
  league,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

const hasImageError = computed(() => league.badge && !isBadgeLoaded.value)

const handleBadgeLoad = () => (isBadgeLoaded.value = true)
const handleBadgeError = () => (isBadgeLoaded.value = false)
</script>

<style lang="scss">
.league-form__badge {
  display: flex;
  justify-content: center;
  max-width: 64px;
}
</style>
