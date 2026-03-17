// components/cart/cart-sheet.tsx
"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CartItem } from "./cart-item"  // ✅ استيراد صحيح
import { CartSummary } from "./cart-summary"
import { EmptyCart } from "./empty-cart"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

export function CartSheet() {
  const { items, totalItems, totalPrice, clearCart } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              سلة التسوق
              <Badge variant="secondary">{totalItems} منتج</Badge>
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                إفراغ
              </Button>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />  // ✅ استخدام CartItem
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 space-y-4">
              <Separator />
              <CartSummary totalPrice={totalPrice} />
              <div className="space-y-2">
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    إتمام الشراء
                  </Button>
                </Link>
                <SheetTrigger asChild>
                  <Link href="/cart" className="block">
                    <Button variant="outline" className="w-full">
                      عرض السلة
                    </Button>
                  </Link>
                </SheetTrigger>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}