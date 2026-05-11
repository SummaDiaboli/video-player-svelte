import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import ErrorScreen from '../../components/Home/ErrorScreen.svelte'

describe('ErrorScreen — not-found', () => {
  it('renders the file not found heading', () => {
    render(ErrorScreen, { type: 'not-found', onGoBack: vi.fn() })
    expect(screen.getByText('Video file not found')).toBeInTheDocument()
  })

  it('renders both Select Again and Go Back buttons', () => {
    render(ErrorScreen, { type: 'not-found', onGoBack: vi.fn(), onReselect: vi.fn() })
    expect(screen.getByText('Select Again')).toBeInTheDocument()
    expect(screen.getByText('Go Back')).toBeInTheDocument()
  })

  it('calls onReselect when Select Again is clicked', () => {
    const onReselect = vi.fn()
    render(ErrorScreen, { type: 'not-found', onGoBack: vi.fn(), onReselect })
    fireEvent.click(screen.getByText('Select Again'))
    expect(onReselect).toHaveBeenCalledOnce()
  })

  it('calls onGoBack when Go Back is clicked', () => {
    const onGoBack = vi.fn()
    render(ErrorScreen, { type: 'not-found', onGoBack, onReselect: vi.fn() })
    fireEvent.click(screen.getByText('Go Back'))
    expect(onGoBack).toHaveBeenCalledOnce()
  })
})

describe('ErrorScreen — error', () => {
  it('renders the failed to load heading', () => {
    render(ErrorScreen, { type: 'error', onGoBack: vi.fn() })
    expect(screen.getByText('Failed to load video')).toBeInTheDocument()
  })

  it('does not render a Select Again button', () => {
    render(ErrorScreen, { type: 'error', onGoBack: vi.fn() })
    expect(screen.queryByText('Select Again')).not.toBeInTheDocument()
  })

  it('calls onGoBack when Go Back is clicked', () => {
    const onGoBack = vi.fn()
    render(ErrorScreen, { type: 'error', onGoBack })
    fireEvent.click(screen.getByText('Go Back'))
    expect(onGoBack).toHaveBeenCalledOnce()
  })
})
