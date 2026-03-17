"use client"

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from "react"

// ✅ توحيد المسمى إلى quantity ليتوافق مع دوال الحسابات والـ logic
interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number 
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoaded: boolean
}

const EMPTY_CART: CartItem[] = [];
let cachedCart: CartItem[] = EMPTY_CART;
let lastRawValue: string | null = null;

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  
  const items = useSyncExternalStore(
    (callback) => {
      window.addEventListener("cart-update", callback)
      window.addEventListener("storage", callback)
      return () => {
        window.removeEventListener("cart-update", callback)
        window.removeEventListener("storage", callback)
      }
    },
    () => {
      if (typeof window === "undefined") return EMPTY_CART
      
      const rawValue = localStorage.getItem("cart")
      
      if (rawValue === lastRawValue) {
        return cachedCart
      }

      try {
        lastRawValue = rawValue
        cachedCart = rawValue ? JSON.parse(rawValue) : EMPTY_CART
        return cachedCart
      } catch {
        return EMPTY_CART
      }
    },
    () => EMPTY_CART
  )

  const setStorageItem = useCallback((value: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(value))
      window.dispatchEvent(new Event("cart-update"))
    }
  }, [])

  // ✅ إصلاح addItem لاستخدام النوع الصحيح الموحد
  // ✅ التعديل داخل دالة addItem في ملف use-cart.tsx
const addItem = useCallback((newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
  const existingItem = items.find((item) => item.id === newItem.id);
  let updated: CartItem[];
  
  if (existingItem) {
    updated = items.map((item) =>
      item.id === newItem.id
        ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
        : item
    );
  } else {
    // ✅ بدلاً من استخدام any، نقوم ببناء الكائن بالخصائص المطلوبة يدوياً
    const itemToAdd: CartItem = {
      id: newItem.id,
      name: newItem.name,
      slug: newItem.slug,
      price: newItem.price,
      image: newItem.image,
      quantity: newItem.quantity || 1,
    };
    updated = [...items, itemToAdd];
  }
  setStorageItem(updated);
}, [items, setStorageItem]);

  const removeItem = useCallback((id: string) => {
    setStorageItem(items.filter((item) => item.id !== id))
  }, [items, setStorageItem])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id)
    setStorageItem(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [items, removeItem, setStorageItem])

  const clearCart = useCallback(() => setStorageItem([]), [setStorageItem])

  // ✅ الحسابات الآن ستعمل بشكل صحيح لأن الحقل موحد باسم quantity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isLoaded: true }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}