import { formatDistanceToNow } from 'date-fns'
import type { RecentVideo } from '../types'

export { type RecentVideo }

const STORAGE_KEY = 'video-player-recent-videos'
const MAX_RECENT = 10

export const getRecentVideos = (): RecentVideo[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const findByFile = (name: string, fileSize: number): RecentVideo | undefined => {
  return getRecentVideos().find(v => v.name === name && v.fileSize === fileSize)
}

export const getVideoProgress = (name: string, fileSize: number): number => {
  const video = findByFile(name, fileSize)
  return video?.progress ?? 0
}

export const addRecentVideo = (
  name: string, 
  blobUrl: string, 
  progress: number = 0,
  duration: number = 0,
  width: number = 0,
  height: number = 0,
  fileSize: number = 0
): void => {
  const recent = getRecentVideos()
  const existing = recent.findIndex(v => v.name === name && v.fileSize === fileSize)
  
  if (existing !== -1) {
    recent.splice(existing, 1)
  }
  
  recent.unshift({
    name,
    path: blobUrl,
    progress,
    lastPlayed: Date.now(),
    duration,
    width,
    height,
    fileSize
  })
  
  if (recent.length > MAX_RECENT) {
    recent.pop()
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
}

export const updateVideoProgress = (name: string, fileSize: number, progress: number, duration: number = 0): void => {
  const recent = getRecentVideos()
  const video = recent.find(v => v.name === name && v.fileSize === fileSize)
  
  if (video) {
    video.progress = progress
    video.lastPlayed = Date.now()
    if (duration > 0) {
      video.duration = duration
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
  }
}

export const updateVideoMetadata = (name: string, fileSize: number, duration: number, width: number, height: number): void => {
  const recent = getRecentVideos()
  const video = recent.find(v => v.name === name && v.fileSize === fileSize)
  
  if (video) {
    if (video.duration === 0 && duration > 0) {
      video.duration = duration
    }
    video.width = width
    video.height = height
    video.lastPlayed = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
  }
}

export const removeRecentVideo = (name: string, fileSize: number): void => {
  const recent = getRecentVideos().filter(v => !(v.name === name && v.fileSize === fileSize))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}