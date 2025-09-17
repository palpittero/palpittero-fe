import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import MatchGuessesView from '../MatchGuessesView.vue'

// Mock services
vi.mock('@/services', () => ({
  default: {
    leagues: {
      fetchLeagueById: vi.fn().mockResolvedValue({ id: 1, name: 'Test League' })
    },
    matches: {
      fetchMatchById: vi.fn().mockResolvedValue({
        id: 1,
        homeTeam: { name: 'Brasil', logo: null },
        awayTeam: { name: 'Argentina', logo: null },
        championship: { name: 'Copa do Mundo' },
        round: { name: 'Final', type: 'REGULAR' },
        date: new Date().toISOString(),
        status: 'SCHEDULED'
      })
    },
    guesses: {
      fetchMyGuesses: vi.fn().mockResolvedValue([]),
      registerGuesses: vi.fn().mockResolvedValue({ total: 1 })
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

describe('MatchGuessesView', () => {
  let wrapper: VueWrapper
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/liga/:leagueId/jogo/:matchId/palpites',
          name: 'app.match-guesses',
          component: MatchGuessesView
        },
        {
          path: '/liga/:leagueId/palpites',
          name: 'app.guesses',
          component: { template: '<div />' }
        }
      ]
    })

    router.push('/liga/1/jogo/1/palpites')
  })

  it('renders the match guesses page', async () => {
    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('Palpite do Jogo')
  })

  it('displays breadcrumb navigation', async () => {
    wrapper = mount(MatchGuessesView, {
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
    expect(breadcrumb.text()).toContain('Palpite do Jogo')
  })

  it('displays match information', async () => {
    wrapper = mount(MatchGuessesView, {
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
    expect(wrapper.text()).toContain('Final')
    expect(wrapper.text()).toContain('Agendado')
  })

  it('displays team names', async () => {
    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Brasil')
    expect(wrapper.text()).toContain('Argentina')
  })

  it('displays score input fields', async () => {
    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })

  it('shows penalty inputs for elimination rounds', async () => {
    vi.mocked(await import('@/services')).default.matches.fetchMatchById
      .mockResolvedValue({
        id: 1,
        homeTeam: { name: 'Brasil' },
        awayTeam: { name: 'Argentina' },
        championship: { name: 'Copa do Mundo' },
        round: { name: 'Final', type: 'PENALTIES' },
        date: new Date().toISOString(),
        status: 'SCHEDULED'
      })

    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Disputa de Pênaltis')
    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs.length).toBeGreaterThanOrEqual(4) // 2 regular + 2 penalties
  })

  it('displays points information', async () => {
    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    const infoAlert = wrapper.find('.alert-info')
    expect(infoAlert.exists()).toBe(true)
    expect(infoAlert.text()).toContain('5 pontos')
    expect(infoAlert.text()).toContain('2 pontos')
  })

  it('loads existing guess when available', async () => {
    const existingGuess = [{
      homeTeamRegularTimeGoals: 2,
      awayTeamRegularTimeGoals: 1
    }]

    vi.mocked(await import('@/services')).default.guesses.fetchMyGuesses
      .mockResolvedValue(existingGuess)

    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs[0].element.value).toBe('2')
    expect(inputs[1].element.value).toBe('1')
  })

  it('disables inputs when match is not scheduled', async () => {
    vi.mocked(await import('@/services')).default.matches.fetchMatchById
      .mockResolvedValue({
        id: 1,
        homeTeam: { name: 'Brasil' },
        awayTeam: { name: 'Argentina' },
        championship: { name: 'Copa do Mundo' },
        round: { name: 'Final' },
        status: 'FINISHED'
      })

    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const inputs = wrapper.findAll('input[type="number"]')
    inputs.forEach(input => {
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  it('validates guess before saving', async () => {
    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Try to save without filling scores
    const saveBtn = wrapper.find('button.btn-primary')
    expect(saveBtn.attributes('disabled')).toBeDefined()
  })

  it('handles save guess action', async () => {
    const registerGuesses = vi.mocked(await import('@/services'))
      .default.guesses.registerGuesses
    const toastSuccess = vi.fn()

    vi.mocked(await import('@/stores')).useToastStore = () => ({
      success: toastSuccess,
      error: vi.fn()
    })

    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // Fill in scores
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0].setValue('2')
    await inputs[1].setValue('1')

    // Click save button
    const saveBtn = wrapper.find('button.btn-primary')
    await saveBtn.trigger('click')

    expect(registerGuesses).toHaveBeenCalled()
  })

  it('shows warning for finished matches', async () => {
    vi.mocked(await import('@/services')).default.matches.fetchMatchById
      .mockResolvedValue({
        id: 1,
        homeTeam: { name: 'Brasil' },
        awayTeam: { name: 'Argentina' },
        championship: { name: 'Copa do Mundo' },
        round: { name: 'Final' },
        status: 'FINISHED'
      })

    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const warning = wrapper.find('.alert-warning')
    expect(warning.exists()).toBe(true)
    expect(warning.text()).toContain('Palpites não são mais aceitos')
  })

  it('formats match date correctly', async () => {
    const mockDate = '2024-12-25T15:00:00Z'
    vi.mocked(await import('@/services')).default.matches.fetchMatchById
      .mockResolvedValue({
        id: 1,
        homeTeam: { name: 'Brasil' },
        awayTeam: { name: 'Argentina' },
        championship: { name: 'Copa do Mundo' },
        round: { name: 'Final' },
        date: mockDate,
        status: 'SCHEDULED'
      })

    wrapper = mount(MatchGuessesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const dateElement = wrapper.find('.stat-value')
    expect(dateElement.text()).toBeTruthy()
    // Should show formatted date, not 'N/A'
    expect(dateElement.text()).not.toBe('N/A')
  })
})