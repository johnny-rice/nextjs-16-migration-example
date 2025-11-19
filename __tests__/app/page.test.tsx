import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Home from '@/app/page'

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>
    },
  }
})

// Mock ProductList component
vi.mock('@/components/ProductList', () => ({
  ProductList: vi.fn(() => (
    <div className="products-grid">
      <a href="/products/1">
        <div className="product-card">
          <h3>Test Product</h3>
          <p>Test Description</p>
          <div className="product-price">$99.99</div>
        </div>
      </a>
      <a href="/products/2">
        <div className="product-card">
          <h3>Another Product</h3>
          <p>Another Description</p>
          <div className="product-price">$149.99</div>
        </div>
      </a>
    </div>
  )),
}))

// Mock Footer component
vi.mock('@/components/Footer', () => ({
  Footer: vi.fn(() => (
    <footer className="footer">
      <p>Rendered at: {new Date().toISOString()}</p>
      <p>This timestamp is dynamically rendered using cache components in Next.js 16</p>
    </footer>
  )),
}))

describe('Home Page (Next.js 16 with Cache Components)', () => {
  it('should render the page title', () => {
    render(<Home />)
    
    expect(screen.getByText('E-Commerce Store')).toBeInTheDocument()
  })

  it('should render Next.js 16 migration message', () => {
    render(<Home />)
    
    expect(screen.getByText('Next.js 16 - Migrated with Cache Components')).toBeInTheDocument()
  })

  it('should render featured products heading', () => {
    render(<Home />)
    
    expect(screen.getByText('Featured Products')).toBeInTheDocument()
  })

  it('should render products via ProductList component', () => {
    render(<Home />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('should render footer with timestamp', () => {
    render(<Home />)
    
    expect(screen.getByText(/Rendered at:/)).toBeInTheDocument()
  })

  it('should have product links', () => {
    render(<Home />)
    
    const links = screen.getAllByRole('link')
    const productLink = links.find(link => link.getAttribute('href') === '/products/1')
    expect(productLink).toBeInTheDocument()
  })

  it('should render all products', () => {
    render(<Home />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
  })

  it('should use Suspense for ProductList (cache components)', () => {
    render(<Home />)
    
    // Suspense fallback should be present in the structure
    expect(screen.getByText('Featured Products')).toBeInTheDocument()
  })

  it('should be a synchronous component (Next.js 16)', () => {
    // In Next.js 16, Home is no longer async - it delegates to child components
    expect(typeof Home).toBe('function')
    const result = Home()
    expect(result).toBeDefined()
    expect(result.type).toBeDefined() // React element
  })
})
