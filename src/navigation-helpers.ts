/** @noSelfInFile */

export type Direction = 'Left' | 'Right' | 'Up' | 'Down'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if two ranges overlap
 * @param start1 Start position of first range
 * @param len1 Length of first range
 * @param start2 Start position of second range
 * @param len2 Length of second range
 * @returns True if ranges overlap
 */
function ranges_overlap(start1: number, len1: number, start2: number, len2: number): boolean {
  return !(start1 + len1 <= start2 || start1 >= start2 + len2)
}

/**
 * Check if a pane is a candidate in the given direction
 * @param pane_info Pane information with position and dimensions
 * @param current_info Current pane information
 * @param dir Navigation direction
 * @returns True if pane is a valid candidate
 */
function is_candidate_in_direction(pane_info: wezterm.PaneInfo, current_info: wezterm.PaneInfo, dir: Direction): boolean {
  if (dir === 'Left') {
    // Left: smaller x-coordinate with overlapping y-coordinate
    return pane_info.left < current_info.left
      && ranges_overlap(pane_info.top, pane_info.height, current_info.top, current_info.height)
  }
  else if (dir === 'Right') {
    // Right: larger x-coordinate with overlapping y-coordinate
    return pane_info.left > current_info.left
      && ranges_overlap(pane_info.top, pane_info.height, current_info.top, current_info.height)
  }
  else if (dir === 'Up') {
    // Up: smaller y-coordinate with overlapping x-coordinate
    return pane_info.top < current_info.top
      && ranges_overlap(pane_info.left, pane_info.width, current_info.left, current_info.width)
  }
  else if (dir === 'Down') {
    // Down: larger y-coordinate with overlapping x-coordinate
    return pane_info.top > current_info.top
      && ranges_overlap(pane_info.left, pane_info.width, current_info.left, current_info.width)
  }
  return false
}

/**
 * Calculate distance between two panes based on direction
 * @param candidate Candidate pane information
 * @param current_info Current pane information
 * @param dir Navigation direction
 * @returns Manhattan distance between panes
 */
function calculate_distance(candidate: wezterm.PaneInfo, current_info: wezterm.PaneInfo, dir: Direction): number {
  if (dir === 'Left' || dir === 'Right') {
    const horizontal_dist = Math.abs(candidate.left - current_info.left)
    const vertical_dist = Math.abs(
      (candidate.top + candidate.height / 2) - (current_info.top + current_info.height / 2),
    )
    return horizontal_dist + vertical_dist
  }
  else {
    const vertical_dist = Math.abs(candidate.top - current_info.top)
    const horizontal_dist = Math.abs(
      (candidate.left + candidate.width / 2) - (current_info.left + current_info.width / 2),
    )
    return vertical_dist + horizontal_dist
  }
}

/**
 * Find the closest pane from candidates
 * @param candidates List of candidate panes
 * @param current_info Current pane information
 * @param dir Navigation direction
 * @returns The closest pane or undefined if no candidates
 */
function find_closest_pane(candidates: wezterm.PaneInfo[], current_info: wezterm.PaneInfo, dir: Direction): wezterm.Pane | undefined {
  if (candidates.length === 0) {
    return undefined
  }

  let best_candidate = candidates[0]
  let best_distance = calculate_distance(best_candidate, current_info, dir)

  for (let i = 1; i < candidates.length; i++) {
    const distance = calculate_distance(candidates[i], current_info, dir)
    if (distance < best_distance) {
      best_distance = distance
      best_candidate = candidates[i]
    }
  }

  return best_candidate.pane
}

/**
 * Get wrap candidates for cyclic navigation
 * @param panes All panes in the tab
 * @param current_pane Current pane object
 * @param current_info Current pane information
 * @param dir Navigation direction
 * @returns Sorted list of wrap candidates
 */
function get_wrap_candidates(panes: wezterm.PaneInfo[], current_pane: wezterm.Pane, current_info: wezterm.PaneInfo, dir: Direction): wezterm.PaneInfo[] {
  const wrap_candidates: wezterm.PaneInfo[] = []

  for (const pane_info of panes) {
    if (pane_info.pane.pane_id() !== current_pane.pane_id()) {
      let include = false

      if (dir === 'Left' || dir === 'Right') {
        // For horizontal navigation, check vertical overlap
        include = ranges_overlap(pane_info.top, pane_info.height, current_info.top, current_info.height)
      }
      else {
        // For vertical navigation, check horizontal overlap
        include = ranges_overlap(pane_info.left, pane_info.width, current_info.left, current_info.width)
      }

      if (include) {
        wrap_candidates.push(pane_info)
      }
    }
  }

  // Sort candidates based on direction
  if (dir === 'Left') {
    // Wrap to rightmost pane
    wrap_candidates.sort((a, b) => b.left - a.left)
  }
  else if (dir === 'Right') {
    // Wrap to leftmost pane
    wrap_candidates.sort((a, b) => a.left - b.left)
  }
  else if (dir === 'Up') {
    // Wrap to bottommost pane
    wrap_candidates.sort((a, b) => b.top - a.top)
  }
  else if (dir === 'Down') {
    // Wrap to topmost pane
    wrap_candidates.sort((a, b) => a.top - b.top)
  }

  return wrap_candidates
}

// ============================================================================
// Main Navigation Logic
// ============================================================================

/**
 * Get the next pane in the specified direction (with wrapping support)
 * @param tab WezTerm tab object
 * @param current_pane Current pane object
 * @param dir Navigation direction
 * @returns The next pane to navigate to, or undefined if none found
 */
function get_next_pane_in_direction(tab: wezterm.Tab, current_pane: wezterm.Pane, dir: Direction): wezterm.Pane | undefined {
  const panes = tab.panes_with_info()
  let current_info: wezterm.PaneInfo | undefined

  // Find current pane info
  for (const pane_info of panes) {
    if (pane_info.pane.pane_id() === current_pane.pane_id()) {
      current_info = pane_info
      break
    }
  }

  if (!current_info) {
    return undefined
  }

  // Find direct candidates in the specified direction
  const candidates: wezterm.PaneInfo[] = []
  for (const pane_info of panes) {
    if (pane_info.pane.pane_id() !== current_pane.pane_id()) {
      if (is_candidate_in_direction(pane_info, current_info, dir)) {
        candidates.push(pane_info)
      }
    }
  }

  // If direct candidates found, return the closest one
  const closest = find_closest_pane(candidates, current_info, dir)
  if (closest) {
    return closest
  }

  // No direct candidates, try wrapping
  const wrap_candidates = get_wrap_candidates(panes, current_pane, current_info, dir)
  if (wrap_candidates.length > 0) {
    return wrap_candidates[0].pane
  }

  // No candidates found (single pane case)
  return undefined
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Navigate to pane with wrapping support
 * @param dir Navigation direction ('Left', 'Right', 'Up', or 'Down')
 * @returns WezTerm action callback function
 */
export function navigate_pane_with_wrap(dir: Direction): any {
  return wezterm.action_callback((win, pane) => {
    const tab = win.active_tab()
    const next_pane = get_next_pane_in_direction(tab, pane, dir)

    if (next_pane) {
      next_pane.activate()
    }
  })
}
