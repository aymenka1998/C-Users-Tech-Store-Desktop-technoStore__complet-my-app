"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

// تعريف النوع لمنع تحذير "Unexpected any" وضمان استقرار البيانات
export interface ActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * أكشن تسجيل مستخدم جديد
 * يرسل الحقول الإضافية (fullName, phone) التي تظهر في إعدادات Strapi الخاصة بك
 */
export async function registerAction(
  prevState: ActionState | null, 
  formData: FormData
): Promise<ActionState> {
  // استخراج القيم من FormData (تأكد أن حقول Input لديها هذه الأسماء في خاصية name)
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username, 
        email, 
        password, 
        fullName, // الحقل الذي يظهر في "Configure the view" (صورة 3)
        phone: phone // سيرسل كنص أو رقم حسب إعدادك (يفضل نص)
      }),
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return { error: data.error?.message || "فشل إنشاء الحساب، يرجى مراجعة البيانات" }
    }

    // حفظ التوكن في الكوكيز لمدة أسبوع
    const cookieStore = await cookies()
    cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return { success: true, message: "تم إنشاء الحساب بنجاح! جاري تحويلك..." }
  } catch (err) {
    console.error("Register Error:", err)
    return { error: "خطأ في الاتصال بخادم Strapi" }
  }
}

/**
 * أكشن تحديث بيانات الحساب
 */
export async function updateAccountAction(
  prevState: ActionState | null, 
  formData: FormData
): Promise<ActionState> {
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value

    if (!token) return { error: "انتهت الجلسة، يرجى تسجيل الدخول" }

    // جلب معرف المستخدم الحالي
    const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const user = await meRes.json()

    // تحديث البيانات في Strapi
    const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, phone }),
    })

    if (!res.ok) return { error: "فشل تحديث البيانات في السيرفر" }

    revalidatePath("/account")
    return { success: true, message: "تم تحديث بياناتك بنجاح ✅" }
  } catch (err) {
    return { error: "حدث خطأ غير متوقع أثناء التحديث" }
  }
}

/**
 * أكشن تسجيل الخروج
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("jwt")
}