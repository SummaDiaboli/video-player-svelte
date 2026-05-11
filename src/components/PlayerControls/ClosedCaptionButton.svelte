<script lang="ts">
  interface Props {
    hasCaptions: boolean
    onToggle: () => void
  }

  let { hasCaptions, onToggle }: Props = $props()
  let isEnabled = $state(false)

  const handleToggle = () => {
    isEnabled = !isEnabled
    onToggle()
  }
</script>

<button
  type="button"
  class="text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  class:hover:text-blue-400={hasCaptions}
  onclick={handleToggle}
  disabled={!hasCaptions}
  aria-label={isEnabled ? 'Disable subtitles' : 'Enable subtitles'}
  aria-pressed={isEnabled}
>
  <i class="fas fa-closed-captioning" aria-hidden="true"></i>
  <span class="sr-only">
    {isEnabled ? 'Subtitles on' : 'Subtitles off'}
  </span>
</button>