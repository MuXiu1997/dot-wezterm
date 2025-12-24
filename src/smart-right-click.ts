/** @noSelfInFile */

// Smart Right-Click Copy/Paste Functionality
// When text is selected: Copy the selected content and clear the selection
// When no text is selected: Paste content from clipboard
function smart_right_click_handler(): any {
  return wezterm.action_callback((window, pane) => {
    const has_selection = window.get_selection_text_for_pane(pane) !== ''

    if (has_selection) {
      // Has selected text: Copy to clipboard and clear selection
      window.perform_action(wezterm.action.CopyTo('ClipboardAndPrimarySelection'), pane)
      window.perform_action(wezterm.action.ClearSelection, pane)
    }
    else {
      // No selected text: Paste from clipboard
      window.perform_action(wezterm.action({
        PasteFrom: 'Clipboard',
      }), pane)
    }
  })
}

export function apply_to_config(config: wezterm.Config): void {
  config.mouse_bindings = [
    ...(config.mouse_bindings ?? []),
    {
      event: { Down: { streak: 1, button: 'Right' } },
      mods: 'NONE',
      action: smart_right_click_handler(),
    },
  ]
}
