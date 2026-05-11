import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import RecentVideos from '../../components/Home/RecentVideos.svelte'
import type { RecentVideo } from '../../types'

const makeVideo = (overrides: Partial<RecentVideo> = {}): RecentVideo => ({
  name: 'movie.mp4',
  path: 'blob://movie',
  progress: 0,
  lastPlayed: Date.now() - 3600000,
  duration: 120,
  width: 1920,
  height: 1080,
  fileSize: 10 * 1024 * 1024,
  ...overrides
})

describe('RecentVideos', () => {
  it('renders the section heading', () => {
    render(RecentVideos, { videos: [makeVideo()], onPlayVideo: vi.fn(), onDeleteVideo: vi.fn() })
    expect(screen.getByText('Recently Played')).toBeInTheDocument()
  })

  it('renders each video name', () => {
    const videos = [makeVideo({ name: 'alpha.mp4' }), makeVideo({ name: 'beta.mp4', fileSize: 200 })]
    render(RecentVideos, { videos, onPlayVideo: vi.fn(), onDeleteVideo: vi.fn() })
    expect(screen.getByText('alpha.mp4')).toBeInTheDocument()
    expect(screen.getByText('beta.mp4')).toBeInTheDocument()
  })

  it('calls onPlayVideo when the play button is clicked', () => {
    const video = makeVideo({ name: 'play-me.mp4' })
    const onPlayVideo = vi.fn()
    render(RecentVideos, { videos: [video], onPlayVideo, onDeleteVideo: vi.fn() })
    fireEvent.click(screen.getAllByRole('button', { name: /play play-me\.mp4/i })[0])
    expect(onPlayVideo).toHaveBeenCalledWith(video)
  })

  it('calls onDeleteVideo when the remove button is clicked', () => {
    const video = makeVideo({ name: 'delete-me.mp4' })
    const onDeleteVideo = vi.fn()
    render(RecentVideos, { videos: [video], onPlayVideo: vi.fn(), onDeleteVideo })
    fireEvent.click(screen.getByRole('button', { name: /remove delete-me\.mp4/i }))
    expect(onDeleteVideo).toHaveBeenCalledWith(video)
  })

  it('shows the progress percentage', () => {
    render(RecentVideos, { videos: [makeVideo({ progress: 0.75 })], onPlayVideo: vi.fn(), onDeleteVideo: vi.fn() })
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('shows the file size', () => {
    render(RecentVideos, { videos: [makeVideo({ fileSize: 1024 * 1024 })], onPlayVideo: vi.fn(), onDeleteVideo: vi.fn() })
    expect(screen.getByText('1 MB')).toBeInTheDocument()
  })

  it('shows 1080p resolution for a 1080p video', () => {
    render(RecentVideos, { videos: [makeVideo({ width: 1920, height: 1080 })], onPlayVideo: vi.fn(), onDeleteVideo: vi.fn() })
    expect(screen.getByText('1080p')).toBeInTheDocument()
  })

  it('shows Unknown for a video with no dimensions', () => {
    render(RecentVideos, { videos: [makeVideo({ width: 0, height: 0 })], onPlayVideo: vi.fn(), onDeleteVideo: vi.fn() })
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})
