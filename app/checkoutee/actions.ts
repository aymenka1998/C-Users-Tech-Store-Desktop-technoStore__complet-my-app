"use server"

import { cookies } from "next/headers"
import { createOrder } from "@/lib/strapi"
import { sendOrderConfirmationEmail } from "@/lib/resend"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

// تعريف الأنواع لضمان سلامة البيانات وتجنب أخطاء ESLint
interface CartItem {
  id: string | number;
  quantity: number;
  price: number;
}

// تعريف نوع عنصر الطلب لإزالة خطأ الـ any
interface OrderItemDetail {
  product?: {
    data?: {
      
      attributes?: {
        name?: string;
      }
    }
  };
  quantity: number;
  price: number;
}


/**
 * أكشن إنشاء الطلب الرئيسي
 */
export async function createOrderAction(_prevState: unknown, formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value
    if (!token) return { error: "يجب تسجيل الدخول أولاً" }

    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!userRes.ok) return { error: "جلسة غير صالحة" }
    const user = await userRes.json()

    const items = JSON.parse(formData.get("items") as string) as CartItem[]
    const total = parseFloat(formData.get("total") as string)
    const shippingCost = parseFloat(formData.get("shippingCost") as string || "0")
    
    const shippingAddress = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
    }



const orderPayload = {
  data: {
    orderNumber: `ORD-${Date.now()}`,
    total: total,
    shipping: shippingCost,
    statu: "pending",
    paymentMethod: (formData.get("paymentMethod") as string) || "cash_on_delivery",
    paymentStatus: "pending",
    shippingAddress: shippingAddress,
    // في Strapi v5 يفضل استخدام المعرف مباشرة للعلاقة
    users_permissions_user: user.id, 
     orderItems: items.map((item) => ({
      quantite: item.quantity,
      price: item.price,
            })
  ),  
  },
};




    const order = await createOrder(orderPayload, token); 

    // استبدل هذا الجزء في ملف actions.ts (عند سطر 80)
if (!order || !order.data) {
  // طباعة الخطأ القادم من Strapi في الـ Terminal لرؤية التفاصيل
  console.error("Strapi full error response:", JSON.stringify(order, null, 2));
  
  // استخراج رسالة الخطأ من Strapi إن وجدت
  const strapiMessage = order?.error?.message || "فشل إنشاء الطلب في قاعدة البيانات.";
  throw new Error(strapiMessage);
}

    return { 
      success: true, 
      orderId: order.data.id, 
      message: "تم إنشاء الطلب بنجاح" 
    }

  } catch (error) {
    console.error("Checkout action error:", error)
    const errorMessage = error instanceof Error ? error.message : "فشل إنشاء الطلب"
    return { error: errorMessage }
  }
}

export async function getOrderDetails(orderId: string | number) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value
    if (!token) return null

    const res = await fetch(
      `${STRAPI_URL}/api/orders/${orderId}?populate[orderItems][populate][product]=*&populate[user]=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      }
    )

    if (!res.ok) return null
    const result = await res.json()
    return result.data
  } catch (error) {
    console.error("Fetch Order Error:", error)
    return null
  }
}
export async function getMyOrders() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value
    if (!token) return []

    // ✅ أولاً: جلب بيانات المستخدم الحالي
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
    if (!userRes.ok) return []
    const user = await userRes.json()

    // ✅ ثانياً: فلترة الطلبات بـ id المستخدم الحالي فقط
    const res = await fetch(
      `${STRAPI_URL}/api/orders?filters[users_permissions_user][id][$eq]=${user.id}&populate=orderItems&sort=createdAt:desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      }
    )

    if (!res.ok) return []
    const result = await res.json()
    return result.data || []

  } catch (error) {
    console.error("Get My Orders Error:", error)
    return []
  }
}


/**
 * إعادة إرسال إيميل تأكيد الطلب
 */
export async function resendOrderEmailAction(orderId: string) {
  try {
    const order = await getOrderDetails(orderId)
    if (!order) return { error: "الطلب غير موجود" }

    const attrs = order.attributes
    const user = attrs.user?.data?.attributes

    if (!user?.email) return { error: "بريد المستخدم غير متوفر" }

    // تصحيح: إرسال البيانات المتوافقة مع نوع OrderData في مكتبة Resend
    const emailResult = await sendOrderConfirmationEmail(user.email, {
      orderNumber: attrs.orderNumber,
      items: attrs.orderItems.map((item: OrderItemDetail) => ({
        name: item.product?.data?.attributes?.name || "منتج",
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: attrs.subtotal,
      shipping: attrs.shipping,
      total: attrs.total,
      shippingAddress: attrs.shippingAddress,
      // تأكد أن الدالة في lib/resend تقبل هذا الحقل أو قم بإزالته إذا لم يكن موجوداً في التعريف
    })

    if (!emailResult.success) throw new Error(String(emailResult.error))

    return { success: true }
  } catch (error) {
    console.error("Resend Email Error:", error)
    return { error: "فشل إرسال الإيميل" }
  }
}   