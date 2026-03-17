"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * ✅ أكشن تسجيل الخروج
 * يقوم بحذف جلسة المستخدم وتوجيهه لصفحة تسجيل الدخول
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  
  // 1. حذف التوكن من الكوكيز مع تحديد المسار لضمان الحذف الشامل
  cookieStore.set("jwt", "", { 
    maxAge: 0, 
    path: "/" 
  })
  
  // أو الطريقة المختصرة التي استخدمتها (كلاهما يعمل)
  // cookieStore.delete("jwt")

  // 2. التوجيه لصفحة تسجيل الدخول
  // ملاحظة: لا تضع الـ redirect داخل try/catch لأنها تعتمد على إلقاء خطأ داخلي
  redirect("/login")
}