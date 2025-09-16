import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { ref } from 'vue'
import App from '../App.vue'

vi.mock('@/stores', () => ({
  useAuthStore: () => ({
    isLoggedIn: ref(false),
    user: ref(null),
    isAdmin: ref(false),
    logout: vi.fn()
  }),
  useToastStore: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('App', () => {
  it('mounts renders properly', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'home', component: { template: '<div>Home</div>' }}]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
        stubs: {
          'router-view': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
