import Link from "next/link"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { DisplayProduct } from "@/types/display"

interface NewArrivalsProps {
  products: DisplayProduct[]
}

export function NewArrivals({ products }: NewArrivalsProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
          <div className="text-right">
            <h2 className="text-3xl font-black text-gray-900 mb-2">وصل حديثاً</h2>
            <p className="text-gray-500 font-medium">استكشف أحدث الإضافات في متجرنا قبل الجميع</p>
          </div>
          <Link href="/products?sort=newest">
            <Button
              variant="outline"
              className="group rounded-xl border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all font-bold px-6 h-12"
            >
              عرض جميع المنتجات
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  )
}