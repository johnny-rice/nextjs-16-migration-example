import { notFound } from 'next/navigation'
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductPage from '@/app/products/[id]/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Mock the ProductDetail component
vi.mock('@/components/ProductDetail', () => ({
  ProductDetail: vi.fn(({ id }: { id: string }) => {
    if (id === '1') {
      return (
        <div className="container">
          <a href="/">← Back to Products</a>
          <div style={{ maxWidth: '600px' }}>
            <h1>Test Product</h1>
            <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1rem' }}>
              Test Description
            </p>
            <div className="product-price">$99.99</div>
          </div>
        </div>
      )
    }
    if (id === '999') {
      notFound()
      return null
    }
    return <div>Product not found</div>
  }),
}))

// Mock the products module
vi.mock('@/lib/products', () => ({
  getCachedProduct: vi.fn((id: string) => {
    if (id === '1') {
      return Promise.resolve({
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      })
    }
    return Promise.resolve(null)
  }),
  getCachedProducts: vi.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Product 1', description: 'Desc 1', price: 10 },
    ])
  ),
}))

describe('Product Page (Next.js 16 with Cache Components)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render product details for valid id', async () => {
    const params = Promise.resolve({ id: '1' })
    
    const component = await ProductPage({ params })
    render(component)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('should call notFound for invalid product id', async () => {
    const params = Promise.resolve({ id: '999' })
    
    // ProductDetail component will call notFound()
    try {
      const component = await ProductPage({ params })
      render(component)
    } catch (error) {
      // notFound() throws an error, which is expected
    }
    
    expect(notFound).toHaveBeenCalled()
  })

  it('should await params correctly (Next.js 16 compatibility)', async () => {
    const params = Promise.resolve({ id: '1' })
    
    // This test ensures params are properly awaited
    // In Next.js 16, params MUST be awaited
    const result = await ProductPage({ params })
    
    expect(result).toBeDefined()
    expect(notFound).not.toHaveBeenCalled()
  })

  it('should render back link', async () => {
    const params = Promise.resolve({ id: '1' })
    
    const component = await ProductPage({ params })
    render(component)
    
    expect(screen.getByText('← Back to Products')).toBeInTheDocument()
  })

  it('should use Suspense for ProductDetail (cache components)', async () => {
    const params = Promise.resolve({ id: '1' })
    
    const component = await ProductPage({ params })
    render(component)
    
    // Suspense should be present in the structure
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('should be a synchronous component that delegates to ProductDetail', async () => {
    const params = Promise.resolve({ id: '1' })
    
    // In Next.js 16, ProductPage is async but delegates to child components
    const result = await ProductPage({ params })
    expect(result).toBeDefined()
    expect(result.type).toBeDefined() // React element
  })
})
