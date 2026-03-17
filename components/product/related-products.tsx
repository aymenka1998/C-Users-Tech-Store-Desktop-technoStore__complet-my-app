// components/product/related-products.tsx
import Link from "next/link"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  rating: number
  reviewsCount: number
  category: string
}

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">منتجات مشابهة</h2>
        <Link href="/products">
          <Button variant="ghost" className="gap-2">
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}