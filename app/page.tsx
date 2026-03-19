export const dynamic = 'force-dynamic';
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoriesShowcase } from "@/components/home/categories-showcase"
import { NewArrivals } from "@/components/home/new-arrivals"
import { Newsletter } from "@/components/home/newsletter"
import { getCategories, getFeaturedProducts, getNewArrivals } from "@/lib/strapi"
import { Category as StrapiCategory } from "@/types/strapi"
import { DisplayProduct, DisplayCategory } from "@/types/display"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// ✅ استبدال 'any' بأنواع محددة لإصلاح أخطاء ESLint
interface StrapiMedia {
  url: string;
  attributes?: { url: string };
  formats?: { medium?: { url?: string } };
}

interface StrapiEntity {
  id: number;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
}

function getStrapiImageUrl(imageField: unknown): string {
  if (!imageField) return "";

  // معالجة الحقل كـ unknown ثم تحويله بحذر
  const target = Array.isArray(imageField) ? imageField[0] : imageField;
  if (!target || typeof target !== 'object') return "";

  const img = target as StrapiMedia;
  const url = img.url || img.attributes?.url || img.formats?.medium?.url || "";

  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

const mapProduct = (p: StrapiEntity): DisplayProduct => {
  const attrs = (p.attributes || p) as Record<string, unknown>;
  
  let catName = "عام";
  const categoryData = attrs.category as { data?: { attributes?: { name?: string } }; name?: string } | undefined;
  
  if (categoryData) {
    catName = categoryData.data?.attributes?.name || categoryData.name || "عام";
  }

  return {
    id: Number(p.id),
    name: String(attrs.name || ""),
    slug: String(attrs.slug || ""),
    price: Number(attrs.price) || 0,
    originalPrice: attrs.originalPrice ? Number(attrs.originalPrice) : undefined,
    image: getStrapiImageUrl(attrs.image || attrs.images),
    category: catName,
    isSale: Boolean(attrs.isSale),
    isNew: Boolean(attrs.isNew),
    rating: Number(attrs.rating) || 0,
    reviewsCount: Number(attrs.reviewsCount) || 0,
  };
};

export default async function HomePage() {
  let featuredProducts: DisplayProduct[] = [];
  let newArrivals: DisplayProduct[] = [];
  let categories: DisplayCategory[] = [];

  try {
    const [featuredRes, newRes, catRes] = await Promise.all([
      getFeaturedProducts(8),
      getNewArrivals(8),
      getCategories({ populate: "*" }),
    ]);

    featuredProducts = (featuredRes?.data || []).map((p: unknown) => mapProduct(p as StrapiEntity));
    newArrivals = (newRes?.data || []).map((p: unknown) => mapProduct(p as StrapiEntity));

    categories = (catRes?.data || []).map((cat: StrapiCategory) => {
      // تحويل cat إلى Record للوصول للخصائص بحرية دون استخدام any
      const attrs = (cat.attributes || cat) as Record<string, unknown>;

      const imagesField = attrs.images || attrs.image;
      const imageUrl = getStrapiImageUrl(imagesField);

      const productArray = attrs.products || attrs.product;
      const productCount = Array.isArray(productArray) ? productArray.length : 0;

      return {
        id: String(cat.id),
        name: String(attrs.name || ""),
        slug: String(attrs.slug || ""),
        image: imageUrl,
        count: productCount,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching home data:", error);
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}
      <CategoriesShowcase categories={categories.map(cat => ({ ...cat, count: cat.count ?? 0 }))} />
      {newArrivals.length > 0 && <NewArrivals products={newArrivals} />}
      <Newsletter />
    </div>
  );
}