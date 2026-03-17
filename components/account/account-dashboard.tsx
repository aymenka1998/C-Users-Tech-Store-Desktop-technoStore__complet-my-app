"use client"
import AccountOverviewPage from "@/app/account/page"
import { useState, useActionState, useEffect, useRef, useTransition } from "react"
import {
  User, ShoppingBag, MapPin, Heart, LogOut, Package,
  Settings, Loader2, Camera, Mail, ShieldCheck,
  Home, Grid3X3, Tag, MessageCircle, LayoutDashboard, ChevronLeft,
  Menu, // تم إضافة أيقونة القائمة
  type LucideIcon
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { updateAccountAction, uploadImageAction } from "@/app/auth/account/actions"
import { type User as UserType } from "@/lib/auth"
import { deleteCookie } from "cookies-next"
import { WishlistItems } from "@/components/account/wishlist-items"
import { useWishlist } from "@/context/wishlist-context"
import {OrdersList} from "@/components/account/orders-list"
import { SettingsPanel } from "@/components/account/settings-panel"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // تأكد من وجود المكون
import {SecurityPanel} from "@/components/account/security-panel"
// ─────────────────────────────────────────────────────────────────
// Sidebar — الشريط الجانبي الأيمن
// ─────────────────────────────────────────────────────────────────
interface NavContentProps {
  isAdmin: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
  pathname: string;
  closeSheet?: () => void;
}
const STORE_NAV = [
  { href: "/",          label: "الرئيسية",    Icon: Home },
  { href: "/products",   label: "المنتجات",    Icon: ShoppingBag },
  { href: "/categories", label: "الفئات",     Icon: Grid3X3 },
  { href: "/offers",     label: "العروض",     Icon: Tag },
  { href: "/contact",    label: "تواصل معنا", Icon: MessageCircle },
]

// مكون محتوى القائمة (مفصول لتجنب التكرار)
function NavContent({ isAdmin, onLogout, isLoggingOut, pathname, closeSheet }: NavContentProps) {
  return (
    <>
      <Link href="/" className="flex items-center gap-2 group px-5 pt-6" onClick={closeSheet}>
        <div className="bg-primary w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:-rotate-6">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-black tracking-tighter">
          TECH<span className="text-primary">STORE</span>
        </span>
      </Link>
              
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-5 pt-5 pb-2"> 
        التنقل في المتجر
      </p>

      <nav className="flex flex-col gap-0.5 px-2">
        {STORE_NAV.map(({ href, label, Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={closeSheet}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
                ${isActive
                  ? "bg-violet-50 text-violet-600 font-bold border-r-2 border-violet-500"
                  : "text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 border-r-2 border-transparent"
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? "text-violet-500" : "text-gray-400 group-hover:text-gray-600"}`} />
                {label}
              </span>
              <ChevronLeft className={`h-3.5 w-3.5 ${isActive ? "text-violet-400" : "text-gray-300"}`} />
            </Link>
          )
        })}
      </nav>

      <div className="mx-4 my-3 h-px bg-gray-100" />

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-5 pb-2">
        إدارة الحساب
      </p>

      <div className="flex flex-col gap-0.5 px-2 pb-4">
        {isAdmin && (
          <Link
            href="/admin"
            onClick={closeSheet}
            className="flex items-center gap-2.5 mx-1 my-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white
              bg-linear-to-l from-violet-600 to-blue-500 hover:opacity-90
              shadow-md shadow-violet-200 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            لوحة التحكم
          </Link>
        )}

        <button
          onClick={() => { onLogout(); closeSheet?.(); }}
          disabled={isLoggingOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500
            hover:bg-red-50 transition-all duration-150 disabled:opacity-50 w-full text-right"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          تسجيل الخروج
        </button>
      </div>
    </>
  )
}

function AccountSidebar({
  isAdmin,
  onLogout,
  isLoggingOut,
}: {
  isAdmin: boolean
  onLogout: () => void
  isLoggingOut: boolean
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 📱 نسخة الهاتف: الزر العائم والـ Sheet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="w-14 h-14 bg-violet-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0 border-none rounded-l-3xl overflow-hidden" dir="rtl">
             <NavContent 
              isAdmin={isAdmin} 
              onLogout={onLogout} 
              isLoggingOut={isLoggingOut} 
              pathname={pathname}
              closeSheet={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* 💻 نسخة الحاسوب: Sidebar الثابت */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden self-start sticky top-6">
        <NavContent 
          isAdmin={isAdmin} 
          onLogout={onLogout} 
          isLoggingOut={isLoggingOut} 
          pathname={pathname}
        />
      </aside>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// المكوّن الرئيسي (لم يتغير فيه شيء سوى الحفاظ على الهيكلية)
// ─────────────────────────────────────────────────────────────────
export function AccountDashboard({ user }: { user: UserType }) {
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { count: wishlistCount } = useWishlist()
  const [, startTransition] = useTransition()

  const [coverImage, setCoverImage] = useState<string | null>(
    (user as UserType & { coverImage?: string }).coverImage || null
  )
  const [avatarImage, setAvatarImage] = useState<string | null>(user.avatar || null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (
    file: File,
    type: "avatar" | "cover",
    maxSize: number,
    onSuccess: (url: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({ title: "الصورة كبيرة جداً", description: `الحد الأقصى ${maxSize}MB`, variant: "destructive" })
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    startTransition(async () => {
      const result = await uploadImageAction(formData)
      if (result?.success && result.imageUrl) {
        onSuccess(result.imageUrl)
        toast({ title: type === "avatar" ? "تم تحديث صورة الملف الشخصي ✅" : "تم تحديث صورة الغلاف ✅" })
      } else {
        toast({ title: "خطأ", description: result?.error || "فشل الرفع", variant: "destructive" })
      }
      setUploading(false)
    })
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleImageUpload(file, "cover", 5, setCoverImage, setUploadingCover)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleImageUpload(file, "avatar", 3, setAvatarImage, setUploadingAvatar)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    deleteCookie("jwt")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const isAdmin = !!(user as UserType & { role?: { type?: string } }).role?.type &&
    (user as UserType & { role?: { type?: string } }).role?.type !== "authenticated"

  const userInitials = user.username?.slice(0, 2).toUpperCase() || "U"

  return (
    <div className="flex gap-5 items-start pb-10" dir="rtl">
      <AccountSidebar
        isAdmin={isAdmin}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <div className="flex-1 min-w-0">
        {/* بطاقة الملف الشخصي */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div
            className="h-40 relative overflow-hidden cursor-pointer group"
            style={{
              background: coverImage
                ? `url(${coverImage}) center/cover no-repeat`
                : "linear-gradient(to left, #7c3aed, #3b82f6)"
            }}
            onClick={() => !uploadingCover && coverInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
              {uploadingCover ? (
                <div className="bg-black/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
                  <Loader2 className="h-4 w-4 animate-spin" /> جاري الرفع...
                </div>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
                  <Camera className="h-4 w-4" />
                  {coverImage ? "تغيير الغلاف" : "إضافة صورة الغلاف"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click() }}
              disabled={uploadingCover}
              className="absolute bottom-3 left-3 bg-white/20 hover:bg-white/40 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/30 disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" />
              {coverImage ? "تغيير الغلاف" : "تعديل الغلاف"}
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              <div className="relative group cursor-pointer shrink-0" onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}>
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={avatarImage || undefined} />
                  <AvatarFallback className="bg-linear-to-br from-violet-100 to-blue-100 text-violet-600 text-2xl font-black">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center border-4 border-white">
                  {uploadingAvatar
                    ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                    : <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  }
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click() }}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 bg-white border-2 border-gray-100 p-1.5 rounded-full shadow-md hover:border-violet-200 transition-colors disabled:opacity-50"
                >
                  <Camera className="h-3.5 w-3.5 text-gray-600" />
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <div className="flex-1 text-center sm:text-right pb-1">
                <h1 className="text-2xl font-black text-gray-900">{user.fullName || user.username}</h1>
                <p className="text-gray-400 text-sm font-medium">@{user.username}</p>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all font-bold text-sm disabled:opacity-50 lg:hidden"
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6">
            <TabsList className="flex flex-wrap h-auto bg-transparent gap-1 p-0">
              <SideTabTrigger value="overview"  icon={User}        label="نظرة عامة" />
              <SideTabTrigger value="orders"    icon={ShoppingBag} label="الطلبات" />
              <SideTabTrigger value="wishlist"  icon={Heart}       label={`المفضلة${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`} />
              <SideTabTrigger value="addresses" icon={MapPin}      label="العناوين" />
              <SideTabTrigger value="settings"  icon={Settings}     label="الإعدادات" />
              <SideTabTrigger value="security"  icon={ShieldCheck} label="الأمان" />
            </TabsList>
          </div>

          <TabsContent value="overview" className="m-0 space-y-4 outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard icon={ShoppingBag} title="إجمالي المشتريات" value="0 طلب" color="blue" />
              <StatCard icon={Heart} title="في قائمة المفضلة" value={`${wishlistCount} منتج`} color="red" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-violet-500" /> معلومات التواصل
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm font-bold">البريد الإلكتروني</span>
                  <span className="text-gray-800 text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm font-bold">تاريخ الانضمام</span>
                  <span className="text-gray-800 text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="m-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-blue-400" /> طلباتي
              </h3>
              <OrdersList />
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="m-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-400" /> قائمة المفضلة
              </h3>
              <WishlistItems />
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="m-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-black text-gray-800 mb-1">لا توجد عناوين محفوظة</h3>
              <p className="text-gray-400 text-sm">أضف عناوين الشحن لتسريع عملية الطلب</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0 outline-none">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
                <Settings className="h-4 w-4 text-violet-400" /> الإعدادات
              </h3>
              <SettingsPanel user={user} />
            </div>
          </TabsContent>

        <TabsContent value="security" className="m-0 outline-none">
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
      <ShieldCheck className="h-4 w-4 text-violet-400" /> الأمان
    </h3>
    <SecurityPanel />
  </div>
</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// مكوّنات مساعدة — لم تتغير
// ─────────────────────────────────────────────────────────────────
function ProfileUpdateForm({ user }: { user: UserType }) {
  const [state, formAction, isPending] = useActionState(updateAccountAction, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) toast({ title: "تم التحديث بنجاح ✅" })
    if (state?.error) toast({ title: "خطأ", description: state.error, variant: "destructive" })
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700 block">الاسم الكامل</label>
        <input
          name="fullName"
          defaultValue={user.fullName}
          placeholder="أدخل اسمك بالكامل"
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700 block">رقم الهاتف</label>
        <input
          name="phone"
          defaultValue={user.phone}
          placeholder="05xxxxxxxx"
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:bg-white transition-all text-right text-sm"
        />
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-linear-to-l from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-200 disabled:opacity-40 flex items-center gap-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  )
}

function SideTabTrigger({ value, icon: Icon, label }: { value: string; icon: LucideIcon; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
        data-[state=active]:bg-linear-to-l data-[state=active]:from-violet-600 data-[state=active]:to-blue-500
        data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-violet-200
        text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
    >
      <Icon className="h-4 w-4" />
      {label}
    </TabsTrigger>
  )
}

function StatCard({ icon: Icon, title, value, color }: {
  icon: LucideIcon; title: string; value: string; color: "blue" | "red" | "violet"
}) {
  const colors = {
    blue:   "bg-blue-50 text-blue-500",
    red:    "bg-red-50 text-red-500",
    violet: "bg-violet-50 text-violet-500",
  }
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold">{title}</p>
        <p className="text-xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  )
}