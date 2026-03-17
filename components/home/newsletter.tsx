"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("idle")

    try {
      // استبدل هذا الرابط برابط Strapi الخاص بك
      const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      
      const response = await fetch(`${STRAPI_URL}/api/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // إذا كان الوصول يتطلب Token أضف السطر التالي:
          //"Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
        },
        body: JSON.stringify({
          data: { email: email } // Strapi يتوقع البيانات داخل كائن data
        }),
      })

      //if (!response.ok) throw new Error("Failed to subscribe")

      setStatus("success")
      setEmail("") 
    } catch (error) {
      console.error("Newsletter Error:", error)
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 bg-[#402d41] text-white border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight">اشترك في نشرتنا البريدية</h2>
          <p className="text-muted-foreground text-lg">
            احصل على أحدث العروض والخصومات مباشرة إلى بريدك الإلكتروني
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all">
              <Input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none text-white placeholder:text-gray-500 h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
                disabled={isLoading || status === "success"}
              />
              <Button 
                type="submit" 
                size="lg"
                className="rounded-xl px-8 font-bold h-12 transition-all active:scale-95"
                disabled={isLoading || status === "success"}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  "اشترك الآن"
                )}
              </Button>
            </div>

            {/* رسائل التغذية الراجعة */}
            <div className="absolute -bottom-10 left-0 right-0">
              {status === "success" && (
                <p className="text-sm text-emerald-400 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> شكراً لك! تم تسجيل بريدك بنجاح.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-rose-400 font-medium">
                  عذراً، حدث خطأ أثناء التسجيل. حاول مرة أخرى.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}