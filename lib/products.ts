// Mock product data and API functions
// In Next.js 16, these can be optimized with cache components

export interface Product {
  id: number
  name: string
  description: string
  price: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 299.99,
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking and notifications.',
    price: 399.99,
  },
  {
    id: 3,
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand for better posture.',
    price: 79.99,
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches.',
    price: 149.99,
  },
  {
    id: 5,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.',
    price: 59.99,
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking.',
    price: 49.99,
  },
]

// Simulate API delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// In Next.js 15, this uses default caching behavior
// In Next.js 16, we can use cache components for more granular control
export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await delay(100)
  return products
}

export async function getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await delay(100)
  const product = products.find((p) => p.id === parseInt(id))
  return product || null
}

