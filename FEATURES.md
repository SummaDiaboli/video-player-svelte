# Video Player Features

## Implemented

- [x] Video playback (play/pause, seek, volume, fullscreen)
- [x] SRT subtitle support with styling (size, color, background, position)
- [x] Settings popover with tabbed interface
- [x] Recent videos list with progress tracking
- [x] Toast notifications
- [x] Keyboard shortcuts (Space, M, F, Arrow keys, etc.)
- [x] Accessibility (ARIA labels, keyboard navigation)
- [x] Error handling ("Video not found" with "Select Again")
- [x] Double-click for fullscreen
- [x] date-fns for relative time formatting

## Pending / In Progress

- [ ] **Progress persistence bug** - selecting same video again doesn't resume
- [ ] **playbackSpeed prop error** - PlayerControls Props interface missing property
- [ ] Buffering indicator
- [ ] Loop/repeat mode
- [ ] Frame-by-frame navigation (forward/backward)
- [ ] Fit toggle (fill vs contain)
- [ ] Brightness/contrast controls
- [ ] Subtitle offset adjustment
- [ ] Volume persistence
- [ ] Customizable keyboard shortcuts

## Feature Details

### Buffering Indicator
Show loading spinner when video is buffering.

### Loop/Repeat Mode
Toggle to repeat current video. Option to repeat one or repeat all (if playlist).

### Frame-by-Frame Navigation
Step forward/backward by one frame. Useful for precise editing or analysis.

### Fit Toggle
Toggle between:
- **Contain**: Maintain aspect ratio, letterbox if needed
- **Fill**: Stretch to fill screen (may crop)

### Brightness/Contrast Controls
Video filter adjustments:
- Brightness: 50% - 150%
- Contrast: 50% - 150%

### Subtitle Offset Adjustment
Fine-tune subtitle timing:
- ±100ms increments
- Quick adjust buttons (±1s)

### Volume Persistence
Remember volume level across sessions. Store in localStorage.

### Customizable Keyboard Shortcuts
Allow users to rebind keyboard shortcuts to their preference.

---

## Priority

| Priority | Features |
|----------|----------|
| High | Progress persistence, playbackSpeed prop |
| Medium | - |
| Low | All others |
