import Link from "next/link"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { DisplayProduct } from "@/types/display"

interface FeaturedProductsProps {
  products: DisplayProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-12 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">منتجات مميزة</h2>
          <p className="text-muted-foreground">لا توجد منتجات مميزة حالياً</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2 text-gray-900">منتجات مميزة</h2>
          <p className="text-muted-foreground font-medium">اخترنا لك أفضل المنتجات بأفضل الأسعار</p>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>
        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  )
}