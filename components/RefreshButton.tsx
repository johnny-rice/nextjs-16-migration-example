'use client'

import { revalidateProducts } from '@/app/actions'
import { useState } from 'react'

// Next.js 16: Client component demonstrating Server Actions for cache revalidation
// This shows how to trigger cache invalidation from the UI
export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null)

  async function handleRefresh() {
    setIsRefreshing(true)
    try {
      const result = await revalidateProducts()
      setLastRefreshed(result.timestamp)
    } catch (error) {
      console.error('Failed to refresh:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: isRefreshing ? 'not-allowed' : 'pointer',
          opacity: isRefreshing ? 0.6 : 1,
        }}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh Products Cache'}
      </button>
      {lastRefreshed && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          Last refreshed: {new Date(lastRefreshed).toLocaleString()}
        </p>
      )}
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#999' }}>
        This demonstrates Next.js 16 Server Actions with cache revalidation
      </p>
    </div>
  )
}

