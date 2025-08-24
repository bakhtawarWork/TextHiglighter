// Content script for text highlighting functionality

console.log('Content script starting...');

// Check if Chrome APIs are available
if (typeof chrome === 'undefined' || !chrome.storage) {
  console.error('Chrome APIs not available - extension may not be loaded properly');
} else {
  console.log('Chrome APIs available');
}

class TextHighlighter {
  constructor() {
    console.log('TextHighlighter constructor called');
    this.popup = null
    this.selectedText = ''
    this.selectionRange = null
    this.isProcessing = false
    this.lastSelection = ''
    this.timeoutId = null
    this.init()
  }

  init() {
    console.log('Initializing TextHighlighter...');
    try {
      // Use a single event listener with proper debouncing
      document.addEventListener('mouseup', this.handleTextSelection.bind(this))
      
      // Listen for messages from popup
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this))
      
      console.log('TextHighlighter initialized successfully');
    } catch (error) {
      console.error('Error initializing TextHighlighter:', error);
    }
  }

  handleTextSelection(event) {
    console.log('handleTextSelection called');
    
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    // Debounce the selection handling
    this.timeoutId = setTimeout(() => {
      this.processSelection(event)
    }, 150)
  }

  processSelection(event) {
    console.log('processSelection called');
    
    // Prevent multiple popups
    if (this.isProcessing) {
      console.log('Already processing, skipping...');
      return
    }
    
    const selection = window.getSelection()
    const selectedText = selection.toString().trim()
    
    console.log('Selected text:', selectedText);
    
    // Only show popup if selection actually changed and has content
    if (selectedText.length > 0 && selectedText !== this.lastSelection) {
      console.log('Showing popup for new selection');
      this.selectedText = selectedText
      this.lastSelection = selectedText
      this.selectionRange = selection.getRangeAt(0)
      this.showSavePopup(event)
    } else if (selectedText.length === 0) {
      console.log('No selection, hiding popup');
      this.hidePopup()
      this.clearSelection()
      this.lastSelection = ''
    } else {
      console.log('Same selection, not showing popup');
    }
  }

  showSavePopup(event) {
    console.log('showSavePopup called');
    
    // Remove existing popup
    this.hidePopup()

    // Create popup element
    this.popup = document.createElement('div')
    this.popup.id = 'text-highlighter-popup'
    this.popup.innerHTML = `
      <div class="text-highlighter-popup-content">
        <div class="text-highlighter-popup-header">
          <span class="text-highlighter-popup-title">Save Highlight?</span>
        </div>
        <div class="text-highlighter-popup-actions">
          <button class="text-highlighter-btn text-highlighter-btn-save" id="save-highlight-btn">
            Save
          </button>
          <button class="text-highlighter-btn text-highlighter-btn-cancel" id="cancel-highlight-btn">
            Cancel
          </button>
        </div>
      </div>
    `

    // Add event listeners
    const saveBtn = this.popup.querySelector('#save-highlight-btn');
    const cancelBtn = this.popup.querySelector('#cancel-highlight-btn');
    
    if (saveBtn) {
      saveBtn.addEventListener('click', this.saveHighlight.bind(this))
      console.log('Save button event listener added');
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', this.hidePopup.bind(this))
      console.log('Cancel button event listener added');
    }

    // Position popup near selection
    this.positionPopup(event)

    // Add to DOM
    document.body.appendChild(this.popup)
    console.log('Popup added to DOM');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (this.popup && this.popup.parentNode) {
        this.hidePopup()
      }
    }, 5000)
  }

  positionPopup(event) {
    if (!this.popup) return

    const rect = this.popup.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate position based on mouse/selection position
    let left = event.clientX
    let top = event.clientY + 20

    // Adjust if popup would go off-screen
    if (left + rect.width > viewportWidth) {
      left = viewportWidth - rect.width - 10
    }
    if (top + rect.height > viewportHeight) {
      top = event.clientY - rect.height - 10
    }
    if (left < 10) left = 10
    if (top < 10) top = 10

    this.popup.style.left = left + 'px'
    this.popup.style.top = top + 'px'
  }

  hidePopup() {
    if (this.popup && this.popup.parentNode) {
      this.popup.parentNode.removeChild(this.popup)
      this.popup = null
      console.log('Popup hidden');
    }
    // Don't clear selectedText and selectionRange here - let saveHighlight do it
    // this.selectedText = ''
    // this.selectionRange = null
    // this.isProcessing = false
  }
  
  clearSelection() {
    // New function to clear selection data
    this.selectedText = ''
    this.selectionRange = null
    this.isProcessing = false
    console.log('Selection data cleared');
  }

  saveHighlight() {
    console.log('saveHighlight called with text:', this.selectedText);
    console.log('isProcessing:', this.isProcessing);
    console.log('selectedText length:', this.selectedText.length);
    
    if (!this.selectedText) {
      console.log('Cannot save: no text selected');
      return
    }
    
    if (this.isProcessing) {
      console.log('Cannot save: already processing');
      return
    }

    this.isProcessing = true
    console.log('Saving highlight:', this.selectedText)

    try {
      // Get current page information
      const pageInfo = {
        url: window.location.href,
        title: document.title,
        text: this.selectedText,
        timestamp: Date.now(),
        id: this.generateId()
      }

      console.log('Page info:', pageInfo)

      // Get existing highlights using callback approach
      chrome.storage.local.get(['highlights'], (result) => {
        console.log('Current highlights:', result.highlights)
        
        const highlights = result.highlights || []
        
        // Add new highlight
        highlights.unshift(pageInfo)
        
        console.log('Updated highlights:', highlights)
        
        // Save to storage
        chrome.storage.local.set({ highlights: highlights }, () => {
          console.log('Highlight saved successfully')
          
          // Show success message
          this.showSuccessMessage()
          
          // Highlight the text visually
          this.highlightText()
          
          // Hide popup
          this.hidePopup()
          
          // Clear selection data
          this.clearSelection()
          
          // Reset last selection to allow same text to be selected again
          this.lastSelection = ''
        })
      })

    } catch (error) {
      console.error('Error saving highlight:', error)
      this.showErrorMessage()
      this.clearSelection()
    }
  }

  highlightText() {
    if (!this.selectionRange) return

    try {
      // Create a highlight element
      const highlightSpan = document.createElement('span')
      highlightSpan.className = 'text-highlighter-saved'
      highlightSpan.style.backgroundColor = '#fef3c7'
      highlightSpan.style.borderRadius = '3px'
      highlightSpan.style.padding = '2px 4px'
      highlightSpan.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      
      // Wrap the selected text
      this.selectionRange.surroundContents(highlightSpan)
      
      // Clear the selection
      window.getSelection().removeAllRanges()
      
      console.log('Text highlighted visually')
    } catch (error) {
      console.error('Error highlighting text:', error)
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  showSuccessMessage() {
    console.log('Showing success message')
    
    const message = document.createElement('div')
    message.id = 'text-highlighter-success'
    message.innerHTML = `
      <div class="text-highlighter-success-content">
        <span>✓ Highlight saved!</span>
      </div>
    `
    
    // Add styles directly to ensure they work
    message.style.position = 'fixed'
    message.style.top = '20px'
    message.style.left = '50%'
    message.style.transform = 'translateX(-50%)'
    message.style.zIndex = '10001'
    message.style.padding = '12px 20px'
    message.style.borderRadius = '6px'
    message.style.backgroundColor = '#d1fae5'
    message.style.color = '#065f46'
    message.style.border = '1px solid #a7f3d0'
    message.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    message.style.fontSize = '14px'
    message.style.fontWeight = '500'
    message.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    
    document.body.appendChild(message)
    console.log('Success message added to DOM')

    // Remove after 3 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message)
        console.log('Success message removed')
      }
    }, 3000)
  }

  showErrorMessage() {
    console.log('Showing error message')
    
    const message = document.createElement('div')
    message.id = 'text-highlighter-error'
    message.innerHTML = `
      <div class="text-highlighter-error-content">
        <span>✗ Error saving highlight</span>
      </div>
    `
    
    // Add styles directly to ensure they work
    message.style.position = 'fixed'
    message.style.top = '20px'
    message.style.left = '50%'
    message.style.transform = 'translateX(-50%)'
    message.style.zIndex = '10001'
    message.style.padding = '12px 20px'
    message.style.borderRadius = '6px'
    message.style.backgroundColor = '#fee2e2'
    message.style.color = '#991b1b'
    message.style.border = '1px solid #fecaca'
    message.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    message.style.fontSize = '14px'
    message.style.fontWeight = '500'
    message.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    
    document.body.appendChild(message)

    // Remove after 3 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message)
      }
    }, 3000)
  }

  handleMessage(request, sender, sendResponse) {
    if (request.action === 'getSelection') {
      sendResponse({
        text: this.selectedText,
        hasSelection: this.selectedText.length > 0
      })
    }
  }
}

// Initialize the text highlighter
console.log('Text Highlighter content script initialized')
console.log('Chrome storage available:', !!chrome.storage)
console.log('Chrome runtime available:', !!chrome.runtime)

// Add global debug function
window.debugTextHighlighter = function() {
  console.log('=== Text Highlighter Debug Info ===');
  console.log('Extension loaded:', !!window.textHighlighterInstance);
  console.log('Current selection:', window.getSelection().toString());
  
  chrome.storage.local.get(['highlights'], (result) => {
    console.log('Stored highlights:', result.highlights);
    console.log('Number of highlights:', (result.highlights || []).length);
  });
  
  console.log('Popup elements:', document.querySelectorAll('[id*="text-highlighter"]').length);
  console.log('============================');
};

try {
  window.textHighlighterInstance = new TextHighlighter()
  console.log('TextHighlighter instance created successfully');
} catch (error) {
  console.error('Error creating TextHighlighter instance:', error);
}
