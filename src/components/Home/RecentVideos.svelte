<script lang="ts">
  import { formatFileSize, formatRelativeTime } from '../../utils'
  import type { RecentVideo } from '../../types'

  interface Props {
    videos: RecentVideo[]
    onPlayVideo: (video: RecentVideo) => void
    onDeleteVideo: (video: RecentVideo) => void
  }

  let { videos, onPlayVideo, onDeleteVideo }: Props = $props()

  const getResolution = (video: RecentVideo): string => {
    if (video.width && video.height) {
      if (video.height >= 2160) return '4K'
      if (video.height >= 1440) return '1440p'
      if (video.height >= 1080) return '1080p'
      if (video.height >= 720) return '720p'
      if (video.height >= 480) return '480p'
      if (video.height >= 360) return '360p'
      return `${video.width}x${video.height}`
    }
    return 'Unknown'
  }
</script>

<section class="w-full max-w-5xl" aria-labelledby="recent-heading">
  <h2 id="recent-heading" class="text-white text-xl mb-6 font-semibold">Recently Played</h2>
  <ul class="space-y-3 list-none p-0 m-0" role="list">
    {#each videos as video}
      <li class="relative group">
        <article class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="flex-shrink-0 w-32 h-20 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
              onclick={() => onPlayVideo(video)}
              aria-label="Play {video.name}"
            >
              <i class="fas fa-play text-3xl text-gray-500" aria-hidden="true"></i>
            </button>
            
            <div class="flex-1 min-w-0">
              <h3 class="text-white font-medium truncate">{video.name}</h3>
              
              <div class="flex items-center gap-4 mt-1 text-sm text-gray-400" role="list" aria-label="Video details">
                <span class="flex items-center gap-1" role="listitem">
                  <i class="fas fa-film" aria-hidden="true"></i>
                  <span>{getResolution(video)}</span>
                </span>
                <span class="flex items-center gap-1" role="listitem">
                  <i class="fas fa-hard-drive" aria-hidden="true"></i>
                  <span>{formatFileSize(video.fileSize)}</span>
                </span>
                <span class="flex items-center gap-1" role="listitem">
                  <i class="fas fa-clock" aria-hidden="true"></i>
                  <span>{formatRelativeTime(video.lastPlayed)}</span>
                </span>
              </div>
              
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 h-1.5 bg-gray-600 rounded overflow-hidden" role="progressbar" aria-valuenow={Math.round(video.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Playback progress">
                  <div 
                    class="h-full bg-blue-500 transition-all"
                    style="width: {video.progress * 100}%"
                  ></div>
                </div>
                <span class="text-gray-400 text-xs min-w-[3rem] text-right" aria-hidden="true">
                  {Math.round(video.progress * 100)}%
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                class="text-blue-500 hover:text-blue-400 transition-colors p-2 cursor-pointer"
                onclick={() => onPlayVideo(video)}
                aria-label="Play {video.name}"
              >
                <i class="fas fa-play-circle text-3xl" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                class="text-gray-500 hover:text-red-500 transition-colors p-2 cursor-pointer"
                onclick={() => onDeleteVideo(video)}
                aria-label="Remove {video.name} from recent videos"
              >
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </article>
      </li>
    {/each}
  </ul>
</section>