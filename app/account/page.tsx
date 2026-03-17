"use client"
// app/account/page.tsx


import Link from "next/link"
import { ShoppingBag, Heart, Mail, CalendarDays, User } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import { type User as UserType } from "@/lib/auth"

function StatCard({
  icon: Icon, label, value, unit, href, colorClass, borderClass,
}: {
  icon: React.ElementType
  label: string; value: number; unit: string; href: string
  colorClass: string; borderClass: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm
        hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${borderClass}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 mb-0.5">{label}</p>
        <p className="text-xl font-black text-gray-900">
          {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
        </p>
      </div>
    </Link>
  )
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value?: string
}) {
  return (
    <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl">
      <span className="flex items-center gap-2 text-sm font-bold text-gray-500">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
    </div>
  )
}

// ─── يستقبل user مباشرة من AccountDashboard (لا localStorage) ────
export default function AccountOverviewPage({ user }: { user: UserType }) {
  const { count: wishlistCount } = useWishlist()

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-DZ")
    : undefined

  return (
    <div dir="rtl" className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={ShoppingBag} label="إجمالي المشتريات" value={0} unit="طلب"
          href="/account" colorClass="bg-blue-50 text-blue-500" borderClass="border-blue-100"
        />
        <StatCard
          icon={Heart} label="في قائمة المفضلة" value={wishlistCount} unit="منتج"
          href="/account" colorClass="bg-red-50 text-red-500" borderClass="border-red-100"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Mail className="h-4 w-4 text-violet-500" />
          <h3 className="font-black text-gray-800 text-sm">معلومات التواصل</h3>
        </div>
        <div className="p-4 space-y-2">
          <InfoRow icon={Mail}         label="البريد الإلكتروني" value={user?.email} />
          <InfoRow icon={CalendarDays} label="تاريخ الانضمام"   value={joinDate} />
          <InfoRow icon={User}         label="اسم المستخدم"     value={user?.username} />
        </div>
      </div>

    </div>
  )
}