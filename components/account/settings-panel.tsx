"use client"

import { useState, useActionState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateAccountAction } from "@/app/auth/account/actions"
import { type User as UserType } from "@/lib/auth"
import {
  User, Phone, Mail, Lock, Bell,
  ChevronDown, ChevronUp, Loader2, Check,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// مكوّن القسم القابل للطي
// ─────────────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  subtitle,
  iconColor,
  iconBg,
  children,
  defaultOpen = false,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  iconColor: string
  iconBg: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-800 text-sm">{title}</p>
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
// حقل إدخال موحّد
// ─────────────────────────────────────────────────────────────────
function Field({
  label, name, type = "text", defaultValue, placeholder, required,
}: {
  label: string; name: string; type?: string
  defaultValue?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 block">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800
          placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white
          transition-all text-right text-sm"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// زر الحفظ
// ─────────────────────────────────────────────────────────────────
function SaveButton({ isPending }: { isPending: boolean }) {
  return (
    <div className="flex justify-end pt-3">
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 bg-gradient-to-l from-violet-600 to-blue-500
          hover:from-violet-500 hover:to-blue-400 text-white font-bold py-2.5 px-6
          rounded-xl transition-all hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 text-sm"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 1. تعديل الاسم ورقم الهاتف
// ─────────────────────────────────────────────────────────────────
function ProfileForm({ user }: { user: UserType }) {
  const [state, formAction, isPending] = useActionState(updateAccountAction, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) toast({ title: "تم تحديث المعلومات ✅" })
    if (state?.error)   toast({ title: "خطأ", description: state.error, variant: "destructive" })
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-4 mt-4">
      <input type="hidden" name="type" value="profile" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="الاسم الكامل"  name="fullName" defaultValue={user.fullName} placeholder="أدخل اسمك بالكامل" />
        <Field label="اسم المستخدم" name="username"  defaultValue={user.username} placeholder="@username" />
      </div>
      <Field label="رقم الهاتف" name="phone" type="tel" defaultValue={user.phone} placeholder="05xxxxxxxx" />
      <SaveButton isPending={isPending} />
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────
// 2. تغيير البريد الإلكتروني
// ─────────────────────────────────────────────────────────────────
function EmailForm({ user }: { user: UserType }) {
  const [state, formAction, isPending] = useActionState(updateAccountAction, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) toast({ title: "تم تحديث البريد ✅" })
    if (state?.error)   toast({ title: "خطأ", description: state.error, variant: "destructive" })
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-4 mt-4">
      <input type="hidden" name="type" value="email" />
      <Field
        label="البريد الإلكتروني الحالي"
        name="currentEmail"
        type="email"
        defaultValue={user.email}
        placeholder={user.email}
      />
      <Field label="البريد الجديد"    name="newEmail"     type="email" placeholder="example@email.com" required />
      <Field label="تأكيد البريد"     name="confirmEmail" type="email" placeholder="example@email.com" required />
      <SaveButton isPending={isPending} />
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────
// 3. تغيير كلمة المرور
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
      <Field label="كلمة المرور الحالية" name="currentPassword" type="password" placeholder="••••••••" required />
      <Field label="كلمة المرور الجديدة" name="newPassword"     type="password" placeholder="••••••••" required />
      <Field label="تأكيد كلمة المرور"   name="confirmPassword" type="password" placeholder="••••••••" required />
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
        🔒 يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على أرقام وحروف
      </p>
      <SaveButton isPending={isPending} />
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────
// 4. إعدادات الإشعارات
// ─────────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { key: "orders",     label: "تحديثات الطلبات",    desc: "عند تغيير حالة طلبك" },
  { key: "offers",     label: "العروض والخصومات",   desc: "آخر العروض الحصرية" },
  { key: "security",   label: "تنبيهات الأمان",     desc: "تسجيل دخول جديد أو نشاط غير عادي" },
  { key: "newsletter", label: "النشرة الإخبارية",  desc: "أخبار المتجر والمنتجات الجديدة" },
]

function NotificationsForm() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    orders: true, offers: true, security: true, newsletter: false,
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800)) // placeholder
    setSaving(false)
    toast({ title: "تم حفظ إعدادات الإشعارات ✅" })
  }

  return (
    <div className="mt-4 space-y-3">
      {NOTIFICATIONS.map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm font-bold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
          {/* Toggle */}
          <button
            type="button"
            onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0
              ${prefs[key] ? "bg-violet-500" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
              ${prefs[key] ? "right-0.5" : "left-0.5"}`}
            />
          </button>
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-l from-violet-600 to-blue-500
            hover:from-violet-500 hover:to-blue-400 text-white font-bold py-2.5 px-6
            rounded-xl transition-all hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 text-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {saving ? "جاري الحفظ..." : "حفظ التفضيلات"}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// المكوّن الرئيسي — يُستخدم في AccountDashboard
// ─────────────────────────────────────────────────────────────────
export function SettingsPanel({ user }: { user: UserType }) {
  return (
    <div className="space-y-3" dir="rtl">

      <Section
        icon={User}
        title="المعلومات الشخصية"
        subtitle="الاسم، اسم المستخدم، رقم الهاتف"
        iconBg="bg-violet-50"
        iconColor="text-violet-500"
        defaultOpen
      >
        <ProfileForm user={user} />
      </Section>

      <Section
        icon={Mail}
        title="البريد الإلكتروني"
        subtitle="تغيير عنوان بريدك الإلكتروني"
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      >
        <EmailForm user={user} />
      </Section>

      <Section
        icon={Lock}
        title="كلمة المرور"
        subtitle="تغيير كلمة المرور الحالية"
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
      >
        <PasswordForm />
      </Section>

      <Section
        icon={Bell}
        title="الإشعارات"
        subtitle="تحكم في الإشعارات التي تصلك"
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
      >
        <NotificationsForm />
      </Section>

    </div>
  )
}