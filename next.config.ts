import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable cache components in Next.js 16
  // This allows for simultaneous static and dynamic rendering
  cacheComponents: true,
}

export default nextConfig

