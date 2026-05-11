import type { AllSettings, FontSize, FontColor, BackgroundType } from '../types'

const STORAGE_KEY = 'video-player-settings'

const defaultSettings: AllSettings = {
  subtitles: {
    fontSize: 'medium',
    fontColor: 'white',
    background: 'semi-transparent',
    position: 'bottom'
  },
  playback: {
    speed: 1
  }
}

export const getSettings = (): AllSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings: Partial<AllSettings>): void => {
  const current = getSettings()
  const updated = {
    subtitles: { ...current.subtitles, ...settings.subtitles },
    playback: { ...current.playback, ...settings.playback }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const getFontSizeValue = (size: FontSize): string => {
  switch (size) {
    case 'small': return '0.875rem'
    case 'medium': return '1.125rem'
    case 'large': return '1.5rem'
  }
}

export const getFontColorValue = (color: FontColor): string => {
  switch (color) {
    case 'white': return '#ffffff'
    case 'yellow': return '#ffdd00'
    case 'cyan': return '#00ffff'
  }
}

export const getBackgroundValue = (type: BackgroundType): string => {
  switch (type) {
    case 'semi-transparent': return 'rgba(0, 0, 0, 0.8)'
    case 'solid': return 'rgba(0, 0, 0, 1)'
    case 'none': return 'transparent'
  }
}