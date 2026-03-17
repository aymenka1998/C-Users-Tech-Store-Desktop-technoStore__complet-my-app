// components/layout/mobile-nav.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, ChevronLeft, Home, Box, Grid, Tag, MessageCircle, User, LogIn, UserPlus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import { getCookie } from "cookies-next"

interface MobileNavProps {
  links: { href: string; label: string }[]
}

const icons: any = {
  "/": Home,
  "/products": Box,
  "/categories": Grid,
  "/offers": Tag,
  "/contact": MessageCircle
}

export function MobileNav({ links }: MobileNavProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = getCookie("jwt")
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="flex flex-col h-full py-4" dir="rtl">
      {/* رأس القائمة */}
      <div className="flex items-center justify-between mb-8 border-b pb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Box className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900">القائمة</span>
        </div>
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </SheetClose>
      </div>

      {/* روابط التنقل */}
      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const Icon = icons[link.href] || ChevronLeft
          return (
            <SheetClose key={link.href} asChild>
              <Link
                href={link.href}
                className="flex items-center justify-between py-4 px-4 rounded-2xl hover:bg-gray-50 group transition-all"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-primary" />
                  <span className="font-bold text-gray-700 group-hover:text-primary">{link.label}</span>
                </div>
                <ChevronLeft className="h-4 w-4 text-gray-300" />
              </Link>
            </SheetClose>
          )
        })}
      </nav>

      {/* ✅ قسم الحساب في أسفل القائمة (Mobile) */}
      <div className="mt-auto border-t pt-6 px-2">
        {isAuthenticated ? (
          <div className="space-y-3">
            <SheetClose asChild>
              <Link href="/account">
                <Button className="w-full justify-start gap-3 h-14 rounded-2xl bg-primary/5 text-primary hover:bg-primary/10 border-none">
                  <User className="h-5 w-5" />
                  <span className="font-bold">لوحة التحكم (حسابي)</span>
                </Button>
              </Link>
            </SheetClose>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="h-5 w-5" />
              <span className="font-bold">تسجيل الخروج</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <SheetClose asChild>
              <Link href="/login">
                <Button variant="outline" className="w-full gap-2 h-12 rounded-2xl font-bold border-2">
                  <LogIn className="h-4 w-4" />
                  دخول
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/register">
                <Button className="w-full gap-2 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20">
                  <UserPlus className="h-4 w-4" />
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