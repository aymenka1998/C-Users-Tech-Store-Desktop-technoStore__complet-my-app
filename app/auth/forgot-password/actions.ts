//app/auth/forgot-password/actions.ts
'use server'; // ضروري جداً

import { sendPasswordResetEmail } from "@/lib/resend";
import { randomBytes } from "crypto";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// ملاحظة: بما أنك تستعمل Map، تذكر أنها ستفقد البيانات عند إعادة تشغيل السيرفر.
// مستقبلاً في الـ "Full-stack" الحقيقي، ستضع هذا في قاعدة البيانات.
const resetTokens = new Map<string, { email: string; expires: Date }>();

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;

    if (!email) return { error: "البريد الإلكتروني مطلوب" };

    // 1. التحقق من وجود المستخدم في Strapi
    const checkRes = await fetch(
      `${STRAPI_URL}/api/users?filters[email][$eq]=${email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const users = await checkRes.json();

    // نرجع نجاح وهمي للأمان
    if (!users || users.length === 0) {
      return { success: true, message: "إذا كان البريد مسجلاً، سيتم إرسال رابط الاستعادة" };
    }

    // 2. إنشاء توكن وحفظه
    const resetToken = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); 
    resetTokens.set(resetToken, { email, expires });

    // 3. إرسال الإيميل
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (!emailResult.success) {
       return { error: "فشل إرسال البريد الإلكتروني" };
    }

    return { success: true, message: "تم إرسال رابط الاستعادة إلى بريدك الإلكتروني" };

  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}