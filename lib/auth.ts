import { cookies } from "next/headers"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

// ✅ واجهة بيانات المستخدم
export interface User {
  id: number
  email: string
  username: string
  fullName?: string
  phone?: string
  avatar?: string
  coverImage?: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
}

// ✅ واجهة بيانات نموذج التسجيل
interface RegisterFormData {
  email: string
  password?: string
  fullName: string
  phone: string
}

/**
 * ✅ دالة التسجيل بدون استخدام 'any'
 */
export async function registerUser(formData: RegisterFormData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.email, 
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "فشل عملية التسجيل")
    }

    if (data.jwt) {
      const cookieStore = await cookies()
      cookieStore.set("jwt", data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // أسبوع
        path: "/",
      })
    }

    return data
  } catch (error: unknown) {
    // ✅ معالجة الخطأ بنوع آمن
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع"
    console.error("❌ Register Error:", errorMessage)
    throw new Error(errorMessage)
  }
}

/**
 * ✅ جلب بيانات المستخدم الحالية
 */
export async function getUserFromToken(): Promise<User | null> {
  try {
    const token = await getToken()
    if (!token) return null

    // ✅ populate=* لجلب كل الحقول المخصصة
    const response = await fetch(
      `${STRAPI_URL}/api/users/me?populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    )

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error("❌ Auth Error:", error)
    return null
  }
}

/**
 * ✅ تحديث الملف الشخصي
 */
export async function updateUserProfile(userId: number, data: Partial<User>) {
  try {
    const token = await getToken()
    if (!token) throw new Error("غير مصرح لك بالقيام بهذا الإجراء")

    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "فشل تحديث البيانات")
    }

    return await response.json()
  } catch (error) {
    console.error("❌ Update Profile Error:", error)
    throw error
  }
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("jwt")?.value || null
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("jwt")
}