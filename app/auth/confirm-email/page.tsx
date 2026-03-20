"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  
  const confirmationToken = searchParams.get('confirmation')

  useEffect(() => {
    const confirmAccount = async () => {
      if (!confirmationToken) {
        setStatus('error')
        setMessage('رمز التأكيد مفقود أو غير صالح.')
        return
      }

      try {
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
        
        // إرسال طلب التأكيد إلى Strapi
        const response = await fetch(`${STRAPI_URL}/api/auth/email-confirmation?confirmation=${confirmationToken}`)
        
        if (response.ok) {
          setStatus('success')
          // تحويل المستخدم لصفحة تسجيل الدخول بعد 4 ثوانٍ تلقائياً
          setTimeout(() => {
            router.push("/auth/login?confirmed=true")
          }, 4000)
        } else {
          const errorData = await response.json()
          setStatus('error')
          setMessage(errorData?.error?.message || 'فشل تأكيد الحساب. ربما انتهت صلاحية الرابط.')
        }
      } catch (error) {
        console.error("Confirmation Error:", error)
        setStatus('error')
        setMessage('حدث خطأ أثناء الاتصال بالسيرفر. يرجى المحاولة لاحقاً.')
      }
    }

    confirmAccount()
  }, [confirmationToken, router])

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-slate-800">
      {status === 'loading' && (
        <div className="flex flex-col items-center py-10">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">جاري تأكيد حسابك</h1>
          <p className="text-gray-500 mt-2">يرجى الانتظار لحظة بينما نفعل بريدك الإلكتروني...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">تم تفعيل الحساب بنجاح!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
            شكراً لتأكيد بريدك الإلكتروني. يمكنك الآن تسجيل الدخول والبدء في التسوق.
          </p>
          <div className="mt-8 w-full">
            <Link 
              href="/auth/login" 
              className="flex items-center justify-center gap-2 bg-primary text-white w-full py-3 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg"
            >
              انتقل لتسجيل الدخول
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6 italic">سيتم تحويلك تلقائياً خلال ثوانٍ...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-6">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-400">فشل عملية التأكيد</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            {message}
          </p>
          <div className="mt-8 w-full space-y-3">
            <Link 
              href="/auth/register" 
              className="block bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white w-full py-3 rounded-xl font-bold hover:bg-gray-200 transition text-center"
            >
              حاول التسجيل مرة أخرى
            </Link>
            <Link href="/" className="block text-primary text-sm font-medium hover:underline">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Next.js يتطلب استخدام Suspense عند استخدام useSearchParams في Client Components
export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4" dir="rtl">
      <Suspense fallback={
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      }>
        <ConfirmEmailContent />
      </Suspense>
    </div>
  )
}