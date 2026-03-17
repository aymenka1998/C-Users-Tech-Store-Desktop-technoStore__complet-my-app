"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import { WishlistButton } from "@/components/ui/wishlist-button"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

interface Product {
  id: string | number
  name: string
  slug: string
  price: number
  originalPrice?: number
  image?: string
  rating?: number
  reviewsCount?: number
  isNew?: boolean
  isSale?: boolean
  category?: string | { name: string }
  quantite?: number | string | null
  stock?: number | string | null
  inStock?: boolean
}

interface ProductCardProps {
  product: Product
  className?: string
  showWishlist?: boolean
}

const productEmojis = ["📱", "💻", "🎧", "⌚", "👜", "👟", "🏠", "⚽", "📷", "🎮"]

function checkStock(product: Product) {
  const possibleValues = [
    product.quantite,
    product.stock,
    product.inStock !== undefined ? (product.inStock ? 1 : 0) : undefined
  ].filter(v => v !== undefined && v !== null)

  const rawValue = possibleValues[0]
  let numericValue = 0
  
  if (typeof rawValue === 'boolean') numericValue = rawValue ? 1 : 0
  else if (typeof rawValue === 'string') numericValue = parseInt(rawValue, 10) || 0
  else if (typeof rawValue === 'number') numericValue = rawValue

  const isOutOfStock = numericValue <= 0 && rawValue !== undefined && rawValue !== null

  return { isOutOfStock, displayStock: numericValue }
}

export function ProductCard({ 
  product, 
  className,
  showWishlist = true,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const { isOutOfStock, displayStock } = checkStock(product)
  
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const categoryName = typeof product.category === 'object' && product.category !== null
    ? (product.category as { name: string }).name 
    : (product.category as string) || "عام"

  const productIdNum = typeof product.id === 'string' ? parseInt(product.id) || 0 : product.id
  const emoji = productEmojis[productIdNum % productEmojis.length]

  const fullImageUrl = product.image?.startsWith('/') 
    ? `${STRAPI_URL}${product.image}` 
    : product.image;

  const handleAddToCart = () => {
    if (isOutOfStock) return
    setIsAdding(true)
    addItem({
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: fullImageUrl || "",
      quantity: 1
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden h-full flex flex-col border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl",
      isOutOfStock && "opacity-75",
      className
    )}>
      <div className="relative aspect-4/5 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 m-3 rounded-2xl">
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md border-none px-3 py-1 shadow-lg font-bold text-white">جديد</Badge>
          )}
          {product.isSale && discount > 0 && (
            <Badge className="bg-rose-500/90 hover:bg-rose-500 backdrop-blur-md border-none px-3 py-1 shadow-lg font-bold text-white">-{discount}%</Badge>
          )}
        </div>

        {showWishlist && (
          <div className="absolute top-3 left-3 z-10">
            <WishlistButton
              product={{
                id: productIdNum,
                name: product.name,
                slug: product.slug,
                price: product.price,
                originalPrice: product.originalPrice,
                image: fullImageUrl || "",
                category: typeof product.category === 'string' ? product.category : undefined,
              }}
              size="sm"
            />
          </div>
        )}

        <Link href={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center relative">
          {fullImageUrl && !imageError ? (
            <Image 
              src={fullImageUrl} 
              alt={product.name} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <span className="text-7xl select-none">{emoji}</span>
            </div>
          )}
        </Link>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center m-3 rounded-2xl z-20">
            <span className="bg-white/95 px-6 py-3 rounded-full font-bold text-gray-800 text-lg shadow-lg">⚠️ نفذت الكمية</span>
          </div>
        )}
      </div>

      <CardContent className="px-5 py-4 grow flex flex-col items-end text-right">
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2 uppercase tracking-widest">
          {categoryName}
        </span>
        
        <Link href={`/products/${product.slug}`} className="block w-full">
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 hover:text-blue-700 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-end gap-1 mb-4 bg-gray-50 px-2 py-1 rounded-lg w-fit">
          <span className="text-[11px] text-gray-400 font-medium">({product.reviewsCount || 0})</span>
          <span className="text-sm font-bold text-gray-700">{product.rating || 0}</span>
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        </div>

        <div className="mt-auto w-full flex items-center justify-between flex-row-reverse">
          <div className="flex flex-col items-end gap-1">
            <span className="text-2xl font-black text-gray-900 flex items-center gap-1">
              <span className="text-sm font-medium text-gray-500">د.ج</span>
              {product.price.toLocaleString()}
            </span>
          </div>
          {!isOutOfStock && displayStock > 0 && displayStock < 10 && (
            <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">متبقي {displayStock} فقط</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <button 
          disabled={isOutOfStock || isAdding}
          onClick={handleAddToCart}
          className={cn(
            "w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all duration-300 shadow-lg",
            isOutOfStock ? "bg-gray-200 text-gray-500 cursor-not-allowed" : 
            isAdding ? "bg-green-600 text-white" : "bg-gray-900 hover:bg-blue-700 text-white"
          )}
        >
          {isOutOfStock ? "غير متوفر" : isAdding ? "تمت الإضافة ✓" : (
            <>
              <ShoppingCart className="h-5 w-5" />
              أضف إلى السلة
            </>
          )}
        </button>
      </CardFooter>
    </Card>
  )
}