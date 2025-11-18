import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container">
      <h1>404 - Product Not Found</h1>
      <p>The product you're looking for doesn't exist.</p>
      <Link href="/" style={{ color: '#2563eb' }}>
        Return to home
      </Link>
    </div>
  )
}

