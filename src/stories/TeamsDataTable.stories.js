import TeamsDataTable from '../components/Admin/Teams/TeamsDataTable/TeamsDataTable.vue'

const teams = [
  {
    id: 1,
    name: 'Brasil',
    badge: 'https://cdn.countryflags.com/thumbs/brazil/flag-square-250.png',
    type: 'nationalTeam',
    country: 'world',
    region: null,
    nationalDivision: null,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 2,
    name: 'Argentina',
    badge: 'https://cdn.countryflags.com/thumbs/argentina/flag-square-250.png',
    type: 'nationalTeam',
    country: 'world',
    region: null,
    nationalDivision: null,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 3,
    name: 'Itália',
    badge: 'https://cdn.countryflags.com/thumbs/italy/flag-square-250.png',
    type: 'nationalTeam',
    country: 'world',
    region: null,
    nationalDivision: null,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 4,
    name: 'Alemanha',
    badge: 'https://cdn.countryflags.com/thumbs/germany/flag-square-250.png',
    type: 'nationalTeam',
    country: 'world',
    region: null,
    nationalDivision: null,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 5,
    name: 'Real Madrid',
    badge:
      'https://content.sportslogos.net/logos/130/4017/full/643_-real_madrid-primary-.gif',
    type: 'club',
    country: 'Spain',
    region: null,
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 6,
    name: 'Barcelona',
    badge:
      'https://content.sportslogos.net/logos/130/4016/full/954_-fc_barcelona-primary-.gif',
    type: 'club',
    country: 'Spain',
    region: null,
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 7,
    name: 'Milan',
    badge:
      'https://content.sportslogos.net/logos/128/3992/full/131_-ac_milan-primary-.gif',
    type: 'club',
    country: 'Italy',
    region: null,
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 8,
    name: 'Juventus',
    badge:
      'https://content.sportslogos.net/logos/128/3997/full/4488__juventus-primary-2017.png',
    type: 'club',
    country: 'Italy',
    region: null,
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 9,
    name: 'Bayern Munch',
    badge:
      'https://content.sportslogos.net/logos/132/4069/full/376_-bayern_munich-primary-.gif',
    type: 'club',
    country: 'Germany',
    region: null,
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 10,
    name: 'Borussia Dortmund',
    badge:
      'https://content.sportslogos.net/logos/132/4072/full/789_-borussia_dortmund-primary-.gif',
    type: 'club',
    country: 'Germany',
    region: null,
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 11,
    name: 'Flamengo',
    badge:
      'https://content.sportslogos.net/logos/143/4455/full/738_-clube_de_regatas_do_flamengo-primary-.gif',
    type: 'club',
    country: 'Brazil',
    region: 'RJ',
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  },
  {
    id: 12,
    name: 'Fluminense',
    badge:
      'https://content.sportslogos.net/logos/143/4456/full/354_-fluminense_football_club-primary-.gif',
    type: 'club',
    country: 'Brazil',
    region: 'RJ',
    nationalDivision: 1,
    status: 'active',
    createdAt: '2022-08-01 21:32:17',
    updatedAt: '2022-08-01 21:32:17'
  }
]

export default {
  title: 'TeamsDataTable',
  component: TeamsDataTable
}

const Template = (args) => ({
  components: { TeamsDataTable },
  setup() {
    return { args }
  },
  template: '<teams-data-table v-bind="args" />'
})

export const Basic = Template.bind({})
Basic.args = {
  teams,
  modelValue: []
}
