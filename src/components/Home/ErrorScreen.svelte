<script lang="ts">
  interface Props {
    type: 'not-found' | 'error'
    onReselect?: () => void
    onGoBack: () => void
  }

  let { type, onReselect, onGoBack }: Props = $props()
</script>

<div 
  class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20"
  role="alertdialog"
  aria-labelledby="error-title"
  aria-describedby="error-description"
>
  {#if type === 'not-found'}
    <i class="fas fa-file-circle-xmark text-5xl text-red-500 mb-4" aria-hidden="true"></i>
    <h2 id="error-title" class="text-white text-xl mb-2">Video file not found</h2>
    <p id="error-description" class="text-gray-400 mb-4">The video file may have been moved or deleted.</p>
    <div class="flex gap-3">
      <button
        type="button"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
        onclick={onReselect}
      >
        Select Again
      </button>
      <button
        type="button"
        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
        onclick={onGoBack}
      >
        Go Back
      </button>
    </div>
  {:else}
    <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4" aria-hidden="true"></i>
    <h2 id="error-title" class="text-white text-xl mb-2">Failed to load video</h2>
    <p id="error-description" class="text-gray-400 mb-4">The video could not be played. Please try a different file.</p>
    <button
      type="button"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
      onclick={onGoBack}
    >
      Go Back
    </button>
  {/if}
</div>