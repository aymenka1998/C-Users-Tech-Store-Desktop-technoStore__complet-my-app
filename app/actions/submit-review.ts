"use server"

import { getToken } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function submitReviewAction(
  productId: string,
   productNumericId: number,
  productSlug: string,
  rating: number,
  comment: string
) {
  try {
    const token = await getToken()
    
    if (!token) {
      return { success: false, error: "يرجى تسجيل الدخول للمتابعة" }
    }

    if (!productId) {
      return { success: false, error: "معرف المنتج غير متوفر" }
    }

    const payload = {
      data: {
        rating,
        comment,
        product:productNumericId,
       publishedAt: new Date().toISOString()
        
      }
    }

    console.log("Sending payload:", JSON.stringify(payload, null, 2))

    const res = await fetch(`${STRAPI_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log("Strapi response:", res.status, JSON.stringify(data, null, 2))

    if (res.ok) {
      revalidatePath(`/products/${productSlug}`) // ← slug حقيقي
      return { success: true }
    } else {
      return { success: false, error: data?.error?.message || "فشل إرسال التقييم" }
    }
  } catch (error) {
    console.error("Submit review error:", error)
    return { success: false, error: "حدث خطأ في الاتصال بالسيرفر" }
  }

}
