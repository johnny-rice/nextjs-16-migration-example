import { Suspense } from 'react'
import { ProductList } from '@/components/ProductList'
import { ProductStats } from '@/components/ProductStats'
import { Footer } from '@/components/Footer'
import { RefreshButton } from '@/components/RefreshButton'

// Next.js 16: Using cache components with Suspense boundaries
// This allows for simultaneous static and dynamic rendering
// The ProductList component is cached (static), while Footer is dynamic
// Demonstrates multiple cache boundaries on the same page
export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>E-Commerce Store</h1>
        <p>Next.js 16 - Migrated with Cache Components, React Compiler & Cache Tags</p>
      </header>

      <main>
        <h2>Featured Products</h2>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductList />
        </Suspense>
        
        {/* Next.js 16: Advanced cache component pattern - multiple boundaries */}
        {/* ProductStats uses the same cached data as ProductList but independently */}
        <Suspense fallback={<div style={{ marginTop: '2rem', padding: '1rem' }}>Loading statistics...</div>}>
          <ProductStats />
        </Suspense>
        
        {/* Next.js 16: Server Actions for cache revalidation */}
        <RefreshButton />
      </main>

      <Suspense fallback={<footer className="footer"><p>Loading...</p></footer>}>
        <Footer />
      </Suspense>
    </div>
  )
}

