// Mock product data and API functions
// Next.js 16: Using cache components with cache tags for optimized rendering

import * as React from 'react'
import { unstable_cache } from 'next/cache'

// cache is available in React 19+ and Next.js 16
// For test compatibility, provide a fallback
const cacheFn = (React as any).cache || ((fn: any) => fn)

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

// Next.js 16: Base functions without caching
async function _getProducts(): Promise<Product[]> {
  // Simulate network delay
  await delay(100)
  return products
}

async function _getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await delay(100)
  const product = products.find((p) => p.id === parseInt(id))
  return product || null
}

// Next.js 16: Using cache() for request-level memoization
// This works with cache components to enable static rendering
export async function getProducts(): Promise<Product[]> {
  return _getProducts()
}

export async function getProduct(id: string): Promise<Product | null> {
  return _getProduct(id)
}

// Next.js 16: Cached versions with cache tags for ISR
// Using unstable_cache with tags allows for precise cache invalidation
// Cache tags: 'products-list' and 'product-{id}' can be revalidated independently
export const getCachedProducts = unstable_cache(
  async () => _getProducts(),
  ['products-list'],
  {
    tags: ['products-list'],
    revalidate: 3600, // 1 hour - ISR revalidation time
  }
)

// For getCachedProduct, we create a cached function per product ID
// The key array must include the id parameter for proper caching
export async function getCachedProduct(id: string): Promise<Product | null> {
  // Create a cached function that includes the id in the cache key
  // This ensures each product is cached separately
  const cachedFn = unstable_cache(
    async () => _getProduct(id),
    ['product', id], // Include id in cache key
    {
      tags: [`product-${id}`, 'products-list'], // Dynamic tags based on id
      revalidate: 3600, // 1 hour - ISR revalidation time
    }
  )
  
  return cachedFn()
}

