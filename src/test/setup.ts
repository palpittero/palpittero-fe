import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import crypto from 'node:crypto'

// Provide Node's crypto.hash to global for vite plugin vue
if (!global.crypto) {
  global.crypto = crypto as any
}

if (!global.crypto.hash && crypto.hash) {
  global.crypto.hash = crypto.hash
}

// If crypto.hash still doesn't exist, create a mock
if (!global.crypto.hash) {
  global.crypto.hash = vi.fn((algo: string, data: any) => {
    const hash = crypto.createHash(algo.replace('-', '').toLowerCase())
    hash.update(data)
    return hash.digest('hex')
  })
}

// Set global stubs for commonly used components
config.global.stubs = {
  teleport: true,
  RouterLink: true
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})