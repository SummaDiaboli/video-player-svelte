<script lang="ts">
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  interface Props {
    currentTime: number
    duration: number
  }

  let { currentTime, duration }: Props = $props()
</script>

<div class="text-white text-sm font-mono tabular-nums">
  <span>{formatTime(currentTime)}</span>
  <span class="mx-1">/</span>
  <span>{formatTime(duration)}</span>
</div>