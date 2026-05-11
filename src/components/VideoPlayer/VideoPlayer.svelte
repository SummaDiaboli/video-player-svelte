<script lang="ts">
  interface Props {
    src: string
    playing: boolean
    volume: number
    playbackRate: number
    onTimeUpdate: (time: number, progress: number) => void
    onPlay: () => void
    onPause: () => void
    onLoadedMetadata: (duration: number, width: number, height: number) => void
    onVideoClick: () => void
    onFullscreen: () => void
    onError: () => void
  }

  let { src, playing, volume, playbackRate, onTimeUpdate, onPlay, onPause, onLoadedMetadata, onVideoClick, onFullscreen, onError }: Props = $props()

  let videoElement: HTMLVideoElement
  let lastClickTime = 0

  export const seek = (time: number) => {
    if (videoElement) {
      videoElement.currentTime = time
    }
  }

  export const getVideoElement = (): HTMLVideoElement | undefined => {
    return videoElement
  }

  const handleClick = () => {
    const now = Date.now()
    if (now - lastClickTime < 300) {
      onFullscreen()
    } else {
      onVideoClick()
    }
    lastClickTime = now
  }

  const applyPlaybackRate = () => {
    if (videoElement) {
      videoElement.playbackRate = playbackRate
    }
  }

  $effect(() => {
    if (videoElement) {
      if (playing) {
        videoElement.play()
      } else {
        videoElement.pause()
      }
    }
  })

  $effect(() => {
    if (videoElement) {
      videoElement.volume = volume
    }
  })

  $effect(() => {
    if (videoElement) {
      applyPlaybackRate()
    }
  })
</script>

<video
  bind:this={videoElement}
  {src}
  class="w-full h-full object-contain bg-black cursor-pointer"
  onclick={handleClick}
  ontimeupdate={() => {
    if (videoElement.duration) {
      const progress = videoElement.currentTime / videoElement.duration
      onTimeUpdate(videoElement.currentTime, progress || 0)
    }
  }}
  onplay={onPlay}
  onpause={onPause}
  onloadedmetadata={() => {
    onLoadedMetadata(videoElement.duration, videoElement.videoWidth, videoElement.videoHeight)
    applyPlaybackRate()
  }}
  onerror={onError}
>
  <track kind="captions" />
</video>