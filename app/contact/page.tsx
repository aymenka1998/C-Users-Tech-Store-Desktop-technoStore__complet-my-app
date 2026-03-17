"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast" // المسار الصحيح غالباً هو @/hooks/use-toast
import { sendContactMessage } from "@/lib/strapi"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    
    // تأكد أن هذه الأسماء (name, email, subject, content) 
    // مطابقة تماماً لما أنشأته في Strapi Content-Type Builder
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      content: formData.get("content") as string,
    }

    try {
      await sendContactMessage(data)
      toast({ 
        title: "تم الإرسال بنجاح!", 
        description: "شكراً لتواصلك معنا، سنرد عليك قريباً." 
      })
      ;(event.target as HTMLFormElement).reset()
    } catch (error: any) {
      console.error("Contact Form Error:", error)
      toast({ 
        variant: "destructive", 
        title: "خطأ في الإرسال", 
        description: error.message || "تأكد من إعدادات Strapi والحقول." 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 text-right" dir="rtl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
        <p className="text-muted-foreground">نحن هنا للإجابة على استفساراتك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
           {/* معلومات الاتصال هنا */}
           <div className="flex gap-4 justify-start items-center">
              <Mail className="text-primary" />
              <span>support@techstore.dz</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input name="name" placeholder="الاسم الكامل" required />
            <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
            <Input name="subject" placeholder="الموضوع" required />
            <Textarea name="content" placeholder="رسالتك..." className="min-h-[150px]" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "إرسال"}
          </Button>
        </form>
      </div>
    </div>
  )
}