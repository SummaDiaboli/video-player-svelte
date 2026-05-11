import { describe, it, expect, beforeEach } from 'vitest'
import {
  getRecentVideos,
  addRecentVideo,
  getVideoProgress,
  updateVideoProgress,
  updateVideoMetadata,
  removeRecentVideo,
  formatFileSize,
  formatRelativeTime
} from '../../utils/recentVideos'

beforeEach(() => {
  localStorage.clear()
})

describe('getRecentVideos', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(getRecentVideos()).toEqual([])
  })

  it('returns parsed videos from localStorage', () => {
    addRecentVideo('test.mp4', 'blob://test', 0.5, 120, 1920, 1080, 1000)
    const videos = getRecentVideos()
    expect(videos).toHaveLength(1)
    expect(videos[0].name).toBe('test.mp4')
  })

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('video-player-recent-videos', 'not-json')
    expect(getRecentVideos()).toEqual([])
  })
})

describe('addRecentVideo', () => {
  it('adds a video to the front of the list', () => {
    addRecentVideo('a.mp4', 'blob://a', 0, 0, 0, 0, 100)
    addRecentVideo('b.mp4', 'blob://b', 0, 0, 0, 0, 200)
    const videos = getRecentVideos()
    expect(videos[0].name).toBe('b.mp4')
    expect(videos[1].name).toBe('a.mp4')
  })

  it('moves an existing video (matched by name+fileSize) to the front', () => {
    addRecentVideo('a.mp4', 'blob://a', 0, 0, 0, 0, 100)
    addRecentVideo('b.mp4', 'blob://b', 0, 0, 0, 0, 200)
    addRecentVideo('a.mp4', 'blob://a2', 0.3, 0, 0, 0, 100)
    const videos = getRecentVideos()
    expect(videos).toHaveLength(2)
    expect(videos[0].name).toBe('a.mp4')
    expect(videos[0].progress).toBe(0.3)
  })

  it('does not deduplicate videos with same name but different fileSize', () => {
    addRecentVideo('a.mp4', 'blob://a1', 0, 0, 0, 0, 100)
    addRecentVideo('a.mp4', 'blob://a2', 0, 0, 0, 0, 200)
    expect(getRecentVideos()).toHaveLength(2)
  })

  it('caps the list at 10 videos', () => {
    for (let i = 0; i < 11; i++) {
      addRecentVideo(`video${i}.mp4`, `blob://${i}`, 0, 0, 0, 0, i)
    }
    expect(getRecentVideos()).toHaveLength(10)
  })
})

describe('getVideoProgress', () => {
  it('returns 0 for an unknown video', () => {
    expect(getVideoProgress('unknown.mp4', 999)).toBe(0)
  })

  it('returns the saved progress', () => {
    addRecentVideo('test.mp4', 'blob://test', 0.75, 0, 0, 0, 500)
    expect(getVideoProgress('test.mp4', 500)).toBe(0.75)
  })
})

describe('updateVideoProgress', () => {
  it('updates the progress of an existing video', () => {
    addRecentVideo('test.mp4', 'blob://test', 0, 120, 0, 0, 500)
    updateVideoProgress('test.mp4', 500, 0.6, 120)
    expect(getVideoProgress('test.mp4', 500)).toBe(0.6)
  })

  it('does nothing for an unknown video', () => {
    updateVideoProgress('ghost.mp4', 999, 0.5, 60)
    expect(getRecentVideos()).toHaveLength(0)
  })
})

describe('updateVideoMetadata', () => {
  it('updates width and height', () => {
    addRecentVideo('test.mp4', 'blob://test', 0, 0, 0, 0, 500)
    updateVideoMetadata('test.mp4', 500, 120, 1920, 1080)
    const video = getRecentVideos()[0]
    expect(video.width).toBe(1920)
    expect(video.height).toBe(1080)
    expect(video.duration).toBe(120)
  })

  it('does not overwrite an existing non-zero duration', () => {
    addRecentVideo('test.mp4', 'blob://test', 0, 90, 0, 0, 500)
    updateVideoMetadata('test.mp4', 500, 120, 1920, 1080)
    expect(getRecentVideos()[0].duration).toBe(90)
  })
})

describe('removeRecentVideo', () => {
  it('removes the matching video', () => {
    addRecentVideo('a.mp4', 'blob://a', 0, 0, 0, 0, 100)
    addRecentVideo('b.mp4', 'blob://b', 0, 0, 0, 0, 200)
    removeRecentVideo('a.mp4', 100)
    const videos = getRecentVideos()
    expect(videos).toHaveLength(1)
    expect(videos[0].name).toBe('b.mp4')
  })

  it('does not remove a video with matching name but different fileSize', () => {
    addRecentVideo('a.mp4', 'blob://a', 0, 0, 0, 0, 100)
    removeRecentVideo('a.mp4', 999)
    expect(getRecentVideos()).toHaveLength(1)
  })
})

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
  })

  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('rounds to one decimal place', () => {
    expect(formatFileSize(1500)).toBe('1.5 KB')
  })
})

describe('formatRelativeTime', () => {
  it('returns a non-empty string for a recent timestamp', () => {
    const result = formatRelativeTime(Date.now() - 60000)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('includes "ago" for past timestamps', () => {
    const result = formatRelativeTime(Date.now() - 3600000)
    expect(result).toMatch(/ago/)
  })
})
