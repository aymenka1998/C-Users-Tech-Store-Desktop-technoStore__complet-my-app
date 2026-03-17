// components/cart/cart-line-items.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface CartItemType {
  id: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
}

interface CartLineItemsProps {
  items: CartItemType[]
}

export function CartLineItems({ items }: CartLineItemsProps) {
  const { updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لا توجد منتجات في السلة
      </div>
    )
  }

  return (
    <div className="divide-y">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 py-6">
          {/* Product Image */}
          <Link 
            href={`/products/${item.slug}`}
            className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.slug}`}>
              <h3 className="font-semibold text-base hover:text-primary transition-colors">
                {item.name}
              </h3>
            </Link>
            
            <p className="text-primary font-bold text-lg mt-1">
              {item.price.toFixed(2)} ر.س
            </p>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none rounded-r-lg"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none rounded-l-lg"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-4 w-4 mr-1" />
                إزالة
              </Button>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-right min-w-[100px]">
            <p className="font-bold text-lg">
              {(item.price * item.quantity).toFixed(2)} ر.س
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {item.price.toFixed(2)} × {item.quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}