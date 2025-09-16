import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TeamModalForm from '../TeamModalForm.vue'

const mockTeamModel = {
  name: '',
  badge: '',
  region: '',
  nationalDivision: '',
  countryId: '',
  type: 'club',
  status: 'active',
}

vi.mock('@/constants', () => ({
  TEAM_MODEL: {
    name: '',
    badge: '',
    region: '',
    nationalDivision: '',
    countryId: '',
    type: 'club',
    status: 'active',
  }
}))

vi.mock('@/services', () => ({
  default: {
    teams: {
      fetchTeamById: vi.fn(),
      createTeam: vi.fn(),
      updateTeam: vi.fn()
    }
  }
}))

vi.mock('@/stores', () => ({
  useToastStore: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

import services from '@/services'

describe('TeamModalForm', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(TeamModalForm, {
      props: {
        teamId: 0,
        ...props
      },
      global: {
        stubs: {
          BaseModal: {
            name: 'BaseModal',
            template: '<div><slot /></div>',
            props: ['id', 'title'],
            emits: ['open', 'close', 'submit']
          },
          CountrySelect: {
            template: '<select v-model="modelValue"></select>',
            props: ['modelValue', 'label', 'required'],
            emits: ['update:modelValue']
          },
          InputFileImage: {
            template: '<input type="file" />',
            props: ['modelValue', 'label'],
            emits: ['update:modelValue']
          }
        }
      }
    })
  }

  it('renders properly', () => {
    wrapper = createWrapper()

    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#type-club').exists()).toBe(true)
    expect(wrapper.find('#type-national-team').exists()).toBe(true)
  })

  it('initializes with empty team model when no teamId', async () => {
    wrapper = createWrapper({ teamId: 0 })

    const baseModal = wrapper.findComponent({ name: 'BaseModal' })
    await baseModal.vm.$emit('open')
    await flushPromises()

    const nameInput = wrapper.find('#name')
    expect(nameInput.element.value).toBe('')
  })

  it('fetches team data when teamId is provided', async () => {
    const mockTeam = {
      id: 1,
      name: 'Test Team',
      type: 'club',
      badge: null,
      countryId: 1,
      region: 'Test Region',
      nationalDivision: '1'
    }

    vi.mocked(services.teams.fetchTeamById).mockResolvedValue(mockTeam)

    wrapper = createWrapper({ teamId: 1 })

    const baseModal = wrapper.findComponent({ name: 'BaseModal' })
    await baseModal.vm.$emit('open')
    await flushPromises()

    expect(vi.mocked(services.teams.fetchTeamById)).toHaveBeenCalledWith(1)
  })

  it('shows country select and additional fields when type is club', async () => {
    wrapper = createWrapper()

    // By default type is 'club', so fields should be visible
    expect(wrapper.find('select').exists()).toBe(true) // CountrySelect is stubbed as select
    expect(wrapper.find('input[placeholder="Informe a região"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Informe a divisão nacional"]').exists()).toBe(true)
  })

  it('hides country select when type is national team', async () => {
    wrapper = createWrapper()

    const nationalTeamRadio = wrapper.find('#type-national-team')
    await nationalTeamRadio.setValue(true)

    expect(wrapper.findComponent({ name: 'CountrySelect' }).exists()).toBe(false)
    expect(wrapper.find('input[placeholder="Informe a região"]').exists()).toBe(false)
  })

  it('creates new team when submitting without id', async () => {
    vi.mocked(services.teams.createTeam).mockResolvedValue({ id: 1 })

    wrapper = createWrapper()

    // Set all required fields
    const nameInput = wrapper.find('#name')
    await nameInput.setValue('New Team')

    const clubRadio = wrapper.find('#type-club')
    await clubRadio.setValue(true)

    const baseModal = wrapper.findComponent({ name: 'BaseModal' })
    await baseModal.vm.$emit('submit')
    await flushPromises()

    expect(vi.mocked(services.teams.createTeam)).toHaveBeenCalled()
  })

  it('updates existing team when submitting with id', async () => {
    const mockTeam = {
      id: 1,
      name: 'Existing Team',
      type: 'club',
      badge: null,
      countryId: 1
    }

    vi.mocked(services.teams.fetchTeamById).mockResolvedValue(mockTeam)
    vi.mocked(services.teams.updateTeam).mockResolvedValue(mockTeam)

    wrapper = createWrapper({ teamId: 1 })

    const baseModal = wrapper.findComponent({ name: 'BaseModal' })
    await baseModal.vm.$emit('open')
    await flushPromises()

    await baseModal.vm.$emit('submit')
    await flushPromises()

    expect(vi.mocked(services.teams.updateTeam)).toHaveBeenCalled()
  })

  it('emits success event after successful submit', async () => {
    vi.mocked(services.teams.createTeam).mockResolvedValue({ id: 1 })

    wrapper = createWrapper()

    const nameInput = wrapper.find('#name')
    await nameInput.setValue('New Team')

    const clubRadio = wrapper.find('#type-club')
    await clubRadio.setValue(true)

    const baseModal = wrapper.findComponent({ name: 'BaseModal' })
    await baseModal.vm.$emit('submit')
    await flushPromises()

    expect(wrapper.emitted('success')).toBeTruthy()
  })

  it('emits cancel event when closing', async () => {
    wrapper = createWrapper()

    const baseModal = wrapper.findComponent({ name: 'BaseModal' })
    await baseModal.vm.$emit('close')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('validates required fields', () => {
    wrapper = createWrapper()

    const nameInput = wrapper.find('#name')
    expect(nameInput.attributes('required')).toBeDefined()
    expect(wrapper.find('.validator-hint').text()).toBe('Nome é obrigatório')
  })
})