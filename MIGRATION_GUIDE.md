# Next.js 15 → 16 Migration Guide

This guide provides step-by-step instructions for migrating this repository from Next.js 15 to Next.js 16, including the implementation of cache components.

## Prerequisites

- Node.js 20.9+ (required for Next.js 16)
- TypeScript 5.1+ (required for Next.js 16)
- Understanding of Next.js App Router and React Server Components

## Overview

This migration involves:
1. Updating dependencies
2. Renaming middleware to proxy
3. Enabling cache components
4. Refactoring pages to use Suspense boundaries
5. Extracting data fetching into separate components
6. Updating TypeScript configuration
7. Updating tests

---

## Step 1: Create Migration Branch

```bash
git checkout -b nextjs-16-migration
```

---

## Step 2: Update Dependencies

### 2.1 Update package.json

Update the following dependencies:

```json
{
  "dependencies": {
    "next": "^16.0.0",  // Changed from ^15.0.0
    "react": "^18.3.1",  // No change
    "react-dom": "^18.3.1"  // No change
  },
  "devDependencies": {
    "typescript": "^5.1.0"  // Changed from ^5.0.0
  }
}
```

### 2.2 Install Dependencies

```bash
pnpm install
```

This will update `pnpm-lock.yaml` automatically.

---

## Step 3: Update TypeScript Configuration

### 3.1 Update tsconfig.json

Make the following changes:

1. **Change jsx setting:**
   ```json
   "jsx": "react-jsx"  // Changed from "preserve"
   ```

2. **Add .next/dev/types to include:**
   ```json
   "include": [
     "next-env.d.ts",
     "**/*.ts",
     "**/*.tsx",
     ".next/types/**/*.ts",
     ".next/dev/types/**/*.ts"  // Added
   ]
   ```

**Why:** Next.js 16 requires `react-jsx` and includes additional type definitions.

---

## Step 4: Rename Middleware to Proxy

### 4.1 Rename the file

```bash
git mv middleware.ts proxy.ts
```

### 4.2 Update proxy.ts

Change the export from a function to an async constant:

**Before:**
```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-middleware-version', '15')
  return response
}
```

**After:**
```typescript
export const proxy = async (request: NextRequest) => {
  const response = NextResponse.next()
  response.headers.set('x-proxy-version', '16')
  return response
}
```

**Changes:**
- `function middleware()` → `const proxy = async ()`
- Header changed: `x-middleware-version` → `x-proxy-version`
- Function is now async by default

### 4.3 Update tests

Update `__tests__/middleware.test.ts`:

```typescript
// Change import
import { proxy } from '@/proxy'  // Changed from '@/middleware'

// Update test
const middlewareOrProxy = proxy  // Changed from middleware
```

---

## Step 5: Enable Cache Components

### 5.1 Update next.config.ts

**Before:**
```typescript
const nextConfig: NextConfig = {
  /* config options here */
}
```

**After:**
```typescript
const nextConfig: NextConfig = {
  // Enable cache components in Next.js 16
  // This allows for simultaneous static and dynamic rendering
  cacheComponents: true,
}
```

**Important:** `cacheComponents` is now a top-level config option, not under `experimental`.

---

## Step 6: Update Library Functions for Caching

### 6.1 Update lib/products.ts

Add cache wrapper functions:

```typescript
import * as React from 'react'

// cache is available in React 19+ and Next.js 16
// For test compatibility, provide a fallback
const cacheFn = (React as any).cache || ((fn: any) => fn)

// ... existing getProducts and getProduct functions ...

// Cached versions for use with cache components
export const getCachedProducts = cacheFn(getProducts)
export const getCachedProduct = cacheFn(getProduct)
```

**Why:** Cache components require cached versions of data fetching functions.

---

## Step 7: Refactor Home Page

### 7.1 Create ProductList Component

Create `components/ProductList.tsx`:

```typescript
import Link from 'next/link'
import { getCachedProducts, type Product } from '@/lib/products'

// Next.js 16: Using cache components for static rendering
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
```

### 7.2 Create Footer Component

Create `components/Footer.tsx`:

```typescript
import { headers } from 'next/headers'

// Next.js 16: Dynamic component that can be cached separately
// We access headers() first to mark this as dynamic, allowing Date() usage
export async function Footer() {
  // Access headers to mark this component as dynamic
  // This allows us to use new Date() in Next.js 16 cache components
  await headers()
  
  return (
    <footer className="footer">
      <p>Rendered at: {new Date().toISOString()}</p>
      <p>This timestamp is dynamically rendered using cache components in Next.js 16</p>
    </footer>
  )
}
```

**Why:** Dynamic components that use `new Date()` must access uncached data (like `headers()`) first in Next.js 16.

### 7.3 Update app/page.tsx

**Before:**
```typescript
import Link from 'next/link'
import { getProducts } from '@/lib/products'

export default async function Home() {
  const products = await getProducts()
  
  return (
    <div className="container">
      {/* ... inline product rendering ... */}
      <footer className="footer">
        <p>Rendered at: {new Date().toISOString()}</p>
      </footer>
    </div>
  )
}
```

**After:**
```typescript
import { Suspense } from 'react'
import { ProductList } from '@/components/ProductList'
import { Footer } from '@/components/Footer'

// Next.js 16: Using cache components with Suspense boundaries
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
```

**Changes:**
- Page component is no longer async (delegates to children)
- Product list wrapped in Suspense (static/cached)
- Footer wrapped in Suspense (dynamic)
- Data fetching moved to child components

---

## Step 8: Refactor Product Detail Page

### 8.1 Create ProductDetail Component

Create `components/ProductDetail.tsx`:

```typescript
import { notFound } from 'next/navigation'
import { getCachedProduct } from '@/lib/products'
import Link from 'next/link'

type ProductDetailProps = {
  id: string
}

// Next.js 16: Extract data fetching into a component that can be wrapped in Suspense
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
```

### 8.2 Update app/products/[id]/page.tsx

**Before:**
```typescript
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const search = await searchParams
  const product = await getProduct(id)
  // ... render with search params support
}
```

**After:**
```typescript
import { Suspense } from 'react'
import { getCachedProducts, type Product } from '@/lib/products'
import { ProductDetail } from '@/components/ProductDetail'

type Props = {
  params: Promise<{ id: string }>
  // Note: searchParams removed to allow static generation with cache components
}

export async function generateStaticParams() {
  const products = await getCachedProducts()
  return products.map((product: Product) => ({
    id: product.id.toString(),
  }))
}

export default async function ProductPage({ params }: Props) {
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
```

**Important Changes:**
- `searchParams` removed (conflicts with `generateStaticParams` when cache components enabled)
- Data fetching extracted to `ProductDetail` component
- Wrapped in Suspense boundary
- Uses `getCachedProducts()` in `generateStaticParams`

**Why remove searchParams:** In Next.js 16 with cache components, `searchParams` makes pages dynamic, which conflicts with `generateStaticParams`. If you need search params, consider making the page fully dynamic or handling them differently.

---

## Step 9: Update Tests

### 9.1 Update Home Page Tests

Update `__tests__/app/page.test.tsx`:

- Mock `ProductList` and `Footer` components instead of `getProducts`
- Update tests to work with Suspense structure
- Remove async component tests (page is now sync)

### 9.2 Update Product Detail Page Tests

Update `__tests__/app/products/[id]/page.test.tsx`:

- Remove `searchParams` from test props
- Mock `ProductDetail` component
- Update tests for Suspense structure
- Remove search params tests

### 9.3 Update Migration Compatibility Tests

Update `__tests__/migration-compatibility.test.ts`:

- Document that `searchParams` was removed for cache components compatibility
- Add test explaining why `searchParams` was removed

### 9.4 Run Tests

```bash
pnpm test
```

All tests should pass (expect 41 tests total).

---

## Step 10: Verify Build

### 10.1 Build the Application

```bash
pnpm build
```

**Expected output:**
- Compiled successfully
- Generating static pages
- Routes should show "Partial Prerender" for pages using cache components

### 10.2 Check for Errors

Common issues to watch for:

1. **"Uncached data was accessed outside of <Suspense>"**
   - Solution: Wrap data-fetching components in Suspense boundaries

2. **"Route segment config 'dynamic' is not compatible with cacheComponents"**
   - Solution: Remove `export const dynamic` if present

3. **TypeScript errors about Product types**
   - Solution: Add type annotations: `(product: Product) =>`

4. **"cacheComponents has been moved"**
   - Solution: Use top-level `cacheComponents: true`, not `experimental.cacheComponents`

---

## Step 11: Update Documentation

### 11.1 Update README.md

Update the README to reflect:
- Next.js 16 migration completion
- Cache components usage
- New component structure
- Test updates
- Breaking changes (searchParams removal)

### 11.2 Document Migration Notes

Add notes about:
- Why `searchParams` was removed
- Cache components pattern
- Suspense boundaries requirement
- Component extraction pattern

---

## Step 12: Final Verification

### 12.1 Checklist

- [ ] All dependencies updated
- [ ] TypeScript config updated
- [ ] Middleware renamed to proxy
- [ ] Cache components enabled
- [ ] Home page refactored with Suspense
- [ ] Product detail page refactored with Suspense
- [ ] Components created (ProductList, Footer, ProductDetail)
- [ ] Library functions updated with cache wrappers
- [ ] All tests passing
- [ ] Build successful
- [ ] Documentation updated

### 12.2 Test the Application

```bash
pnpm dev
```

Visit `http://localhost:3000` and verify:
- Home page loads with products
- Footer shows dynamic timestamp
- Product detail pages load correctly
- Navigation works

---

## Key Migration Patterns

### Pattern 1: Extract Data Fetching to Components

**Before:**
```typescript
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

**After:**
```typescript
// Component
export async function DataComponent() {
  const data = await fetchCachedData()
  return <div>{data}</div>
}

// Page
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent />
    </Suspense>
  )
}
```

### Pattern 2: Dynamic Components Must Access Uncached Data First

**Before:**
```typescript
export function DynamicComponent() {
  return <p>{new Date().toISOString()}</p>
}
```

**After:**
```typescript
import { headers } from 'next/headers'

export async function DynamicComponent() {
  await headers()  // Mark as dynamic
  return <p>{new Date().toISOString()}</p>
}
```

### Pattern 3: Use Cached Versions of Data Functions

**Before:**
```typescript
export async function getData() { /* ... */ }
```

**After:**
```typescript
import { cache } from 'react'

export async function getData() { /* ... */ }
export const getCachedData = cache(getData)
```

---

## Troubleshooting

### Issue: Build fails with "Uncached data accessed outside Suspense"

**Solution:** Ensure all data-fetching components are wrapped in Suspense boundaries.

### Issue: TypeScript errors about implicit 'any' types

**Solution:** Add explicit type annotations, especially in `.map()` callbacks:
```typescript
products.map((product: Product) => ...)
```

### Issue: searchParams causes build errors

**Solution:** Remove `searchParams` from pages that use `generateStaticParams` with cache components enabled.

### Issue: Footer timestamp causes errors

**Solution:** Access `headers()` first to mark the component as dynamic:
```typescript
await headers()
return <p>{new Date().toISOString()}</p>
```

---

## Summary

This migration transforms the application from Next.js 15's sequential data fetching pattern to Next.js 16's cache components pattern, enabling:

- **Partial Prerendering:** Static and dynamic content on the same page
- **Better Performance:** Granular caching control
- **Improved Developer Experience:** Clearer separation of concerns

The key architectural change is moving from async page components with inline data fetching to synchronous page components that delegate to async child components wrapped in Suspense boundaries.

---

## References

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Cache Components Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/cache-components)
- [React Suspense Documentation](https://react.dev/reference/react/Suspense)

