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

// Mock the products module
vi.mock('@/lib/products', () => ({
  getProducts: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      },
      {
        id: 2,
        name: 'Another Product',
        description: 'Another Description',
        price: 149.99,
      },
    ])
  ),
}))

describe('Home Page', () => {
  it('should render the page title', async () => {
    const component = await Home()
    render(component)
    
    expect(screen.getByText('E-Commerce Store')).toBeInTheDocument()
  })

  it('should render featured products heading', async () => {
    const component = await Home()
    render(component)
    
    expect(screen.getByText('Featured Products')).toBeInTheDocument()
  })

  it('should render products', async () => {
    const component = await Home()
    render(component)
    
    // Wait for products to load
    expect(await screen.findByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('should render footer with timestamp', async () => {
    const component = await Home()
    render(component)
    
    expect(screen.getByText(/Rendered at:/)).toBeInTheDocument()
  })

  it('should have product links', async () => {
    const component = await Home()
    render(component)
    
    await screen.findByText('Test Product')
    const links = screen.getAllByRole('link')
    const productLink = links.find(link => link.getAttribute('href') === '/products/1')
    expect(productLink).toBeInTheDocument()
  })

  it('should render all products', async () => {
    const component = await Home()
    render(component)
    
    expect(await screen.findByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Another Product')).toBeInTheDocument()
  })

  it('should be an async component (Next.js 15/16 compatible)', async () => {
    // Test that Home is an async function
    const homeComponent = Home()
    expect(homeComponent).toBeInstanceOf(Promise)
    
    const component = await homeComponent
    expect(component).toBeDefined()
  })
})

