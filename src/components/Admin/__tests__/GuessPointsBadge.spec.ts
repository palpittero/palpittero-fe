import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuessPointsBadge from '../GuessPointsBadge.vue'

describe('GuessPointsBadge', () => {
  it('renders with base classes', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 3 }
      }
    })

    const badge = wrapper.find('.badge')
    expect(badge.classes()).toContain('badge-sm')
    expect(badge.classes()).toContain('badge')
    expect(badge.classes()).toContain('badge-soft')
  })

  it('displays correct label for 5 points', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 5 }
      }
    })

    expect(wrapper.text()).toBe('5 pontos')
    expect(wrapper.find('.badge').classes()).toContain('badge-primary')
  })

  it('displays correct label for 4 points', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 4 }
      }
    })

    expect(wrapper.text()).toBe('4 pontos')
    expect(wrapper.find('.badge').classes()).toContain('badge-green')
  })

  it('displays correct label for 3 points', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 3 }
      }
    })

    expect(wrapper.text()).toBe('3 pontos')
    expect(wrapper.find('.badge').classes()).toContain('badge-green')
  })

  it('displays correct label for 2 points', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 2 }
      }
    })

    expect(wrapper.text()).toBe('2 pontos')
    expect(wrapper.find('.badge').classes()).toContain('badge-info')
  })

  it('displays correct label for 1 point', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 1 }
      }
    })

    expect(wrapper.text()).toBe('1 pontos')
    expect(wrapper.find('.badge').classes()).toContain('badge-warning')
  })

  it('displays correct label for 0 points', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: 0 }
      }
    })

    expect(wrapper.text()).toBe('0 ponto')
    // When points is 0, it's evaluated as falsy, so 'processing' is used
    expect(wrapper.find('.badge').classes()).toContain('badge-success')
  })

  it('displays processing state when guess has id but no points', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: null }
      }
    })

    expect(wrapper.text()).toBe('Processando')
    expect(wrapper.find('.badge').classes()).toContain('badge-success')
  })

  it('displays not registered state when guess has no id', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { points: null }
      }
    })

    expect(wrapper.text()).toBe('Palpite não registrado')
    expect(wrapper.find('.badge').classes()).toContain('badge-neutral')
  })

  it('handles undefined points properly', () => {
    const wrapper = mount(GuessPointsBadge, {
      props: {
        guess: { id: 1, points: undefined }
      }
    })

    expect(wrapper.text()).toBe('Processando')
    expect(wrapper.find('.badge').classes()).toContain('badge-success')
  })

  it('applies correct styling classes for each state', () => {
    const testCases = [
      { guess: { id: 1, points: 5 }, expectedClass: 'badge-primary' },
      { guess: { id: 1, points: 4 }, expectedClass: 'badge-green' },
      { guess: { id: 1, points: 3 }, expectedClass: 'badge-green' },
      { guess: { id: 1, points: 2 }, expectedClass: 'badge-info' },
      { guess: { id: 1, points: 1 }, expectedClass: 'badge-warning' },
      { guess: { id: 1, points: 0 }, expectedClass: 'badge-success' },
      { guess: { id: 1, points: null }, expectedClass: 'badge-success' },
      { guess: { points: null }, expectedClass: 'badge-neutral' }
    ]

    testCases.forEach(({ guess, expectedClass }) => {
      const wrapper = mount(GuessPointsBadge, {
        props: { guess }
      })

      expect(wrapper.find('.badge').classes()).toContain(expectedClass)
    })
  })
})