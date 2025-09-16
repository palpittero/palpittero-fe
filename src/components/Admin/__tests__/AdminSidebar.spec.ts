import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AdminSidebar from '../AdminSidebar.vue'

const routes = [
  { path: '/admin', name: 'admin.index' },
  { path: '/admin/guesses', name: 'admin.guesses' },
  { path: '/admin/users', name: 'admin.users' },
  { path: '/admin/leagues', name: 'admin.leagues' },
  { path: '/admin/teams', name: 'admin.teams' },
  { path: '/admin/championships', name: 'admin.championships' },
  { path: '/admin/matches', name: 'admin.matches' }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

describe('AdminSidebar', () => {
  it('renders properly', () => {
    const wrapper = mount(AdminSidebar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      }
    })

    expect(wrapper.find('.menu-title').text()).toContain('Painel Administrativo')
  })

  it('renders all navigation links', () => {
    const wrapper = mount(AdminSidebar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(14) // 7 desktop + 7 mobile

    const desktopLinks = wrapper.findAll('.menu a')
    expect(desktopLinks).toHaveLength(7)

    expect(desktopLinks[0].text()).toContain('Dashboard')
    expect(desktopLinks[1].text()).toContain('Palpites não processados')
    expect(desktopLinks[2].text()).toContain('Usuários')
    expect(desktopLinks[3].text()).toContain('Ligas')
    expect(desktopLinks[4].text()).toContain('Times')
    expect(desktopLinks[5].text()).toContain('Campeonatos')
    expect(desktopLinks[6].text()).toContain('Partidas')
  })

  it('has correct route names', () => {
    const wrapper = mount(AdminSidebar, {
      global: {
        plugins: [router]
      }
    })

    // RouterLink components are rendered as actual router-link elements
    const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' })
    const desktopLinks = routerLinks.slice(0, 7) // First 7 are desktop links

    expect(desktopLinks[0].props('to')).toEqual({ name: 'admin.index' })
    expect(desktopLinks[1].props('to')).toEqual({ name: 'admin.guesses' })
    expect(desktopLinks[2].props('to')).toEqual({ name: 'admin.users' })
    expect(desktopLinks[3].props('to')).toEqual({ name: 'admin.leagues' })
    expect(desktopLinks[4].props('to')).toEqual({ name: 'admin.teams' })
    expect(desktopLinks[5].props('to')).toEqual({ name: 'admin.championships' })
    expect(desktopLinks[6].props('to')).toEqual({ name: 'admin.matches' })
  })

  it('renders mobile dropdown select', () => {
    const wrapper = mount(AdminSidebar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      }
    })

    expect(wrapper.find('.select').exists()).toBe(true)
    expect(wrapper.findAll('option')).toHaveLength(7)
  })

  it('applies correct CSS classes for desktop menu', () => {
    const wrapper = mount(AdminSidebar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      }
    })

    const menu = wrapper.find('.menu')
    expect(menu.classes()).toContain('menu-md')
    expect(menu.classes()).toContain('bg-base-200')
    expect(menu.classes()).toContain('rounded-box')
    expect(menu.classes()).toContain('hidden')
    expect(menu.classes()).toContain('lg:flex')
  })

  it('renders correct icons for each menu item', () => {
    const wrapper = mount(AdminSidebar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const icons = wrapper.findAll('.menu i')

    expect(icons[0].classes()).toContain('fa-chart-line')
    expect(icons[1].classes()).toContain('fa-clock')
    expect(icons[2].classes()).toContain('fa-users')
    expect(icons[3].classes()).toContain('fa-flag')
    expect(icons[4].classes()).toContain('fa-shield-halved')
    expect(icons[5].classes()).toContain('fa-trophy')
    expect(icons[6].classes()).toContain('fa-futbol')
  })
})