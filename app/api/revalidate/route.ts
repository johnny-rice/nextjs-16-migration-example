import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Next.js 16: API route for cache revalidation using cache tags
// This demonstrates tag-based cache invalidation with ISR
// Usage: POST /api/revalidate?tag=products-list
//        POST /api/revalidate?tag=product-1
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tag = searchParams.get('tag')

    if (!tag) {
      return NextResponse.json(
        { error: 'Missing tag parameter' },
        { status: 400 }
      )
    }

    // Revalidate the cache for the specified tag
    // In Next.js 16, revalidateTag requires a cacheLife profile as second parameter
    // 'max' = 24 hours, 'auto' = automatic, or custom profiles from next.config
    revalidateTag(tag, 'max')

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating cache' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing (useful for webhook testing)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tag = searchParams.get('tag')

  if (!tag) {
    return NextResponse.json(
      { 
        message: 'Cache revalidation API',
        usage: 'POST /api/revalidate?tag=products-list',
        availableTags: ['products-list', 'product-{id}'],
      },
      { status: 200 }
    )
  }

  try {
    // In Next.js 16, revalidateTag requires a cacheLife profile as second parameter
    // 'max' = 24 hours, 'auto' = automatic, or custom profiles from next.config
    revalidateTag(tag, 'max')
    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating cache' },
      { status: 500 }
    )
  }
}

