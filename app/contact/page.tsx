"use client"
// app/contact/page.tsx

import { useState, FormEvent } from "react" // استيراد FormEvent لتحديد نوع الحدث
import { Mail } from "lucide-react" 
// تم حذف Phone, MapPin, Send لأنها لم تكن مستخدمة لإصلاح أخطاء ESLint

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  // ✅ حل مشكلة "Unexpected any" بتحديد نوع الحدث كـ FormEvent
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      // منطق الإرسال الخاص بك هنا (مثلاً إلى API Route)
      console.log("Form Data:", data)
      setStatus({ type: 'success', msg: 'تم إرسال رسالتك بنجاح!' })
    } catch (error) {
      setStatus({ type: 'error', msg: 'حدث خطأ، يرجى المحاولة لاحقاً.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">اتصل بنا</h1>
          <p className="text-muted-foreground mt-2">نحن هنا للإجابة على استفساراتك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">الاسم</label>
              <input name="name" required className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <input name="email" type="email" required className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">الموضوع</label>
            <input name="subject" required className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">الرسالة</label>
            {/* تحسين كلاس Tailwind لتجنب التحذير */}
            <textarea name="message" required className="w-full p-3 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-primary outline-none transition-all min-h-37.5" rows={5} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>

          {status && (
            <p className={`text-center text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}