import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '@/middleware'

// Test middleware/proxy functionality
// This test works for both Next.js 15 (middleware.ts) and Next.js 16 (proxy.ts)
// On the main branch, we test middleware.ts
// On the migration branch, proxy.ts will be tested
describe('Middleware (Next.js 15) / Proxy (Next.js 16)', () => {
  // Use middleware from main branch (Next.js 15)
  // On migration branch, this test will need to be updated or proxy.ts will be imported
  const middlewareOrProxy = middleware

  it('should export middleware or proxy function', () => {
    expect(middlewareOrProxy).not.toBeNull()
    expect(typeof middlewareOrProxy).toBe('function')
  })

  it('should return a NextResponse', async () => {
    if (!middlewareOrProxy) return
    
    const request = new NextRequest('http://localhost:3000/')
    const response = await Promise.resolve(middlewareOrProxy(request))
    
    expect(response).toBeDefined()
    expect(response).toBeInstanceOf(NextResponse)
    expect(response.headers).toBeDefined()
  })

  it('should set version header', async () => {
    if (!middlewareOrProxy) return
    
    const request = new NextRequest('http://localhost:3000/')
    const response = await Promise.resolve(middlewareOrProxy(request))
    
    // Check for either x-middleware-version (Next.js 15) or x-proxy-version (Next.js 16)
    const versionHeader = response.headers.get('x-middleware-version') || 
                         response.headers.get('x-proxy-version')
    expect(versionHeader).toBeTruthy()
  })

  it('should set x-api-route header for API routes', async () => {
    if (!middlewareOrProxy) return
    
    const request = new NextRequest('http://localhost:3000/api/test')
    const response = await Promise.resolve(middlewareOrProxy(request))
    
    expect(response.headers.get('x-api-route')).toBe('true')
  })

  it('should not set x-api-route header for non-API routes', async () => {
    if (!middlewareOrProxy) return
    
    const request = new NextRequest('http://localhost:3000/products')
    const response = await Promise.resolve(middlewareOrProxy(request))
    
    expect(response.headers.get('x-api-route')).toBeNull()
  })

  it('should handle different request paths', async () => {
    if (!middlewareOrProxy) return
    
    const paths = [
      'http://localhost:3000/',
      'http://localhost:3000/products',
      'http://localhost:3000/products/1',
      'http://localhost:3000/api/users',
    ]
    
    for (const path of paths) {
      const request = new NextRequest(path)
      const response = await Promise.resolve(middlewareOrProxy(request))
      expect(response).toBeDefined()
      expect(response).toBeInstanceOf(NextResponse)
    }
  })
})

