import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RuleCard from '../RuleCard.vue'

describe('RuleCard', () => {
  const mockRule = {
    points: 5,
    hint: 'pontuação máxima por palpite',
    description: 'Caso você acerte o placar <b>exato</b>',
    examples: [
      {
        guess: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        },
        result: {
          homeTeam: { name: 'Time da Casa' },
          awayTeam: { name: 'Time Visitante' },
          regularTimeHomeTeamGoals: 2,
          regularTimeAwayTeamGoals: 1
        }
      }
    ]
  }

  it('renders the rule card with correct structure', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Resultado do Tempo Regular',
        rule: mockRule
      }
    })

    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.card-body').exists()).toBe(true)
  })

  it('displays points badge with correct value', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    const badge = wrapper.find('.badge')
    expect(badge.text()).toBe('5 pts')
  })

  it('displays hint when provided', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    expect(wrapper.text()).toContain('pontuação máxima por palpite')
  })

  it('renders HTML in description', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    const description = wrapper.find('p.text-base-content\\/80')
    expect(description.html()).toContain('<b>exato</b>')
  })

  it('displays examples when provided', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    expect(wrapper.text()).toContain('Exemplos:')
    expect(wrapper.text()).toContain('Seu Palpite:')
    expect(wrapper.text()).toContain('Resultado Real:')
  })

  it('shows team names in examples', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    expect(wrapper.text()).toContain('Time da Casa')
    expect(wrapper.text()).toContain('Time Visitante')
  })

  it('displays scores in examples', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    const scores = wrapper.findAll('.text-2xl.font-bold')
    expect(scores.length).toBeGreaterThan(0)
  })

  it('applies correct badge color based on points', () => {
    const testCases = [
      { points: 0, expectedClass: 'badge-neutral' },
      { points: 1, expectedClass: 'badge-error' },
      { points: 3, expectedClass: 'badge-warning' },
      { points: 5, expectedClass: 'badge-success' },
      { points: 10, expectedClass: 'badge-primary' }
    ]

    testCases.forEach(({ points, expectedClass }) => {
      const wrapper = mount(RuleCard, {
        props: {
          header: 'Test',
          rule: { ...mockRule, points }
        }
      })

      const badge = wrapper.find('.badge')
      expect(badge.classes()).toContain(expectedClass)
    })
  })

  it('shows points earned badge in examples', () => {
    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test Header',
        rule: mockRule
      }
    })

    const pointsBadges = wrapper.findAll('.badge')
    const earnedBadge = pointsBadges.find(badge => badge.text().includes('+5 pontos'))
    expect(earnedBadge).toBeDefined()
  })

  it('handles rule without examples', () => {
    const ruleWithoutExamples = {
      points: 3,
      description: 'Test description'
    }

    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test',
        rule: ruleWithoutExamples
      }
    })

    expect(wrapper.text()).not.toContain('Exemplos:')
  })

  it('handles rule without hint', () => {
    const ruleWithoutHint = {
      points: 2,
      description: 'Test description',
      examples: []
    }

    const wrapper = mount(RuleCard, {
      props: {
        header: 'Test',
        rule: ruleWithoutHint
      }
    })

    // Should still render without errors
    expect(wrapper.find('.badge').text()).toBe('2 pts')
  })
})