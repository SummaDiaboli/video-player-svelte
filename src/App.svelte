<script lang="ts">
  import { tick } from 'svelte'
  import { SettingsPopover, ToastContainer, HomeView, PlayerView } from './components'
  import { parseSRT, getRecentVideos, getVideoProgress, updateVideoProgress, updateVideoMetadata, addRecentVideo, removeRecentVideo, getSettings, createToast } from './utils'
  import { type SubtitleInfo, type RecentVideo, type SubtitleSettings, type PlaybackSettings, type Toast } from './types'
  import { onMount } from 'svelte'
  import screenfull from 'screenfull'

  let videoSrc = $state<string | null>(null)
  let videoFileName = $state<string | null>(null)
  let videoFileSize = $state<number>(0)
  let playerViewRef = $state<{ seek: (time: number) => void; getVideoElement: () => HTMLVideoElement | undefined; getContainerElement: () => HTMLDivElement | null } | null>(null)
  let fileInputElement = $state<HTMLInputElement | null>(null)
  let pendingVideoSelection = $state<RecentVideo | null>(null)

  let playing = $state(false)
  let currentTime = $state(0)
  let duration = $state(0)
  let progress = $state(0)
  let volume = $state(1)
  let playbackSpeed = $state(1)
  let subtitles = $state<SubtitleInfo[]>([])
  let showSubtitles = $state(false)
  let showControls = $state(false)
  let showSettings = $state(false)
  let showVolumeIndicator = $state(false)
  let hasError = $state(false)
  let showFileNotFound = $state(false)
  let recentVideos = $state<RecentVideo[]>([])
  let subtitleSettings = $state<SubtitleSettings>(getSettings().subtitles)
  let toasts = $state<Toast[]>([])

  let hideControlsTimeout: number | null = null

  const showToastMessage = (message: string, icon: string) => {
    const timeoutId = window.setTimeout(() => {
      toasts = toasts.filter(t => t.timeoutId !== timeoutId)
    }, 2000)
    const toast = createToast(message, icon, timeoutId)
    toasts = [...toasts, toast]
  }

  const loadRecentVideos = () => {
    recentVideos = getRecentVideos()
  }

  const handleSelectVideo = (file: File) => {
    hasError = false
    showFileNotFound = false
    const blobUrl = URL.createObjectURL(file)
    videoSrc = blobUrl
    videoFileName = file.name
    videoFileSize = file.size

    if (pendingVideoSelection && pendingVideoSelection.name === file.name && pendingVideoSelection.fileSize === file.size) {
      addRecentVideo(file.name, blobUrl, pendingVideoSelection.progress, pendingVideoSelection.duration, pendingVideoSelection.width, pendingVideoSelection.height, file.size)
    } else {
      const savedProgress = getVideoProgress(file.name, file.size)
      addRecentVideo(file.name, blobUrl, savedProgress, 0, 0, 0, file.size)
    }

    loadRecentVideos()
  }

  const playRecentVideo = (video: RecentVideo) => {
    hasError = false
    showFileNotFound = false
    videoSrc = video.path
    videoFileName = video.name
    videoFileSize = video.fileSize

    pendingVideoSelection = video
    addRecentVideo(video.name, video.path, video.progress, video.duration, video.width, video.height, video.fileSize)
    loadRecentVideos()

    setTimeout(() => {
      if (video.progress > 0 && playerViewRef && duration > 0) {
        const startTime = video.progress * duration
        playerViewRef.seek(startTime)
      }
    }, 100)
  }

  const handleVideoError = () => {
    hasError = true
    showFileNotFound = true
    playing = false
    pendingVideoSelection = recentVideos.find(v => v.path === videoSrc) || null
  }

  const reselectVideo = async () => {
    videoSrc = null
    hasError = false
    showFileNotFound = false
    await tick()
    fileInputElement?.click()
  }

  const deleteVideo = (video: RecentVideo) => {
    removeRecentVideo(video.name, video.fileSize)
    loadRecentVideos()
  }

  const goHome = () => {
    if (videoFileName && videoFileSize) {
      updateVideoProgress(videoFileName, videoFileSize, progress, duration)
    }
    videoSrc = null
    videoFileName = null
    videoFileSize = 0
    playing = false
    currentTime = 0
    progress = 0
    duration = 0
    subtitles = []
    hasError = false
    showFileNotFound = false
    pendingVideoSelection = null
    loadRecentVideos()
  }

  const selectSubtitle = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      file.text().then((text) => {
        subtitles = parseSRT(text)
      })
    }
  }

  const togglePlay = () => {
    playing = !playing
  }

  const handleTimeUpdate = (time: number, prog: number) => {
    currentTime = time
    progress = prog

    if (videoFileName && videoFileSize && duration > 0 && Math.floor(time) % 5 === 0) {
      updateVideoProgress(videoFileName, videoFileSize, prog, duration)
    }
  }

  const handlePlay = () => {
    playing = true
  }

  const handlePause = () => {
    playing = false
  }

  const handleLoadedMetadata = (dur: number, width: number, height: number) => {
    duration = dur

    if (videoFileName && videoFileSize) {
      updateVideoMetadata(videoFileName, videoFileSize, dur, width, height)

      let progressToSeek = 0

      if (pendingVideoSelection && pendingVideoSelection.name === videoFileName && pendingVideoSelection.fileSize === videoFileSize) {
        progressToSeek = pendingVideoSelection.progress
      } else {
        progressToSeek = getVideoProgress(videoFileName, videoFileSize)
      }

      if (progressToSeek > 0 && progressToSeek < 0.95) {
        const startTime = progressToSeek * duration
        playerViewRef?.seek(startTime)
      }

      pendingVideoSelection = null
    }
    loadRecentVideos()
  }

  const handleSeek = (prog: number) => {
    progress = prog
  }

  const seek = (time: number) => {
    playerViewRef?.seek(time)
  }

  const handleVolumeChange = (vol: number) => {
    volume = vol
    showVolumeIndicator = true
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout)
    }
    hideControlsTimeout = window.setTimeout(() => {
      showVolumeIndicator = false
    }, 1000)
  }

  const toggleSubtitles = () => {
    showSubtitles = !showSubtitles
    showToastMessage(showSubtitles ? 'Subtitles On' : 'Subtitles Off', 'fas fa-closed-captioning')
  }

  const toggleFullscreen = () => {
    const container = playerViewRef?.getContainerElement()
    if (container && screenfull.isEnabled) {
      screenfull.toggle(container)
      showToastMessage(screenfull.isFullscreen ? 'Fullscreen' : 'Exit Fullscreen', 'fas fa-expand')
    }
  }

  const togglePictureInPicture = () => {
    const videoEl = playerViewRef?.getVideoElement()
    if (videoEl) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
        showToastMessage('Exit Picture-in-Picture', 'fas fa-external-link-square')
      } else {
        videoEl.requestPictureInPicture()
        showToastMessage('Picture-in-Picture', 'fas fa-clone')
      }
    }
  }

  const showControlsTemporarily = () => {
    showControls = true
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout)
    }
    hideControlsTimeout = window.setTimeout(() => {
      showControls = false
    }, 3000)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case ' ':
        event.preventDefault()
        togglePlay()
        break
      case 'ArrowLeft':
        event.preventDefault()
        seek(Math.max(0, currentTime - 10))
        break
      case 'ArrowRight':
        event.preventDefault()
        seek(Math.min(duration, currentTime + 10))
        break
      case 'ArrowUp':
        event.preventDefault()
        handleVolumeChange(Math.min(1, volume + 0.05))
        break
      case 'ArrowDown':
        event.preventDefault()
        handleVolumeChange(Math.max(0, volume - 0.05))
        break
      case 'm':
      case 'M':
        handleVolumeChange(volume > 0 ? 0 : 1)
        break
      case 'f':
      case 'F':
        toggleFullscreen()
        break
      case 'p':
      case 'P':
        togglePictureInPicture()
        break
      case 'Escape':
        if (showSettings) {
          showSettings = false
        } else if (videoSrc) {
          goHome()
        }
        break
    }
    showControlsTemporarily()
  }

  const handleSubtitleSettingsChange = (settings: SubtitleSettings) => {
    subtitleSettings = settings
  }

  const handlePlaybackSettingsChange = (settings: PlaybackSettings) => {
    playbackSpeed = settings.speed
  }

  onMount(() => {
    const savedSettings = getSettings()
    subtitleSettings = savedSettings.subtitles
    playbackSpeed = savedSettings.playback.speed
    loadRecentVideos()
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

{#if showSettings}
  <SettingsPopover
    onClose={() => showSettings = false}
    onSubtitleSettingsChange={handleSubtitleSettingsChange}
    onPlaybackSettingsChange={handlePlaybackSettingsChange}
  />
{/if}

<ToastContainer {toasts} />

<main class="min-h-screen bg-gray-900">
  {#if !videoSrc}
    <HomeView
      {recentVideos}
      onSelectVideo={handleSelectVideo}
      onPlayVideo={playRecentVideo}
      onDeleteVideo={deleteVideo}
    />
  {:else}
    <PlayerView
      bind:this={playerViewRef}
      videoSrc={videoSrc}
      {playing}
      {volume}
      {playbackSpeed}
      {subtitles}
      {showSubtitles}
      {showControls}
      {showVolumeIndicator}
      {hasError}
      {showFileNotFound}
      {videoFileName}
      {currentTime}
      {duration}
      {progress}
      {subtitleSettings}
      onGoHome={goHome}
      onTogglePlay={togglePlay}
      onTimeUpdate={handleTimeUpdate}
      onPlay={handlePlay}
      onPause={handlePause}
      onLoadedMetadata={handleLoadedMetadata}
      onError={handleVideoError}
      onReselect={reselectVideo}
      onSeek={handleSeek}
      onVolumeChange={handleVolumeChange}
      onCaptionToggle={toggleSubtitles}
      onFullscreen={toggleFullscreen}
      onLoadSubtitles={selectSubtitle}
      onOpenSettings={() => showSettings = true}
      onMouseMove={showControlsTemporarily}
    />
  {/if}
</main>
