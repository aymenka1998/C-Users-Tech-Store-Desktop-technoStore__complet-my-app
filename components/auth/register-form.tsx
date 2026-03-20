"use client"

import React, { useState, useActionState, startTransition, memo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Eye, EyeOff, User, Mail, Lock, ArrowLeft,
  CheckCircle, AlertCircle, Phone, ShieldCheck, LucideIcon
} from "lucide-react"
import { registerAction } from "@/app/auth/register/actions"

// --- Helper Functions ---
const calculateStrength = (pwd: string) => {
  let strength = 0;
  if (pwd.length >= 8) strength += 1;
  if (/[A-Z]/.test(pwd)) strength += 1;
  if (/[0-9]/.test(pwd)) strength += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
  return strength;
};

const getStrengthConfig = (strength: number) => {
  const configs = [
    { color: 'bg-gray-200', text: 'ضعيفة جداً', width: '20%' },
    { color: 'bg-red-400', text: 'ضعيفة', width: '40%' },
    { color: 'bg-orange-400', text: 'متوسطة', width: '60%' },
    { color: 'bg-amber-400', text: 'جيدة', width: '80%' },
    { color: 'bg-emerald-500', text: 'قوية جداً', width: '100%' },
  ];
  return configs[strength] || configs[0];
};

// --- Sub-Components ---
const InputField = memo(({ 
  label, icon: Icon, error, ...props 
}: { label: string; icon: LucideIcon; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5 flex-1 text-right">
    <label className="text-sm font-bold text-gray-700 block mr-1">{label}</label>
    <div className="relative group">
      <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-violet-500 text-gray-400">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <input
        {...props}
        className={`w-full pr-11 pl-4 py-3 bg-gray-50 border-2 rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:bg-white text-right
          ${error ? 'border-red-200 focus:border-red-400' : 'border-gray-100 focus:border-violet-400 focus:shadow-sm'}
          disabled:opacity-60 disabled:cursor-not-allowed`}
      />
    </div>
    {error && <p className="text-[10px] text-red-500 mr-2 animate-in fade-in slide-in-from-right-1">{error}</p>}
  </div>
));

InputField.displayName = "InputField";

export default function RegisterForm() {
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
  const strength = calculateStrength(formData.password);
  const strengthInfo = getStrengthConfig(strength);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val.toString()));
    data.append('fullName', formData.username);

    startTransition(() => {
      formAction(data);
    });
  };

  if (state?.success) {
    setTimeout(() => { router.push('/account'); router.refresh(); }, 2000);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6 max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto rotate-12">
            <CheckCircle className="h-10 w-10 text-emerald-500 -rotate-12" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">تم بنجاح! 🎉</h2>
          <p className="text-gray-500 leading-relaxed">أهلاً بك يا <span className="text-violet-600 font-bold">{formData.username}</span>، جاري تحضير لوحة التحكم الخاصة بك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4 py-12" dir="rtl">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden transform transition-all">
        
        {/* Header Section */}
        <div className="bg-linear-to-r from-violet-600 to-indigo-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl mb-4 border border-white/30 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight text-center">انضم إلينا</h1>
            <p className="text-indigo-100/80 text-sm mt-1 text-center">أنشئ حسابك في أقل من دقيقة ✨</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 text-sm font-medium">{state.error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="الاسم الكامل"
                name="username"
                icon={User}
                placeholder="مثال: أيمن أحمد"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={isPending}
              />
              <InputField
                label="رقم الهاتف"
                name="phone"
                type="tel"
                icon={Phone}
                placeholder="0560000000"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={isPending}
              />
            </div>

            <InputField
              label="البريد الإلكتروني"
              name="email"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isPending}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <InputField
                  label="كلمة المرور"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isPending}
                />
                {formData.password && (
                  <div className="px-1 space-y-1.5">
                    <div className="flex gap-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${strengthInfo.color}`} 
                        style={{ width: strengthInfo.width }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-medium">قوة المرور:</span>
                      <span className={`text-[10px] font-bold ${strengthInfo.color.replace('bg-', 'text-')}`}>
                        {strengthInfo.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <InputField
                  label="تأكيد كلمة المرور"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "غير متطابق" : ""}
                  required
                  disabled={isPending}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-10 text-gray-400 hover:text-violet-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                    required
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-lg peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-xs text-slate-500 leading-relaxed text-right">
                  بإنشاء الحساب، أنت توافق على <Link href="/terms" className="text-violet-600 font-bold hover:underline">شروط الاستخدام</Link> و <Link href="/privacy" className="text-violet-600 font-bold hover:underline">سياسة الخصوصية</Link> الخاصة بنا.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending || !formData.agreeTerms || (formData.password !== formData.confirmPassword)}
              className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-violet-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {isPending ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>إنشاء حسابك الآن</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm text-center">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-violet-600 font-black hover:text-indigo-700 transition-colors border-b-2 border-transparent hover:border-indigo-700 pb-0.5">
                سجل الدخول من هنا
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}