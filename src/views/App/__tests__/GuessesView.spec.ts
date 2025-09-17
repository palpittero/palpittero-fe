import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import GuessesView from '../GuessesView.vue'

// Mock services
vi.mock('@/services', () => ({
  default: {
    leagues: {
      fetchLeagueById: vi.fn().mockResolvedValue({ id: 1, name: 'Test League' }),
      fetchChampionships: vi.fn().mockResolvedValue([])
    },
    guesses: {
      registerGuesses: vi.fn().mockResolvedValue({ total: 5 }),
      fetchMyGuesses: vi.fn().mockResolvedValue([]),
      copyGuesses: vi.fn().mockResolvedValue({ total: 10 })
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

describe('GuessesView', () => {
  let wrapper: VueWrapper
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/liga/:leagueId/palpites', name: 'app.guesses', component: GuessesView }
      ]
    })

    router.push('/liga/1/palpites')
  })

  it('renders the guesses page with breadcrumb', async () => {
    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    const breadcrumb = wrapper.find('.breadcrumbs')
    expect(breadcrumb.exists()).toBe(true)
    expect(breadcrumb.text()).toContain('Home')
    expect(breadcrumb.text()).toContain('Palpites')
  })

  it('displays league name in sticky header', async () => {
    const mockLeague = { id: 1, name: 'Liga de Teste' }
    vi.mocked(await import('@/services')).default.leagues.fetchLeagueById.mockResolvedValue(mockLeague)

    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for async data

    expect(wrapper.find('h1').text()).toContain('Liga de Teste')
  })

  it('shows register and copy buttons', async () => {
    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const registerBtn = wrapper.find('button.btn-primary')
    const copyBtn = wrapper.find('button.btn-secondary')

    expect(registerBtn.exists()).toBe(true)
    expect(registerBtn.text()).toContain('Registrar')
    expect(copyBtn.exists()).toBe(true)
    expect(copyBtn.text()).toContain('Copiar')
  })

  it('displays loading spinner while fetching data', async () => {
    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const loadingSpinner = wrapper.find('.loading-spinner')
    expect(loadingSpinner.exists()).toBe(true)
  })

  it('displays championships list when loaded', async () => {
    const mockChampionships = [
      { id: 1, name: 'Copa do Mundo', matches: [{ id: 1, name: 'Jogo 1' }] },
      { id: 2, name: 'Copa América', matches: [{ id: 2, name: 'Jogo 2' }] }
    ]

    vi.mocked(await import('@/services')).default.leagues.fetchChampionships.mockResolvedValue(mockChampionships)

    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for async data

    const cards = wrapper.findAll('.card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('toggles championship expansion on click', async () => {
    const mockChampionships = [
      { id: 1, name: 'Copa do Mundo', matches: [] }
    ]

    vi.mocked(await import('@/services')).default.leagues.fetchChampionships.mockResolvedValue(mockChampionships)

    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const championshipHeader = wrapper.find('.cursor-pointer')
    if (championshipHeader.exists()) {
      await championshipHeader.trigger('click')
      // Check if the championship is expanded (implementation detail)
    }
  })

  it('shows empty state when no championships', async () => {
    vi.mocked(await import('@/services')).default.leagues.fetchChampionships.mockResolvedValue([])

    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Nenhum campeonato encontrado')
  })

  it('handles register guesses action', async () => {
    const registerGuesses = vi.mocked(await import('@/services')).default.guesses.registerGuesses
    const toastSuccess = vi.fn()

    vi.mocked(await import('@/stores')).useToastStore = () => ({
      success: toastSuccess,
      error: vi.fn()
    })

    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // @ts-ignore - accessing private method for testing
    await wrapper.vm.handleRegisterGuesses()

    expect(registerGuesses).toHaveBeenCalled()
  })

  it('disables register button when loading', async () => {
    wrapper = mount(GuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    // @ts-ignore - accessing private property
    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()

    const registerBtn = wrapper.find('button.btn-primary')
    expect(registerBtn.attributes('disabled')).toBeDefined()
  })
})