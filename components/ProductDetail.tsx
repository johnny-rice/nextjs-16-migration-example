import { notFound } from 'next/navigation'
import { getCachedProduct, type Product } from '@/lib/products'
import Link from 'next/link'

type ProductDetailProps = {
  id: string
}

// Next.js 16: Extract data fetching into a component that can be wrapped in Suspense
// This allows cache components to work properly with static generation
export async function ProductDetail({ id }: ProductDetailProps) {
  const product = await getCachedProduct(id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="container">
      <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#2563eb' }}>
        ← Back to Products
      </Link>
      
      <div style={{ maxWidth: '600px' }}>
        <h1>{product.name}</h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1rem' }}>
          {product.description}
        </p>
        <div className="product-price">${product.price}</div>
      </div>
    </div>
  )
}

