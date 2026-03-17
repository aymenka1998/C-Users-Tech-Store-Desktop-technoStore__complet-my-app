// lib/strapi.ts
import qs from 'qs';
import { 
  Product, 
  Category, 
  StrapiResponse, 
} from '@/types/strapi'

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

// ✅ تعريف الأنواع لإصلاح أخطاء الوصول للبيانات (Property 'data' does not exist)
interface ImageDataAttributes {
  url: string;
}

interface ImageItem {
  attributes: ImageDataAttributes;
}

interface ItemAttributes {
  images?: {
    data?: ImageItem[];
  };
  image?: {
    data?: ImageItem;
  };
  [key: string]: unknown;
}

interface ItemWithAttributes {
  attributes?: ItemAttributes;
  [key: string]: unknown;
}

interface FetchOptions {
  filters?: Record<string, unknown>
  populate?: string | string[] | Record<string, unknown>
  pageSize?: number
  page?: number
  sort?: string | string[]
}

/**
 * ✅ دالة مساعدة لتوحيد الـ Headers
 */
const getFetchHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token || STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${token || STRAPI_TOKEN}`
  }
  return headers
}

/**
 * ✅ الدالة المركزية لجلب المنتجات
 */
export async function getProducts(options: FetchOptions = {}) {
  try {
    const { filters, populate = '*', pageSize = 12, page = 1, sort } = options;

    const query = qs.stringify({
      populate,
      pagination: {
        pageSize,
        page,
      },
      ...(sort && { sort }),
      ...(filters && { filters }),
    }, {
      encodeValuesOnly: true,
      arrayFormat: 'brackets',
    });

    const url = `${STRAPI_URL}/api/products?${query}`;
    
    const res = await fetch(url, {
      headers: getFetchHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) {
      return { data: [], meta: {} };
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Strapi Fetch Error:", error);
    return { data: [], meta: {} };
  }
}

/**
 * ✅ استخراج رابط الصورة - تم تصحيح الوصول للخصائص (Property data fixes)
 */
export const getImageUrl = (item: ItemWithAttributes | null | undefined, baseUrl: string = STRAPI_URL): string => {
  if (!item) return "https://placehold.co/600x400?text=No+Data";

  const attr = (item.attributes ?? item) as ItemAttributes;
  
  // الوصول الآمن للصور بناءً على هيكل Strapi v4/v5
  const imageData = attr.images?.data?.[0] ?? attr.image?.data;
                   
  const relativeUrl = imageData?.attributes?.url;

  if (!relativeUrl) return "https://placehold.co/600x400?text=No+Image";

  return relativeUrl.startsWith('http') ? relativeUrl : `${baseUrl}${relativeUrl}`;
};

/**
 * ✅ جلب التصنيفات
 */
export async function getCategories(options: FetchOptions = {}): Promise<StrapiResponse<Category>> {
  const { populate = '*', pageSize = 100, filters, sort } = options;
  
  const query = qs.stringify({
    populate,
    pagination: { pageSize },
    ...(sort && { sort }),
    ...(filters && { filters }),
  }, { encodeValuesOnly: true });

  const url = `${STRAPI_URL}/api/categories?${query}`;
  
  const res = await fetch(url, { 
    headers: getFetchHeaders(),
    cache: 'no-store' 
  });
  
  if (!res.ok) throw new Error(`Failed to fetch categories`);
  return res.json();
}

/**
 * ✅ جلب البيانات بواسطة الـ Slug
 */

export async function getProductBySlug(slug: string) {
  const res = await fetch(
    `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
    { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
  )
  const data = await res.json()
  
  console.log("Product by slug response:", JSON.stringify(data, null, 2)) // ← للتشخيص
  
  // Strapi v5 يرجع data كمصفوفة
  return data?.data?.[0] || null
}

export async function getOrderById(orderId: string) {
  if (!orderId) {
    console.error("Order ID is missing!");
    return null;
  }

  // استخدام السلسلة النصية مباشرة لتجنب مشاكل الـ Encoding في URLSearchParams
  const populateQuery = "populate[items][populate][product][populate]=image";
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/${orderId}?${populateQuery}`;

  try {
    const res = await fetch(url, {
      method: 'GET', // تحديد النوع بوضوح
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // محاولة قراءة تفاصيل الخطأ من Strapi لمعرفة الحقل المسبب للمشكلة
      const errorDetail = await res.json().catch(() => ({}));
      console.error(`Order Fetch Error: ${res.status}`, errorDetail);
      return null;
    }

    const result = await res.json();
    return result.data; // في Strapi النتيجة تكون عادةً داخل object اسمه data
  } catch (error) {
    console.error("Network or Parsing Error:", error);
    return null;
  }
}
    

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: '*',
  }, { encodeValuesOnly: true });

  const url = `${STRAPI_URL}/api/categories?${query}`;
  
  try {
    const res = await fetch(url, { headers: getFetchHeaders(), cache: 'no-store' });
    if (!res.ok) return null;
    const data: StrapiResponse<Category> = await res.json();
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * ✅ دوال العروض والمنتجات المميزة
 */
export async function getFeaturedProducts(pageSize = 10) {
  return getProducts({ filters: { isFeatured: { $eq: true } }, pageSize });
}

export async function getSaleProducts(pageSize = 10) {
  return getProducts({ filters: { isOffer: { $eq: true } }, pageSize });
}

export async function getNewArrivals(pageSize = 10) {
  return getProducts({ sort: 'createdAt:desc', pageSize });
}

/**
 * ✅ التعامل مع الطلبات والرسائل
 */
export async function sendContactMessage(data: Record<string, unknown>) {
  const res = await fetch(`${STRAPI_URL}/api/messages`, {
    method: 'POST',
    headers: getFetchHeaders(),
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

/**
 * ✅ إنشاء طلب جديد - تم استبدال any بنوع غير محدد للامتثال للقواعد
 */
export async function createOrder(payload: unknown, token: string) {
  const res = await fetch(`${STRAPI_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload), 
  });
  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=*`, {
    headers: getFetchHeaders(token),
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return await res.json();
}