// app/auth/register/page.tsx
export const dynamic = 'force-dynamic';
import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | متجري",
  description: "سجل في متجري واستمتع بتجربة تسوق مميزة",
}

export default function RegisterPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-50 via-white to-blue-50 p-6 relative overflow-hidden" 
      dir="rtl"
    >
      {/* خلفية جمالية (دوائر ضبابية متحركة) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-lg relative group">
        {/* إطار مضيء خلف النموذج (Glow Effect) */}
        <div className="absolute -inset-1 bg-linear-to-r from-violet-500/30 to-blue-500/30 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        {/* حاوية النموذج الأساسية */}
        <div className="relative bg-white/90 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8 md:p-10 transition-all duration-300">
          
          {/* رأس الصفحة الترحيبي */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-blue-500 text-white shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">انضم إلينا اليوم! ✨</h1>
            <p className="text-gray-500 text-sm">أنشئ حسابك وابدأ رحلة تسوق استثنائية</p>
          </div>

          {/* نموذج التسجيل الفعلي */}
          <RegisterForm />
          
          {/* رابط العودة لتسجيل الدخول */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              لديك حساب بالفعل؟{' '}
              <Link 
                href="/auth/login" 
                className="text-violet-600 hover:text-violet-700 font-bold inline-flex items-center gap-1 group/link transition-colors"
              >
                تسجيل الدخول
                <ArrowRight className="w-4 h-4 group-hover/link:-translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
        
        {/* تذييل بسيط */}
        <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-[0.2em] font-medium">
          جميع الحقوق محفوظة لمتجر أيمن © 2026
        </p>
      </div>
    </div>
  )
}