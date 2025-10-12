<script setup lang="ts">
import ChampionshipsModalSelect from '@/components/Admin/Championships/ChampionshipsModalSelect.vue'
import type { iChampionship } from '@/types'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    required?: boolean
    championships?: iChampionship[]
    filter?: (championships: iChampionship[]) => iChampionship[]
  }>(),
  {
    championships: () => [],
    filter: (championships: iChampionship[]) => championships,
  },
)

const selectedChampionships = defineModel<iChampionship[]>({ required: true })

const noChampionshipsSelected = computed(() => selectedChampionships.value?.length === 0)

const handleAdd = () => {
  // @ts-ignore
  championships_modal_select.showModal()
}

const handleRemove = (championship: iChampionship) => {
  selectedChampionships.value = selectedChampionships.value.filter(
    ({ id }) => id !== championship.id,
  )
}

const handleConfirm = (championships: iChampionship[]) => {
  selectedChampionships.value = championships
  // @ts-ignore
  championships_modal_select.close()
}

const isInvalid = computed<boolean>(
  () => props.required && selectedChampionships.value.length === 0,
)
</script>

<template>
  <div>
    <fieldset class="fieldset">
      <legend class="fieldset-legend flex items-center justify-between w-full">
        Campeonatos
        <a class="link link-hover link-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" /> Selecionar Campeonatos
        </a>
      </legend>
      <div v-if="noChampionshipsSelected" role="alert" class="alert alert-warning alert-soft">
        <span><i class="fa-solid fa-warning" /> Nenhum campeonato selecionado</span>
      </div>
      <ul v-else class="list bg-base-100 rounded-box shadow-md validator">
        <li
          class="list-row w-full flex gap-2 items-center"
          v-for="championship in selectedChampionships"
          :key="championship.id"
        >
          <div class="w-full flex items-center justify-between">
            <div>
              <div>{{ championship.name }} {{ championship.year }}</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                {{ championship.teams.length }} times
              </div>
            </div>

            <div class="flex items-center gap-2">
              <fieldset class="fieldset">
                <label class="label">
                  <input
                    type="checkbox"
                    class="toggle toggle-primary"
                    v-model="championship.enableGuesses"
                    :true-value="1"
                    :false-value="0"
                  />
                  Habilitar palpite de posições
                </label>
              </fieldset>
              <div class="divider divider-horizontal mx-0" />
              <a class="link link-hover link-error" @click="handleRemove(championship)">
                <i class="fa-solid fa-trash" />
              </a>
            </div>
          </div>
        </li>
      </ul>
      <input
        type="number"
        class="input validator hidden"
        :value="selectedChampionships.length"
        :required="required"
        :min="1"
      />
      <div class="validator-hint" v-if="isInvalid">Selecione pelo menos um campeonato</div>
    </fieldset>
    <ChampionshipsModalSelect
      :selected-championships="selectedChampionships"
      :championships="championships"
      @confirm="handleConfirm"
    />
  </div>
</template>
