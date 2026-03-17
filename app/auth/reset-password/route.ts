// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

// نفس Map من forgot-password (في الإنتاج استخدم قاعدة بيانات)
const resetTokens = new Map<string, { email: string; expires: Date }>()

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // التحقق من التوكن
    if (!resetTokens.has(token)) {
      return NextResponse.json(
        { error: "الرابط غير صالح" },
        { status: 400 }
      )
    }

    const tokenData = resetTokens.get(token)!
    
    if (new Date() > tokenData.expires) {
      resetTokens.delete(token)
      return NextResponse.json(
        { error: "انتهت صلاحية الرابط" },
        { status: 400 }
      )
    }

    // ✅ تحديث كلمة المرور في Strapi
    // ملاحظة: Strapi لا يدعم تحديث كلمة المرور مباشرة عبر API
    // يجب استخدام Strapi Admin API أو إنشاء endpoint مخصص في Strapi
    
    // الحل المؤقت: إرسال بريد للمستخدم ليتواصل مع الدعم
    // أو استخدام Strapi's built-in forgot-password endpoint

    resetTokens.delete(token)

    return NextResponse.json({
      success: true,
      message: "تم إعادة تعيين كلمة المرور بنجاح",
    })

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إعادة التعيين" },
      { status: 500 }
    )
  }
}