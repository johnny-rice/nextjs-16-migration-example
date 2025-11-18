import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getCachedProducts, getCachedProduct, type Product } from '@/lib/products'
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

// Next.js 16: Dynamic metadata generation with async data
// This demonstrates enhanced SEO features with cache components
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getCachedProduct(id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
  
  return {
    title: `${product.name} - E-Commerce Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      // In a real app, you would have product images
      // images: [`/products/${id}/image.jpg`],
    },
    twitter: {
      card: 'summary',
      title: product.name,
      description: product.description,
    },
  }
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

