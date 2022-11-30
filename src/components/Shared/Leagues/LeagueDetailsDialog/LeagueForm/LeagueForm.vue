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
    <ImageInput v-model="league.badge" />
  </div>

  <div class="field">
    <label for="badge">{{ $t('admin.leagues.championships') }}</label>
    <ChampionshipsPickList
      v-model="league.championships"
      :invalid="submitted && errors.championships"
      enable-guesses
    />
    <small class="p-invalid" v-if="submitted && errors.championships">
      {{ $t('admin.leagues.validation.championships') }}
    </small>
  </div>

  <!-- <div class="field">
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
  </div> -->

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

  <!-- <div class="field">
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
  </div> -->

  <div class="field" v-if="!ownerId">
    <label class="mb-3">{{ $t('admin.leagues.owner') }}</label>
    <UserSelect v-model="league.ownerId" :disabled="isEditing" />
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.leagues.participants') }}</label>
    <UsersChips
      v-model="league.users"
      :not-allowed="[ownerId || league.ownerId]"
    />
  </div>

  <div class="field-checkbox" v-if="isEditing">
    <Checkbox
      id="resend-invitations"
      name="resent-invitations"
      v-model="league.resendInvitations"
      binary
    />
    <label for="resend-invitations">
      {{ $t('admin.leagues.resendInvitations') }}
    </label>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.leagues.enablePrizes') }}</label>

    <div class="grid">
      <div class="field-radiobutton col-6">
        <RadioButton
          id="enable-prize"
          name="enable-prize"
          :value="1"
          v-model="league.enablePrizes"
        />
        <label for="enable-prize">{{ $t('common.yes') }}</label>
      </div>
      <div class="field-radiobutton col-6">
        <RadioButton
          id="disable-prize"
          name="enable-prize"
          :value="0"
          v-model="league.enablePrizes"
        />
        <label for="disable-prize">{{ $t('common.no') }}</label>
      </div>
    </div>
  </div>

  <template v-if="league.enablePrizes">
    <div class="field">
      <label for="ticket-value">{{ $t('admin.leagues.ticketValue') }}</label>
      <InputNumber
        input-id="ticket-value"
        v-model="league.ticketValue"
        mode="currency"
        currency="BRL"
        locale="pt-BR"
        showButtons
        :min="0"
        :step="1"
      />
    </div>

    <template v-if="league.ticketValue > 0">
      <h5>{{ $t('admin.leagues.prizes', 2) }}</h5>
      <Divider />

      <LeaguePrizeDetails
        :model-value="league.prizes"
        :league="league"
        :errors="errors"
        :submitted="submitted"
        @update:model-value="
          (detail) => handleUpdatePrizeDetails(detail, index)
        "
        @remove="handleRemovePrizeDetail"
      />
    </template>
  </template>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="league.status" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'
import UserSelect from '@/components/Shared/Users/UserSelect/UserSelect.vue'

import ChampionshipsPickList from '@/components/Admin/Championships/ChampionshipsPickList/ChampionshipsPickList.vue'
import ImageInput from '@/components/Shared/ImageInput/ImageInput.vue'
import UsersChips from '@/components/Shared/Users/UsersChips/UsersChips.vue'
import LeaguePrizeDetails from './LeaguePrizeDetails/LeaguePrizeDetails.vue'

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
const league = ref(props.modelValue)

watch(
  league,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

const isEditing = computed(() => !!league.value.id)
</script>

<style lang="scss">
.league-form__badge {
  display: flex;
  justify-content: center;
  max-width: 64px;
}
</style>
