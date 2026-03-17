// components/cart/empty-cart.tsx
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">سلة التسوق فارغة</h3>
        <p className="text-muted-foreground text-sm">
          ابدأ التسوق واكتشف منتجاتنا المميزة
        </p>
      </div>
      <Link href="/products">
        <Button>تصفح المنتجات</Button>
      </Link>
    </div>
  )
}