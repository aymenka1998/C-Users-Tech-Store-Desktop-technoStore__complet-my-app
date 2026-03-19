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

interface StrapiImageAttributes {
  url?: string
}

interface StrapiImageData {
  attributes?: StrapiImageAttributes
  url?: string
}
interface StrapiImageField {
  url?: string
  formats?: { medium?: { url?: string }; small?: { url?: string } }
  data?: { attributes?: { url?: string } } | Array<{ attributes?: { url?: string } }>
  attributes?: { url?: string }
  [key: number]: { url?: string; formats?: { medium?: { url?: string }; small?: { url?: string } } }
}

interface StrapiCategoryField {
  data?: { attributes?: { name?: string }; name?: string }
  name?: string
}

function getStrapiImageUrl(imageField: StrapiImageField | null | undefined): string {
  if (!imageField) return "";

  // Strapi v5: image مصفوفة
  const target = Array.isArray(imageField) ? imageField[0] : imageField;
  if (!target) return "";

  const url =
    (target as { url?: string }).url ||
    (target as { formats?: { medium?: { url?: string } } }).formats?.medium?.url ||
    (target as { formats?: { small?: { url?: string } } }).formats?.small?.url ||
    ""

  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
}

const mapProduct = (p: { id: number; attributes?: Record<string, unknown> } & Record<string, unknown>): DisplayProduct => {
  const attrs = (p.attributes || p) as Record<string, unknown>;
   console.log("IMAGE:", JSON.stringify(attrs.image, null, 2))
  let catName = "عام";
  if (attrs.category) {
    const cat = attrs.category as StrapiCategoryField;
    catName = cat.data?.attributes?.name || cat.data?.name || cat.name || "عام";
  }

  return {
    id: Number(p.id),
    name: String(attrs.name || ""),
    slug: String(attrs.slug || ""),
    price: Number(attrs.price) || 0,
    originalPrice: attrs.originalPrice ? Number(attrs.originalPrice) : undefined,
    image: getStrapiImageUrl(attrs.image as StrapiImageField),
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

    featuredProducts = (featuredRes?.data || []).map(mapProduct);
    newArrivals = (newRes?.data || []).map(mapProduct);

    categories = (catRes?.data || []).map((cat: StrapiCategory) => {
      const attrs = (cat.attributes || cat) as Record<string, unknown>;

      // ✅ Strapi v5: images مباشرة بدون data
      const imagesField = attrs.images as { url?: string } | undefined;
      const imageUrl = imagesField?.url
        ? (imagesField.url.startsWith("http") ? imagesField.url : `${STRAPI_URL}${imagesField.url}`)
        : getStrapiImageUrl(attrs.image as StrapiImageField);

      // ✅ Strapi v5: المنتجات في product (مصفوفة مباشرة)
      const productArray = attrs.product as unknown[] | undefined;
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
    console.error("Error fetching home data:", error);
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}
    
       <CategoriesShowcase 
  categories={categories.map(cat => ({
    ...cat,
    count: cat.count ?? 0 }))} 
/>
      
      
      {newArrivals.length > 0 && (
        <NewArrivals products={newArrivals} />
       
      )}
      <Newsletter />
    </div>
  );
}