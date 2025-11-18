import { Suspense } from 'react'
import { ProductList } from '@/components/ProductList'
import { Footer } from '@/components/Footer'

// Next.js 16: Using cache components with Suspense boundaries
// This allows for simultaneous static and dynamic rendering
// The ProductList component is cached (static), while Footer is dynamic
export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>E-Commerce Store</h1>
        <p>Next.js 16 - Migrated with Cache Components</p>
      </header>

      <main>
        <h2>Featured Products</h2>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductList />
        </Suspense>
      </main>

      <Suspense fallback={<footer className="footer"><p>Loading...</p></footer>}>
        <Footer />
      </Suspense>
    </div>
  )
}

