import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable cache components in Next.js 16
  // This allows for simultaneous static and dynamic rendering
  cacheComponents: true,
  
  // Enable React Compiler in Next.js 16
  // Automatically memoizes components to reduce unnecessary re-renders
  // No manual useMemo or useCallback needed
  reactCompiler: true,
}

export default nextConfig

