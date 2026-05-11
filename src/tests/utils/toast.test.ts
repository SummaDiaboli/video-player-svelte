import { describe, it, expect } from 'vitest'
import { createToast } from '../../utils/toast'

describe('createToast', () => {
  it('returns a toast with the given message and icon', () => {
    const toast = createToast('Subtitles On', 'fas fa-closed-captioning', 123)
    expect(toast.message).toBe('Subtitles On')
    expect(toast.icon).toBe('fas fa-closed-captioning')
    expect(toast.timeoutId).toBe(123)
  })

  it('assigns a numeric id', () => {
    const toast = createToast('Test', 'fas fa-check', 0)
    expect(typeof toast.id).toBe('number')
  })

  it('increments id on each call', () => {
    const first = createToast('First', 'icon', 1)
    const second = createToast('Second', 'icon', 2)
    expect(second.id).toBeGreaterThan(first.id)
  })
})
