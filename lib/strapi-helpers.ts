/**
 * ✅ تنظيف الملف من تحذيرات ESLint
 * تم استبدال 'any' بأنواع دقيقة لضمان سلامة البيانات
 */

// 1. تعريف واجهة عامة لشكل ردود Strapi (نسخة مبسطة متوافقة مع Strapi v5)
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * دالة مساعدة لجلب روابط الصور من Strapi
 * تتعامل مع الأشكال المختلفة لردود الصور
 */
export function getStrapiMedia(url: string | null): string {
  if (url == null) return "";
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${url}`;
}

/**
 * دالة مساعدة لتنظيف ردود Strapi المعقدة
 * تستخدم Generics <T> بدلاً من any
 */
/**
 * دالة مساعدة لتنظيف ردود Strapi المعقدة
 * تم استبدال (data as any) بطريقة فحص الأنواع الآمنة
 */
export function flattenAttributes<T>(data: unknown): T {
  if (data === null || data === undefined) return data as T;

  // معالجة المصفوفات
  if (Array.isArray(data)) {
    return data.map((item) => flattenAttributes(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const objectData = data as Record<string, unknown>;

    // ✅ Extract data wrapper if it exists (Strapi v4/v5 relations/media)
    if ('data' in objectData && Object.keys(objectData).length <= 2) {
      if (objectData.data === null) return null as unknown as T;
      return flattenAttributes(objectData.data) as T;
    }

    const flattened: Record<string, unknown> = {};
    const target = (objectData.attributes as Record<string, unknown>) || objectData;

    // ✅ Ensure we preserve these root properties if they exist
    if (objectData.id !== undefined) flattened.id = objectData.id;
    if (objectData.documentId !== undefined) flattened.documentId = objectData.documentId;
    if (objectData.createdAt !== undefined) flattened.createdAt = objectData.createdAt;
    if (objectData.updatedAt !== undefined) flattened.updatedAt = objectData.updatedAt;

    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        flattened[key] = flattenAttributes(target[key]);
      }
    }

    return flattened as T;
  }

  return data as T;
}

/**
 * دالة موحدة لطلبات الـ API
 */
export async function fetchStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<StrapiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  
  const res = await fetch(`${baseUrl}/api/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Strapi Fetch Error: ${res.statusText}`);
  }

  return res.json();
}