import { NextRequest, NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      )
    }

    // ✅ استدعاء API الخاص بـ Strapi لإرسال بريد إعادة التعيين
    // سيقوم Strapi بتوليد 'code' فريد وإرساله للمستخدم تلقائياً
    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await strapiRes.json()

    if (!strapiRes.ok) {
      console.error("Strapi forgot-password error:", data)
      // ملاحظة: لأسباب أمنية، يفضل أحياناً عدم إخبار المستخدم إذا كان الإيميل غير موجود
      return NextResponse.json(
        { error: data.error?.message || "حدث خطأ أثناء إرسال البريد" },
        { status: strapiRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: "إذا كان الحساب موجوداً، فستصلك رسالة تحتوي على تعليمات إعادة التعيين",
    })

  } catch (error) {
    console.error("Forgot password route error:", error)
    return NextResponse.json(
      { error: "حدث خطأ فني أثناء الاتصال بالسيرفر" },
      { status: 500 }
    )
  }
}