import { getProducts, getCategories } from "@/lib/strapi"
import { ProductCard } from "@/components/product/product-card"
import { CategoryFilter } from "@/components/filters/category-filter"
import { PriceFilter } from "@/components/filters/price-filter"
import { SortSelect } from "@/components/filters/sort-select"
import { ActiveFilters } from "@/components/filters/active-filters"
import { RatingFilter } from "@/components/filters/rating-filter"
import { MobileFilters } from "@/components/filters/mobile-filters"
export const metadata = {
  title: " المنتجات | TechStore",
  description: "اكتشف أفضل العروض والخصومات على المنتجات التقنية",
};

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

interface SearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
  rating?: string
}

interface ProductPageProps {
  searchParams: Promise<SearchParams>
}

interface StrapiProduct {
  id: number
  documentId?: string
  name?: string
  slug?: string
  price?: number
  originalPrice?: number
  isSale?: boolean
  isNew?: boolean
  rating?: number
  reviewsCount?: number
  category?: { name?: string; slug?: string }
  image?: Array<{ url?: string }> | { url?: string }
  attributes?: {
    name?: string
    slug?: string
    price?: number
    originalPrice?: number
    isSale?: boolean
    isNew?: boolean
    rating?: number
    reviewsCount?: number
    category?: { data?: { attributes?: { name?: string } } }
    image?: { data?: Array<{ attributes?: { url?: string } }> }
  }
}

interface StrapiCategory {
  id: number
  name?: string
  slug?: string
  attributes?: {
    name?: string
    slug?: string
  }
  products?: unknown[]
}

function getImageUrl(product: StrapiProduct): string {
  const p = product.attributes || product
  if (product.attributes) {
    const imgData = product.attributes.image?.data
    const url = Array.isArray(imgData) ? imgData[0]?.attributes?.url : undefined
    if (url) return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
  } else if (Array.isArray(p.image)) {
    const url = (p.image as Array<{ url?: string }>)[0]?.url
    if (url) return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
  }
  return "/images/placeholder.jpg"
}

export default async function ProductsPage({ searchParams }: ProductPageProps) {
  const { category, minPrice, maxPrice, sort, page, rating } = await searchParams
  const currentPage = parseInt(page || "1")

  const filters: Record<string, unknown> = {}
  if (category) filters.category = { slug: { $eq: category } }
  if (minPrice) filters.price = { ...((filters.price as object) || {}), $gte: minPrice }
  if (maxPrice) filters.price = { ...((filters.price as object) || {}), $lte: maxPrice }
  if (rating) filters.rating = { $gte: parseInt(rating) }

  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({
      filters,
      sort: sort || "createdAt:desc",
      pageSize: 12,
      page: currentPage,
    }),
    getCategories({ pageSize: 50 }),
  ])

  const products: StrapiProduct[] = productsRes?.data || []
  const rawCategories: StrapiCategory[] = categoriesRes?.data || []
  const totalPages = productsRes?.meta?.pagination?.pageCount || 1

  const categories = rawCategories.map((cat) => ({
    id: String(cat.id),
    name: cat.attributes?.name || cat.name || "",
    slug: cat.attributes?.slug || cat.slug || "",
    count: Array.isArray(cat.products) ? cat.products.length : 0,
  }))

  const mappedProducts = products.map((product) => {
    const p = product.attributes || product
    const catName = product.attributes
      ? product.attributes.category?.data?.attributes?.name || "عام"
      : (p.category as { name?: string })?.name || "عام"

    return {
      id: product.id,
      name: p.name || "",
      slug: p.slug || "",
      price: p.price || 0,
      originalPrice: p.originalPrice,
      image: getImageUrl(product),
      category: catName,
      isSale: p.isSale || false,
      isNew: p.isNew || false,
      rating: p.rating || 0,
      reviewsCount: p.reviewsCount || 0,
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">المنتجات</h1>

      <div className="flex gap-8 items-start">

        {/* Sidebar - يظهر فقط على الشاشات الكبيرة */}
        <aside
          className="w-[280px] shrink-0 hidden lg:block space-y-6 sticky top-28 self-start border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-card"
          dir="rtl"
        >
          <h3 className="font-bold text-lg border-b pb-3">الفلاتر</h3>
          <CategoryFilter categories={categories} />
          <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
          <RatingFilter />
        </aside>

        {/* المنتجات */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* شريط الفرز والفلاتر */}
          <div className="flex items-center justify-between flex-wrap gap-4" dir="rtl">
            <div className="flex items-center gap-3 flex-wrap">
              <MobileFilters
                categories={categories}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
              <ActiveFilters category={category} categories={categories} />
            </div>
            <SortSelect currentSort={sort} />
          </div>

          {/* قائمة المنتجات */}
          {mappedProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              لا توجد منتجات تطابق الفلاتر المحددة
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mappedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`/products?page=${pageNum}${category ? `&category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`}
                  className={`px-4 py-2 rounded border text-sm ${
                    pageNum === currentPage
                      ? "bg-primary text-white border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}