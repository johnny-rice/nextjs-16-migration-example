import { notFound } from 'next/navigation'
import { vi } from 'vitest'
import ProductPage from '@/app/products/[id]/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Mock the products module
vi.mock('@/lib/products', () => ({
  getProduct: vi.fn((id: string) => {
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
  getProducts: vi.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Product 1', description: 'Desc 1', price: 10 },
    ])
  ),
}))

describe('Product Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render product details for valid id', async () => {
    const params = Promise.resolve({ id: '1' })
    const searchParams = Promise.resolve({})
    
    const component = await ProductPage({ params, searchParams })
    const { container } = require('@testing-library/react').render(component)
    
    expect(container.textContent).toContain('Test Product')
    expect(container.textContent).toContain('Test Description')
    expect(container.textContent).toContain('$99.99')
  })

  it('should call notFound for invalid product id', async () => {
    const params = Promise.resolve({ id: '999' })
    const searchParams = Promise.resolve({})
    
    // ProductPage will call notFound() which throws, so we need to catch it
    try {
      await ProductPage({ params, searchParams })
    } catch (error) {
      // notFound() throws an error, which is expected
    }
    
    expect(notFound).toHaveBeenCalled()
  })

  it('should handle search params', async () => {
    const params = Promise.resolve({ id: '1' })
    const searchParams = Promise.resolve({ review: 'great' })
    
    const component = await ProductPage({ params, searchParams })
    const { container } = require('@testing-library/react').render(component)
    
    expect(container.textContent).toContain('great')
  })

  it('should await params correctly (Next.js 16 compatibility)', async () => {
    const params = Promise.resolve({ id: '1' })
    const searchParams = Promise.resolve({})
    
    // This test ensures params are properly awaited
    // In Next.js 16, params MUST be awaited
    const result = await ProductPage({ params, searchParams })
    
    expect(result).toBeDefined()
    expect(notFound).not.toHaveBeenCalled()
  })

  it('should render back link', async () => {
    const params = Promise.resolve({ id: '1' })
    const searchParams = Promise.resolve({})
    
    const component = await ProductPage({ params, searchParams })
    const { container } = require('@testing-library/react').render(component)
    
    expect(container.textContent).toContain('Back to Products')
  })
})

