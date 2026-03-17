// components/checkout/order-summary.tsx
"use client"

import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function OrderSummary() {
  const { items, totalPrice } = useCart()
  const shipping = totalPrice > 200 ? 0 : 25
  const total = totalPrice + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle>ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-75 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.price.toFixed(2)} د.ج
                </p>
              </div>
              <div className="text-sm font-medium">
                {(item.price * item.quantity).toFixed(2)}د.ج
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{totalPrice.toFixed(2)} د.ج</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">مجاني</span>
              ) : (
                `${shipping.toFixed(2)} د.ج`
              )}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              أضف بقيمة {200 - totalPrice} د.ج للحصول على شحن مجاني
            </p>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span className="text-primary">{total.toFixed(2)} د.ج</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <span>🔒</span>
          <span>دفع آمن 100%</span>
        </div>
      </CardContent>
    </Card>
  )
}