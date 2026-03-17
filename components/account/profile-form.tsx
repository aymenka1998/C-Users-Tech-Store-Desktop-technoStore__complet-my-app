// components/account/profile-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  user: {
    id: number
    email: string
    username: string
    fullName?: string
    phone?: string
    avatar?: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("فشل التحديث")

      toast({ title: "تم الحفظ ✅", description: "تم تحديث بياناتك" })
      router.refresh()
    } catch (error) {
      toast({ title: "خطأ ❌", description: "فشل تحديث البيانات", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {user.fullName?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold">{user.fullName || user.username}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الاسم الكامل</Label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="محمد أحمد"
          />
        </div>
        <div className="space-y-2">
          <Label>رقم الهاتف</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="05XX XXX XXX"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
        حفظ التغييرات
      </Button>
    </form>
  )
}