"use client"
import { getCookie as getClientCookie } from "cookies-next"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, ShoppingBag, User, X,
  Home, Box, Grid, Tag, MessageCircle, ChevronLeft, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { CartSheet } from "@/components/cart/cart-sheet"
import { SearchBar } from "@/components/layout/search-bar"
import { MobileSearch } from "@/components/layout/mobile-search"
import { Separator } from "@/components/ui/separator"
import { useWishlist } from "@/context/wishlist-context"

interface NavLink {
  href: string
  label: string
  icon: React.ElementType
}

const navLinks: NavLink[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/products", label: "المنتجات", icon: Box },
  { href: "/categories", label: "الفئات", icon: Grid }, 
  { href: "/offers", label: "العروض", icon: Tag },
  { href: "/contact", label: "تواصل معنا", icon: MessageCircle },
]

export function Navbar() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { count: wishlistCount } = useWishlist()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getClientCookie("jwt")
        setIsAuthenticated(!!token)
      } catch (error) {
        console.error("Cookie error:", error)
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [pathname])

  if (pathname.startsWith('/account')) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 p-0 flex flex-col">
                <MobileNavigation links={navLinks} isAuthenticated={isAuthenticated} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:-rotate-6">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter hidden sm:block">
                TECH<span className="text-primary">STORE</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar placeholder="ماذا تبحث عنه اليوم؟" />
          </div>

          <div className="flex items-center gap-2">
            <MobileSearch />

            {/* زر المفضلة */}
            <Link href="/account?tab=wishlist" className="relative">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/account">
                  <Button variant="ghost" className="gap-2 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <User className="h-4 w-4" />
                    <span className="font-bold text-sm">حسابي</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="font-bold text-sm">دخول</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="font-bold text-sm rounded-xl shadow-md px-6">انضم إلينا</Button>
                  </Link>
                </>
              )}
            </div>
            <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />
            <CartSheet />
          </div>
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-10 h-12 border-t border-gray-50/50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-bold transition-all hover:text-primary relative py-1 ${
                pathname === link.href ? "text-primary" : "text-gray-500"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 right-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function MobileNavigation({ 
  links, 
  isAuthenticated 
}: { 
  links: NavLink[]
  isAuthenticated: boolean 
}) {
  return (
    <div className="flex flex-col h-full bg-white" dir="rtl">
      <div className="p-6 border-b flex items-center justify-between bg-primary/5">
        <span className="text-xl font-black text-primary underline decoration-2 underline-offset-8">القائمة</span>
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </SheetClose>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => (
          <SheetClose key={link.href} asChild>
            <Link
              href={link.href}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 group transition-all"
            >
              <div className="flex items-center gap-4 text-gray-700 font-bold group-hover:text-primary">
                <link.icon className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                {link.label}
              </div>
              <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
            </Link>
          </SheetClose>
        ))}
      </div>

      <div className="p-6 border-t bg-gray-50/50">
        {isAuthenticated ? (
          <SheetClose asChild>
            <Link href="/account" className="w-full">
              <Button className="w-full h-14 rounded-2xl gap-3 font-bold shadow-xl shadow-primary/20">
                <User className="h-5 w-5" />
                لوحة التحكم
              </Button>
            </Link>
          </SheetClose>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SheetClose asChild>
              <Link href="/login">
                <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2 border-primary/20 text-primary">
                  دخول
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/register">
                <Button className="w-full h-12 rounded-2xl font-bold">
                  تسجيل
                </Button>
              </Link>
            </SheetClose>
          </div>
        )}
      </div>
    </div>
  )
}











