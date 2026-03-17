"use client"

import { Banknote, CreditCard } from "lucide-react"
import { Label } from "@/components/ui/label"

export function PaymentForm() {
  return (
    <div className="grid gap-4 text-right" dir="rtl">
      <h3 className="text-lg font-semibold mb-2">طريقة الدفع</h3>
      
      {/* خيار الدفع عند الاستلام */}
      <div className="relative">
        <input
          type="radio"
          id="cod"
          name="paymentMethod"
          value="cash_on_delivery"
          className="peer hidden"
          defaultChecked
        />
        <Label
          htmlFor="cod"
          className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all 
                     peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-gray-900">الدفع عند الاستلام</p>
              <p className="text-xs text-muted-foreground">ادفع نقداً فور استلام طلبك من المندوب</p>
            </div>
          </div>
          <div className="h-5 w-5 border-2 rounded-full border-muted peer-checked:border-primary flex items-center justify-center">
             <div className="h-2.5 w-2.5 rounded-full bg-primary scale-0 transition-transform peer-checked:scale-100" />
          </div>
        </Label>
      </div>

      {/* خيار البطاقة (معطل حالياً) */}
      <div className="relative opacity-60">
        <div
          className="flex items-center justify-between p-4 border-2 border-dashed rounded-xl cursor-not-allowed bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <CreditCard className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-gray-500">بطاقة مدى / فيزا (قريباً)</p>
              <p className="text-xs text-muted-foreground">هذه الميزة ستتوفر في التحديث القادم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}