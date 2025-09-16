import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MatchStatus from '../MatchStatus.vue'
import type { iMatchStatus } from '@/types'

describe('MatchStatus', () => {
  const testCases: Array<{
    status: iMatchStatus
    expectedText: string
    expectedIconClass: string
    expectedColorClass: string
  }> = [
    {
      status: 'scheduled',
      expectedText: 'Agendada',
      expectedIconClass: 'fa-calendar',
      expectedColorClass: 'text-secondary-content'
    },
    {
      status: 'preparation',
      expectedText: 'Pré-jogo',
      expectedIconClass: 'fa-clock',
      expectedColorClass: 'text-warning'
    },
    {
      status: 'in_progress',
      expectedText: 'Em Andamento',
      expectedIconClass: 'fa-play',
      expectedColorClass: 'text-primary'
    },
    {
      status: 'finished',
      expectedText: 'Concluída',
      expectedIconClass: 'fa-check',
      expectedColorClass: 'text-success'
    },
    {
      status: 'cancelled',
      expectedText: 'Cancelada',
      expectedIconClass: 'fa-times',
      expectedColorClass: 'text-danger'
    },
    {
      status: 'postponed',
      expectedText: 'Adiada',
      expectedIconClass: 'fa-clock',
      expectedColorClass: 'text-base-100'
    },
    {
      status: 'deleted',
      expectedText: 'Removida',
      expectedIconClass: 'fa-times',
      expectedColorClass: 'text-danger'
    }
  ]

  testCases.forEach(({ status, expectedText, expectedIconClass, expectedColorClass }) => {
    describe(`when status is ${status}`, () => {
      it('renders correct text', () => {
        const wrapper = mount(MatchStatus, {
          props: { status }
        })

        expect(wrapper.text()).toBe(expectedText)
      })

      it('renders correct icon', () => {
        const wrapper = mount(MatchStatus, {
          props: { status }
        })

        const icon = wrapper.find('i')
        expect(icon.classes()).toContain('fa-solid')
        expect(icon.classes()).toContain(expectedIconClass)
      })

      it('applies correct color class', () => {
        const wrapper = mount(MatchStatus, {
          props: { status }
        })

        const icon = wrapper.find('i')
        expect(icon.classes()).toContain(expectedColorClass)
      })
    })
  })

  it('renders with flex layout', () => {
    const wrapper = mount(MatchStatus, {
      props: { status: 'scheduled' }
    })

    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('gap-2')
  })

  it('maintains consistent structure for all statuses', () => {
    testCases.forEach(({ status }) => {
      const wrapper = mount(MatchStatus, {
        props: { status }
      })

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.find('i').exists()).toBe(true)
      expect(wrapper.text().length).toBeGreaterThan(0)
    })
  })
})