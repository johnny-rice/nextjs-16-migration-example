'use server'

import { revalidateTag } from 'next/cache'

// Next.js 16: Server Actions for cache invalidation
// These can be called directly from client components or forms
// Demonstrates the new caching APIs in Next.js 16

export async function revalidateProducts() {
  // In Next.js 16, revalidateTag requires a cacheLife profile as second parameter
  // 'max' = 24 hours, 'auto' = automatic, or custom profiles from next.config
  revalidateTag('products-list', 'max')
  
  return {
    success: true,
    message: 'Products cache revalidated',
    timestamp: new Date().toISOString(),
  }
}

export async function revalidateProduct(id: string) {
  // Revalidate both the specific product and the products list
  // revalidateTag requires cacheLife profile as second parameter in Next.js 16
  revalidateTag(`product-${id}`, 'max')
  revalidateTag('products-list', 'max')
  
  return {
    success: true,
    message: `Product ${id} cache revalidated`,
    timestamp: new Date().toISOString(),
  }
}

