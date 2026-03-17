"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react"
import { loginAction } from "@/app/auth/login/actions"

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [state, formAction] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.success) {
      router.push(state.redirectPath ?? '/account')
      router.refresh()
    }
  }, [state, router])

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* رأس البطاقة */}
        <div className="bg-linear-to-br to-blue-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 translate-y-10" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">مرحباً بعودتك! 👋</h1>
            <p className="text-white/70 text-sm">سجّل دخولك للمتابعة</p>
          </div>
        </div>

        {/* النموذج */}
        <div className="p-8">

          {/* تنبيه الخطأ */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-4">

            {/* البريد الإلكتروني أو اسم المستخدم */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">
                البريد الإلكتروني أو اسم المستخدم
              </label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="text"
                  name="identifier"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="mail@example.com أو اسم المستخدم"
                  required
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-500 hover:text-violet-600 font-semibold transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
                <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 pl-11 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* تذكرني */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                value={String(rememberMe)}
                className="w-4 h-4 rounded border-gray-300 text-violet-500 focus:ring-violet-400"
              />
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                تذكرني
              </span>
            </label>

            {/* زر الدخول */}
            <SubmitButton />
          </form>

          {/* فاصل */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">أو</span>
            </div>
          </div>

          {/* أزرار التسجيل الاجتماعي */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-violet-200 hover:text-violet-600 transition-all"
            >
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-violet-200 hover:text-violet-600 transition-all"
            >
              Facebook
            </button>
          </div>

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
      className="w-full bg-linear-to-l from-violet-50 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
    >
      {pending ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>تسجيل الدخول</span>
        </>
      )}
    </button>
  )
}