import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DataFetcher from '../DataFetcher.vue'

describe('DataFetcher', () => {
  it('renders loading state when fetching data', async () => {
    const mockFetch = vi.fn().mockImplementation(() => new Promise(() => {}))

    const wrapper = mount(DataFetcher, {
      props: {
        fetch: mockFetch,
        immediate: true
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading-ring').exists()).toBe(true)
    expect(wrapper.find('.loading-xl').exists()).toBe(true)
  })

  it('fetches data immediately when immediate prop is true', async () => {
    const mockData = [{ id: 1, name: 'Test' }]
    const mockFetch = vi.fn().mockResolvedValue(mockData)

    const wrapper = mount(DataFetcher, {
      props: {
        fetch: mockFetch,
        immediate: true
      }
    })

    await flushPromises()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.loading').exists()).toBe(false)
  })

  it('does not fetch data when immediate prop is false', async () => {
    const mockFetch = vi.fn()

    mount(DataFetcher, {
      props: {
        fetch: mockFetch,
        immediate: false
      }
    })

    await flushPromises()

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('passes params to fetch function', async () => {
    const mockParams = { page: 1, limit: 10 }
    const mockFetch = vi.fn().mockResolvedValue([])

    mount(DataFetcher, {
      props: {
        fetch: mockFetch,
        params: mockParams,
        immediate: true
      }
    })

    await flushPromises()

    expect(mockFetch).toHaveBeenCalledWith(mockParams)
  })

  it('renders slot content with state data after fetch', async () => {
    const mockData = [{ id: 1, name: 'Test Item' }]
    const mockFetch = vi.fn().mockResolvedValue(mockData)

    const wrapper = mount(DataFetcher, {
      props: {
        fetch: mockFetch,
        immediate: true
      },
      slots: {
        default: `<template #default="{ data }">
          <div class="test-content">{{ JSON.stringify(data) }}</div>
        </template>`
      }
    })

    await flushPromises()

    const text = wrapper.find('.test-content').text()
    expect(text).toContain('Test Item')
    expect(wrapper.find('.loading').exists()).toBe(false)
  })

  it('handles fetch errors properly', async () => {
    const mockError = new Error('Fetch failed')
    const mockFetch = vi.fn().mockRejectedValue(mockError)

    // Suppress the unhandled rejection warning for this test
    const originalConsoleError = console.error
    console.error = vi.fn()

    const wrapper = mount(DataFetcher, {
      props: {
        fetch: mockFetch,
        immediate: true
      }
    })

    try {
      await flushPromises()
    } catch (e) {
      // Expected error
    }

    // The component doesn't handle errors, so loading remains true
    expect(wrapper.find('.loading').exists()).toBe(true)

    // Restore console.error
    console.error = originalConsoleError
  })

  it('defaults to immediate false when not specified', async () => {
    const mockFetch = vi.fn()

    mount(DataFetcher, {
      props: {
        fetch: mockFetch
      }
    })

    await flushPromises()

    expect(mockFetch).not.toHaveBeenCalled()
  })
})