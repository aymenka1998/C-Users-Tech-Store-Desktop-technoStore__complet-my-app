// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 
// lib/map-data.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export function getStrapiURL(path: string = "") {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${STRAPI_URL}${path}`;
}

export function mapStrapiProduct(p: any) {
  const attrs = p.attributes || p;
  
  // معالجة الصورة
  const imgObj = attrs.image?.data?.attributes || attrs.image;
  const imageUrl = getStrapiURL(imgObj?.url);

  // معالجة الفئة
  const catObj = attrs.category?.data?.attributes || attrs.category;
  const categoryName = catObj?.name || "عام";

  return {
    id: String(p.id),
    name: String(attrs.name || ""),
    slug: String(attrs.slug || ""),
    price: Number(attrs.price) || 0,
    originalPrice: attrs.originalPrice ? Number(attrs.originalPrice) : undefined,
    image: imageUrl,
    category: categoryName,
    isSale: Boolean(attrs.isSale),
    isNew: Boolean(attrs.isNew),
    rating: Number(attrs.rating) || 0,
    reviewsCount: Number(attrs.reviewsCount) || 0,
    quantite: attrs.quantite // أضفنا الكمية لتعمل في الـ ProductCard
  };
}