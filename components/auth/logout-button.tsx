//components/auth/logout-button.tsx
"use client"

import { LogOut, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import { logoutAction } from "@/app/auth/logout/actions"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async (formData: FormData) => {
    await logoutAction()
    // إجبار المتصفح على إعادة تحميل البيانات لتحديث الـ Navbar (isAuthenticated)
    router.refresh()
  }

  return (
    <form action={handleLogout}>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      variant="ghost" 
      disabled={pending}
      className="w-full flex items-center justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span className="font-bold">تسجيل الخروج</span>
    </Button>
  )
}