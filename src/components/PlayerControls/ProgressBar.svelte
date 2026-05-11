<script lang="ts">
  interface Props {
    progress: number
    currentTime: number
    duration: number
    onSeek: (progress: number) => void
  }

  let { progress, currentTime, duration, onSeek }: Props = $props()
  let isDragging = $state(false)
  let trackElement: HTMLDivElement

  const formatTime = (seconds: number): string => {
    if (seconds === 0 || isNaN(seconds)) return '0:00'
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
    const rect = trackElement.getBoundingClientRect()
    const clickProgress = (event.clientX - rect.left) / rect.width
    onSeek(Math.max(0, Math.min(1, clickProgress)))
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return
    const rect = trackElement.getBoundingClientRect()
    const dragProgress = (event.clientX - rect.left) / rect.width
    onSeek(Math.max(0, Math.min(1, dragProgress)))
  }

  const handleMouseDown = (event: MouseEvent) => {
    isDragging = true
    document.addEventListener('mouseup', handleMouseUp)
    handleClick(event)
  }

  const handleMouseUp = () => {
    isDragging = false
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    event.preventDefault()
    switch (event.key) {
      case 'ArrowLeft':
        onSeek(Math.max(0, progress - 0.01))
        break
      case 'ArrowRight':
        onSeek(Math.min(1, progress + 0.01))
        break
      case 'Home':
        onSeek(0)
        break
      case 'End':
        onSeek(1)
        break
    }
  }
</script>

<div
  bind:this={trackElement}
  class="relative w-full h-2 bg-gray-600 rounded cursor-pointer group"
  role="slider"
  tabindex="0"
  aria-label="Video progress"
  aria-valuenow={Math.round(progress * 100)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuetext="{formatTime(currentTime)} of {formatTime(duration)}"
  aria-orientation="horizontal"
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onkeydown={handleKeydown}
>
  <div class="sr-only" aria-live="polite">
    {formatTime(currentTime)} of {formatTime(duration)}, {Math.round(progress * 100)}% complete
  </div>
  
  <div
    class="absolute h-full bg-blue-500 rounded pointer-events-none transition-all"
    style="width: {progress * 100}%"
    aria-hidden="true"
  ></div>
  
  <div
    class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
    style="left: calc({progress * 100}% - 8px)"
    aria-hidden="true"
  ></div>
</div>