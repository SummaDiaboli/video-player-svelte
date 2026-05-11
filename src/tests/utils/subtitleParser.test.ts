import { describe, it, expect } from 'vitest'
import { parseSRT, getCurrentSubtitle } from '../../utils/subtitleParser'

const singleBlock = `1
00:00:01,000 --> 00:00:03,500
Hello world`

const multiBlock = `1
00:00:01,000 --> 00:00:03,500
Hello world

2
00:00:05,000 --> 00:00:07,000
Second subtitle

3
00:00:10,200 --> 00:00:12,800
Third subtitle`

const multiLineText = `1
00:00:01,000 --> 00:00:03,000
Line one
Line two`

describe('parseSRT', () => {
  it('returns empty array for empty string', () => {
    expect(parseSRT('')).toEqual([])
  })

  it('parses a single subtitle block', () => {
    const result = parseSRT(singleBlock)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: '1',
      startTime: 1,
      endTime: 3.5,
      text: 'Hello world'
    })
  })

  it('parses multiple subtitle blocks', () => {
    const result = parseSRT(multiBlock)
    expect(result).toHaveLength(3)
    expect(result[1].text).toBe('Second subtitle')
    expect(result[2].startTime).toBeCloseTo(10.2)
  })

  it('correctly converts hours, minutes, seconds, milliseconds', () => {
    const input = `1\n01:02:03,456 --> 02:03:04,789\nTest`
    const result = parseSRT(input)
    expect(result[0].startTime).toBeCloseTo(3723.456)
    expect(result[0].endTime).toBeCloseTo(7384.789)
  })

  it('handles multi-line subtitle text', () => {
    const result = parseSRT(multiLineText)
    expect(result[0].text).toBe('Line one\nLine two')
  })

  it('skips blocks with fewer than 3 lines', () => {
    const input = `1\n00:00:01,000 --> 00:00:02,000`
    expect(parseSRT(input)).toEqual([])
  })

  it('skips blocks with invalid time format', () => {
    const input = `1\nnot a timecode\nSome text`
    expect(parseSRT(input)).toEqual([])
  })

  it('handles extra blank lines between blocks', () => {
    const input = `1\n00:00:01,000 --> 00:00:02,000\nFirst\n\n\n2\n00:00:03,000 --> 00:00:04,000\nSecond`
    const result = parseSRT(input)
    expect(result).toHaveLength(2)
  })
})

describe('getCurrentSubtitle', () => {
  const subtitles = parseSRT(multiBlock)

  it('returns null for empty array', () => {
    expect(getCurrentSubtitle([], 1)).toBeNull()
  })

  it('returns null when time is before all subtitles', () => {
    expect(getCurrentSubtitle(subtitles, 0)).toBeNull()
  })

  it('returns null when time is between subtitles', () => {
    expect(getCurrentSubtitle(subtitles, 4)).toBeNull()
  })

  it('returns the matching subtitle', () => {
    const sub = getCurrentSubtitle(subtitles, 2)
    expect(sub?.text).toBe('Hello world')
  })

  it('matches at exact start time', () => {
    const sub = getCurrentSubtitle(subtitles, 1)
    expect(sub?.id).toBe('1')
  })

  it('matches at exact end time', () => {
    const sub = getCurrentSubtitle(subtitles, 3.5)
    expect(sub?.id).toBe('1')
  })

  it('returns null after last subtitle ends', () => {
    expect(getCurrentSubtitle(subtitles, 13)).toBeNull()
  })
})
