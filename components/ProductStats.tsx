"use cache"

import { getCachedProducts, type Product } from '@/lib/products'

// Next.js 16: Advanced cache component pattern
// Demonstrates multiple cache boundaries on the same page
// This component uses the same cached data as ProductList but for different purposes

export async function ProductStats() {
  const products = await getCachedProducts()
  
  const totalProducts = products.length
  const averagePrice = products.reduce((sum: number, p: Product) => sum + p.price, 0) / totalProducts
  const totalValue = products.reduce((sum: number, p: Product) => sum + p.price, 0)
  const highestPrice = Math.max(...products.map((p: Product) => p.price))
  const lowestPrice = Math.min(...products.map((p: Product) => p.price))
  
  return (
    <div style={{
      marginTop: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>
        Product Statistics
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
            Total Products
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
            {totalProducts}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
            Average Price
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
            ${averagePrice.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
            Total Value
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
            ${totalValue.toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
            Price Range
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
            ${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}
          </div>
        </div>
      </div>
      <p style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: '#999',
        fontStyle: 'italic',
      }}>
        This component demonstrates multiple cache boundaries using the same cached data source.
        Both ProductList and ProductStats share the cached products data.
      </p>
    </div>
  )
}

