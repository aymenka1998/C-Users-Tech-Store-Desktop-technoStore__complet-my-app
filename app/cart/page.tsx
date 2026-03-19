"use client"

import { useSyncExternalStore } from "react" // الحل الحديث والآمن
import Link from "next/link"
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CartLineItems } from "@/components/cart/cart-line-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { useCart } from "@/hooks/use-cart"

// وظائف مساعدة لـ useSyncExternalStore
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CartPage() {
  const { items, totalPrice, clearCart, isLoaded } = useCart()

  // هذا الـ Hook يحدد ما إذا كنا في المتصفح أم لا بدون التسبب في Cascading Renders
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // حالة التحميل (Skeleton) - ستظهر في السيرفر وأثناء التحميل الأول
  if (!isClient || !isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  const shipping = totalPrice > 200 ? 0 : 25

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">سلة التسوق فارغة</h2>
          <p className="text-muted-foreground mb-6">لم تضف أي منتجات إلى سلتك بعد</p>
          <Link href="/products">
            <Button size="lg">
              استمر في التسوق
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>المنتجات ({items.length})</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    إفراغ السلة
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CartLineItems items={items} />
              </CardContent>
            </Card>

            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                مواصلة التسوق
              </Button>
            </Link>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CartSummary totalPrice={totalPrice} shipping={shipping} />
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    إتمام الشراء
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>🔒</span>
                  <span>دفع آمن 100%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}