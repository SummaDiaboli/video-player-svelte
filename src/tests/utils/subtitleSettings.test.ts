import { describe, it, expect, beforeEach } from 'vitest'
import {
  getSettings,
  saveSettings,
  getFontSizeValue,
  getFontColorValue,
  getBackgroundValue
} from '../../utils/subtitleSettings'

beforeEach(() => {
  localStorage.clear()
})

describe('getSettings', () => {
  it('returns defaults when localStorage is empty', () => {
    const settings = getSettings()
    expect(settings.subtitles.fontSize).toBe('medium')
    expect(settings.subtitles.fontColor).toBe('white')
    expect(settings.subtitles.background).toBe('semi-transparent')
    expect(settings.subtitles.position).toBe('bottom')
    expect(settings.playback.speed).toBe(1)
  })

  it('returns saved settings', () => {
    saveSettings({ subtitles: { fontSize: 'large', fontColor: 'yellow', background: 'solid', position: 'top' } })
    const settings = getSettings()
    expect(settings.subtitles.fontSize).toBe('large')
    expect(settings.subtitles.fontColor).toBe('yellow')
  })

  it('returns defaults when localStorage contains invalid JSON', () => {
    localStorage.setItem('video-player-settings', 'invalid')
    expect(getSettings().subtitles.fontSize).toBe('medium')
  })
})

describe('saveSettings', () => {
  it('saves subtitle settings', () => {
    saveSettings({ subtitles: { fontSize: 'small', fontColor: 'cyan', background: 'none', position: 'top' } })
    expect(getSettings().subtitles.fontSize).toBe('small')
    expect(getSettings().subtitles.fontColor).toBe('cyan')
  })

  it('saves playback settings', () => {
    saveSettings({ playback: { speed: 1.5 } })
    expect(getSettings().playback.speed).toBe(1.5)
  })

  it('merges partial subtitle settings without overwriting other fields', () => {
    saveSettings({ subtitles: { fontSize: 'large', fontColor: 'white', background: 'solid', position: 'bottom' } })
    saveSettings({ subtitles: { fontSize: 'small', fontColor: 'white', background: 'solid', position: 'bottom' } })
    const settings = getSettings()
    expect(settings.subtitles.fontSize).toBe('small')
    expect(settings.subtitles.background).toBe('solid')
  })
})

describe('getFontSizeValue', () => {
  it('maps small to 0.875rem', () => {
    expect(getFontSizeValue('small')).toBe('0.875rem')
  })

  it('maps medium to 1.125rem', () => {
    expect(getFontSizeValue('medium')).toBe('1.125rem')
  })

  it('maps large to 1.5rem', () => {
    expect(getFontSizeValue('large')).toBe('1.5rem')
  })
})

describe('getFontColorValue', () => {
  it('maps white to #ffffff', () => {
    expect(getFontColorValue('white')).toBe('#ffffff')
  })

  it('maps yellow to #ffdd00', () => {
    expect(getFontColorValue('yellow')).toBe('#ffdd00')
  })

  it('maps cyan to #00ffff', () => {
    expect(getFontColorValue('cyan')).toBe('#00ffff')
  })
})

describe('getBackgroundValue', () => {
  it('maps semi-transparent to rgba(0, 0, 0, 0.8)', () => {
    expect(getBackgroundValue('semi-transparent')).toBe('rgba(0, 0, 0, 0.8)')
  })

  it('maps solid to rgba(0, 0, 0, 1)', () => {
    expect(getBackgroundValue('solid')).toBe('rgba(0, 0, 0, 1)')
  })

  it('maps none to transparent', () => {
    expect(getBackgroundValue('none')).toBe('transparent')
  })
})
