<script lang="ts">
  interface Props {
    videoFileName: string | null
    showControls: boolean
    playing: boolean
    onGoHome: () => void
  }

  let { videoFileName, showControls, playing, onGoHome }: Props = $props()
</script>

{#if showControls || !playing}
  <header class="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
    <nav class="flex items-center gap-2">
      <button
        type="button"
        class="bg-black/50 p-2 rounded hover:bg-black/70 transition-colors focus:ring-2 focus:ring-blue-500 pointer-events-auto cursor-pointer"
        onclick={onGoHome}
        aria-label="Go back to home"
      >
        <i class="fas fa-arrow-left text-white" aria-hidden="true"></i>
      </button>
      <span class="bg-black/50 px-3 py-2 rounded text-white text-sm truncate max-w-md pointer-events-auto">
        {videoFileName}
      </span>
    </nav>
  </header>
{/if}
