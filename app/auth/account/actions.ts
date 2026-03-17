"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export interface UpdateAccountState {
  success?: boolean
  message?: string
  error?: string
}

// ── مساعد: جلب التوكن والمستخدم ─────────────────────────────────
async function getAuthContext() {
  const cookieStore = await cookies()
  const token = cookieStore.get("jwt")?.value
  if (!token) return null

  const res = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) return null

  const user = await res.json()
  return { token, userId: user.id }
}

// ── مساعد: تحديث بيانات المستخدم في Strapi ───────────────────────
async function updateUser(
  userId: number,
  token: string,
  data: Record<string, unknown>
): Promise<UpdateAccountState> {
  const res = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    return { error: err.error?.message || "فشل تحديث البيانات" }
  }

  revalidatePath("/account")
  return { success: true }
}

// ── Action الرئيسي ────────────────────────────────────────────────
export async function updateAccountAction(
  prevState: UpdateAccountState | null,
  formData: FormData
): Promise<UpdateAccountState> {
  try {
    const auth = await getAuthContext()
    if (!auth) return { error: "انتهت الجلسة، يرجى تسجيل الدخول مجدداً" }

    const type = formData.get("type") as string || "profile"

    // ── 1. تعديل المعلومات الشخصية ─────────────────────────────
    if (type === "profile") {
      const fullName = (formData.get("fullName") as string)?.trim()
      const username = (formData.get("username") as string)?.trim()
      const phone    = (formData.get("phone") as string)?.trim()

      const data: Record<string, string> = {}
      if (fullName) data.fullName = fullName
      if (username) data.username = username
      if (phone)    data.phone    = phone

      return await updateUser(auth.userId, auth.token, data)
    }

    // ── 2. تغيير البريد الإلكتروني ─────────────────────────────
    if (type === "email") {
      const newEmail     = (formData.get("newEmail") as string)?.trim()
      const confirmEmail = (formData.get("confirmEmail") as string)?.trim()

      if (!newEmail)                   return { error: "أدخل البريد الجديد" }
      if (newEmail !== confirmEmail)   return { error: "البريدان غير متطابقان" }
      if (!/\S+@\S+\.\S+/.test(newEmail)) return { error: "صيغة البريد غير صحيحة" }

      return await updateUser(auth.userId, auth.token, { email: newEmail })
    }

    // ── 3. تغيير كلمة المرور ───────────────────────────────────
    if (type === "password") {
      const currentPassword = formData.get("currentPassword") as string
      const newPassword     = formData.get("newPassword") as string
      const confirmPassword = formData.get("confirmPassword") as string

      if (!currentPassword || !newPassword) return { error: "يرجى ملء جميع الحقول" }
      if (newPassword !== confirmPassword)   return { error: "كلمتا المرور غير متطابقتان" }
      if (newPassword.length < 8)           return { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }

      // Strapi: تغيير كلمة المرور عبر endpoint مخصص
      const res = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        return { error: err.error?.message || "فشل تغيير كلمة المرور — تحقق من كلمة المرور الحالية" }
      }

      return { success: true, message: "تم تغيير كلمة المرور بنجاح" }
    }

    return { error: "نوع التحديث غير معروف" }

  } catch (e) {
    console.error("updateAccountAction error:", e)
    return { error: "حدث خطأ غير متوقع" }
  }
}

// ── رفع الصور (لم يتغير) ─────────────────────────────────────────
export async function uploadImageAction(formData: FormData) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value
    if (!token) return { error: "يجب تسجيل الدخول أولاً" }

    const file = formData.get("file") as File
    const type = formData.get("type") as string
    if (!file) return { error: "لم يتم اختيار صورة" }

    const uploadData = new FormData()
    uploadData.append("files", file)

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: uploadData,
    })

    if (!uploadRes.ok) return { error: "فشل رفع الصورة" }

    const uploaded = await uploadRes.json()
    const imageUrl = `${STRAPI_URL}${uploaded[0].url}`

    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const user = await userRes.json()

    const updateField = type === "avatar"
      ? { avatar: imageUrl }
      : { coverImage: imageUrl }

    await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateField),
    })

    revalidatePath("/account")
    return { success: true, imageUrl }

  } catch (error) {
    console.error("Upload error:", error)
    return { error: "حدث خطأ أثناء الرفع" }
  }
}