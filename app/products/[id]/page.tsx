import { Suspense } from 'react'
import { getCachedProducts, type Product } from '@/lib/products'
import { ProductDetail } from '@/components/ProductDetail'

// Next.js 16: params MUST be async and require await
type Props = {
  params: Promise<{ id: string }>
  // Note: searchParams removed to allow static generation with cache components
  // In Next.js 16 with cache components, searchParams makes pages dynamic
  // which conflicts with generateStaticParams
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const products = await getCachedProducts()
  return products.map((product: Product) => ({
    id: product.id.toString(),
  }))
}

// Next.js 16: Page component is no longer async - delegates to child components
// Data fetching happens in ProductDetail component wrapped in Suspense
export default async function ProductPage({ params }: Props) {
  // Next.js 16: params MUST be awaited
  const { id } = await params

  return (
    <Suspense fallback={
      <div className="container">
        <div style={{ padding: '2rem' }}>Loading product...</div>
      </div>
    }>
      <ProductDetail id={id} />
    </Suspense>
  )
}

