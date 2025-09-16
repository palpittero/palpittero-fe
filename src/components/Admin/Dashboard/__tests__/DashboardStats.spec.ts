import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import DashboardStats from '../DashboardStats.vue'

const mockPush = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush
    })
  }
})

const routes = [
  { path: '/admin/users', name: 'admin.users' },
  { path: '/admin/leagues', name: 'admin.leagues' }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

describe('DashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockData = {
    users: 100,
    leagues: 25,
    processedGuesses: 500
  }

  it('renders stats cards with correct data', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    const statCards = wrapper.findAll('.stat')
    expect(statCards).toHaveLength(3)
  })

  it('displays users stat correctly', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    const usersStat = wrapper.findAll('.stat')[0]
    expect(usersStat.find('.stat-title').text()).toBe('Total de Usuários')
    expect(usersStat.find('.stat-value').text()).toBe('100')
    expect(usersStat.find('i').classes()).toContain('fa-users')
    expect(usersStat.find('.stat-value').classes()).toContain('text-primary')
  })

  it('displays leagues stat correctly', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    const leaguesStat = wrapper.findAll('.stat')[1]
    expect(leaguesStat.find('.stat-title').text()).toBe('Total de Ligas')
    expect(leaguesStat.find('.stat-value').text()).toBe('25')
    expect(leaguesStat.find('i').classes()).toContain('fa-flag')
    expect(leaguesStat.find('.stat-value').classes()).toContain('text-secondary')
  })

  it('displays processed guesses stat correctly', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    const guessesStat = wrapper.findAll('.stat')[2]
    expect(guessesStat.find('.stat-title').text()).toBe('Total de Palpites Processados')
    expect(guessesStat.find('.stat-value').text()).toBe('500')
    expect(guessesStat.find('i').classes()).toContain('fa-comments')
    expect(guessesStat.find('.stat-value').classes()).toContain('text-accecnt')
  })

  it('navigates to users route when users card is clicked', async () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    await wrapper.findAll('.stat')[0].trigger('click')
    expect(mockPush).toHaveBeenCalledWith({ name: 'admin.users' })
  })

  it('navigates to leagues route when leagues card is clicked', async () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    await wrapper.findAll('.stat')[1].trigger('click')
    expect(mockPush).toHaveBeenCalledWith({ name: 'admin.leagues' })
  })

  it('does not navigate when processed guesses card is clicked', async () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    await wrapper.findAll('.stat')[2].trigger('click')
    expect(mockPush).toHaveBeenCalledWith(undefined)
  })

  it('applies hover styles to stat cards', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    const statCard = wrapper.find('.stat')
    expect(statCard.classes()).toContain('bg-base-200')
    expect(statCard.classes()).toContain('hover:bg-base-300')
    expect(statCard.classes()).toContain('cursor-pointer')
  })

  it('renders with responsive stats layout', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: mockData
      },
      global: {
        plugins: [router]
      }
    })

    const statsContainer = wrapper.find('.stats')
    expect(statsContainer.classes()).toContain('shadow')
    expect(statsContainer.classes()).toContain('stats-vertical')
    expect(statsContainer.classes()).toContain('lg:stats-horizontal')
    expect(statsContainer.classes()).toContain('w-full')
    expect(statsContainer.classes()).toContain('lg:flex')
  })

  it('handles null data gracefully', () => {
    const wrapper = mount(DashboardStats, {
      props: {
        loading: false,
        error: null,
        data: null
      },
      global: {
        plugins: [router]
      }
    })

    const statCards = wrapper.findAll('.stat')
    expect(statCards).toHaveLength(0)
  })
})