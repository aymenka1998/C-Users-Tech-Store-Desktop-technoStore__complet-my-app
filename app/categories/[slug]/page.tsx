export const dynamic = 'force-dynamic';
import { getCategoryBySlug, getProducts } from "@/lib/strapi"
import { ProductCard } from "@/components/product/product-card"
import { notFound } from "next/navigation"
import { ArrowLeft, ShoppingBag, Filter } from "lucide-react"
import Link from "next/link"
import { Product, StrapiResponse } from "@/types/strapi"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

interface NormalizedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
  rating: number
  reviewsCount: number
  category: string
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

function getProductImageUrl(product: Product): string {
  const attrs = (product.attributes || product) as Record<string, unknown>
  
  // Strapi v5: image مصفوفة
  const imageRaw = attrs.image
  const image = Array.isArray(imageRaw) ? imageRaw[0] : imageRaw as {
    url?: string
    formats?: { medium?: { url?: string }; small?: { url?: string } }
  } | undefined

  const url =
    image?.url ||
    image?.formats?.medium?.url ||
    image?.formats?.small?.url ||
    ""

  if (!url) return "https://placehold.co/400x400?text=No+Image"
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const rawCategory = await getCategoryBySlug(slug)
  if (!rawCategory) notFound()

  const categoryAttrs = (rawCategory as unknown) as Record<string, unknown>
  const categoryName = String(categoryAttrs.name || (categoryAttrs.attributes as Record<string, unknown>)?.name || "فئة غير معروفة")

  const productsResponse: StrapiResponse<Product> = await getProducts({
    filters: { category: { slug: { $eq: slug } } },
    populate: "*",
  })

  const normalizedProducts: NormalizedProduct[] = (productsResponse.data || []).map((item) => {
    const attrs = (item.attributes || item) as Record<string, unknown>
    return {
      id: String(item.id),
      name: String(attrs.name || ""),
      price: Number(attrs.price) || 0,
      originalPrice: attrs.originalPrice ? Number(attrs.originalPrice) : undefined,
      image: getProductImageUrl(item),
      slug: String(attrs.slug || item.id),
      rating: Number(attrs.rating) || 0,
      reviewsCount: Number(attrs.reviewsCount) || 0,
      category: categoryName,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-700 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-gray-700 transition-colors">الأقسام</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{categoryName}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                {categoryName}
                <span className="text-blue-500 text-xl mr-3 font-bold">
                  {normalizedProducts.length} منتج
                </span>
              </h1>
              <p className="text-gray-500 text-lg">أفضل المنتجات في قسم {categoryName}</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-blue-600 transition-all w-fit">
              <Filter className="w-4 h-4" />
              تصفية
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {normalizedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">هذا القسم فارغ حالياً</h3>
            <p className="text-gray-400 mb-8">سيتم إضافة منتجات قريباً</p>
            <Link
              href="/categories"
              className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للأقسام
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{direction: "ltr"}}>
  {normalizedProducts.map((product) => (
    <div key={product.id} style={{direction: "rtl"}}>
      <ProductCard product={product} />
    </div>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-black mb-3">لم تجد ما تبحث عنه؟</h2>
          <p className="text-gray-400 mb-6">فريقنا جاهز لمساعدتك</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  )
}