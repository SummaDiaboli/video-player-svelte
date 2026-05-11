<script lang="ts">
  import VideoPlayer from '../VideoPlayer/VideoPlayer.svelte'
  import { ErrorScreen } from '../Home'
  import SubtitleDisplay from '../SubtitleDisplay'
  import PlayerControls from '../PlayerControls'
  import PlayerHeader from './PlayerHeader.svelte'
  import type { SubtitleInfo, SubtitleSettings } from '../../types'

  interface Props {
    videoSrc: string
    playing: boolean
    volume: number
    playbackSpeed: number
    subtitles: SubtitleInfo[]
    showSubtitles: boolean
    showControls: boolean
    showVolumeIndicator: boolean
    hasError: boolean
    showFileNotFound: boolean
    videoFileName: string | null
    currentTime: number
    duration: number
    progress: number
    subtitleSettings: SubtitleSettings
    onGoHome: () => void
    onTogglePlay: () => void
    onTimeUpdate: (time: number, prog: number) => void
    onPlay: () => void
    onPause: () => void
    onLoadedMetadata: (dur: number, width: number, height: number) => void
    onError: () => void
    onReselect: () => void
    onSeek: (prog: number) => void
    onVolumeChange: (vol: number) => void
    onCaptionToggle: () => void
    onFullscreen: () => void
    onLoadSubtitles: (event: Event) => void
    onOpenSettings: () => void
    onMouseMove: () => void
  }

  let {
    videoSrc, playing, volume, playbackSpeed,
    subtitles, showSubtitles, showControls, showVolumeIndicator,
    hasError, showFileNotFound, videoFileName,
    currentTime, duration, progress, subtitleSettings,
    onGoHome, onTogglePlay, onTimeUpdate, onPlay, onPause, onLoadedMetadata,
    onError, onReselect, onSeek, onVolumeChange, onCaptionToggle,
    onFullscreen, onLoadSubtitles, onOpenSettings, onMouseMove
  }: Props = $props()

  let containerElement: HTMLDivElement
  let playerComponent: { seek: (time: number) => void; getVideoElement: () => HTMLVideoElement | undefined } | null = $state(null)

  export const seek = (time: number) => playerComponent?.seek(time)
  export const getVideoElement = () => playerComponent?.getVideoElement()
  export const getContainerElement = () => containerElement
</script>

<div
  bind:this={containerElement}
  class="relative h-screen w-full bg-black"
  onmousemove={onMouseMove}
  role="application"
>
  <VideoPlayer
    bind:this={playerComponent}
    src={videoSrc}
    {playing}
    {volume}
    playbackRate={playbackSpeed}
    onTimeUpdate={onTimeUpdate}
    onPlay={onPlay}
    onPause={onPause}
    onLoadedMetadata={onLoadedMetadata}
    onVideoClick={onTogglePlay}
    onFullscreen={onFullscreen}
    onError={onError}
  />

  {#if showFileNotFound}
    <ErrorScreen type="not-found" onReselect={onReselect} onGoBack={onGoHome} />
  {:else if hasError}
    <ErrorScreen type="error" onGoBack={onGoHome} />
  {/if}

  <SubtitleDisplay {subtitles} {currentTime} {showSubtitles} settings={subtitleSettings} />

  <PlayerHeader {videoFileName} {showControls} {playing} {onGoHome} />

  {#if !hasError && !showFileNotFound}
    <PlayerControls
      {playing}
      {currentTime}
      {duration}
      {progress}
      {volume}
      playbackSpeed={playbackSpeed}
      {showVolumeIndicator}
      hasCaptions={subtitles.length > 0}
      {showControls}
      onTogglePlay={onTogglePlay}
      onSeek={onSeek}
      onVolumeChange={onVolumeChange}
      onCaptionToggle={onCaptionToggle}
      onFullscreen={onFullscreen}
      seek={seek}
      onLoadSubtitles={onLoadSubtitles}
      onOpenSettings={onOpenSettings}
    />
  {/if}
</div>
