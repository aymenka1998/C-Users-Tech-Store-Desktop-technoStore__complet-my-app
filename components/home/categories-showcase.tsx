// components/home/categories-showcase.tsx
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
//import { DisplayCategory } from "@/types/display"
interface Category {
  id: string
  name: string
  slug: string
  count: number
  image?: string
}
export function CategoriesShowcase({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 bg-white" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">تسوق حسب الفئة</h2>
          <Link href="/categories" className="text-blue-600 hover:underline font-medium">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group overflow-hidden hover:border-blue-500 transition-all duration-300 border-gray-100 shadow-sm">
                <div className="relative aspect-4/3 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count || 0 } منتج</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}