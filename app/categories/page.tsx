export const dynamic = 'force-dynamic';
import Link from "next/link"
import Image from "next/image"
import { getCategories } from "@/lib/strapi"
import { Category } from "@/types/strapi"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

function getCategoryImageUrl(category: Category): string {
  const attrs = (category.attributes || category) as Record<string, unknown>
  // Strapi v5: images مباشرة بدون data
  const images = attrs.images as { url?: string } | undefined
  const image = attrs.image as { data?: { attributes?: { url?: string } } } | undefined
  const url = images?.url || image?.data?.attributes?.url || ""
  if (!url) return ""
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
}

export default async function CategoriesPage() {
  const response = await getCategories()
  const categories: Category[] = response.data || []

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 text-right">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-4">
            الأقسام
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-3">تصفح حسب القسم</h1>
          <p className="text-gray-500 text-lg">اختر القسم الذي يناسبك للوصول لأفضل المنتجات</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const attrs = (category.attributes || category) as Record<string, unknown>
            const imageUrl = getCategoryImageUrl(category)
            const productArray = attrs.product as unknown[] | undefined
            const productCount = Array.isArray(productArray) ? productArray.length : 0

            return (
              <Link
                key={category.id}
                href={`/categories/${attrs.slug}`}
                className="group flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                {/* صورة الفئة */}
                <div className="relative w-24 h-24 mb-5 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-blue-200 transition-colors duration-300">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={String(attrs.name || "")}
                      fill
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index === 0}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                  )}
                </div>

                {/* اسم الفئة */}
                <h3 className="font-bold text-gray-800 text-lg text-center group-hover:text-blue-600 transition-colors mb-2">
                  {String(attrs.name || "")}
                </h3>

                {/* عدد المنتجات */}
                <span className="text-xs text-gray-400 font-medium">
                  {productCount > 0 ? `${productCount} منتج` : "اكتشف الآن"}
                </span>

                {/* شريط سفلي */}
                <div className="mt-4 w-0 group-hover:w-12 h-0.5 bg-blue-500 rounded-full transition-all duration-300" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}