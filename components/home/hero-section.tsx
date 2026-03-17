// components/home/hero-section.tsx
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[600px] lg:h-[800px] flex items-center justify-center overflow-hidden">
      {/* 1. الخلفية (الصورة أو الـ Placeholder) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/unnamed.jpg" // استبدلها بمسار صورتك
          alt="Background Cover"
          fill
          className="object-cover"
          priority
        />
        {/* طبقة تظليل (Overlay) لجعل النص مقروءاً */}
        <div className="absolute inset-0 bg-black/50" /> 
      </div>

      {/* 2. المحتوى فوق الصورة */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
            تخفيضات الصيف
          </Badge>
          
          <h1 className="text-4xl lg:text-7xl font-bold leading-tight text-white">
            اكتشف تشكيلتنا الجديدة
            <span className="text-primary block mt-4">خصومات تصل إلى 50%</span>
          </h1>
          
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            أحدث المنتجات بأفضل الأسعار. توصيل سريع لجميع المناطق مع ضمان استرجاع خلال 14 يوم.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="h-12 px-8 text-lg gap-2">
                تسوق الآن
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg bg-white/10 text-white border-white/20 hover:bg-white/20">
                استكشف الفئات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}