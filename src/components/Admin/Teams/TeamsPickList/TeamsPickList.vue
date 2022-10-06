<template>
  <BaseDataRenderer :state="teams">
    <PickList
      v-model="selectedTeams"
      listStyle="height:342px"
      data-key="id"
      class="teams-pick-list"
    >
      <template #sourceheader>
        <div class="flex justify-content-between align-items-center mb-2">
          <div class="p-inputgroup p-inputgroup-sm">
            <InputText
              v-model="search"
              :placeholder="$t('common.search')"
              class="p-inputtext-sm"
            />
            <Button
              @click="toggleFilters"
              icon="pi pi-filter"
              class="p-button-sm"
              v-tooltip.top="$t('admin.teams.advancedFilters')"
            />
          </div>
        </div>

        <div class="justify-content-between" v-if="showFilters">
          <div class="flex">
            <div class="field-radiobutton col">
              <RadioButton
                id="filter-per-type"
                name="filterMode"
                :value="TEAM_FILTER_MODES.TYPE"
                v-model="filters.mode"
              />
              <label for="filter-per-type">
                {{ $t('admin.teams.perType') }}
              </label>
            </div>
            <div class="field-radiobutton col">
              <RadioButton
                id="filter-per-country-region"
                name="filterMode"
                :value="TEAM_FILTER_MODES.COUNTRY_REGION"
                v-model="filters.mode"
              />
              <label for="filter-per-country-region">
                {{ $t('admin.teams.perCountryRegion') }}
              </label>
            </div>
          </div>

          <div class="field" v-if="isFilterByType">
            <Dropdown
              v-model="filters.type"
              :options="TEAM_TYPES_OPTIONS"
              :placeholder="$t('admin.teams.selectType')"
            >
              <template #value="{ value, placeholder }">
                <span v-if="value">{{ $t(`admin.teams.${value.id}`) }}</span>
                <span v-else>
                  {{ placeholder }}
                </span>
              </template>
              <template #option="{ option }">
                {{ $t(`admin.teams.${option.id}`) }}
              </template>
            </Dropdown>
          </div>

          <template v-else>
            <div class="field">
              <label>{{ $t('admin.teams.country') }}</label>
              <CountrySelect v-model="filters.country" />
            </div>
          </template>

          <div class="flex justify-content-end" v-if="hasActiveFilters">
            <Button
              class="p-button-text p-button-sm p-button-danger"
              @click="clearFilters"
            >
              <span class="pi pi-trash mr-2" />
              {{ $t('admin.teams.clearFilters') }}
            </Button>
          </div>
        </div>
      </template>
      <template #targetheader> Selecionados </template>
      <template #item="{ item }">
        <div class="flex align-items-center gap-3">
          <BadgeAvatar :image="item.badge" />
          <span>{{ item.name }}</span>
        </div>
      </template>
    </PickList>
  </BaseDataRenderer>
</template>

<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'
import differenceBy from 'lodash/fp/differenceBy'
import services from '@/services'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import CountrySelect from '../CountrySelect/CountrySelect.vue'
import { TEAM_TYPES_OPTIONS, TEAM_FILTER_MODES } from '@/constants/teams'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  filter: {
    type: Function,
    default: (teams) => teams
  },
  invalid: Boolean
})

const menu = ref()

const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
          // toast.add({
          //   severity: 'success',
          //   summary: 'Updated',
          //   detail: 'Data Updated',
          //   life: 3000
          // })
        }
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => {
          // toast.add({
          //   severity: 'warn',
          //   summary: 'Delete',
          //   detail: 'Data Deleted',
          //   life: 3000
          // })
        }
      }
    ]
  },
  {
    label: 'Navigate',
    items: [
      {
        label: 'Vue Website',
        icon: 'pi pi-external-link',
        command: () => {
          // window.location.hash = '/fileupload'
        }
      },
      {
        label: 'Router',
        icon: 'pi pi-upload',
        command: () => {
          // window.location.hash = '/fileupload'
        }
      }
    ]
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}

const emits = defineEmits(['update:modelValue'])

const teams = reactive({
  loading: false,
  error: null,
  data: []
})

const search = ref('')
const showFilters = ref()
const filters = ref({
  mode: TEAM_FILTER_MODES.TYPE,
  type: null,
  country: null
})

const selectedTeams = computed({
  set([, value]) {
    emits('update:modelValue', value)
  },
  get() {
    const teamsData = differenceBy('id', teams.data, props.modelValue)
    let filteredTeamsData = teamsData

    if (filters.value.type) {
      filteredTeamsData = teamsData.filter(
        ({ type }) => type === filters.value.type.id
      )
    } else if (filters.value.country) {
      filteredTeamsData = teamsData.filter(
        ({ country }) => country?.id === filters.value.country.id
      )
    }
    const searchedTeamsData = search.value
      ? filteredTeamsData.filter(({ name }) =>
          name.toLowerCase().includes(search.value.toLowerCase())
        )
      : filteredTeamsData
    return [searchedTeamsData, props.modelValue]
  }
})

onMounted(async () => {
  teams.loading = true
  const rows = await services.teams.fetchTeams()
  teams.data = props.filter(rows)
  teams.loading = false
})

const toggleFilters = () => (showFilters.value = !showFilters.value)

const isFilterByType = computed(
  () => filters.value.mode === TEAM_FILTER_MODES.TYPE
)

const hasActiveFilters = computed(
  () => search.value || filters.value.country || filters.value.type
)

const clearFilters = () => {
  search.value = ''
  filters.value.type = null
  filters.value.country = null
}

watch(
  () => isFilterByType.value,
  (value) => {
    if (value) {
      filters.value.country = null
      filters.value.region = null
    } else {
      filters.value.type = null
    }
  }
)
</script>

<style lang="scss">
.teams-pick-list {
  .p-picklist-source-controls,
  .p-picklist-target-controls {
    display: none;
  }
}
</style>
