"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/hooks/use-cart"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

function getFullImageUrl(url: string) {
  if (!url) return "https://placehold.co/400x400?text=No+Image"
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
}

export function WishlistItems() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <Heart className="h-10 w-10 text-red-300" />
        </div>
        <p className="text-lg font-bold text-gray-700">قائمة المفضلة فارغة</p>
        <p className="text-sm text-muted-foreground">أضف منتجاتك المفضلة بالضغط على ❤️</p>
        <Link href="/products">
          <Button className="mt-2 rounded-xl">تصفح المنتجات</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} منتج في المفضلة</p>
        <Button variant="ghost" size="sm" onClick={clearWishlist} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs gap-1">
          <Trash2 className="h-3 w-3" />
          مسح الكل
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow">
            <Link href={`/products/${item.slug}`} className="shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={getFullImageUrl(item.image)}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.slug}`}>
                <p className="font-bold text-sm truncate hover:text-primary">{item.name}</p>
              </Link>
              {item.category && (
                <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-black text-primary text-sm">{item.price.toLocaleString()} د.ج</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xs text-muted-foreground line-through">{item.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="h-8 text-xs rounded-xl flex-1 gap-1"
                  onClick={() => addItem({ id: String(item.id), name: item.name, price: item.price, image: item.image, slug: item.slug, quantity: 1 })}
                >
                  <ShoppingCart className="h-3 w-3" />
                  أضف للسلة
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
