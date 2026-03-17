"use client"

import { useState, useActionState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Mail, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, KeyRound } from "lucide-react"
import { forgotPasswordAction } from "@/app/auth/forgot-password/actions"

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, null)
  const [emailValue, setEmailValue] = useState("")

  if (state?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* رأس البطاقة */}
          <div className="bg-gradient-to-l from-violet-600 to-blue-500 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 translate-y-10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white mb-1">تم الإرسال!</h1>
              <p className="text-white/70 text-sm">تحقق من بريدك الإلكتروني ✉️</p>
            </div>
          </div>

          {/* المحتوى */}
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
              <Mail className="w-9 h-9 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-800">راجع بريدك الإلكتروني</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                أرسلنا رابط إعادة تعيين كلمة المرور إلى
                <br />
                <span className="font-bold text-violet-600">{emailValue}</span>
              </p>
              <p className="text-gray-400 text-xs">إذا لم تجد الرسالة، تحقق من مجلد الـ Spam</p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-l from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>إعادة الإرسال</span>
              </button>

              <Link
                href="/login"
                className="w-full border-2 border-gray-100 text-gray-600 font-bold py-3.5 rounded-xl transition-all hover:border-violet-200 hover:text-violet-600 flex items-center justify-center gap-2 group"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>العودة لتسجيل الدخول</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* رأس البطاقة */}
        <div className="bg-gradient-to-l from-violet-600 to-blue-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 translate-y-10" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">نسيت كلمة المرور؟</h1>
            <p className="text-white/70 text-sm">لا تقلق، سنساعدك في استرجاعها 🔑</p>
          </div>
        </div>

        {/* النموذج */}
        <div className="p-8">

          {/* وصف */}
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-6 text-center">
            <p className="text-violet-700 text-sm leading-relaxed">
              أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
            </p>
          </div>

          {/* تنبيه الخطأ */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">

            {/* البريد الإلكتروني */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="mail@example.com"
                  required
                />
              </div>
            </div>

            {/* زر الإرسال */}
            <SubmitButton />

            {/* رابط العودة */}
            <Link
              href="/login"
              className="w-full border-2 border-gray-100 text-gray-500 font-bold py-3.5 rounded-xl transition-all hover:border-violet-200 hover:text-violet-600 flex items-center justify-center gap-2 group"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>العودة لتسجيل الدخول</span>
            </Link>
          </form>

          <p className="text-center mt-6 text-gray-400 text-sm">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-violet-500 hover:text-violet-600 font-bold transition-colors">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-l from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
    >
      {pending ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>إرسال رابط الاسترجاع</span>
        </>
      )}
    </button>
  )
}