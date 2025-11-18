"use cache"

import Link from 'next/link'
import { getCachedProducts, type Product } from '@/lib/products'

// Next.js 16: Using cache components for static rendering
// The explicit "use cache" directive ensures this component can be statically rendered

export async function ProductList() {
  const products = await getCachedProducts()
  
  return (
    <div className="products-grid">
      {products.map((product: Product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-price">${product.price}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

