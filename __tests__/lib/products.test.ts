import { getProducts, getProduct, type Product } from '@/lib/products'

describe('Product Data Functions', () => {
  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products = await getProducts()
      
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it('should return products with correct structure', async () => {
      const products = await getProducts()
      
      products.forEach((product) => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('description')
        expect(product).toHaveProperty('price')
        expect(typeof product.id).toBe('number')
        expect(typeof product.name).toBe('string')
        expect(typeof product.description).toBe('string')
        expect(typeof product.price).toBe('number')
      })
    })

    it('should return all 6 products', async () => {
      const products = await getProducts()
      expect(products).toHaveLength(6)
    })

    it('should return products in consistent order', async () => {
      const products1 = await getProducts()
      const products2 = await getProducts()
      
      expect(products1).toEqual(products2)
      expect(products1[0].id).toBe(1)
    })
  })

  describe('getProduct', () => {
    it('should return a product when given a valid id', async () => {
      const product = await getProduct('1')
      
      expect(product).not.toBeNull()
      expect(product?.id).toBe(1)
      expect(product?.name).toBe('Wireless Headphones')
    })

    it('should return null for invalid id', async () => {
      const product = await getProduct('999')
      expect(product).toBeNull()
    })

    it('should return null for non-numeric id', async () => {
      const product = await getProduct('invalid')
      expect(product).toBeNull()
    })

    it('should return correct product for each id', async () => {
      const product1 = await getProduct('1')
      const product2 = await getProduct('2')
      const product3 = await getProduct('3')
      
      expect(product1?.id).toBe(1)
      expect(product2?.id).toBe(2)
      expect(product3?.id).toBe(3)
    })

    it('should handle string ids that parse to valid numbers', async () => {
      const product = await getProduct('5')
      expect(product).not.toBeNull()
      expect(product?.id).toBe(5)
    })
  })

  describe('Product Data Integrity', () => {
    it('should have unique product ids', async () => {
      const products = await getProducts()
      const ids = products.map(p => p.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have positive prices', async () => {
      const products = await getProducts()
      
      products.forEach((product) => {
        expect(product.price).toBeGreaterThan(0)
      })
    })

    it('should have non-empty names and descriptions', async () => {
      const products = await getProducts()
      
      products.forEach((product) => {
        expect(product.name.trim().length).toBeGreaterThan(0)
        expect(product.description.trim().length).toBeGreaterThan(0)
      })
    })
  })
})

