"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface WishlistItem {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  toggleItem: (item: WishlistItem) => void
  isInWishlist: (id: number) => boolean
  count: number
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount (Client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist")
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // ignore errors
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (!isLoaded) return // Don't overwrite localStorage before loading
    try {
      localStorage.setItem("wishlist", JSON.stringify(items))
    } catch {}
  }, [items, isLoaded])

  const addItem = useCallback((item: WishlistItem) => {
    setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item])
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    )
  }, [])

  const isInWishlist = useCallback((id: number) => items.some(i => i.id === id), [items])

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      count: items.length,
      clearWishlist: () => setItems([]),
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
