<script lang="ts">
  import VideoSelector from './VideoSelector.svelte'
  import RecentVideos from './RecentVideos.svelte'
  import type { RecentVideo } from '../../types'

  interface Props {
    recentVideos: RecentVideo[]
    onSelectVideo: (file: File) => void
    onPlayVideo: (video: RecentVideo) => void
    onDeleteVideo: (video: RecentVideo) => void
  }

  let { recentVideos, onSelectVideo, onPlayVideo, onDeleteVideo }: Props = $props()
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-8">
  <VideoSelector {onSelectVideo} />
  {#if recentVideos.length > 0}
    <RecentVideos videos={recentVideos} onPlayVideo={onPlayVideo} onDeleteVideo={onDeleteVideo} />
  {/if}
</div>
