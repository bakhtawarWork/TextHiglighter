// Background service worker for Text Highlighter extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Text Highlighter extension installed')
    
    // Initialize storage with empty highlights array
    chrome.storage.local.set({ highlights: [] })
  }
})

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHighlights') {
    // Get highlights from storage
    chrome.storage.local.get(['highlights'], (result) => {
      sendResponse({ highlights: result.highlights || [] })
    })
    return true // Keep message channel open for async response
  }
  
  if (request.action === 'saveHighlight') {
    // Save highlight to storage
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || []
      const newHighlight = {
        ...request.highlight,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        timestamp: Date.now()
      }
      
      highlights.unshift(newHighlight)
      
      chrome.storage.local.set({ highlights: highlights }, () => {
        sendResponse({ success: true, highlight: newHighlight })
      })
    })
    return true // Keep message channel open for async response
  }
  
  if (request.action === 'deleteHighlight') {
    // Delete highlight from storage
    chrome.storage.local.get(['highlights'], (result) => {
      const highlights = result.highlights || []
      const updatedHighlights = highlights.filter(h => h.id !== request.id)
      
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {
        sendResponse({ success: true })
      })
    })
    return true // Keep message channel open for async response
  }
  
  if (request.action === 'clearAllHighlights') {
    // Clear all highlights from storage
    chrome.storage.local.set({ highlights: [] }, () => {
      sendResponse({ success: true })
    })
    return true // Keep message channel open for async response
  }
})

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup defined in manifest.json
  console.log('Extension icon clicked')
})

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // Content script is automatically injected via manifest.json
    console.log('Tab updated:', tab.url)
  }
})
