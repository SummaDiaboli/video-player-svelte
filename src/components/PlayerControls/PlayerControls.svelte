<script lang="ts">
  import ProgressBar from './ProgressBar.svelte'
  import VolumeSlider from './VolumeSlider.svelte'
  import ClosedCaptionButton from './ClosedCaptionButton.svelte'
  import PlayerTimestamp from './PlayerTimestamp.svelte'

  interface Props {
    playing: boolean
    currentTime: number
    duration: number
    progress: number
    volume: number
    playbackSpeed: number
    showVolumeIndicator: boolean
    hasCaptions: boolean
    showControls: boolean
    onTogglePlay: () => void
    onSeek: (progress: number) => void
    onVolumeChange: (volume: number) => void
    onCaptionToggle: () => void
    onFullscreen: () => void
    onLoadSubtitles: (event: Event) => void
    onOpenSettings: () => void
    seek: (time: number) => void
  }

  let {
    playing,
    currentTime,
    duration,
    progress,
    volume,
    playbackSpeed,
    showVolumeIndicator,
    hasCaptions,
    showControls,
    onTogglePlay,
    onSeek,
    onVolumeChange,
    onCaptionToggle,
    onFullscreen,
    onLoadSubtitles,
    onOpenSettings,
    seek
  }: Props = $props()

  const handleSeek = (prog: number) => {
    onSeek(prog)
    const newTime = prog * duration
    seek(newTime)
  }
</script>

{#if showControls || !playing}
  <div
    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 pointer-events-auto"
    role="toolbar"
    aria-label="Video player controls"
  >
    <ProgressBar 
      {progress} 
      {currentTime}
      {duration}
      onSeek={handleSeek} 
    />

    <div class="flex items-center justify-between mt-2">
      <div class="flex items-center gap-4" role="group" aria-label="Playback controls">
        <button
          type="button"
          class="text-white hover:text-blue-400 transition-colors text-xl cursor-pointer"
          onclick={onTogglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {#if playing}
            <i class="fas fa-pause" aria-hidden="true"></i>
            <span class="sr-only">Pause</span>
          {:else}
            <i class="fas fa-play" aria-hidden="true"></i>
            <span class="sr-only">Play</span>
          {/if}
        </button>

        <VolumeSlider {volume} {onVolumeChange} {showVolumeIndicator} />

        <PlayerTimestamp {currentTime} {duration} />

        {#if playbackSpeed !== 1}
          <span 
            class="text-white text-sm bg-gray-700 px-2 py-1 rounded"
            aria-label="Playback speed: {playbackSpeed}x"
          >
            {playbackSpeed}x
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-4" role="group" aria-label="Additional controls">
        <label class="cursor-pointer text-white hover:text-blue-400 transition-colors text-sm flex items-center gap-1">
          <i class="fas fa-file-alt" aria-hidden="true"></i>
          <span>Load SRT</span>
          <input
            type="file"
            accept=".srt"
            class="sr-only"
            tabindex="-1"
            onchange={onLoadSubtitles}
          />
        </label>

        <ClosedCaptionButton {hasCaptions} onToggle={onCaptionToggle} />

        <button
          type="button"
          class="text-white hover:text-blue-400 transition-colors cursor-pointer"
          onclick={onOpenSettings}
          aria-label="Open settings"
          aria-haspopup="dialog"
        >
          <i class="fas fa-gear" aria-hidden="true"></i>
          <span class="sr-only">Settings</span>
        </button>

        <button
          type="button"
          class="text-white hover:text-blue-400 transition-colors cursor-pointer"
          onclick={onFullscreen}
          aria-label="Toggle fullscreen"
        >
          <i class="fas fa-expand" aria-hidden="true"></i>
          <span class="sr-only">Fullscreen</span>
        </button>
      </div>
    </div>
  </div>
{/if}