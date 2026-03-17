// components/cart/cart-summary.tsx
interface CartSummaryProps {
  totalPrice: number
  shipping?: number
}

export function CartSummary({ totalPrice, shipping = 0 }: CartSummaryProps) {
  const subtotal = totalPrice
  const total = subtotal + shipping

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">المجموع الفرعي</span>
        <span>{subtotal.toFixed(2)} ر.س</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">الشحن</span>
        <span>{shipping === 0 ? "مجاني" : `${shipping.toFixed(2)} ر.س`}</span>
      </div>
      <div className="flex justify-between text-lg font-bold pt-2 border-t">
        <span>الإجمالي</span>
        <span className="text-primary">{total.toFixed(2)} ر.س</span>
      </div>
    </div>
  )
}