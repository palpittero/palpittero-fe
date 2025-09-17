import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ChampionshipGuessesView from '../ChampionshipGuessesView.vue'

// Mock services
vi.mock('@/services', () => ({
  default: {
    leagues: {
      fetchLeagueById: vi.fn().mockResolvedValue({ id: 1, name: 'Test League' })
    },
    championships: {
      fetchChampionshipById: vi.fn().mockResolvedValue({
        id: 1,
        name: 'Copa do Mundo',
        enableGuesses: true
      }),
      fetchTeams: vi.fn().mockResolvedValue([
        { id: 1, name: 'Brasil' },
        { id: 2, name: 'Argentina' },
        { id: 3, name: 'Alemanha' },
        { id: 4, name: 'França' }
      ])
    },
    championshipsGuesses: {
      fetchChampionshipsGuesses: vi.fn().mockResolvedValue([]),
      createChampionshipGuesses: vi.fn().mockResolvedValue(true)
    }
  }
}))

// Mock stores
vi.mock('@/stores', () => ({
  useAuthStore: () => ({
    loggedUser: { id: 1, name: 'Test User' }
  }),
  useToastStore: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('ChampionshipGuessesView', () => {
  let wrapper: VueWrapper
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/liga/:leagueId/campeonato/:championshipId/palpites',
          name: 'app.championship-guesses',
          component: ChampionshipGuessesView
        },
        {
          path: '/liga/:leagueId/palpites',
          name: 'app.guesses',
          component: { template: '<div />' }
        }
      ]
    })

    router.push('/liga/1/campeonato/1/palpites')
  })

  it('renders the championship guesses page', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('🏆')
  })

  it('displays breadcrumb navigation', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const breadcrumb = wrapper.find('.breadcrumbs')
    expect(breadcrumb.exists()).toBe(true)
    expect(breadcrumb.text()).toContain('Home')
    expect(breadcrumb.text()).toContain('Palpites')
  })

  it('loads and displays championship name', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Copa do Mundo')
  })

  it('displays champion and runner-up selection dropdowns', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const selects = wrapper.findAll('select')
    expect(selects.length).toBe(2)
    expect(wrapper.text()).toContain('Campeão')
    expect(wrapper.text()).toContain('Vice-campeão')
  })

  it('populates team options in dropdowns', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const options = wrapper.findAll('option')
    expect(options.some(opt => opt.text() === 'Brasil')).toBe(true)
    expect(options.some(opt => opt.text() === 'Argentina')).toBe(true)
  })

  it('displays points information', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const infoAlert = wrapper.find('.alert-info')
    expect(infoAlert.exists()).toBe(true)
    expect(infoAlert.text()).toContain('10 pontos')
    expect(infoAlert.text()).toContain('5 pontos')
  })

  it('disables runner-up option when selected as champion', async () => {
    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const selects = wrapper.findAll('select')
    await selects[0].setValue('1') // Select Brasil as champion

    const runnerUpOptions = selects[1].findAll('option')
    const brasilOption = runnerUpOptions.find(opt => opt.element.value === '1')

    if (brasilOption) {
      expect(brasilOption.attributes('disabled')).toBeDefined()
    }
  })

  it('shows disabled state when championship does not allow guesses', async () => {
    vi.mocked(await import('@/services')).default.championships.fetchChampionshipById
      .mockResolvedValue({
        id: 1,
        name: 'Copa do Mundo',
        enableGuesses: false
      })

    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Palpites desabilitados')
  })

  it('loads existing guesses when available', async () => {
    const existingGuesses = [
      { position: 1, teamId: 1 },
      { position: 2, teamId: 2 }
    ]

    vi.mocked(await import('@/services')).default.championshipsGuesses
      .fetchChampionshipsGuesses.mockResolvedValue(existingGuesses)

    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const selects = wrapper.findAll('select')
    expect(selects[0].element.value).toBe('1')
    expect(selects[1].element.value).toBe('2')
  })

  it('handles save guesses action', async () => {
    const createGuesses = vi.mocked(await import('@/services'))
      .default.championshipsGuesses.createChampionshipGuesses
    const toastSuccess = vi.fn()

    vi.mocked(await import('@/stores')).useToastStore = () => ({
      success: toastSuccess,
      error: vi.fn()
    })

    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // Select teams
    const selects = wrapper.findAll('select')
    await selects[0].setValue('1')
    await selects[1].setValue('2')

    // Click save button
    const saveBtn = wrapper.find('button.btn-primary')
    await saveBtn.trigger('click')

    expect(createGuesses).toHaveBeenCalled()
  })

  it('shows error when trying to save without selections', async () => {
    const toastError = vi.fn()

    vi.mocked(await import('@/stores')).useToastStore = () => ({
      success: vi.fn(),
      error: toastError
    })

    wrapper = mount(ChampionshipGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    const saveBtn = wrapper.find('button.btn-primary')
    await saveBtn.trigger('click')

    expect(toastError).toHaveBeenCalled()
  })
})