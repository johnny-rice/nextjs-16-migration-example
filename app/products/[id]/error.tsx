'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Next.js 16: Enhanced error boundary for product pages
// Demonstrates error handling improvements with recovery patterns
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to an error reporting service in production
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
      }}>
        <h2 style={{ color: '#dc2626', marginTop: 0 }}>
          Something went wrong!
        </h2>
        <p style={{ color: '#991b1b', marginBottom: '1.5rem' }}>
          {error.message || 'An unexpected error occurred while loading the product.'}
        </p>
        
        {error.digest && (
          <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '1rem' }}>
            Error ID: {error.digest}
          </p>
        )}
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Try again
          </button>
          
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'inline-block',
            }}
          >
            Back to Products
          </Link>
        </div>
        
        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: '#999',
          fontStyle: 'italic',
        }}>
          This error boundary demonstrates Next.js 16 error handling with recovery options.
        </p>
      </div>
    </div>
  )
}

