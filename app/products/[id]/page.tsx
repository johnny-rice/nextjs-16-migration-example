import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/lib/products'
import Link from 'next/link'

// In Next.js 15, params can be synchronous
// In Next.js 16, params MUST be async and require await
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

export default async function ProductPage({ params, searchParams }: Props) {
  // In Next.js 15, params can be accessed directly
  // In Next.js 16, this needs to be: const { id } = await params
  const { id } = await params
  const search = await searchParams
  
  const product = await getProduct(id)
  
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
        
        {search.review && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
            <p>Review parameter: {search.review}</p>
          </div>
        )}
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Page rendered at: {new Date().toISOString()}
          </p>
        </div>
      </div>
    </div>
  )
}

