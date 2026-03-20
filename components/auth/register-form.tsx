"use client"

import { useState, useActionState, startTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Eye, EyeOff, User, Mail, Lock, ArrowLeft,
  CheckCircle, AlertCircle, Phone
} from "lucide-react"
import { registerAction } from "@/app/auth/register/actions"

function calculateStrength(pwd: string) {
  let strength = 0;
  if (pwd.length >= 6) strength += 1;
  if (pwd.length >= 10) strength += 1;
  if (/[A-Z]/.test(pwd)) strength += 1;
  if (/[0-9]/.test(pwd)) strength += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
  return strength;
}

function getStrengthColor(strength: number) {
  if (strength <= 2) return 'bg-red-400';
  if (strength <= 3) return 'bg-amber-400';
  return 'bg-emerald-400';
}

function getStrengthText(strength: number) {
  if (strength === 0) return 'ضعيفة جداً';
  if (strength <= 2) return 'ضعيفة';
  if (strength <= 3) return 'جيدة';
  if (strength <= 4) return 'قوية';
  return 'قوية جداً';
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = calculateStrength(formData.password);

  if (state?.success) {
    setTimeout(() => {
      router.push('/account');
      router.refresh();
    }, 1500);

    return (
      <div className="min-h-screen bg-linear-to-l from-violet-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center space-y-6 max-w-md w-full border border-gray-100">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900">أهلاً بك معنا! 🎉</h2>
            <p className="text-gray-500">تم إنشاء حسابك بنجاح، جاري تحويلك...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    if (!formData.agreeTerms) return;

    const data = new FormData();
    data.append('username', formData.username);
    data.append('fullName', formData.username);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('password', formData.password);

    startTransition(() => {
      formAction(data);
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-l from-violet-50 via-white to-blue-50 flex items-center justify-center p-4" dir="rtl">

      {/* بطاقة رئيسية مربعة */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* رأس البطاقة */}
        <div className="bg-linear-to-l from-violet-600 to-blue-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 translate-y-10" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">إنشاء حساب جديد</h1>
            <p className="text-white/70 text-sm">ابدأ رحلتك معنا اليوم ✨</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* الاسم الكامل */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">الاسم الكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full pr-11 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="أحمد محمد"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pr-11 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="mail@example.com"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">رقم الهاتف</label>
              <div className="relative group">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pr-11 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="05xxxxxxxx"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pr-11 pl-11 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* مؤشر القوة */}
              {formData.password && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-gray-100'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    قوة كلمة المرور: <span className="font-semibold text-gray-600">{getStrengthText(passwordStrength)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* تأكيد كلمة المرور */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">تأكيد كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full pr-11 pl-11 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:bg-white transition-all text-right text-sm ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-gray-100 focus:border-violet-400'
                  }`}
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs">كلمتا المرور غير متطابقتين</p>
              )}
            </div>

            {/* الموافقة على الشروط */}
            <label className="flex items-start gap-3 cursor-pointer group pt-1">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-violet-500 focus:ring-violet-400"
                required
                disabled={isPending}
              />
              <span className="text-sm text-gray-500 leading-relaxed">
                أوافق على{' '}
                <Link href="/terms" className="text-violet-500 hover:text-violet-600 font-semibold">شروط الخدمة</Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-violet-500 hover:text-violet-600 font-semibold">سياسة الخصوصية</Link>
              </span>
            </label>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={isPending || !formData.agreeTerms || formData.password !== formData.confirmPassword}
              className="w-full bg-linear-to-l from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>إنشاء الحساب</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400 text-sm">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-violet-500 hover:text-violet-600 font-bold transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}