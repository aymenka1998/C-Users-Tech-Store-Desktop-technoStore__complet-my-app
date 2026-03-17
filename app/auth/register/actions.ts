"use server"

import { cookies } from "next/headers"

// 1. تعريف شكل الحالة التي يعيدها الأكشن (للتخلص من any)
export interface RegisterActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function registerAction(
  prevState: RegisterActionState | null, // استبدال any بالنوع الجديد
  formData: FormData
): Promise<RegisterActionState> { // تحديد نوع القيمة المعادة
  
  // 2. استخراج البيانات من الفورم
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  //const fullName = formData.get("fullName") as string
  //const phone = formData.get("phone") as string

  try {
    // 3. إرسال طلب التسجيل لـ Strapi
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      username,
      
      email,
      password,
           
      }),
      cache: "no-store",
    })

    const data = await res.json()

    // 4. معالجة الأخطاء
    if (!res.ok) {
      return { 
        error: data.error?.message || "فشل إنشاء الحساب، يرجى التأكد من البيانات" 
      }
    }

    // 5. حفظ التوكن (JWT) في الكوكيز
    const cookieStore = await cookies()
    cookieStore.set("jwt", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    })

    return { success: true, message: "تم إنشاء الحساب بنجاح!" }

  } catch (error) {
    console.error("Register Error:", error)
    return { error: "خطأ في الاتصال بالسيرفر" }
  }
}