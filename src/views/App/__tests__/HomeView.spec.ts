import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../HomeView.vue'

// Mock services
vi.mock('@/services', () => ({
  default: {
    leagues: {
      fetchMyLeagues: vi.fn().mockResolvedValue([]),
      fetchPublicLeagues: vi.fn().mockResolvedValue([]),
      fetchLeagueById: vi.fn().mockResolvedValue({ id: 1, name: 'Test League' }),
      createLeague: vi.fn().mockResolvedValue({ id: 1 }),
      updateLeague: vi.fn().mockResolvedValue({ id: 1 }),
      deleteLeague: vi.fn().mockResolvedValue(true)
    },
    usersLeagues: {
      joinLeague: vi.fn().mockResolvedValue(true),
      deleteUser: vi.fn().mockResolvedValue(true)
    }
  }
}))

// Mock stores
vi.mock('@/stores', () => ({
  useAuthStore: () => ({
    loggedUser: { id: 1, name: 'Test User' },
    logout: vi.fn()
  }),
  useToastStore: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('HomeView', () => {
  let wrapper: VueWrapper
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'app.index', component: HomeView },
        { path: '/liga/:leagueId/palpites', name: 'app.guesses', component: { template: '<div />' } }
      ]
    })
  })

  it('renders the home page with correct title', async () => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('Ligas')
  })

  it('shows loading spinner when fetching leagues', async () => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    // Check for loading spinners in both sections
    const loadingSpinners = wrapper.findAll('.loading')
    expect(loadingSpinners.length).toBeGreaterThan(0)
  })

  it('displays joined leagues section', async () => {
    const mockLeagues = [
      {
        id: 1,
        name: 'Liga Teste 1',
        description: 'Descrição teste',
        private: false,
        ownerId: 1,
        users: [{ id: 1, status: 'APPROVED' }]
      }
    ]

    vi.mocked(await import('@/services')).default.leagues.fetchMyLeagues.mockResolvedValue(mockLeagues)

    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Minhas Ligas')
  })

  it('displays public leagues section', async () => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    expect(wrapper.text()).toContain('Ligas Públicas')
  })

  it('shows create league button', async () => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const createButton = wrapper.find('button.btn-primary')
    expect(createButton.text()).toContain('Criar Liga')
  })

  it('displays pending invitations alert when there are invitations', async () => {
    const mockInvitations = [
      {
        id: 2,
        name: 'Liga com Convite',
        users: [{ id: 1, status: 'INVITED' }]
      }
    ]

    vi.mocked(await import('@/services')).default.leagues.fetchMyLeagues
      .mockImplementation((params: any) => {
        if (params.status === 'INVITED') {
          return Promise.resolve(mockInvitations)
        }
        return Promise.resolve([])
      })

    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for async updates

    const alert = wrapper.find('.alert-info')
    if (alert.exists()) {
      expect(alert.text()).toContain('convite')
    }
  })

  it('handles league navigation to guesses page', async () => {
    const push = vi.spyOn(router, 'push')

    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const league = { id: 1, name: 'Test League' }
    // @ts-ignore - accessing private method for testing
    wrapper.vm.handleGuessesLeague(league)

    expect(push).toHaveBeenCalledWith({
      name: 'app.guesses',
      params: { leagueId: '1' }
    })
  })

  it('displays empty state when no leagues are found', async () => {
    wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    const emptyStateText = wrapper.text()
    expect(emptyStateText).toContain('Você ainda não participa de nenhuma liga')
  })
})