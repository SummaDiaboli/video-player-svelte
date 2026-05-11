import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import PlayerHeader from '../../components/Player/PlayerHeader.svelte'

describe('PlayerHeader', () => {
  it('renders when showControls is true', () => {
    render(PlayerHeader, { videoFileName: 'movie.mp4', showControls: true, playing: true, onGoHome: vi.fn() })
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders when playing is false regardless of showControls', () => {
    render(PlayerHeader, { videoFileName: 'movie.mp4', showControls: false, playing: false, onGoHome: vi.fn() })
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('does not render when showControls is false and playing is true', () => {
    render(PlayerHeader, { videoFileName: 'movie.mp4', showControls: false, playing: true, onGoHome: vi.fn() })
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('displays the video filename', () => {
    render(PlayerHeader, { videoFileName: 'my-video.mkv', showControls: true, playing: false, onGoHome: vi.fn() })
    expect(screen.getByText('my-video.mkv')).toBeInTheDocument()
  })

  it('calls onGoHome when the back button is clicked', () => {
    const onGoHome = vi.fn()
    render(PlayerHeader, { videoFileName: 'movie.mp4', showControls: true, playing: false, onGoHome })
    fireEvent.click(screen.getByRole('button', { name: /go back/i }))
    expect(onGoHome).toHaveBeenCalledOnce()
  })
})
