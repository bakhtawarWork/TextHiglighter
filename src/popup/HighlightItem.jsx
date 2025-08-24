import React from 'react'

const HighlightItem = ({ highlight, onDelete }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const openOriginalPage = () => {
    chrome.tabs.create({ url: highlight.url })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {highlight.title || 'Untitled Page'}
          </h3>
          <p className="text-xs text-gray-500">
            {formatDate(highlight.timestamp)}
          </p>
        </div>
        <button
          onClick={() => onDelete(highlight.id)}
          className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
          title="Delete highlight"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Highlighted Text */}
      <div className="mb-3">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
          <p className="text-sm text-gray-800 leading-relaxed">
            "{truncateText(highlight.text)}"
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={openOriginalPage}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline"
        >
          View Original Page
        </button>
        <div className="text-xs text-gray-400">
          {highlight.text.length} characters
        </div>
      </div>
    </div>
  )
}

export default HighlightItem
