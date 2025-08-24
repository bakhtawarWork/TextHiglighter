import React, { useState, useEffect } from 'react'
import HighlightItem from './HighlightItem.jsx'

const Popup = () => {
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHighlights()
    
    // Refresh highlights every 2 seconds to catch new ones
    const interval = setInterval(loadHighlights, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const loadHighlights = async () => {
    try {
      // Use chrome.storage.local.get with a callback for better compatibility
      chrome.storage.local.get(['highlights'], (result) => {
        const highlightsData = result.highlights || []
        setHighlights(highlightsData)
        setLoading(false)
      })
    } catch (error) {
      console.error('Error loading highlights:', error)
      setLoading(false)
    }
  }

  const deleteHighlight = async (id) => {
    try {
      const updatedHighlights = highlights.filter(h => h.id !== id)
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {
        setHighlights(updatedHighlights)
      })
    } catch (error) {
      console.error('Error deleting highlight:', error)
    }
  }

  const clearAllHighlights = async () => {
    try {
      chrome.storage.local.set({ highlights: [] }, () => {
        setHighlights([])
      })
    } catch (error) {
      console.error('Error clearing highlights:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Text Highlighter</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={loadHighlights}
              className="text-primary-100 hover:text-white p-1 rounded transition-colors"
              title="Refresh highlights"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="text-sm text-primary-100">
              {highlights.length} highlight{highlights.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {highlights.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No highlights yet</h3>
            <p className="text-gray-500 text-sm">
              Select text on any webpage to start highlighting
            </p>
            <button
              onClick={loadHighlights}
              className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Clear All Button */}
            <div className="mb-4">
              <button
                onClick={clearAllHighlights}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Clear All Highlights
              </button>
            </div>

            {/* Highlights List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {highlights.map((highlight) => (
                <HighlightItem
                  key={highlight.id}
                  highlight={highlight}
                  onDelete={deleteHighlight}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="text-center text-xs text-gray-500">
          Select text on any webpage to highlight
        </div>
      </div>
    </div>
  )
}

export default Popup
