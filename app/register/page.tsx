// app/register/page.tsx
export const dynamic = 'force-dynamic';
import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | متجري",
  description: "سجل في متجري واستمتع بتجربة تسوق مميزة",
}

export default function RegisterPage() {
  return (
<div 
  className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-slate-50 to-background p-6" 
  dir="rtl"
>
  {/* خلفية جمالية إضافية (دوائر ضبابية) */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl animate-pulse" />
    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
  </div>

  <div className="w-full max-w-md relative group">
    {/* إطار مضيء خلف النموذج (Glow Effect) */}
    <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
    
    {/* حاوية النموذج الأساسية */}
    <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-primary/10">
      
      {/* شعار أو عنوان ترحيبي */}
      <div className="text-center mb-8">
        
      </div>

      <RegisterForm />
      
    </div>
    
    {/* تذييل بسيط */}
    <p className="text-center text-xs text-slate-400 mt-6 uppercase tracking-widest">
      جميع الحقوق محفوظة © 2026
    </p>
  </div>
</div>
  )
}