# Next.js 15 → 16 Migration Example

This project demonstrates a Next.js 15 application ready for migration to Next.js 16, based on the migration webinar notes.

## Current Setup (Next.js 15)

This project includes examples of features that need to be migrated:

### Breaking Changes to Address

1. **middleware.ts → proxy.ts**
   - Current: `middleware.ts` exports a `middleware` function
   - Next.js 16: Rename to `proxy.ts` and export a `proxy` value

2. **Async Page Props**
   - Current: `params` and `searchParams` can be accessed directly (though we've already made them async for compatibility)
   - Next.js 16: `params` and `searchParams` MUST be awaited

3. **Turbopack**
   - Current: Optional (can be enabled with `--turbo` flag)
   - Next.js 16: Enabled by default

### Features to Migrate

1. **Cache Components**
   - Current: Using default Next.js caching behavior
   - Next.js 16: Can use cache components for granular static/dynamic rendering control
   - See `/app/page.tsx` and `/lib/products.ts` for examples that can benefit from cache components

2. **React Compiler Support**
   - Can be enabled in Next.js 16 for automatic optimization

3. **Improved Logging**
   - Better development and build insights in Next.js 16

## Project Structure

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
│   ├── page.tsx            # Home page with product listing
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx    # Product detail page (demonstrates async params)
│   └── globals.css         # Global styles
├── lib/
│   └── products.ts         # Mock product data and API functions
├── middleware.ts           # NOTE: To be renamed to proxy.ts in Next.js 16
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies (Next.js 15)
├── vitest.config.ts        # Vitest configuration
├── vitest.setup.ts         # Test setup file
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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
- Search params support
- `notFound()` behavior for invalid products
- Back navigation link

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

## Migration Checklist

When migrating to Next.js 16:

- [ ] Update `next` to version 16 in `package.json`
- [ ] Rename `middleware.ts` to `proxy.ts` and update exports
- [ ] Ensure all `params` and `searchParams` are awaited
- [ ] Enable cache components in `next.config.ts`
- [ ] Refactor data fetching to use cache components where beneficial
- [ ] Update minimum Node.js version to 20.9+
- [ ] Update TypeScript to 5.1+
- [ ] Test with Turbopack (now default)

## Key Migration Points

### 1. Middleware → Proxy

**Before (Next.js 15):**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // ...
}
```

**After (Next.js 16):**
```typescript
// proxy.ts
export const proxy = async (request: NextRequest) => {
  // ...
}
```

### 2. Async Params

**Before (Next.js 15):**
```typescript
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  // ...
}
```

**After (Next.js 16):**
```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

### 3. Cache Components

Cache components allow for simultaneous static and dynamic rendering. See the Next.js 16 documentation for details on implementing cache components.

## Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- Migration webinar notes in `plan.md`

## Credits

Created by [@johnny-rice](https://github.com/johnny-rice)

This project demonstrates Next.js 15 to 16 migration patterns based on Vercel's migration webinar.

