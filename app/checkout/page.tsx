
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { useCart } from "@/hooks/use-cart"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, isLoaded } = useCart()

  useEffect(() => {
    if (isLoaded && items.length === 0) {
      router.push("/cart")
    }
  }, [items, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">إتمام الشراء</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <CheckoutForm />
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
