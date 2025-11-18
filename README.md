# Next.js 15 → 16 Migration Example

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
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx    # Product detail page (params properly awaited)
│   └── globals.css         # Global styles
├── components/             # New: Cache component examples
│   ├── ProductList.tsx    # Cached product list component (static)
│   └── Footer.tsx         # Dynamic footer component
├── lib/
│   └── products.ts         # Updated with cache() function exports
├── proxy.ts                # Migrated from middleware.ts
├── next.config.ts          # Cache components enabled
├── package.json            # Next.js 16 dependencies
└── tsconfig.json           # TypeScript configuration
```

**Key Features:**
- Uses `proxy.ts` with `proxy` constant export
- Cache components enabled in `next.config.ts`
- Suspense boundaries with cache components
- Granular static/dynamic rendering control
- All async params properly awaited
- Turbopack enabled by default (Next.js 16)

**Migration Completed:**
- Updated Next.js to v16.0.0
- Renamed `middleware.ts` to `proxy.ts` and updated exports
- Enabled cache components in `next.config.ts`
- Refactored pages to use cache components with Suspense boundaries
- Created `ProductList` and `Footer` components demonstrating cache components
- Updated `lib/products.ts` with cached function exports
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
- **Breaking changes are caught early** (async params, middleware → proxy)
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

### 1. Middleware → Proxy

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
- File renamed: `middleware.ts` → `proxy.ts`
- Export changed: `function middleware()` → `const proxy = async ()`
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

## Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- Migration webinar notes in `plan.md`

