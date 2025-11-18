# Next.js 15 to 16 Migration Example

This project demonstrates a Next.js 15 application and its migration to Next.js 16, based on Vercel's migration webinar.

## Branches Overview

This repository contains two branches demonstrating the before and after states of a Next.js 15 to 16 migration:

- **`main`**: Next.js 15 baseline code (before migration)
- **`nextjs-16-migration`**: Migrated Next.js 16 code (after migration)

---

## Branch: `main` (Next.js 15)

### Current State

**Dependencies:**
- Next.js: `^15.0.0`
- TypeScript: `^5.0.0`
- React: `^18.3.1`

**Project Structure:**
```
├── __tests__/              # Test suite
│   ├── lib/
│   │   └── products.test.ts
│   ├── app/
│   │   ├── page.test.tsx
│   │   └── products/[id]/page.test.tsx
│   ├── middleware.test.ts
│   └── migration-compatibility.test.ts
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with product listing (sequential data fetching)
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx    # Product detail page (async params ready)
│   └── globals.css         # Global styles
├── lib/
│   └── products.ts         # Mock product data and API functions
├── middleware.ts           # NOTE: Needs to be renamed to proxy.ts
├── next.config.ts          # Basic Next.js configuration
├── package.json            # Next.js 15 dependencies
├── vitest.config.ts        # Vitest configuration
├── vitest.setup.ts         # Test setup file
└── tsconfig.json           # TypeScript configuration
```

**Key Features:**
- Uses `middleware.ts` with `middleware` function export
- Sequential data fetching in pages
- Default Next.js caching behavior
- No cache components implementation

---

## Branch: `nextjs-16-migration` (Next.js 16)

### Migrated State

**Dependencies:**
- Next.js: `^16.0.0`
- TypeScript: `^5.1.0`
- React: `^18.3.1`

**Project Structure:**
```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page using cache components with Suspense
│   ├── actions.ts          # Server Actions for cache revalidation
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts    # API route for cache tag revalidation
│   ├── products/
│   │   └── [id]/
│   │       ├── page.tsx    # Product detail page with generateMetadata
│   │       └── error.tsx   # Enhanced error boundary with recovery
│   └── globals.css         # Global styles
├── components/             # Cache component examples
│   ├── ProductList.tsx    # Cached product list component (static, "use cache")
│   ├── ProductDetail.tsx  # Cached product detail component
│   ├── ProductStats.tsx   # Advanced cache pattern - multiple boundaries
│   ├── Footer.tsx         # Dynamic footer component
│   └── RefreshButton.tsx  # Client component using Server Actions
├── lib/
│   └── products.ts         # Cache tags with unstable_cache and ISR
├── proxy.ts                # Migrated from middleware.ts
├── next.config.ts          # Cache components & React Compiler enabled
├── package.json            # Next.js 16 dependencies
└── tsconfig.json           # TypeScript configuration
```

**Key Features:**
- Uses `proxy.ts` with `proxy` constant export
- Cache components enabled in `next.config.ts`
- **React Compiler enabled** - automatic memoization without manual code
- **Cache tags with ISR** - tag-based cache invalidation with `unstable_cache`
- **Explicit "use cache" directive** - visible caching behavior in components
- **Server Actions for cache revalidation** - UI-triggered cache invalidation
- Suspense boundaries with cache components
- Granular static/dynamic rendering control
- All async params properly awaited
- Turbopack enabled by default (Next.js 16)

**Migration Completed:**
- Updated Next.js to v16.0.0
- Renamed `middleware.ts` to `proxy.ts` and updated exports
- Enabled cache components in `next.config.ts`
- **Enabled React Compiler** - automatic component optimization
- **Implemented cache tags** - using `unstable_cache` with ISR revalidation
- **Added "use cache" directive** - explicit caching in components
- **Created cache revalidation API** - `/api/revalidate` route with `revalidateTag`
- **Added Server Actions** - `app/actions.ts` for cache invalidation
- **Created RefreshButton component** - demonstrates Server Actions in UI
- Refactored pages to use cache components with Suspense boundaries
- Created `ProductList` and `Footer` components demonstrating cache components
- Updated `lib/products.ts` with cached function exports using cache tags
- Updated TypeScript to 5.1+
- All async params properly awaited

## Getting Started

### Viewing the Next.js 15 Baseline

```bash
git checkout main
pnpm install
pnpm dev
```

### Viewing the Next.js 16 Migration

```bash
git checkout nextjs-16-migration
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Comparing Branches

To see all the changes made during migration:

```bash
git diff main..nextjs-16-migration
```

Or view specific files:

```bash
git diff main..nextjs-16-migration -- middleware.ts proxy.ts
git diff main..nextjs-16-migration -- app/page.tsx
git diff main..nextjs-16-migration -- next.config.ts
```

## Testing

This project includes a comprehensive test suite using [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react). The tests are designed to work on both Next.js 15 (main branch) and Next.js 16 (migration branch), ensuring migration compatibility.

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Coverage

The test suite includes **37 tests** across **5 test files**, covering:

#### 1. Product Data Functions (`__tests__/lib/products.test.ts`)
- `getProducts()` - Returns all products with correct structure
- `getProduct()` - Handles valid/invalid IDs correctly
- Data integrity - Unique IDs, positive prices, non-empty fields
- Consistent results across multiple calls

#### 2. Middleware/Proxy (`__tests__/middleware.test.ts`)
- Middleware function export (Next.js 15)
- Header setting (`x-middleware-version`)
- API route detection (`x-api-route` header)
- Path-based request handling
- Compatible with proxy.ts (Next.js 16)

#### 3. Home Page (`__tests__/app/page.test.tsx`)
- Page title and heading rendering
- Product listing display
- Product links and navigation
- Footer with timestamp
- Async component behavior (Next.js 15/16 compatible)

#### 4. Product Detail Page (`__tests__/app/products/[id]/page.test.tsx`)
- Product detail rendering
- Async params handling (Next.js 16 requirement)
- Suspense boundaries with cache components
- `notFound()` behavior for invalid products
- Back navigation link
- NOTE: Search params removed to allow static generation with cache components

#### 5. Migration Compatibility (`__tests__/migration-compatibility.test.ts`)
- Async params pattern validation (Next.js 16 requirement)
- Data fetching consistency
- Component rendering compatibility
- Caching behavior validation

### Test Structure

```
__tests__/
├── lib/
│   └── products.test.ts              # Product data function tests
├── middleware.test.ts                 # Middleware/proxy tests
├── app/
│   ├── page.test.tsx                 # Home page component tests
│   └── products/
│       └── [id]/
│           └── page.test.tsx         # Product detail page tests
└── migration-compatibility.test.ts    # Migration compatibility tests
```

### Why These Tests Matter

These tests ensure that:
- **Functionality is preserved** during migration from Next.js 15 to 16
- **Breaking changes are caught early** (async params, middleware to proxy)
- **Data integrity is maintained** across both versions
- **Components render correctly** with Next.js 16 patterns
- **Migration compatibility** is validated before and after migration

### Running Tests Before Migration

Before migrating to Next.js 16, ensure all tests pass:

```bash
pnpm test
```

After migration, run the same tests to verify everything still works:

```bash
pnpm test
```

All tests should pass on both branches, confirming a successful migration.

## Key Migration Changes

### 1. Middleware to Proxy

**`main` branch (Next.js 15):**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-middleware-version', '15')
  return response
}
```

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// proxy.ts
export const proxy = async (request: NextRequest) => {
  const response = NextResponse.next()
  response.headers.set('x-proxy-version', '16')
  return response
}
```

**Changes:**
- File renamed: `middleware.ts` to `proxy.ts`
- Export changed: `function middleware()` to `const proxy = async ()`
- Function is now async by default

### 2. Async Params

**`main` branch (Next.js 15):**
```typescript
// app/products/[id]/page.tsx
// Params are typed as Promise but can be accessed directly
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params  // Already using await for compatibility
  // ...
}
```

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// app/products/[id]/page.tsx
// Params MUST be async and awaited in Next.js 16
// Note: searchParams removed to allow static generation with cache components
type Props = {
  params: Promise<{ id: string }>
  // searchParams removed - makes pages dynamic, conflicts with generateStaticParams
}

import { Suspense } from 'react'
import { ProductDetail } from '@/components/ProductDetail'

export default async function ProductPage({ params }: Props) {
  const { id } = await params  // Required in Next.js 16
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetail id={id} />
    </Suspense>
  )
}
```

**Changes:**
- `params` must be awaited (required in Next.js 16)
- `searchParams` removed to enable static generation with cache components
- Data fetching extracted to `ProductDetail` component wrapped in Suspense
- Follows cache components pattern for optimal performance

### 3. Cache Components

**`main` branch (Next.js 15):**
```typescript
// app/page.tsx
import { getProducts } from '@/lib/products'

export default async function Home() {
  const products = await getProducts()  // Sequential data fetching
  
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
            // Product cards...
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
```

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// app/page.tsx
import { Suspense } from 'react'
import { ProductList } from '@/components/ProductList'
import { Footer } from '@/components/Footer'

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
          <ProductList /> {/* Static, cached */}
        </Suspense>
      </main>
      <Footer /> {/* Dynamic */}
    </div>
  )
}

// components/ProductList.tsx
import { getCachedProducts } from '@/lib/products'

export async function ProductList() {
  const products = await getCachedProducts()  // Uses cache()
  // ...
}

// lib/products.ts
import { cache } from 'react'

export async function getProducts(): Promise<Product[]> {
  // Original function
}

export const getCachedProducts = cache(getProducts)  // Cached version
```

**Changes:**
- Enabled `cacheComponents: true` in `next.config.ts`
- Created separate components for cached (static) and dynamic content
- Used Suspense boundaries to enable simultaneous static/dynamic rendering
- Applied `cache()` from React for request-level memoization
- Page component is no longer async (delegates to child components)

**Benefits:**
- Static product list can be cached and served from CDN
- Dynamic footer renders fresh timestamps
- Better performance through granular caching control
- Improved developer experience with clearer separation of concerns

### 4. React Compiler

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true, // Automatic memoization
}
```

**What it does:**
- Automatically memoizes components to reduce unnecessary re-renders
- No manual `useMemo` or `useCallback` needed
- Stable in Next.js 16, works transparently
- Requires `babel-plugin-react-compiler` package (installed)

**Benefits:**
- Improved performance without code changes
- Reduced cognitive load - no need to manually optimize
- Better default performance out of the box

### 5. Cache Tags & ISR Integration

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// lib/products.ts
import { unstable_cache } from 'next/cache'

export const getCachedProducts = unstable_cache(
  async () => _getProducts(),
  ['products-list'],
  {
    tags: ['products-list'],
    revalidate: 3600, // 1 hour ISR
  }
)

// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, tag })
}
```

**What it does:**
- Tag-based cache invalidation with `revalidateTag()`
- Integration with Incremental Static Regeneration (ISR)
- Precise control over which cached data to invalidate

**Benefits:**
- Update specific data without redeploying
- Webhook-friendly cache invalidation
- Better cache management for dynamic content

### 6. Server Actions for Cache Revalidation

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateProducts() {
  revalidateTag('products-list')
  return { success: true, timestamp: new Date().toISOString() }
}

// components/RefreshButton.tsx
'use client'

import { revalidateProducts } from '@/app/actions'

export function RefreshButton() {
  return (
    <form action={revalidateProducts}>
      <button type="submit">Refresh Products Cache</button>
    </form>
  )
}
```

**What it does:**
- Server Actions can trigger cache revalidation
- Direct integration with UI components
- Type-safe server-side operations

**Benefits:**
- User-triggered cache updates
- Admin interfaces for cache management
- Real-world pattern for content management

### 7. Explicit "use cache" Directive

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// components/ProductList.tsx
"use cache"

export async function ProductList() {
  const products = await getCachedProducts()
  // Component logic
}
```

**What it does:**
- Makes caching behavior explicit in code
- Clear indication of static rendering intent
- Works alongside cache components

**Benefits:**
- Better code readability
- Explicit caching control
- Easier to understand component behavior

### 8. Dynamic Metadata API

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getCachedProduct(id)
  
  return {
    title: `${product.name} - E-Commerce Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: product.name,
      description: product.description,
    },
  }
}
```

**What it does:**
- Dynamic metadata generation with async data
- Enhanced SEO features per product page
- Social media optimization (OpenGraph, Twitter Cards)

**Benefits:**
- Better search engine optimization
- Improved social sharing previews
- Per-page metadata customization

### 9. Advanced Cache Component Patterns

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// components/ProductStats.tsx
"use cache"

export async function ProductStats() {
  const products = await getCachedProducts()
  // Calculate statistics from cached data
  // ...
}

// app/page.tsx - Multiple cache boundaries
<Suspense fallback={<div>Loading products...</div>}>
  <ProductList />
</Suspense>
<Suspense fallback={<div>Loading statistics...</div>}>
  <ProductStats />
</Suspense>
```

**What it does:**
- Multiple cache boundaries on the same page
- Independent Suspense boundaries
- Shared cached data source (both use `getCachedProducts`)

**Benefits:**
- Demonstrates complex cache component usage
- Shows how multiple components can share cached data
- Independent loading states per cache boundary

### 10. Enhanced Error Handling

**`nextjs-16-migration` branch (Next.js 16):**
```typescript
// app/products/[id]/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      {error.digest && <p>Error ID: {error.digest}</p>}
      <button onClick={reset}>Try again</button>
      <Link href="/">Back to Products</Link>
    </div>
  )
}
```

**What it does:**
- Enhanced error boundaries with recovery patterns
- Error logging and reporting
- User-friendly error messages with recovery options

**Benefits:**
- Better user experience when errors occur
- Error recovery without full page reload
- Error tracking with digest IDs

## New Features Summary

This branch now demonstrates:

1. **Cache Components** - Simultaneous static/dynamic rendering
2. **React Compiler** - Automatic component optimization
3. **Cache Tags** - Tag-based cache invalidation with ISR
4. **Server Actions** - UI-triggered cache revalidation
5. **"use cache" Directive** - Explicit caching control
6. **Proxy Migration** - Middleware to proxy.ts
7. **Async Params** - Required await for params
8. **Dynamic Metadata** - SEO-optimized per-page metadata
9. **Advanced Cache Patterns** - Multiple cache boundaries
10. **Error Handling** - Enhanced error boundaries with recovery

## Testing Cache Revalidation

You can test the cache revalidation features:

**Via API Route:**
```bash
# Revalidate products list
curl -X POST http://localhost:3000/api/revalidate?tag=products-list

# Revalidate specific product
curl -X POST http://localhost:3000/api/revalidate?tag=product-1
```

**Via UI:**
- Click the "Refresh Products Cache" button on the home page
- This uses Server Actions to trigger cache revalidation

## Testing Error Handling

To test the error boundary, you can:

1. Navigate to a non-existent product: `/products/999`
2. The error boundary will catch the error and display a recovery UI
3. Use the "Try again" button to retry or "Back to Products" to navigate away

## Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- Migration webinar notes in `plan.md`
- [Next.js Cache Tags Documentation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Error Handling](https://nextjs.org/docs/app/api-reference/file-conventions/error)

## Credits

Created by [@johnny-rice](https://github.com/johnny-rice)

This project demonstrates Next.js 15 to 16 migration patterns based on Vercel's migration webinar.

