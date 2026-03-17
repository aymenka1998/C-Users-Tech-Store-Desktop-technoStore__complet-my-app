
"use client"

import { useEffect, useActionState } from "react" // تحديث الاستيراد هنا
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { useCart } from "@/hooks/use-cart"
import { createOrderAction } from "@/app/checkoutee/actions"
import { Card, CardContent } from "@/components/ui/card"
import { ShippingForm } from "./shipping-form"
import { PaymentForm } from "./payment-form"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CheckoutForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, totalPrice, clearCart } = useCart()
  
  // حساب الشحن الإجمالي
  const shippingCost = totalPrice > 200 ? 0 : 25
  const total = totalPrice + shippingCost

  // استخدام useActionState بدلاً من useFormState للتوافق مع React 19 / Next.js 15
  const [state, formAction] = useActionState(createOrderAction, null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "تم الطلب بنجاح",
        description: "شكراً لثقتك بنا، سيصلك إيميل بتفاصيل الطلب قريباً.",
      })
      clearCart()
      // توجيه المستخدم لصفحة النجاح باستخدام المعرف العائد من السيرفر
      router.push(`/checkout/success?orderId=${state.orderId}`)
    }
    
    if (state?.error) {
      toast({
        title: "عذراً، حدث خطأ",
        description: state.error,
        variant: "destructive",
      })
    }
  }, [state, router, clearCart, toast])

  return (
    <form action={formAction} className="space-y-8 text-right" dir="rtl">
      {/* 1. حقول مخفية للبيانات التقنية */}
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="total" value={total.toString()} />
      <input type="hidden" name="shippingCost" value={shippingCost.toString()} />

      {/* 2. قسم معلومات الشحن */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
          معلومات الشحن
        </h2>
        <Card className="border-2">
          <CardContent className="pt-6">
            <ShippingForm />
          </CardContent>
        </Card>
      </section>

      {/* 3. قسم طريقة الدفع */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
          طريقة الدفع
        </h2>
        <PaymentForm />
      </section>

      {/* 4. زر التأكيد */}
      <div className="space-y-4">
        <SubmitButton />
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>بياناتك محمية ومشفرة بالكامل</span>
        </div>
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      size="lg" 
      className="w-full h-14 text-xl font-black shadow-lg hover:shadow-primary/20 transition-all" 
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="ml-2 h-6 w-6 animate-spin" />
          جاري معالجة طلبك...
        </>
      ) : (
        "تأكيد إتمام الشراء"
      )}
    </Button>
  )
}
