"use client"

import { useState, useActionState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateAccountAction } from "@/app/auth/account/actions"
import {
  KeyRound, Laptop, AlertTriangle,
  Loader2, Check, ChevronDown, ChevronUp,
  Shield, Eye, EyeOff,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// نفس مكوّن Section من SettingsPanel
// ─────────────────────────────────────────────────────────────────
function Section({
  icon: Icon, title, subtitle, iconColor, iconBg, children, defaultOpen = false, danger = false,
}: {
  icon: React.ElementType
  title: string; subtitle: string
  iconColor: string; iconBg: string
  children: React.ReactNode
  defaultOpen?: boolean; danger?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`border rounded-2xl overflow-hidden bg-white ${danger ? "border-red-100" : "border-gray-100"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-5 transition-colors
          ${danger ? "hover:bg-red-50/50" : "hover:bg-gray-50"}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="text-right">
            <p className={`font-bold text-sm ${danger ? "text-red-700" : "text-gray-800"}`}>{title}</p>
            <p className="text-xs text-gray-400 font-normal">{subtitle}</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// حقل كلمة المرور مع زر إظهار/إخفاء
// ─────────────────────────────────────────────────────────────────
function PasswordField({ label, name, placeholder }: {
  label: string; name: string; placeholder: string
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 block">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800
            placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white
            transition-all text-right text-sm pr-4 pl-11"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 1. تغيير كلمة المرور
// ─────────────────────────────────────────────────────────────────
function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updateAccountAction, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) toast({ title: "تم تغيير كلمة المرور ✅" })
    if (state?.error)   toast({ title: "خطأ", description: state.error, variant: "destructive" })
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-4 mt-4">
      <input type="hidden" name="type" value="password" />

      <PasswordField label="كلمة المرور الحالية" name="currentPassword" placeholder="••••••••" />
      <PasswordField label="كلمة المرور الجديدة" name="newPassword"     placeholder="••••••••" />
      <PasswordField label="تأكيد كلمة المرور"   name="confirmPassword" placeholder="••••••••" />

      {/* متطلبات كلمة المرور */}
      <div className="grid grid-cols-2 gap-2">
        {[
          "8 أحرف على الأقل",
          "حرف كبير واحد",
          "رقم واحد على الأقل",
          "رمز خاص (!@#...)",
        ].map((req) => (
          <div key={req} className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
            {req}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-gradient-to-l from-violet-600 to-blue-500
            hover:from-violet-500 hover:to-blue-400 text-white font-bold py-2.5 px-6
            rounded-xl transition-all hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 text-sm"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isPending ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </button>
      </div>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────
// 2. الأجهزة النشطة
// ─────────────────────────────────────────────────────────────────
function ActiveDevices() {
  const devices = [
    {
      emoji: "💻",
      name: "Windows PC • Chrome",
      location: "الجزائر، سطيف",
      time: "نشط الآن",
      current: true,
    },
  ]

  return (
    <div className="mt-4 space-y-3">
      {devices.map((device, i) => (
        <div
          key={i}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all
            ${device.current
              ? "bg-violet-50/50 border-violet-100"
              : "bg-gray-50 border-gray-100 hover:border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-base">
              {device.emoji}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{device.name}</p>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${device.current ? "text-emerald-500" : "text-gray-400"}`}>
                  {device.time}
                </span>
                <span className="text-[10px] text-gray-300">•</span>
                <span className="text-[10px] text-gray-400">{device.location}</span>
              </div>
            </div>
          </div>

          {device.current ? (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full">
              هذا الجهاز
            </span>
          ) : (
            <button className="text-[11px] font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
              تسجيل خروج
            </button>
          )}
        </div>
      ))}

      <p className="text-xs text-gray-400 text-center pt-1">
        إذا لاحظت جهازاً غير معروف، سجّل خروجه فوراً وغيّر كلمة مرورك
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 3. منطقة الخطر
// ─────────────────────────────────────────────────────────────────
function DangerZone() {
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setDeleting(true)
    await new Promise(r => setTimeout(r, 1000))
    setDeleting(false)
    toast({ title: "تم إرسال طلب الحذف", description: "ستصلك رسالة تأكيد على بريدك الإلكتروني", variant: "destructive" })
    setConfirm(false)
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xs text-red-600/80 bg-red-50 rounded-xl p-3 leading-relaxed">
        ⚠️ بمجرد حذف حسابك، سيتم حذف جميع بياناتك وطلباتك وقائمة مفضلتك بشكل نهائي ولا يمكن التراجع عن هذه العملية.
      </p>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="flex items-center gap-2 text-red-600 border-2 border-red-100 px-5 py-2.5
            rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white hover:border-red-600
            transition-all duration-200"
        >
          <AlertTriangle className="h-4 w-4" />
          حذف الحساب نهائياً
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-red-700">هل أنت متأكد تماماً؟ هذا الإجراء لا يمكن التراجع عنه.</p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white
                font-bold py-2 px-5 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
              {deleting ? "جاري الحذف..." : "نعم، احذف حسابي"}
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="font-bold py-2 px-5 rounded-xl text-sm border-2 border-gray-200
                text-gray-600 hover:bg-gray-100 transition-all"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// المكوّن الرئيسي
// ─────────────────────────────────────────────────────────────────
export function SecurityPanel() {
  return (
    <div className="space-y-3" dir="rtl">

      <Section
        icon={KeyRound}
        title="تغيير كلمة المرور"
        subtitle="يُنصح بتغييرها كل 3 أشهر"
        iconBg="bg-violet-50"
        iconColor="text-violet-500"
        defaultOpen
      >
        <PasswordForm />
      </Section>

      <Section
        icon={Laptop}
        title="الأجهزة النشطة"
        subtitle="الأجهزة المسجّل دخولها حالياً"
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <ActiveDevices />
      </Section>

      <Section
        icon={AlertTriangle}
        title="منطقة الخطر"
        subtitle="حذف الحساب نهائياً — لا يمكن التراجع"
        iconBg="bg-red-50"
        iconColor="text-red-500"
        danger
      >
        <DangerZone />
      </Section>

    </div>
  )
}