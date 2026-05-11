<script lang="ts">
  import { getCurrentSubtitle } from '../../utils/subtitleParser'
  import { getFontSizeValue, getFontColorValue, getBackgroundValue } from '../../utils/subtitleSettings'
  import type { SubtitleInfo, SubtitleSettings } from '../../types'

  interface Props {
    subtitles: SubtitleInfo[]
    currentTime: number
    showSubtitles: boolean
    settings: SubtitleSettings
  }

  let { subtitles, currentTime, showSubtitles, settings }: Props = $props()

  let currentSubtitle = $derived(getCurrentSubtitle(subtitles, currentTime))
  
  let subtitleStyle = $derived(`
    font-size: ${getFontSizeValue(settings.fontSize)};
    color: ${getFontColorValue(settings.fontColor)};
    background-color: ${getBackgroundValue(settings.background)};
  `)
</script>

{#if showSubtitles && currentSubtitle}
  <div
    class="absolute left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded text-center max-w-2xl"
    class:bottom-20={settings.position === 'bottom'}
    class:top-20={settings.position === 'top'}
    style={subtitleStyle}
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <p class="whitespace-pre-wrap">{currentSubtitle.text}</p>
  </div>
{/if}