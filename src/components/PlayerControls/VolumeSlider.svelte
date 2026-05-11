<script lang="ts">
  interface Props {
    volume: number
    onVolumeChange: (volume: number) => void
    showVolumeIndicator?: boolean
  }

  let { volume, onVolumeChange, showVolumeIndicator = false }: Props = $props()
  let isMuted = $state(false)
  let previousVolume = $state(1)
  let showSlider = $state(false)
  let showIndicator = $state(false)
  let indicatorTimeout: number | null = null
  let sliderId = `volume-${Math.random().toString(36).slice(2, 9)}`

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const newVolume = parseFloat(target.value)
    onVolumeChange(newVolume)
    if (newVolume > 0) {
      isMuted = false
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(previousVolume)
      isMuted = false
    } else {
      previousVolume = volume
      onVolumeChange(0)
      isMuted = true
    }
  }

  let displayVolume = $derived(isMuted ? 0 : volume)

  $effect(() => {
    if (volume !== undefined) {
      showIndicator = true
      if (indicatorTimeout) {
        clearTimeout(indicatorTimeout)
      }
      indicatorTimeout = window.setTimeout(() => {
        showIndicator = false
      }, 1000)
    }
  })

  const getVolumeIcon = (): string => {
    if (isMuted || volume === 0) return 'fas fa-volume-xmark'
    if (volume < 0.5) return 'fas fa-volume-low'
    return 'fas fa-volume-high'
  }

  const getVolumeLabel = (): string => {
    const percent = Math.round(displayVolume * 100)
    if (isMuted || percent === 0) return 'Muted'
    return `${percent}% volume`
  }
</script>

<div 
  class="flex items-center gap-2 group relative"
  role="group"
  aria-label="Volume controls"
  onmouseenter={() => showSlider = true} 
  onmouseleave={() => showSlider = false}
>
  <button
    type="button"
    class="text-white hover:text-blue-400 transition-colors relative cursor-pointer"
    onclick={toggleMute}
    aria-label={getVolumeLabel()}
    aria-describedby={showSlider ? sliderId : undefined}
  >
    <i class={getVolumeIcon()} aria-hidden="true"></i>
  </button>
  
  <div
    id={sliderId}
    class="flex items-center overflow-hidden transition-all duration-200"
    class:w-0={!showSlider}
    class:w-20={showSlider}
    role="group"
    aria-label="Volume slider"
  >
    <label class="sr-only" for="volume-range">Volume</label>
    <input
      id="volume-range"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={displayVolume}
      oninput={handleChange}
      class="w-20 h-1 bg-gray-600 rounded appearance-none cursor-pointer accent-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-runnable-track]:rounded-full [&::-moz-range-track]:rounded-full"
      style="--volume-fill: {displayVolume * 100}%; background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--volume-fill), #4b5563 var(--volume-fill), #4b5563 100%);"
      aria-label="Adjust volume"
      aria-valuenow={Math.round(displayVolume * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
  
  {#if showVolumeIndicator && showIndicator}
    <div 
      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
      role="status"
      aria-live="polite"
    >
      <span class="sr-only">Volume: </span>{Math.round(volume * 100)}%
    </div>
  {/if}
</div>