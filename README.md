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
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with product listing
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx    # Product detail page (demonstrates async params)
│   └── globals.css         # Global styles
├── lib/
│   └── products.ts         # Mock product data and API functions
├── middleware.ts           # ⚠️ To be renamed to proxy.ts in Next.js 16
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies (Next.js 15)
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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

