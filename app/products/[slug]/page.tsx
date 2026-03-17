// app/products/[slug]/page.tsx
// ✅ Server Component - بدون "use client"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductReviews } from "@/components/product/product-reviews"
import { Separator } from "@/components/ui/separator"
import { getProductBySlug} from "@/lib/strapi"
import { Product, StrapiImage } from "@/types/strapi"
import { getStrapiMedia, flattenAttributes } from "@/lib/strapi-helpers"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

interface StrapiRawProduct {
  id: number
  documentId?: string
  [key: string]: unknown
}

interface FlattenedProduct extends Omit<Product, 'category' | 'image'> {
  images?: StrapiImage[]
  image?: StrapiImage | StrapiImage[]
  category?: { name: string; slug: string }
  reviews?: Array<{
    id: number
    documentId?: string
    rating: number
    comment: string
    user?: { username: string }
    createdAt: string
  }>
  features?: string[]
  rating?: number
  stock?: number
  sku?: string
  originalPrice?: number
}

interface FlattenedProductWithQuantite extends FlattenedProduct {
  quantite?: number
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const rawProduct = await getProductBySlug(slug)
  if (!rawProduct) return { title: "المنتج غير موجود" }

  const p = flattenAttributes<FlattenedProduct>(rawProduct)
  return {
    title: `${p.name} | متجري`,
    description: p.description?.substring(0, 160),
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const rawProduct = await getProductBySlug(slug)
  if (!rawProduct) notFound()

  const rawProductTyped = rawProduct as StrapiRawProduct
  const p = flattenAttributes<FlattenedProductWithQuantite>(rawProduct)

  // ✅ معالجة الصور
  let imageUrls: string[] = []

  if (p.images && p.images.length > 0) {
    imageUrls = p.images.map(
      (img) => getStrapiMedia(img.url || null) || "/images/placeholder.jpg"
    )
  } else if (p.image) {
    const imageArray = Array.isArray(p.image) ? p.image : [p.image]
    imageUrls = imageArray.map(
      (img) => getStrapiMedia(img.url || null) || "/images/placeholder.jpg"
    )
  }

  if (imageUrls.length === 0) {
    imageUrls = ["/images/placeholder.jpg"]
  }

  // ✅ بيانات المنتج
  const productData = {
    id: String(rawProductTyped.documentId || rawProductTyped.id),
    name: p.name || "",
    price: p.price || 0,
    originalPrice: p.originalPrice || 0,
    description: p.description || "",
    slug: slug,
    images: imageUrls,
    image: imageUrls[0],
    rating: p.rating || 0,
    reviewsCount: p.reviews?.length || 0,
    stock: p.quantite ?? p.stock ?? 0,
    quantite: p.quantite ?? p.stock ?? 0,
    sku: p.sku || "N/A",
    category: p.category?.name || "عام",
    features: p.features || [],
  }

  // ✅ معالجة التقييمات مع documentId
  const reviews = p.reviews?.map((rev) => ({
    id: String(rev.documentId || rev.id),
    rating: rev.rating || 0,
    comment: rev.comment || "",
    user: rev.user?.username || "مستخدم",
    date: rev.createdAt || new Date().toISOString(),
  })) || []

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">

        <ProductGallery images={productData.images} productName={productData.name} />

        <div className="flex flex-col gap-6">
          <ProductInfo product={productData} />

          {productData.features.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-3 text-lg">أهم المميزات:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {productData.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      <Separator className="my-12" />

      <div id="reviews" className="scroll-mt-24">
        <ProductReviews
          productId={productData.id}
          productNumericId={rawProductTyped.id}
          slug={slug}
          reviews={reviews}
          rating={productData.rating}
          reviewsCount={productData.reviewsCount}
        />
      </div>
    </div>
  )
}