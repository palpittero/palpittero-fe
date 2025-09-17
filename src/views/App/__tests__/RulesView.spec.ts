import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import RulesView from '../RulesView.vue'
import RuleCard from '@/components/App/Rules/RuleCard.vue'

describe('RulesView', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(RulesView, {
      global: {
        components: {
          RuleCard
        }
      }
    })
  })

  it('renders the rules page with correct title', () => {
    expect(wrapper.find('h1').text()).toContain('Regras de Pontuação')
  })

  it('displays all three main rule sections', () => {
    const cards = wrapper.findAll('.card')

    // Should have 3 main sections
    expect(cards.length).toBe(3)

    // Check section titles
    const titles = wrapper.findAll('.card-title')
    expect(titles[0].text()).toContain('Tempo Regular')
    expect(titles[1].text()).toContain('Pênaltis')
    expect(titles[2].text()).toContain('Campeão / Vice-campeão')
  })

  it('displays regular time scoring rules', () => {
    const regularSection = wrapper.findAll('.card')[0]
    const ruleCards = regularSection.findAllComponents(RuleCard)

    // Should have 6 regular time rules (5, 4, 3, 2, 1, 0 points)
    expect(ruleCards.length).toBe(6)
  })

  it('displays penalty scoring rules', () => {
    const penaltySection = wrapper.findAll('.card')[1]
    const ruleCards = penaltySection.findAllComponents(RuleCard)

    // Should have 6 penalty rules
    expect(ruleCards.length).toBe(6)
  })

  it('displays championship position scoring rules', () => {
    const positionSection = wrapper.findAll('.card')[2]
    const ruleCards = positionSection.findAllComponents(RuleCard)

    // Should have 3 position rules (10, 5, 0 points)
    expect(ruleCards.length).toBe(3)
  })

  it('shows penalty info alert', () => {
    const alert = wrapper.find('.alert-info')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('disputas de pênaltis nunca terminarão empatadas')
  })

  it('passes correct props to RuleCard components', () => {
    const firstRuleCard = wrapper.findComponent(RuleCard)

    expect(firstRuleCard.props('header')).toBe('Resultado do Tempo Regular')
    expect(firstRuleCard.props('rule')).toHaveProperty('points')
    expect(firstRuleCard.props('rule')).toHaveProperty('description')
    expect(firstRuleCard.props('rule')).toHaveProperty('examples')
  })

  it('displays icons for each section', () => {
    const icons = wrapper.findAll('.card-title > span')

    expect(icons[0].text()).toBe('⚽') // Regular time
    expect(icons[1].text()).toBe('🥅') // Penalties
    expect(icons[2].text()).toBe('🏆') // Championship
  })

  it('has proper section descriptions', () => {
    const sections = wrapper.findAll('.card-body')

    expect(sections[0].text()).toContain('A pontuação padrão segue as seguintes regras')
    expect(sections[1].text()).toContain('A pontuação bônus segue as seguintes regras')
    expect(sections[2].text()).toContain('palpites de campeão e vice-campeão')
  })
})