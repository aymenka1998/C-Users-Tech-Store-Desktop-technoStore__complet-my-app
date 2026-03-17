// app/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <SearchX className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-4">الصفحة غير موجودة</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/">
          <Button size="lg">العودة للرئيسية</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">
            تصفح المنتجات
          </Button>
        </Link>
      </div>
    </div>
  )
}