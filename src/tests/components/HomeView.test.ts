import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import HomeView from '../../components/Home/HomeView.svelte'
import type { RecentVideo } from '../../types'

const mockVideo: RecentVideo = {
  name: 'test.mp4',
  path: 'blob://test',
  progress: 0.5,
  lastPlayed: Date.now(),
  duration: 120,
  width: 1920,
  height: 1080,
  fileSize: 1024 * 1024
}

describe('HomeView', () => {
  it('renders the video selector', () => {
    render(HomeView, {
      recentVideos: [],
      onSelectVideo: vi.fn(),
      onPlayVideo: vi.fn(),
      onDeleteVideo: vi.fn()
    })
    expect(screen.getByText('Click or drag video to select')).toBeInTheDocument()
  })

  it('does not render the recent videos section when the list is empty', () => {
    render(HomeView, {
      recentVideos: [],
      onSelectVideo: vi.fn(),
      onPlayVideo: vi.fn(),
      onDeleteVideo: vi.fn()
    })
    expect(screen.queryByText('Recently Played')).not.toBeInTheDocument()
  })

  it('renders the recent videos section when the list has items', () => {
    render(HomeView, {
      recentVideos: [mockVideo],
      onSelectVideo: vi.fn(),
      onPlayVideo: vi.fn(),
      onDeleteVideo: vi.fn()
    })
    expect(screen.getByText('Recently Played')).toBeInTheDocument()
    expect(screen.getByText('test.mp4')).toBeInTheDocument()
  })
})
