"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export interface ActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function registerAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!username || !email || !password) {
    return { error: "يرجى ملء جميع الحقول الأساسية" }
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
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

export async function updateAccountAction(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const username = formData.get("username") as string

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) return { error: "انتهت الجلسة، يرجى تسجيل الدخول" }
    if (!username) return { error: "اسم المستخدم مطلوب" };

    const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: "GET",
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    })
    const user = await meRes.json()

    const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    })

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Strapi Update Error:", errorData);
      return { error: "فشل تحديث البيانات في السيرفر" };
    }

    revalidatePath("/account")
    return { success: true, message: "تم تحديث بياناتك بنجاح ✅" }
  } catch (err) {
    console.error("Update Action Catch:", err);
    return { error: "حدث خطأ في الاتصال بخادم البيانات" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("jwt")
}