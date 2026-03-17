//components/checkout/email-status-handler.tsx
"use client"

import { useState, useEffect } from "react"
import { resendOrderEmailAction } from "@/app/checkoutee/actions"
import { MailCheck, Loader2, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmailStatusHandler({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<"loading" | "sent" | "error">("loading")
  const [isResending, setIsResending] = useState(false)

  const handleSendEmail = async () => {
    try {
      const result = await resendOrderEmailAction(orderId)
      if (result && result.success) {
        setStatus("sent")
      } else {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    }
  }

  useEffect(() => {
    if (orderId) {
      handleSendEmail()
    }
  }, [orderId])

  const handleManualResend = async () => {
    setIsResending(true)
    await handleSendEmail()
    setIsResending(false)
  }

  return (
    <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-3 text-right" dir="rtl">
      {status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>جاري إرسال تأكيد الطلب إلى بريدك الإلكتروني...</span>
        </div>
      )}

      {status === "sent" && (
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <MailCheck className="h-5 w-5" />
          <span>تم إرسال تفاصيل الطلب بنجاح. تفقد بريدك الوارد.</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
            <AlertCircle className="h-5 w-5" />
            <span>لم نتمكن من إرسال الإيميل تلقائياً</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleManualResend} 
            disabled={isResending}
            className="text-xs text-primary hover:bg-primary/5"
          >
            {isResending ? <Loader2 className="h-3 w-3 animate-spin ml-1" /> : <RotateCcw className="h-3 w-3 ml-1" />}
            إعادة محاولة الإرسال
          </Button>
        </div>
      )}
    </div>
  )
}