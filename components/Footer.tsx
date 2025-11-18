import { headers } from 'next/headers'

// Next.js 16: Dynamic component that can be cached separately
// This demonstrates how cache components allow static and dynamic content
// to coexist on the same page
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

