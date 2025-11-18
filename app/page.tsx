import Link from 'next/link'
import { getProducts } from '@/lib/products'

// This page demonstrates current Next.js 15 rendering approach
// In Next.js 16, we can migrate to cache components for better performance
export default async function Home() {
  // Sequential data fetching - can be optimized with cache components
  const products = await getProducts()
  
  return (
    <div className="container">
      <header className="header">
        <h1>E-Commerce Store</h1>
        <p>Next.js 15 Example - Ready for Migration to Next.js 16</p>
      </header>

      <main>
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">${product.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>Rendered at: {new Date().toISOString()}</p>
        <p>This timestamp will be optimized with cache components in Next.js 16</p>
      </footer>
    </div>
  )
}

