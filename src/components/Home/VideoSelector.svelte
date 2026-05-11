<script lang="ts">
  interface Props {
    onSelectVideo: (file: File) => void
  }

  let { onSelectVideo }: Props = $props()

  const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      onSelectVideo(file)
      input.value = ''
    }
  }
</script>

<label
  for="videoInput"
  class="flex flex-col items-center justify-center cursor-pointer mb-12 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 rounded-lg p-4"
>
  <input
    type="file"
    accept="video/*"
    id="videoInput"
    class="sr-only"
    onchange={handleFileSelect}
  />

  <div class="text-center z-10">
    <i class="fas fa-file-import text-white text-8xl mb-4" aria-hidden="true"></i>
    <p class="text-white text-xl">Click or drag video to select</p>
    <p class="text-gray-400 text-sm mt-2">Supported formats: MP4, WebM, MOV, AVI</p>
  </div>
</label>