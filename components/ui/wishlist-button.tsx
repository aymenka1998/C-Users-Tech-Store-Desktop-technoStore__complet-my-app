"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/context/wishlist-context"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: {
    id: number
    name: string
    slug: string
    price: number
    originalPrice?: number
    image: string
    category?: string
  }
  className?: string
  size?: "sm" | "md"
}

export function WishlistButton({ product, className, size = "md" }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
      className={cn(
        "rounded-full transition-all",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        inWishlist
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          inWishlist && "fill-red-500"
        )}
      />
    </Button>
  )
}
