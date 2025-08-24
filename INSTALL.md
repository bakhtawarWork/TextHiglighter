# Installation Guide

## Quick Install

1. **Open Chrome Extensions**
   - Go to `chrome://extensions/` in your Chrome browser
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `extension` folder from this project

4. **Pin the Extension**
   - Click the puzzle piece icon in your Chrome toolbar
   - Find "Text Highlighter" and click the pin icon

## How to Use

1. **Select Text**: Highlight any text on any webpage
2. **Save Highlight**: Click "Save" in the popup that appears
3. **View Highlights**: Click the extension icon to see all saved highlights
4. **Manage**: Delete individual highlights or clear all at once

## Features

- ✅ Text selection and highlighting
- ✅ Local storage (no data sent to servers)
- ✅ Beautiful popup interface
- ✅ Delete and manage highlights
- ✅ Navigate back to original pages

## Troubleshooting

- **Extension not loading**: Make sure Developer mode is enabled
- **Highlights not saving**: Check browser console for errors
- **Popup not working**: Verify all files are in the extension folder

## Development

To modify the extension:
1. Edit files in the `src/` directory
2. Run `npm run build:extension`
3. Reload the extension in Chrome
