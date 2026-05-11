<script lang="ts">
  import { getSettings, saveSettings } from '../../utils/subtitleSettings'
  import { onMount } from 'svelte'
  import type { SubtitleSettings, PlaybackSettings, FontSize, FontColor, BackgroundType, Position, PlaybackSpeed } from '../../types'

  interface Props {
    onClose: () => void
    onSubtitleSettingsChange: (settings: SubtitleSettings) => void
    onPlaybackSettingsChange: (settings: PlaybackSettings) => void
  }

  let { onClose, onSubtitleSettingsChange, onPlaybackSettingsChange }: Props = $props()

  let dialogElement: HTMLDialogElement
  let activeTab = $state<'subtitles' | 'playback'>('subtitles')
  let settings = $state(getSettings())

  onMount(() => {
    dialogElement.showModal()
  })

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === dialogElement) {
      onClose()
    }
  }

  const updateSubtitleSetting = <K extends keyof SubtitleSettings>(key: K, value: SubtitleSettings[K]) => {
    settings.subtitles[key] = value
    saveSettings({ subtitles: settings.subtitles })
    onSubtitleSettingsChange(settings.subtitles)
  }

  const updatePlaybackSetting = <K extends keyof PlaybackSettings>(key: K, value: PlaybackSettings[K]) => {
    settings.playback[key] = value
    saveSettings({ playback: settings.playback })
    onPlaybackSettingsChange(settings.playback)
  }

  const fontSizes: FontSize[] = ['small', 'medium', 'large']
  const fontColors: FontColor[] = ['white', 'yellow', 'cyan']
  const backgrounds: BackgroundType[] = ['semi-transparent', 'solid', 'none']
  const positions: Position[] = ['bottom', 'top']
  const speeds: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  const formatSpeed = (speed: PlaybackSpeed): string => {
    return speed === 1 ? '1x (Normal)' : `${speed}x`
  }

  const getColorHex = (color: FontColor): string => {
    switch (color) {
      case 'white': return '#ffffff'
      case 'yellow': return '#ffdd00'
      case 'cyan': return '#00ffff'
    }
  }
</script>

<dialog
  bind:this={dialogElement}
  class="backdrop:bg-black/50 bg-transparent p-0 m-auto border-0"
  aria-labelledby="settings-title"
  onkeydown={handleKeydown}
  onclick={handleBackdropClick}
>
  <div 
    class="bg-gray-800 rounded-lg shadow-xl w-80 max-h-[80vh] overflow-hidden"
    role="document"
  >
    <header class="flex border-b border-gray-700">
      <h2 id="settings-title" class="sr-only">Settings</h2>
      <button
        class="flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
        class:text-white={activeTab === 'subtitles'}
        class:bg-gray-700={activeTab === 'subtitles'}
        class:text-gray-400={activeTab !== 'subtitles'}
        aria-selected={activeTab === 'subtitles'}
        role="tab"
        onclick={() => activeTab = 'subtitles'}
      >
        Subtitles
      </button>
      <button
        class="flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer"
        class:text-white={activeTab === 'playback'}
        class:bg-gray-700={activeTab === 'playback'}
        class:text-gray-400={activeTab !== 'playback'}
        aria-selected={activeTab === 'playback'}
        role="tab"
        onclick={() => activeTab = 'playback'}
      >
        Playback
      </button>
    </header>

    <div class="p-4 overflow-y-auto max-h-[calc(80vh-48px)]" role="tabpanel">
      {#if activeTab === 'subtitles'}
        <fieldset class="border-0 p-0 m-0 space-y-4">
          <legend class="sr-only">Subtitle Settings</legend>
          
          <fieldset class="border-0 p-0 m-0">
            <legend class="block text-sm text-gray-400 mb-2">Font Size</legend>
            <div class="flex gap-2" role="radiogroup" aria-label="Font Size">
              {#each fontSizes as size}
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded text-sm transition-colors cursor-pointer"
                  class:bg-blue-600={settings.subtitles.fontSize === size}
                  class:text-white={settings.subtitles.fontSize === size}
                  class:bg-gray-700={settings.subtitles.fontSize !== size}
                  class:text-gray-300={settings.subtitles.fontSize !== size}
                  role="radio"
                  aria-checked={settings.subtitles.fontSize === size}
                  onclick={() => updateSubtitleSetting('fontSize', size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              {/each}
            </div>
          </fieldset>

          <fieldset class="border-0 p-0 m-0">
            <legend class="block text-sm text-gray-400 mb-2">Font Color</legend>
            <div class="flex gap-2" role="radiogroup" aria-label="Font Color">
              {#each fontColors as color}
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  class:bg-blue-600={settings.subtitles.fontColor === color}
                  class:text-white={settings.subtitles.fontColor === color}
                  class:bg-gray-700={settings.subtitles.fontColor !== color}
                  class:text-gray-300={settings.subtitles.fontColor !== color}
                  role="radio"
                  aria-checked={settings.subtitles.fontColor === color}
                  onclick={() => updateSubtitleSetting('fontColor', color)}
                >
                  <span 
                    class="w-4 h-4 rounded-full border border-gray-500"
                    style="background-color: {getColorHex(color)}"
                    aria-hidden="true"
                  ></span>
                  <span class:sr-only={settings.subtitles.fontColor !== color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </span>
                </button>
              {/each}
            </div>
          </fieldset>

          <fieldset class="border-0 p-0 m-0">
            <legend class="block text-sm text-gray-400 mb-2">Background</legend>
            <div class="flex gap-2" role="radiogroup" aria-label="Background">
              {#each backgrounds as bg}
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded text-sm transition-colors cursor-pointer"
                  class:bg-blue-600={settings.subtitles.background === bg}
                  class:text-white={settings.subtitles.background === bg}
                  class:bg-gray-700={settings.subtitles.background !== bg}
                  class:text-gray-300={settings.subtitles.background !== bg}
                  role="radio"
                  aria-checked={settings.subtitles.background === bg}
                  onclick={() => updateSubtitleSetting('background', bg)}
                >
                  {bg === 'semi-transparent' ? 'Semi' : bg === 'solid' ? 'Solid' : 'None'}
                </button>
              {/each}
            </div>
          </fieldset>

          <fieldset class="border-0 p-0 m-0">
            <legend class="block text-sm text-gray-400 mb-2">Position</legend>
            <div class="flex gap-2" role="radiogroup" aria-label="Position">
              {#each positions as pos}
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded text-sm transition-colors cursor-pointer"
                  class:bg-blue-600={settings.subtitles.position === pos}
                  class:text-white={settings.subtitles.position === pos}
                  class:bg-gray-700={settings.subtitles.position !== pos}
                  class:text-gray-300={settings.subtitles.position !== pos}
                  role="radio"
                  aria-checked={settings.subtitles.position === pos}
                  onclick={() => updateSubtitleSetting('position', pos)}
                >
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </button>
              {/each}
            </div>
          </fieldset>
        </fieldset>
      {:else}
        <fieldset class="border-0 p-0 m-0">
          <legend class="block text-sm text-gray-400 mb-2">Playback Speed</legend>
          <div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Playback Speed">
            {#each speeds as speed}
              <button
                type="button"
                class="px-3 py-2 rounded text-sm transition-colors cursor-pointer"
                class:bg-blue-600={settings.playback.speed === speed}
                class:text-white={settings.playback.speed === speed}
                class:bg-gray-700={settings.playback.speed !== speed}
                class:text-gray-300={settings.playback.speed !== speed}
                role="radio"
                aria-checked={settings.playback.speed === speed}
                onclick={() => updatePlaybackSetting('speed', speed)}
              >
                {formatSpeed(speed)}
              </button>
            {/each}
          </div>
        </fieldset>
      {/if}
    </div>
  </div>
</dialog>