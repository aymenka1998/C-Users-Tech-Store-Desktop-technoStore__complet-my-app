"use server"

import { cookies } from "next/headers"

// 1. تعريف واجهة الحالة (State Interface) لحل مشكلة 'any'
export interface LoginActionState {
  success?: boolean;
  error?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    // أضف أي حقول إضافية تتوقعها من Strapi هنا
  };
  redirectPath?: string;
}

export async function loginAction(
  // 2. استبدال 'any' بالواجهة التي قمنا بتعريفها
  prevState: LoginActionState | null, 
  formData: FormData
): Promise<LoginActionState> { // 3. تحديد نوع القيمة المعادة من الدالة
  
  const identifier = formData.get("identifier") || formData.get("email")
  const password = formData.get("password")
  const rememberMe = formData.get("rememberMe") === "true"

  if (!identifier || !password) {
    return { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" }
  }

  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: identifier.toString(),
        password: password.toString(),
      }),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error?.message || "البيانات غير صحيحة، يرجى المحاولة مرة أخرى" };
    }

    const cookieStore = await cookies();
    cookieStore.set("jwt", data.jwt, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
      path: "/",
    });

    return { 
      success: true, 
      user: data.user,
      redirectPath: "/account"
    };

  } catch (error) {
    console.error("Login Error:", error);
    return { error: "حدث خطأ في الاتصال بالسيرفر، تأكد من تشغيل Strapi" };
  }
}