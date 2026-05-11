import type { SubtitleInfo } from '../types'

export const parseSRT = (content: string): SubtitleInfo[] => {
  const subtitles: SubtitleInfo[] = []
  const blocks = content.trim().split(/\n\n+/)

  for (const block of blocks) {
    const lines = block.split('\n')
    if (lines.length < 3) continue

    const timeLine = lines[1]
    const timeMatch = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
    )

    if (timeMatch) {
      const startTime =
        parseInt(timeMatch[1]) * 3600 +
        parseInt(timeMatch[2]) * 60 +
        parseInt(timeMatch[3]) +
        parseInt(timeMatch[4]) / 1000

      const endTime =
        parseInt(timeMatch[5]) * 3600 +
        parseInt(timeMatch[6]) * 60 +
        parseInt(timeMatch[7]) +
        parseInt(timeMatch[8]) / 1000

      subtitles.push({
        id: lines[0],
        startTime,
        endTime,
        text: lines.slice(2).join('\n')
      })
    }
  }

  return subtitles
}

export const getCurrentSubtitle = (
  subtitles: SubtitleInfo[],
  currentTime: number
): SubtitleInfo | null => {
  return subtitles.find(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  ) || null
}