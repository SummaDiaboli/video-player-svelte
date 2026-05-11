export type FontSize = 'small' | 'medium' | 'large'
export type FontColor = 'white' | 'yellow' | 'cyan'
export type BackgroundType = 'semi-transparent' | 'solid' | 'none'
export type Position = 'bottom' | 'top'
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2

export interface SubtitleSettings {
  fontSize: FontSize
  fontColor: FontColor
  background: BackgroundType
  position: Position
}

export interface PlaybackSettings {
  speed: PlaybackSpeed
}

export interface AllSettings {
  subtitles: SubtitleSettings
  playback: PlaybackSettings
}